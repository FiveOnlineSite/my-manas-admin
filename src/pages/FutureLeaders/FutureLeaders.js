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
import { useForm } from "react-hook-form";
import {
  DataTableHead,
  DataTableRow,
  DataTableItem,
} from "../../components/table/DataTable";
import Content from "../../layout/content/Content";
import Head from "../../layout/head/Head";
import TooltipComponent from "../../components/tooltip/Tooltip";
import { toast } from "react-toastify";
import { Spinner } from "reactstrap";

import {
  deleteRequest,
  getRequest,
  postFormData,
  putRequest,
} from "../../api/api";

const FutureLeaders = () => {
  const [data, setData] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    buttonText: "",
    buttonLink: "",
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
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
      title: "",
      description: "",
      image: null,
      buttonText: "",
      buttonLink: "",
    });
    reset();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 512000) {
      alert("File must be less than 500KB");
      setValue("image", null, { shouldValidate: true });
      setFormData({ ...formData, image: null });
      trigger("image");
    } else {
      setFormData({ ...formData, image: file });
      setValue("image", file, { shouldValidate: true });
      trigger("image");
    }
  };

  const handleImageRemove = () => {
    setFormData({ ...formData, image: null });
    setValue("image", null, { shouldValidate: true });
    trigger("image");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value });
    setValue("description", value);
    trigger("description");
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true); // Show loader

    const res = await getRequest("/about/future-leaders");
    if (res.success) {
      setData(res.data);
    } else {
      toast.error("Failed to fetch future leaders data.");
    }
    setLoading(false); // Show loader

  };

  console.log("Submitting:", formData);

  const onSubmit = async () => {
    setSubmitting(true);

    const isValid = await trigger();
    if (!isValid || !formData.image) return;

    const formPayload = new FormData();
    formPayload.append("title", formData.title);
    formPayload.append("description", formData.description);
    formPayload.append("image", formData.image);
    formPayload.append("buttonText", formData.buttonText);
    formPayload.append("buttonLink", formData.buttonLink);

    try {
      if (editId !== null) {
        const res = await putRequest(
          `/about/future-leaders/${editId}`,
          formPayload
        );
        if (res.success) {
          const updatedData = data.map((item) =>
            item._id === editId ? res.data : item
          );
          setData(updatedData);
          toast.success("Content updated successfully!");
        } else {
          toast.error("Update failed.");
          return;
        }
      } else {
        const res = await postFormData("/about/future-leaders", formPayload);
        if (res.success) {
          setData([res.data, ...data]);
          toast.success("Content added successfully!");
        } else {
          toast.error("Creation failed.");
          return;
        }
      }
      toggleModal();
      setSubmitting(false);
    } catch (err) {
      toast.error("An error occurred.");
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setConfirmModal(true);
  };
  

  const onDeleteClick = async (id) => {
    const res = await deleteRequest(`/about/future-leaders/${id}`);
    if (res.success) {
      toast.success("Deleted successfully!");
      fetchData(); // refresh data
    } else {
      toast.error("Delete failed.");
    }
  };

  return (
    <>
      <Head title='Future Leaders Content' />
      <Content>
        <BlockHead size='sm'>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag='h3' page>
                Future Leaders Section
              </BlockTitle>
              <BlockDes className='text-soft'>
                <p>Manage your Future Leaders content items here.</p>
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
                  <span>Title</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Description</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Image</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Button Text</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Button Link</span>
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
                    <span
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  </DataTableRow>
                  <DataTableRow>
                    {item.image?.url ? (
                      <img
                        src={item.image?.url}
                        alt={item.title}
                        width={60}
                        height={40}
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      "No image"
                    )}
                  </DataTableRow>
                  <DataTableRow>
                    <span>{item.buttonText}</span>
                  </DataTableRow>
                  <DataTableRow>
                    <a href={item.buttonLink} target='_blank' rel='noreferrer'>
                      {item.buttonLink}
                    </a>
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
                          containerClassName='btn btn-trigger btn-icon '
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
                  ? "Edit Future Leaders Content"
                  : "Add Future Leaders Content"}
              </h5>
              <Form className='row gy-4' onSubmit={handleSubmit(onSubmit)}>
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
                  <input
                    className='form-control'
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                  />
                  {errors.image && (
                    <span className='invalid'>{errors.image.message}</span>
                  )}
                  {formData.image && (
                    <div
                      style={{
                        position: "relative",
                        display: "inline-block",
                        marginTop: "10px",
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
                        alt='icon preview'
                        width={100}
                        height={100}
                        style={{
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
                        onClick={handleImageRemove}
                      >
                        <Icon name='cross' />
                      </Button>
                    </div>
                  )}
                </Col>

                <Col md='6'>
                  <label className='form-label'>Button Text</label>
                  <input
                    className='form-control'
                    name='buttonText'
                    value={formData.buttonText}
                    {...register("buttonText", { required: "Required" })}
                    onChange={handleInputChange}
                  />

                  {errors.buttonText && (
                    <span className='invalid'>{errors.buttonText.message}</span>
                  )}
                </Col>

                <Col md='6'>
                  <label className='form-label'>Button Link</label>
                  <input
                    className='form-control'
                    name='buttonLink'
                    value={formData.buttonLink}
                    {...register("buttonLink", { required: "Required" })}
                    onChange={handleInputChange}
                  />

                  {errors.buttonLink && (
                    <span className='invalid'>{errors.buttonLink.message}</span>
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
                          const res = await deleteRequest(`/about/future-leaders/${deleteId}`);
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

export default FutureLeaders;
