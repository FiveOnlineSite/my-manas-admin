import React, { useContext, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
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
import {
  deleteRequest,
  getRequest,
  postFormData,
  putRequest,
} from "../../api/api";
import { toast } from "react-toastify";
import { Spinner } from "reactstrap";


const OurInspirations = () => {
  const [data, setData] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    subtitle: "",
    title: "",
    description: "",
    image: null,
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

  const toggleModal = (editItem = null) => {
    if (editItem) {
      setEditId(editItem._id);
      setFormData(editItem);
    } else {
      resetForm();
      setEditId(null);
    }
    setModal(!modal);
  };

  const resetForm = () => {
    setFormData({
      subtitle: "",
      title: "",
      description: "",
      image: null,
    });
    reset();
  };

  const selectorDeleteUser = () => {
    const updated = data.filter((item) => !item.checked);
    setData(updated);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 512000) {
      setValue("image", null, { shouldValidate: true });
      setFormData({ ...formData, image: null });
      trigger("image");
    } else {
      setFormData({ ...formData, image: file });
      setValue("image", file, { shouldValidate: true });
      trigger("image");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value });
    setValue("description", value); // set value for react-hook-form
    trigger("description"); // trigger validation on change
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true); // Show loader

    const res = await getRequest("/about/our-inspiration"); // Update with your API route
    if (res.success) {
      console.log("inspiration created:", res.data);

      setData(res.data);
    } else {
      toast.error("Failed to fetch inspirations data.");
    }
    setLoading(false); // Show loader

  };

  const onSubmit = async () => {
    setSubmitting(true);

    const isValid = await trigger();
    if (!isValid || !formData.image) return;

    const formPayload = new FormData();
    formPayload.append("subtitle", formData.subtitle);
    formPayload.append("title", formData.title);
    formPayload.append("description", formData.description);
    formPayload.append("image", formData.image);

    try {
      if (editId !== null) {
        const res = await putRequest(
          `/about/our-inspiration/${editId}`,
          formPayload
        );
        if (res.success) {
          const updatedData = data.map((item) =>
            item._id === editId ? res.data : item
          );
          setData(updatedData);
          toast.success("Inspiration updated successfully!");
        } else {
          toast.error("Update failed.");
        }
      } else {
        const res = await postFormData("/about/our-inspiration", formPayload);
        if (res.success) {
          setData([res.data, ...data]);
          toast.success("Inspiration added successfully!");
        } else {
          toast.error("Creation failed.");
        }
      }
      toggleModal();
      setSubmitting(false);

    } catch (error) {
      toast.error("An error occurred.");
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setConfirmModal(true);
  };

  const onDeleteClick = async (id) => {
    const res = await deleteRequest(`/about/our-inspiration/${id}`);
    if (res.success) {
      toast.success("Deleted successfully!");
      fetchData(); // Refresh list
    } else {
      toast.error("Delete failed.");
    }
  };

  return (
    <>
      <Head title='Our Inspirations Content' />
      <Content>
        <BlockHead size='sm'>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag='h3' page>
                Our Inspirations Section
              </BlockTitle>
              <BlockDes className='text-soft'>
                <p>Manage your Our Inspirations content items here.</p>
              </BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              {/* <Button
                color='primary'
                className='btn-icon'
                onClick={() => toggleModal()}
              >
                <Icon name='plus' />
              </Button> */}
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
                  <span>Subtitle</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Title</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Description</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Image</span>
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
                              selectorDeleteUser();
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
                    <span>{item.subtitle}</span>
                  </DataTableRow>
                  <DataTableRow>
                    <span>{item.title}</span>
                  </DataTableRow>
                  <DataTableRow>
                    <div
                      dangerouslySetInnerHTML={{ __html: item.description }}
                      style={{ maxWidth: "300px" }}
                    ></div>
                  </DataTableRow>
                  <DataTableRow>
                    {item?.image?.url ? (
                      <img
                        src={item?.image?.url}
                        alt={item.title}
                        width={60}
                        height={40}
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      "No image"
                    )}
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
                      {/* <li onClick={() => confirmDelete(item._id)}>
                        <TooltipComponent
                          tag='a'
                          containerClassName='btn btn-trigger btn-icon'
                          id={"delete" + item._id}
                          icon='trash-fill'
                          direction='top'
                          text='Delete'
                        />
                      </li> */}
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
                {editId
                  ? "Edit Our Inspirations Content"
                  : "Add Our Inspirations Content"}
              </h5>
              <Form className='row gy-4' onSubmit={handleSubmit(onSubmit)}>
                <Col md='12'>
                  <label className='form-label'>Subtitle</label>
                  <input
                    className='form-control'
                    {...register("subtitle", { required: "Required" })}
                    name='subtitle'
                    value={formData.subtitle}
                    onChange={handleInputChange}
                  />
                  {errors.subtitle && (
                    <span className='invalid'>{errors.subtitle.message}</span>
                  )}
                </Col>

                <Col md='12'>
                  <label className='form-label'>Title</label>
                  <input
                    className='form-control'
                    {...register("title", { required: "Required" })}
                    name='title'
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                  {errors.title && (
                    <span className='invalid'>{errors.title.message}</span>
                  )}
                </Col>

                <Col md='12'>
                  <label className='form-label'>Description</label>
                  <ReactQuill
                    theme='snow'
                    value={formData.description}
                    onChange={handleDescriptionChange}
                  />
                  {errors.description && (
                    <span className='invalid'>
                      {errors.description.message}
                    </span>
                  )}
                </Col>

                <Col md='12'>
                  <label className='form-label'>Image Upload (Max 500KB)</label>
                  <Controller
                    name='image'
                    control={control}
                    rules={{
                      validate: (file) => {
                        const isNewUpload = file instanceof File;
                        const hasOldImage = formData.image && !(formData.image instanceof File);

                        if (!file && !hasOldImage) {
                          return "Image is required";
                        }
                        if (isNewUpload && file.size > 512000) {
                          return "Image size must be under 500KB";
                        }
                        return true;
                      },
                    }}

                    render={({ field: { onChange } }) => (
                      <>
                        <input
                          type='file'
                          accept='image/*'
                          className='form-control'
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file && file.size > 512000) {
                              onChange(null);
                              setFormData({ ...formData, image: null });
                            } else {
                              onChange(file);
                              setFormData({ ...formData, image: file });
                            }
                          }}
                        />

                        {formData.image && (
                          <div className='mt-2 position-relative d-inline-block'>
                            <img
                              src={
                                typeof formData.image === "string"
                                  ? formData.image
                                  : formData.image.url
                                    ? formData.image.url
                                    : URL.createObjectURL(formData.image)
                              }
                              alt='preview'
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
                                onChange(null);
                                setFormData({ ...formData, image: null });
                              }}
                            >
                              <i className='ni ni-cross' />
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  />
                  {errors.image && (
                    <span className='invalid'>{errors.image.message}</span>
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
                          const res = await deleteRequest(`/about/our-inspiration/${deleteId}`);
                          if (res.success) {
                            toast.success("Deleted successfully");
                                fetchData();

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

export default OurInspirations;
