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
  Row,
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
import {
  deleteRequest,
  getRequest,
  postFormData,
  putRequest,
} from "../../api/api";
import { Spinner } from "reactstrap";
import ReactQuill from "react-quill";

const Testimonials = () => {
  const [data, setData] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
const [confirmModal, setConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null); 
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    location: "",
    image: null, // to store the image file
    description: "", 
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true)
    const res = await getRequest("/testimonials");
    if (res.success) {
      setData(res.data);
    } else {
      toast.error("Failed to fetch testimonials.");
    }
    setLoading(false)
  };

  const toggleModal = (editItem = null) => {
    if (editItem) {
      setEditId(editItem._id);
      // setFormData(editItem);
      setFormData({
      name: editItem.name || "",
      designation: editItem.designation || "",
      location: editItem.location || "",
      image: editItem.image || null,
      altText: editItem.image?.altText || "",
       description: editItem.description || "", 
    });
    } else {
      resetForm();
      setEditId(null);
    }
    setModal(!modal);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      designation: "",
      location: "",
      image: null, // reset image to null
      altText: "",
    description: "",
    });
    reset();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null }); // Remove the image
  };

  const onSubmit = async () => {
    setSubmitting(true);

    const formPayload = new FormData();
    formPayload.append("name", formData.name);
    formPayload.append("designation", formData.designation);
    formPayload.append("location", formData.location);
    formPayload.append("altText", formData.altText);
    formPayload.append("description", formData.description);


    if (formData.image instanceof File) {
      formPayload.append("image", formData.image);
    }

    try {
      let res;
      if (editId !== null) {
        res = await putRequest(`/testimonials/${editId}`, formPayload);
        if (res.success) {
          const updated = data.map((item) =>
            item._id === editId ? res.data : item
          );
          setData(updated);
          toast.success("Updated successfully!");
        }
      } else {
        res = await postFormData("/testimonials", formPayload);
        if (res.success) {
          setData([res.data, ...data]);
          toast.success("Added successfully!");
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
    const res = await deleteRequest(`/testimonials/${id}`);
    if (res.success) {
      setData(data.filter((item) => item._id !== id));
      toast.success("Deleted successfully!");
    } else {
      toast.error("Failed to delete.");
    }
  };

  const selectorDeleteUser = () => {
    const updated = data.filter((item) => !item.checked);
    setData(updated);
  };

  return (
    <>
      <Head title='Testimonials' />
      <Content>
        <BlockHead size='sm'>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag='h3' page>
                Testimonials
              </BlockTitle>
              <BlockDes className='text-soft'>
                <p>Manage your testimonials here.</p>
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
                  <span>Name</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Designation</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Location</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Image</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Description</span>
                </DataTableRow>
                
                <DataTableRow className='nk-tb-col-tools text-end'>
                  <UncontrolledDropdown>
                    <DropdownToggle
                      color='transparent'
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
                    <span>{item.name}</span>
                  </DataTableRow>
                  <DataTableRow>
                    <span>{item.designation}</span>
                  </DataTableRow>
                  <DataTableRow>
                    <span>{item.location}</span>
                  </DataTableRow>
                  <DataTableRow>
                    {item.image?.url ? (
                      <img
                        src={item.image.url}
                        alt={item.image.altText}
                        style={{ width: 50, height: 50, borderRadius: "50%" }}
                      />
                    ) : (
                      "No image"
                    )}
                  </DataTableRow>
                  <DataTableRow>
  <div dangerouslySetInnerHTML={{ __html: item.description }} />
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
                {editId ? "Edit Testimonial" : "Add Testimonial"}
              </h5>
              <Form className='row gy-4' onSubmit={handleSubmit(onSubmit)}>
                <Col md='12'>
                  <label className='form-label'>Name <span className="danger">*</span></label>
                  <input
                    className='form-control'
                    {...register("name", { required: "Required" })}
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  {errors.name && (
                    <span className='invalid'>{errors.name.message}</span>
                  )}
                </Col>

                <Col md='12'>
                  <label className='form-label'>Designation <span className="danger">*</span></label>
                  <input
                    className='form-control'
                    {...register("designation", { required: "Required" })}
                    name='designation'
                    value={formData.designation}
                    onChange={handleInputChange}
                  />
                  {errors.designation && (
                    <span className='invalid'>
                      {errors.designation.message}
                    </span>
                  )}
                </Col>

                <Col md='12'>
                  <label className='form-label'>Location <span className="danger">*</span></label>
                  <input
                    className='form-control'
                    {...register("location", { required: "Required" })}
                    name='location'
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                  {errors.location && (
                    <span className='invalid'>{errors.location.message}</span>
                  )}
                </Col>

                {/* Image Upload Section */}
                <Col md='12'>
                  <label className='form-label'>Image Upload <span className="danger">*</span></label>
                  <input
                    className='form-control'
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                  />
                  <div>
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
                    )}
                  </div>
                </Col>

                <Col md='12'>
                  <label className='form-label'>Alt Text <span className="danger">*</span></label>
                  <input
                    className='form-control'
                    {...register("altText", { required: "Required" })}
                    name='altText'
                    value={formData.altText}
                    onChange={handleInputChange}
                  />
                  {errors.altText && (
                    <span className='invalid'>{errors.altText.message}</span>
                  )}
                </Col>

                 <Col md='12'>
  <label className='form-label'>Description <span className="danger">*</span></label>
  <ReactQuill
    value={formData.description}
    onChange={(value) => setFormData({ ...formData, description: value })}
    theme='snow'
  />
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
                  const res = await deleteRequest(`/testimonials/${deleteId}`);
                  if (res.success) {
                    toast.success("Deleted successfully");
                    fetchTestimonials();
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

export default Testimonials;
