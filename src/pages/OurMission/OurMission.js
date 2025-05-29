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
import {
  DataTableHead,
  DataTableItem,
  DataTableRow,
} from "../../components/table/DataTable";
import Content from "../../layout/content/Content";
import Head from "../../layout/head/Head";
import { useForm } from "react-hook-form";
import TooltipComponent from "../../components/tooltip/Tooltip";
import { OurMissionContext } from "./OurMissionContext";
import { toast } from "react-toastify";
import { Spinner } from "reactstrap";

import {
  deleteRequest,
  getRequest,
  postFormData,
  putRequest,
} from "../../api/api";

const OurMission = () => {
  const { contextData } = useContext(OurMissionContext);
  const [data, setData] = contextData;
  const [modal, setModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    subtitle: "",
    title: "",
    image: null,
    accordions: [{ title: "", description: "" }],
  });
  const [imageError, setImageError] = useState("");
  const [accordionErrors, setAccordionErrors] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getRequest("/home/mission");
    if (res.success) {
      setData(res.data);
    }
  };

  const toggleModal = (item = null) => {
    setImageError("");
    setAccordionErrors([]);
    if (item) {
      setFormData({
        subtitle: item.subtitle || "",
        title: item.title || "",
        image: item.image || null,
        accordions: item.accordions?.length
          ? item.accordions
          : [{ title: "", description: "" }],
      });
      setEditId(item._id);
    } else {
      resetForm();
    }
    setModal(!modal);
  };

  const resetForm = () => {
    setFormData({
      subtitle: "",
      title: "",
      image: null,
      accordions: [{ title: "", description: "" }],
    });
    reset();
    setEditId(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image")) {
      setImageError("Only image files are allowed.");
      return;
    }

    if (file.size > 512000) {
      setImageError("Image must be less than 500KB.");
      return;
    }

    setImageError("");
    setFormData({ ...formData, image: file });
  };

  const handleAccordionChange = (index, field, value) => {
    const updated = [...formData.accordions];
    updated[index][field] = value;
    setFormData({ ...formData, accordions: updated });
  };

  const addAccordion = () => {
    setFormData({
      ...formData,
      accordions: [...formData.accordions, { title: "", description: "" }],
    });
  };

  const validateAccordions = () => {
    const errors = formData.accordions.map((item) => ({
      title: !item.title,
      description: !item.description,
    }));
    setAccordionErrors(errors);
    return errors.every((e) => !e.title && !e.description);
  };

  const onSubmit = async () => {
    setSubmitting(true);

    if (!formData.image && !editId) {
      setImageError("Image is required.");
      return;
    }

    if (!validateAccordions()) return;

    const formPayload = new FormData();
    formPayload.append("subtitle", formData.subtitle);
    formPayload.append("title", formData.title);

    if (formData.image instanceof File) {
      formPayload.append("image", formData.image);
    }

    formPayload.append("accordions", JSON.stringify(formData.accordions));

    try {
      let res;
      if (editId) {
        res = await putRequest(`/home/mission/${editId}`, formPayload);
        if (res.success) {
          const updated = data.map((d) => (d._id === editId ? res.data : d));
          setData(updated);
          toast.success("Updated successfully!");
        } else {
          toast.error("Update failed.");
          return;
        }
      } else {
        res = await postFormData("/home/mission", formPayload);
        if (res.success) {
          setData([res.data, ...data]);
          toast.success("Created successfully!");
        } else {
          toast.error("Creation failed.");
          return;
        }
      }
      toggleModal();
      setSubmitting(false);
    } catch {
      toast.error("An error occurred.");
    }
  };

  const onDeleteClick = async (id) => {
    const res = await deleteRequest(`/home/mission/${id}`);
    if (res.success) {
      setData(data.filter((item) => item._id !== id));
      toast.success("Deleted successfully!");
    } else {
      toast.error("Failed to delete.");
    }
  };

  return (
    <>
      <Head title='Our Mission' />
      <Content>
        <BlockHead size='sm'>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag='h3'>Our Mission</BlockTitle>
              <BlockDes>
                <p>Manage Our Mission content and accordions.</p>
              </BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <Button color='primary' onClick={() => toggleModal()}>
                <Icon name='plus' />
                <span>Add Mission</span>
              </Button>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <div className='nk-tb-list is-separate is-medium mb-3'>
            <DataTableHead>
              <DataTableRow>
                <span>Subtitle</span>
              </DataTableRow>
              <DataTableRow>
                <span>Title</span>
              </DataTableRow>
              <DataTableRow>
                <span>Image</span>
              </DataTableRow>
              <DataTableRow>
                <span>Accordions</span>
              </DataTableRow>
              <DataTableRow className='nk-tb-col-tools text-end' />
            </DataTableHead>
            {data.map((item) => (
              <DataTableItem key={item._id}>
                <DataTableRow>{item.subtitle}</DataTableRow>
                <DataTableRow>{item.title}</DataTableRow>
                <DataTableRow>
                  {item?.image?.url ? (
                    <img
                      src={item.image.url}
                      alt='preview'
                      width={60}
                      height={40}
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    "No image"
                  )}
                </DataTableRow>
                <DataTableRow>
                  <ul>
                    {item.accordions.map((acc, i) => (
                      <li key={i}>
                        <strong>{acc.title}</strong>: {acc.description}
                      </li>
                    ))}
                  </ul>
                </DataTableRow>
                <DataTableRow className='nk-tb-col-tools'>
                  <ul className='nk-tb-actions gx-1'>
                    <li onClick={() => toggleModal(item)}>
                      <TooltipComponent
                        tag='a'
                        containerClassName='btn btn-trigger btn-icon'
                        id={"edit" + item._id}
                        icon='edit-alt-fill'
                        direction='top'
                        text='Edit'
                      />
                    </li>
                    <li onClick={() => onDeleteClick(item._id)}>
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
        </Block>

        <Modal
          isOpen={modal}
          toggle={toggleModal}
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
                {editId ? "Edit Mission" : "Add Mission"}
              </h5>
              <Form className='row gy-4' onSubmit={handleSubmit(onSubmit)}>
                <Col md='12'>
                  <label className='form-label'>Subtitle</label>
                  <input
                    className='form-control'
                    {...register("subtitle", { required: "Required" })}
                    value={formData.subtitle}
                    onChange={(e) =>
                      setFormData({ ...formData, subtitle: e.target.value })
                    }
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
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                  {errors.title && (
                    <span className='invalid'>{errors.title.message}</span>
                  )}
                </Col>
                <Col
                  md='12'
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <label className='form-label'>Image Upload (Max 500KB)</label>
                  {!formData.image || formData.image instanceof File ? (
                    <input
                      className='form-control'
                      type='file'
                      accept='image/*'
                      onChange={handleImageChange}
                    />
                  ) : null}

                  {imageError && <span className='invalid'>{imageError}</span>}

                  {formData.image && (
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
                            formData.image instanceof File
                              ? URL.createObjectURL(formData.image)
                              : formData.image.url
                          }
                          alt='Mission'
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
                          onClick={() =>
                            setFormData({ ...formData, image: null })
                          }
                        >
                          <Icon name='cross' />
                        </Button>
                      </div>
                    </div>
                  )}
                </Col>
                <Col md='12'>
                  <label className='form-label'>Accordions</label>
                  {formData.accordions.map((acc, index) => (
                    <div key={index} className='border rounded p-3 mb-3'>
                      <Row className='gy-2'>
                        <Col md='6'>
                          <input
                            className={`form-control ${
                              accordionErrors[index]?.title ? "is-invalid" : ""
                            }`}
                            placeholder='Accordion Title'
                            value={acc.title}
                            onChange={(e) =>
                              handleAccordionChange(
                                index,
                                "title",
                                e.target.value
                              )
                            }
                          />
                          {accordionErrors[index]?.title && (
                            <span className='invalid'>Title is required</span>
                          )}
                        </Col>
                        <Col md='6'>
                          <input
                            className={`form-control ${
                              accordionErrors[index]?.description
                                ? "is-invalid"
                                : ""
                            }`}
                            placeholder='Accordion Description'
                            value={acc.description}
                            onChange={(e) =>
                              handleAccordionChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                          />
                          {accordionErrors[index]?.description && (
                            <span className='invalid'>
                              Description is required
                            </span>
                          )}
                        </Col>
                      </Row>
                    </div>
                  ))}
                  <Button size='sm' onClick={addAccordion}>
                    <Icon name='plus' /> Add More
                  </Button>
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
      </Content>
    </>
  );
};

export default OurMission;
