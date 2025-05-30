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
import { ScholarshipDocContext } from "./ScholarshipDocContext";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import {
  deleteRequest,
  getRequest,
  postFormData,
  putRequest,
} from "../../api/api";
import { Spinner } from "reactstrap";

const ScholarshipDoc = () => {
  const { contextData } = useContext(ScholarshipDocContext);
  const [data, setData] = contextData;
  const [submitting, setSubmitting] = useState(false);

  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    image: null,
    description: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
    setValue,
    trigger,
    control,
  } = useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getRequest("/scholarships/documents");
    if (res.success) {
      setData(res.data);
    } else {
      toast.error("Failed to fetch documents");
    }
  };

  const toggleModal = (editItem = null) => {
    if (editItem) {
      setEditId(editItem._id);
      setFormData(editItem);
      setValue("title", editItem.title);
      setValue("description", editItem.description);
      setValue("image", editItem.image || null);
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
      description: "",
    });
    reset();
  };

  const selectorDeleteUser = () => {
    const updated = data.filter((item) => !item.checked);
    setData(updated);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    // if (file && file.size > 512000) {
    //   setError("image", {
    //     type: "manual",
    //     message: "Image must be less than 500KB",
    //   });
    //   setFormData({ ...formData, image: null });
    //   setValue("image", null, { shouldValidate: true });
    // } else {
    clearErrors("image");
    setFormData({ ...formData, image: file });
    setValue("image", file, { shouldValidate: true });
    // }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = async () => {
    setSubmitting(true);

    const isValid = await trigger();
    if (!isValid) return;

    if (!formData.image && editId === null) {
      setError("image", { type: "manual", message: "Image is required" });
      return;
    }

    const formPayload = new FormData();
    formPayload.append("title", formData.title);
    formPayload.append("description", formData.description);
    if (formData.image instanceof File) {
      formPayload.append("image", formData.image);
    }

    try {
      let res;
      if (editId !== null) {
        res = await putRequest(
          `/scholarships/documents/${editId}`,
          formPayload,
          true
        );
      } else {
        res = await postFormData("/scholarships/documents", formPayload);
      }

      if (res.success) {
        fetchData(); // refresh the data
        toast.success(editId ? "Updated successfully" : "Created successfully");
      } else {
        toast.error(res.message || "Operation failed");
      }
      toggleModal();
      setSubmitting(false);
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  useEffect(() => {
    register("image", { required: "Image is required" });
    register("description", { required: true });
  }, [register]);

  const onDeleteClick = async (id) => {
    const res = await deleteRequest(`/scholarships/documents/${id}`);
    if (res.success) {
      setData(data.filter((item) => item._id !== id));
      toast.success("Deleted successfully");
    } else {
      toast.error("Failed to delete");
    }
  };

  return (
    <>
      <Head title='Documents Content' />
      <Content>
        <BlockHead size='sm'>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag='h3' page>
                Documents Section
              </BlockTitle>
              <BlockDes className='text-soft'>
                <p>Manage your Documents content items here.</p>
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
                <span>Image</span>
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
                  {item.image?.url ? (
                    <img
                      src={item.image?.url}
                      alt={item.image?.altText}
                      width={60}
                      height={40}
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    "No image"
                  )}
                </DataTableRow>
                <DataTableRow>
                  <span
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
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
                {editId ? "Edit Document Content" : "Add Document Content"}
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
                            : formData.image.url
                            ? formData.image.url
                            : URL.createObjectURL(formData.image)
                        }
                        alt='Preview'
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
                  {errors.image && (
                    <span className='invalid'>{errors.image.message}</span>
                  )}
                </Col>

                <Col md='12'>
                  <label className='form-label'>Description</label>
                  <Controller
                    name='description'
                    control={control}
                    defaultValue={formData.description || ""}
                    rules={{ required: "Description is required" }}
                    render={({ field }) => (
                      <ReactQuill
                        theme='snow'
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          setFormData({ ...formData, description: value });
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

export default ScholarshipDoc;
