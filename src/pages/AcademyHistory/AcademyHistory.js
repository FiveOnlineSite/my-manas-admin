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
import { AcademyHistoryContext } from "./AcademyHistoryContext";
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

const AcademyHistory = () => {
  const { contextData } = useContext(AcademyHistoryContext);
  const [data, setData] = contextData;
  const [submitting, setSubmitting] = useState(false);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    logo: null,
    altText: "",
    description: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm();

  useEffect(() => {
    fetchAcademyHistory();
  }, []);

  const fetchAcademyHistory = async () => {
    const res = await getRequest("/academy/history");
    if (res.success) {
      setData(res.data);
    }
  };

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
      logo: null,
      altText: "",
      description: "",
    });
    reset();
  };

  const selectorDeleteUser = () => {
    const updated = data.filter((item) => !item.checked);
    setData(updated);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 512000) {
      // alert("Image must be less than 500KB");

      return;
    }
    setFormData({ ...formData, logo: file });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = async () => {
    setSubmitting(true);

    if (!formData.logo && !editId) {
      toast.error("Logo is required");
      return;
    }

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("description", formData.description);
    payload.append("altText", formData.altText);
    if (formData.logo instanceof File) {
      payload.append("logo", formData.logo);
    }

    try {
      let res;
      if (editId) {
        res = await putRequest(`/academy/history/${editId}`, payload);
      } else {
        res = await postFormData("/academy/history", payload);
      }

      if (res.success) {
        toast.success(
          editId ? "Updated successfully!" : "Created successfully!"
        );
        fetchAcademyHistory();
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
    const res = await deleteRequest(`/academy/history/${id}`);
    if (res.success) {
      toast.success("Deleted successfully!");
      fetchAcademyHistory();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <>
      <Head title='Academy History' />
      <Content>
        <BlockHead size='sm'>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag='h3' page>
                Academy History Section
              </BlockTitle>
              <BlockDes className='text-soft'>
                <p>Manage your Academy History content items here.</p>
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
          <div className='nk-tb-list is-separate is-medium mb-3'>
            <DataTableHead>
              <DataTableRow>
                <span>Title</span>
              </DataTableRow>
              <DataTableRow>
                <span>Logo</span>
              </DataTableRow>
              <DataTableRow>
                <span>Alt Text</span>
              </DataTableRow>
              <DataTableRow>
                <span>Description</span>
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
                  <span>{item.title}</span>
                </DataTableRow>
                <DataTableRow>
                  {item.logo ? (
                    <img
                      src={
                        item.logo instanceof File
                          ? URL.createObjectURL(item.logo)
                          : typeof item.logo === "string"
                          ? item.logo
                          : item.logo?.url || ""
                      }
                      alt={item.altText || item.logo?.altText || "Logo"}
                      width={60}
                      height={40}
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    "No logo"
                  )}
                </DataTableRow>
                <DataTableRow>
                  <span>{item.logo?.altText}</span>
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
                    <li onClick={() => onDeleteClick(item._id)}>
                      <TooltipComponent
                        tag='a'
                        containerClassName='btn btn-trigger btn-icon'
                        id={`delete${item._id}`}
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
                {editId ? "Edit Academy History" : "Add Academy History"}
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
                  <label className='form-label'>Logo (Max 500KB)</label>
                  <Controller
                    name='logo'
                    control={control}
                    rules={{
                      required: !editId && "Logo is required",
                      validate: (file) =>
                        !file ||
                        file.size <= 512000 ||
                        "Image must be less than 500KB",
                    }}
                    defaultValue={formData.logo}
                    render={({ field: { onChange } }) => (
                      <>
                        <input
                          className={`form-control mb-2 ${
                            errors.logo ? "is-invalid" : ""
                          }`}
                          type='file'
                          accept='image/*'
                          onChange={(e) => {
                            const file = e.target.files[0];
                            onChange(file);
                            setFormData((prev) => ({
                              ...prev,
                              logo: file,
                            }));
                          }}
                        />
                        {errors.logo && (
                          <span className='invalid'>{errors.logo.message}</span>
                        )}

                        {/* Image Preview with Remove Button */}
                        {formData.logo && (
                          <div
                            style={{
                              position: "relative",
                              display: "inline-block",
                              marginTop: "10px",
                            }}
                          >
                            <img
                              src={
                                formData.logo instanceof File
                                  ? URL.createObjectURL(formData.logo)
                                  : typeof formData.logo === "string"
                                  ? formData.logo
                                  : formData.logo?.url || ""
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
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  logo: null,
                                }));
                                onChange(null); // Clear controller value
                              }}
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
                      </>
                    )}
                  />
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
                <Col md='12'>
                  <label className='form-label'>Description</label>
                  <Controller
                    name='description'
                    control={control}
                    rules={{ required: "Required" }}
                    defaultValue={formData.description}
                    render={({ field }) => (
                      <ReactQuill
                        theme='snow'
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          setFormData((prev) => ({
                            ...prev,
                            description: value,
                          }));
                        }}
                      />
                    )}
                  />
                  {errors.description && (
                    <span className='invalid'>
                      {errors.description.message}
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
      </Content>
    </>
  );
};

export default AcademyHistory;
