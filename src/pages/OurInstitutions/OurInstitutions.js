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
import { deleteRequest, getRequest, postFormData, putRequest } from "../../api/api";
import { Spinner } from "reactstrap";


const OurInstitutions = () => {
  const [data, setData] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    image: null,
    altText: "",
  });

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true)
    const res = await getRequest("/institutions/our-institutions");
    if (res.success) {
      setData(res.data);
    }
    setLoading(false)
  };

  const toggleModal = (editItem = null) => {
    if (editItem) {
      setEditId(editItem.id);
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
      image: null,
      altText: "",
    });
    reset();
  };

  const selectorDeleteUser = () => {
    const updated = data.filter((item) => !item.checked);
    setData(updated);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setError("image", { type: "manual", message: "Image is required" });
      setFormData({ ...formData, image: null });
      return;
    }

    if (file.size > 512000) {
      setError("image", {
        type: "manual",
        message: "Image must be less than 500KB",
      });
      setFormData({ ...formData, image: null });
      return;
    }

    clearErrors("image");
    setFormData({ ...formData, image: file });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = async () => {
    setSubmitting(true);

    if (!formData.image && editId === null) {
      setError("image", { type: "manual", message: "Image is required" });
      return;
    }

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("altText", formData.altText);
    if (formData.image instanceof File) {
      payload.append("image", formData.image);
    }

    try {
      let res;
      if (editId) {
        res = await putRequest(
          `/institutions/our-institutions/${editId}`,
          payload
        );
      } else {
        res = await postFormData("/institutions/our-institutions", payload);
      }

      if (res.success) {
        const updatedList = editId
          ? data.map((item) => (item._id === editId ? res.data : item))
          : [res.data, ...data];

        setData(updatedList);
        toast.success(
          editId ? "Updated successfully!" : "Created successfully!"
        );
        toggleModal();
        setSubmitting(false);

      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Submission failed.");
    }
  };

  const onDeleteClick = async (id) => {
    const res = await deleteRequest(`/institutions/our-institutions/${id}`);
    if (res.success) {
      setData(data.filter((item) => item._id !== id));
      toast.success("Deleted successfully!");
    } else {
      toast.error(res.message || "Delete failed");
    }
  };



  return (
    <>
      <Head title='Our Institutions Content' />
      <Content>
        <BlockHead size='sm'>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag='h3' page>
                Our Institutions Section
              </BlockTitle>
              <BlockDes className='text-soft'>
                <p>Manage your Our Institutions content items here.</p>
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
                  <span>Image</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Alt Text</span>
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
                <DataTableItem key={item.id}>
                  <DataTableRow>
                    <span>{item.title}</span>
                  </DataTableRow>
                  <DataTableRow>
                    {item.image ? (
                      <img
                        src={
                          item.image instanceof File
                            ? URL.createObjectURL(item.image)
                            : typeof item.image === "string"
                              ? item.image
                              : item.image?.url || ""
                        }
                        alt={
                          item.altText ||
                          item.image?.altText ||
                          "Institution Image"
                        }
                        width={60}
                        height={40}
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      "No image"
                    )}
                  </DataTableRow>
                  <DataTableRow>
                    <span>{item.image?.altText}</span>
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
                          id={"edit" + item.id}
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
                  ? "Edit Our Institutions Content"
                  : "Add Our Institutions Content"}
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
                  <label className='form-label'>Image (Max 500KB)</label>
                  <input
                    className='form-control mb-2'
                    type='file'
                    accept='image/*'
                    onChange={handleFileChange}
                  />
                  {errors.image && (
                    <span className='invalid'>{errors.image.message}</span>
                  )}

                  {/* Image Preview */}
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
                          formData.image instanceof File
                            ? URL.createObjectURL(formData.image)
                            : typeof formData.image === "string"
                              ? formData.image
                              : formData.image?.url || ""
                        }
                        alt={formData.altText || "Preview"}
                        style={{
                          width: "150px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                        }}
                      />
                      <button
                        type='button'
                        onClick={() =>
                          setFormData({ ...formData, image: null })
                        }
                        style={{
                          position: "absolute",
                          top: "-5px",
                          right: "-5px",
                          background: "red",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                        title='Remove image'
                      >
                        ×
                      </button>
                    </div>
                  )}
                </Col>

                <Col md='12'>
                  <label className='form-label'>Alt Text</label>
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

export default OurInstitutions;
