import React, { useEffect, useState } from "react";
import {
  Block,
  BlockHead,
  BlockBetween,
  BlockHeadContent,
  BlockTitle,
  BlockDes,
  Button,
  Icon,
} from "../../../components/Component";
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
} from "../../../components/table/DataTable";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import TooltipComponent from "../../../components/tooltip/Tooltip";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Spinner } from "reactstrap";

import { toast } from "react-toastify";
import {
  deleteRequest,
  getRequest,
  postFormData,
  putRequest,
} from "../../../api/api";

const AboutUs = () => {
  const [data, setData] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [imageError, setImageError] = useState("");
  const [confirmModal, setConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    subtitle: "",
    title: "",
    description: "",
    buttonText: "",
    buttonLink: "",
    image: null,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    trigger,
  } = useForm();

  // toggleModal function
  const toggleModal = (editItem = null) => {
    if (editItem) {
      setEditId(editItem._id);
      setFormData(editItem);
      setValue("description", editItem.description);
    } else {
      resetForm();
      setEditId(null);
    }
    setModal(!modal);
    setImageError("");
  };

  const resetForm = () => {
    setFormData({
      subtitle: "",
      title: "",
      description: "",
      buttonText: "",
      buttonLink: "",
      image: null,
    });
    reset();
    setImageError("");
  };

  const selectorDeleteUser = () => {
    const updated = data.filter((item) => !item.checked);
    setData(updated);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 512000) {
      setImageError("Image must be less than 500KB");
      setFormData({ ...formData, image: null });
    } else {
      setImageError("");
      setFormData({ ...formData, image: file });
    }
  };

  const handleImageRemove = () => {
    setFormData({ ...formData, image: null });
    setImageError("Image is required");
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

  const fetchData = async () => {
    setLoading(true); // Show loader

    const res = await getRequest("/home/aboutus"); // your API route
    if (res.success) {
      console.log("aboutus created:", res.data);

      setData(res.data);
    } else {
    }
    setLoading(false); // Show loader

  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async () => {
    setSubmitting(true);
    if (!formData.image) {
      setImageError("Image is required");
      return;
    }

    const formPayload = new FormData();
    formPayload.append("subtitle", formData.subtitle);
    formPayload.append("title", formData.title);
    formPayload.append("description", formData.description);
    formPayload.append("buttonText", formData.buttonText);
    formPayload.append("buttonLink", formData.buttonLink);
    formPayload.append("image", formData.image);
    formPayload.append("imageAltText", formData.title || "About Us Image");

    try {
      if (editId !== null) {
        const res = await putRequest(`/home/aboutus/${editId}`, formPayload);
        if (res.success) {
          const updatedData = data.map(
            (item) => (item._id === editId ? res.data : item) // compare with _id
          );
          setData(updatedData);
          toast.success("aboutData updated successfully!");
        } else {
          toast.error("something went wrong. please try again.");
          return; // Stop further execution
        }
      } else {
        const res = await postFormData("/home/aboutus", formPayload);
        if (res.success) {
          setData([res.data, ...data]);
          toast.success("aboutData added successfully!");
        } else {
          toast.error("something went wrong. please try again.");
          return; // Stop further execution
        }
      }
      toggleModal(); // Close modal only on success
      setSubmitting(false);
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setConfirmModal(true);
  };

  const onDeleteClick = async (id) => {
    if (!id) return;

    const res = await deleteRequest(`/home/aboutus/${id}`);
    if (res.success) {
      toast.success("Entry deleted successfully!");
      fetchData(); // refresh after deletion
    } else {
      toast.error("Failed to delete entry. Please try again.");
    }
  };

  const onEditClick = (item) => {
    toggleModal(item);
  };

  return (
    <>
      <Head title='About Us Content' />
      <Content>
        <BlockHead size='sm'>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag='h3' page>
                About Us Section
              </BlockTitle>
              <BlockDes className='text-soft'>
                <p>Manage your About Us content items here.</p>
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
                  <span>Button Text</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Button Link</span>
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
                      style={{ maxWidth: 250 }}
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  </DataTableRow>
                  <DataTableRow>
                    <span>{item.buttonText}</span>
                  </DataTableRow>
                  <DataTableRow>
                    <a href={item.buttonLink} target='_blank' rel='noreferrer'>
                      {item.buttonLink}
                    </a>
                  </DataTableRow>
                  <DataTableRow>
                    {item?.image?.url ? (
                      <img
                        src={item?.image?.url}
                        alt={item?.image?.url}
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
                        onClick={() => onEditClick(item)}
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
                      {/* <li
                        onClick={() => confirmDelete(item._id)}
                      >
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
                {editId ? "Edit About Us Content" : "Add About Us Content"}
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
                  <input
                    type='hidden'
                    {...register("description", {
                      required: "Description is required",
                    })}
                  />
                  {errors.description && (
                    <span className='invalid'>
                      {errors.description.message}
                    </span>
                  )}
                </Col>
                <Col md='6'>
                  <label className='form-label'>Button Text</label>
                  <input
                    className='form-control'
                    {...register("buttonText", { required: "Required" })}
                    name='buttonText'
                    value={formData.buttonText}
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
                    {...register("buttonLink", { required: "Required" })}
                    name='buttonLink'
                    value={formData.buttonLink}
                    onChange={handleInputChange}
                  />
                  {errors.buttonLink && (
                    <span className='invalid'>{errors.buttonLink.message}</span>
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
                            : formData.image instanceof File
                              ? URL.createObjectURL(formData.image)
                              : formData.image?.url
                        }
                        alt='Preview'
                        width={100}
                        height={80}
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
                  {imageError && !formData.image && (
                    <span className='invalid'>{imageError}</span>
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
                          setSubmitting(false);
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
                  const res = await deleteRequest(`/home/aboutus/${deleteId}`);
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

export default AboutUs;
