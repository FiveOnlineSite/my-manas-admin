import React, { useContext, useEffect, useState } from "react";
import {
  Block,
  BlockHead,
  BlockBetween,
  BlockHeadContent,
  BlockTitle,
  BlockDes,
  Button,
  Icon,
} from "../../components/Component";
import {
  Modal,
  ModalBody,
  Form,
  Col,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import {
  DataTableHead,
  DataTableRow,
  DataTableItem,
} from "../../components/table/DataTable";
import Content from "../../layout/content/Content";
import Head from "../../layout/head/Head";
import TooltipComponent from "../../components/tooltip/Tooltip";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import {
  deleteRequest,
  getRequest,
  postFormData,
  putRequest,
} from "../../api/api";
import { Spinner } from "reactstrap";

const NewsAndEvents = () => {
  const [data, setData] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
const [confirmModal, setConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null); 
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    uploadDate: "",
    type: "news",
    image: null,
    excerpt: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
    trigger,
  } = useForm();

  useEffect(() => {
    fetchNewsEvents();
  }, []);

  const fetchNewsEvents = async () => {
    setLoading(true)
    const res = await getRequest("/newsEvents");
    if (res.success) {
      setData(res.data);
    }
    setLoading(false)
  };

  const toggleModal = (editItem = null) => {
    if (editItem) {
      setEditId(editItem._id);
      setFormData(editItem);

      // Set form values for react-hook-form
      setValue("title", editItem.title);
      setValue("uploadDate", editItem.uploadDate);
      setValue("type", editItem.type);
      setValue("excerpt", editItem.excerpt);
      setValue("content", editItem.content);
      setValue("metaTitle", editItem.metaTitle);
      setValue("metaDescription", editItem.metaDescription);
      setValue("image", editItem.image);
    } else {
      resetForm();
      setEditId(null);
    }
    setModal(!modal);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      uploadDate: "",
      type: "News",
      image: null,
      excerpt: "",
      content: "",
      metaTitle: "",
      metaDescription: "",
    });
    reset();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setValue("image", file, { shouldValidate: true });
      trigger("image"); // Trigger validation after image upload
    } else {
      setFormData({ ...formData, image: null });
      setValue("image", null, { shouldValidate: true });
      trigger("image"); // Trigger validation after image removal
    }
  };

  const handleImageRemove = () => {
    setFormData({ ...formData, image: null });
    setValue("image", null, { shouldValidate: true });
    trigger("image"); // Trigger validation after image removal
  };

  const onSubmit = async (values) => {
    setSubmitting(true);

    const formPayload = new FormData();
    formPayload.append("title", values.title);
    formPayload.append("uploadDate", values.uploadDate);
    formPayload.append("type", values.type.toLowerCase());
    formPayload.append("excerpt", values.excerpt);
    formPayload.append("content", values.content);
    formPayload.append("metaTitle", values.metaTitle);
    formPayload.append("metaDescription", values.metaDescription);
    if (formData.image instanceof File) {
      formPayload.append("image", values.image);
    }

    try {
      let res;
      if (editId !== null) {
        res = await putRequest(`/newsEvents/${editId}`, formPayload);
        if (res.success) {
          const updated = data.map((item) =>
            item._id === editId ? res.data : item
          );
          setData(updated);
          toast.success("Content updated successfully!");
        } else {
          toast.error("Update failed.");
        }
      } else {
        res = await postFormData("/newsEvents", formPayload);
        if (res.success) {
          setData([res.data, ...data]);
          toast.success("Content added successfully!");
        } else {
          toast.error("Creation failed.");
        }
      }
      toggleModal();
      setSubmitting(false);
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };

   const confirmDelete = (id) => {
    setDeleteId(id);
    setConfirmModal(true);
  };

  const onDeleteClick = async (id) => {
    const res = await deleteRequest(`/newsEvents/${id}`);
    if (res.success) {
      setData(data.filter((item) => item._id !== id));
      toast.success("Deleted successfully!");
    } else {
      toast.error("Failed to delete.");
    }
  };

  return (
    <>
      <Head title='News & Events' />
      <Content>
        <BlockHead size='sm'>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag='h3' page>
                News & Events
              </BlockTitle>
              <BlockDes className='text-soft'>
                <p>Manage all your news and events from here.</p>
              </BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <Button
                color='primary'
                className='btn-icon'
                onClick={() => toggleModal()}
              >
                <Icon name='plus' />
              </Button>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          {loading ? (
            <div className="text-center p-5">
              <Spinner color="primary" size="lg" />
            </div>) : (
            <div className='nk-tb-list is-separate is-medium mb-3'>
              <DataTableHead>
                <DataTableRow>
                  <span>Title</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Date</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Type</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Image</span>
                </DataTableRow>

                <DataTableRow>
                  <span>Excerpt</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Content</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Meta Title</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Meta Desc</span>
                </DataTableRow>
                <DataTableRow className='nk-tb-col-tools text-end'>
                  <UncontrolledDropdown>
                    <DropdownToggle
                      color='tranparent'
                      className='dropdown-toggle btn btn-icon btn-trigger me-n1'
                    >
                      <Icon name='more-h' />
                    </DropdownToggle>
                    <DropdownMenu end>
                      <ul className='link-list-opt no-bdr'>
                        <li>
                          <DropdownItem
                            tag='a'
                            href='#'
                            onClick={(e) => {
                              e.preventDefault();
                              // Add delete functionality if needed
                            }}
                          >
                            <Icon name='na' />
                            <span>Remove Selected</span>
                          </DropdownItem>
                        </li>
                      </ul>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </DataTableRow>
              </DataTableHead>

              {data.map((item) => (
                <DataTableItem key={item._id}>
                  <DataTableRow>
                    <span>{item.title}</span>
                  </DataTableRow>
                  <DataTableRow>
                    <span>
                      {item.uploadDate
                        ? new Date(item.uploadDate)
                          .toLocaleDateString("en-GB")
                          .replace(/\//g, ".")
                        : "-"}
                    </span>
                  </DataTableRow>

                  <DataTableRow>
                    <span>{item.type}</span>
                  </DataTableRow>
                  <DataTableRow>
                    {item.image?.url ? (
                      <img
                        src={item.image.url}
                        alt={item.image.altText || "Image"}
                        style={{
                          width: "60px",
                          height: "40px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </DataTableRow>

                  <DataTableRow>
                    <span>{item.excerpt}</span>
                  </DataTableRow>
                  <DataTableRow>
                    <span>{item.content}</span>
                  </DataTableRow>
                  <DataTableRow>
                    <span>{item.metaTitle}</span>
                  </DataTableRow>
                  <DataTableRow>
                    <span>{item.metaDescription}</span>
                  </DataTableRow>
                  <DataTableRow className='nk-tb-col-tools'>
                    <ul className='nk-tb-actions gx-1'>
                      <li
                        className='nk-tb-action-hidden'
                        onClick={() => toggleModal(item)}
                      >
                        <TooltipComponent
                          tag='a'
                          containerClassName='btn btn-trigger btn-icon'
                          id={"edit" + item._id}
                          icon='edit-alt-fill'
                          direction='top'
                          text='Edit'
                        />
                      </li>
                      <li onClick={() => confirmDelete(item._id)}>
                        <TooltipComponent
                          tag='a'
                          containerClassName='btn btn-trigger btn-icon'
                          id={"delete" + item._id}
                          icon='trash-fill'
                          direction='top'
                          text='Delete'
                        />
                      </li>
                    </ul>
                  </DataTableRow>
                </DataTableItem>
              ))}
            </div>
          )}
        </Block>

        <Modal
          isOpen={modal}
          toggle={() => toggleModal()}
          className='modal-dialog-centered'
          size='lg'
        >
          <ModalBody>
            <a
              href='#cancel'
              onClick={(e) => {
                e.preventDefault();
                toggleModal();
              }}
              className='close'
            >
              <Icon name='cross-sm' />
            </a>
            <div className='p-2'>
              <h5 className='title'>
                {editId ? "Edit News/Event" : "Add News/Event"}
              </h5>
              <Form className='row gy-4' onSubmit={handleSubmit(onSubmit)}>
                <Col md='12'>
                  <label className='form-label'>Title</label>
                  <input
                    className='form-control'
                    {...register("title", { required: "Title is required" })}
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                  {errors.title && (
                    <span className='invalid'>{errors.title.message}</span>
                  )}
                </Col>

                <Col md='6'>
                  <label className='form-label'>Upload Date</label>
                  <input
                    type='date'
                    className='form-control'
                    {...register("uploadDate", {
                      required: "Upload date is required",
                    })}
                    value={formData.uploadDate}
                    onChange={(e) =>
                      setFormData({ ...formData, uploadDate: e.target.value })
                    }
                  />
                  {errors.uploadDate && (
                    <span className='invalid'>{errors.uploadDate.message}</span>
                  )}
                </Col>

                <Col md='6'>
                  <label className='form-label'>Type</label>
                  <select
                    className='form-control'
                    {...register("type", { required: "Type is required" })}
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                  >
                    <option value='News'>News</option>
                    <option value='Event'>Event</option>
                  </select>
                </Col>

                <Col
                  md='12'
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <label className='form-label'>Image (Max 500KB)</label>

                  {!formData.image ? (
                    <input
                      className='form-control'
                      type='file'
                      accept='image/*'
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file && file.size > 512000) {
                          setFormData({ ...formData, image: file });
                          setValue("image", null, { shouldValidate: true });
                        } else {
                          setFormData({ ...formData, image: file });
                          setValue("image", file, { shouldValidate: true });
                        }

                        setValue("image", file, { shouldValidate: true });
                        setFormData({ ...formData, image: file });
                      }}
                    />
                  ) : (
                    <div
                      className='image-preview-wrapper'
                      style={{
                        display: "inline-flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        marginTop: "8px",
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          display: "inline-block",
                        }}
                      >
                        <img
                          src={
                            typeof formData.image === "string"
                              ? formData.image
                              : formData.image.url
                                ? formData.image.url
                                : URL.createObjectURL(formData.image)
                          }
                          alt={formData.altText}
                          style={{
                            width: "150px",
                            height: "auto",
                            objectFit: "contain",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                            padding: "4px",
                            backgroundColor: "#fff",
                          }}
                        />
                        <Button
                          size='sm'
                          color='danger'
                          className='btn-icon'
                          style={{
                            position: "absolute",
                            top: "-8px",
                            right: "-8px",
                            borderRadius: "50%",
                            lineHeight: "1",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                            zIndex: 10,
                            height: "20px",
                            width: "20px",
                          }}
                          onClick={() => {
                            setFormData({ ...formData, image: null });
                            setValue("image", null, { shouldValidate: true });
                          }}
                        >
                          <Icon name='cross' />
                        </Button>
                      </div>
                    </div>
                  )}

                  <input
                    type='hidden'
                    {...register("image", {
                      required: !editId ? "Required" : false,
                      validate: {
                        fileSize: (file) => {
                          if (!file) return !editId ? "Required" : true;
                          if (typeof file === "string") return true;
                          // return (
                          //   file.size <= 512000 ||
                          //   "Image must be less than 500KB"
                          // );
                        },
                      },
                    })}
                  />

                  {errors.image && (
                    <span className='invalid'>{errors.image.message}</span>
                  )}
                </Col>

                <Col md='12'>
                  <label className='form-label'>Excerpt</label>
                  <textarea
                    className='form-control'
                    {...register("excerpt", {
                      required: "Excerpt is required",
                    })}
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                  />
                  {errors.excerpt && (
                    <span className='invalid'>{errors.excerpt.message}</span>
                  )}
                </Col>

                <Col md='12'>
                  <label className='form-label'>Content</label>
                  <Controller
                    name='content'
                    control={control}
                    rules={{ required: "Content is required" }}
                    render={({ field }) => (
                      <ReactQuill
                        theme='snow'
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.content && (
                    <span className='invalid'>{errors.content.message}</span>
                  )}
                </Col>

                <Col md='12'>
                  <label className='form-label'>Meta Title</label>
                  <input
                    className='form-control'
                    {...register("metaTitle", {
                      required: "Meta Title is required",
                    })}
                    value={formData.metaTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, metaTitle: e.target.value })
                    }
                  />
                  {errors.metaTitle && (
                    <span className='invalid'>{errors.metaTitle.message}</span>
                  )}
                </Col>

                <Col md='12'>
                  <label className='form-label'>Meta Description</label>
                  <Controller
                    name='metaDescription'
                    control={control}
                    rules={{ required: "Meta Description is required" }}
                    render={({ field }) => (
                      <ReactQuill
                        theme='snow'
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.metaDescription && (
                    <span className='invalid'>
                      {errors.metaDescription.message}
                    </span>
                  )}
                </Col>

                <Col size='12'>
                  <ul className='align-center flex-wrap flex-sm-nowrap gx-4 gy-2'>
                    <li>
                      <Button
                        color='primary'
                        size='md'
                        type='submit'
                        disabled={submitting}
                      >
                        {editId ? "Update" : "Add"}
                        {submitting && <Spinner className='spinner-xs' />}
                      </Button>
                    </li>
                    <li>
                      <a
                        href='#cancel'
                        onClick={(e) => {
                          e.preventDefault();
                          toggleModal();
                        }}
                        className='link link-light'
                      >
                        Cancel
                      </a>
                    </li>
                  </ul>
                </Col>
              </Form>
            </div>
          </ModalBody>
        </Modal>
        <Modal
          isOpen={confirmModal}
          toggle={() => setConfirmModal(false)}
          className='modal-dialog-centered'
          size='sm'
        >
          <ModalBody className='text-center'>
            <h5 className='mt-3'>Confirm Deletion</h5>
            <p>Are you sure you want to delete this item?</p>
            <div className='d-flex justify-content-center gap-2 mt-4'>
              <Button
                color='danger'
                className='p-3'
                onClick={async () => {
                  const res = await deleteRequest(`/newsEvents/${deleteId}`);
                  if (res.success) {
                    toast.success("Deleted successfully");
                    fetchNewsEvents();
                  } else {
                    toast.error("Delete failed");
                  }
                  setConfirmModal(false);
                  setDeleteId(null);
                }}
              >
                OK
              </Button>
              <Button
                color='light'
                className='p-3'
                onClick={() => setConfirmModal(false)}
              >
                Cancel
              </Button>
            </div>
          </ModalBody>
        </Modal>
      </Content>
    </>
  );
};

export default NewsAndEvents;
