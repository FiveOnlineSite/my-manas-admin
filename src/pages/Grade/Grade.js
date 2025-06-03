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

const Grade = () => {
  const [data, setData] =  useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: null,
    altText: "",
  });

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getRequest("/academy/grade-levels");
    if (res.success) {
      const result = Array.isArray(res.data) ? res.data : [res.data];
      setData(result);
    } else {
      toast.error("Failed to fetch data");
      setData([]);
    }
  };

  const toggleModal = (editItem = null) => {
    if (editItem) {
      setEditId(editItem._id);
      // setFormData(editItem);
      setFormData({
        title: editItem.title || "",
        description: editItem.description || "",
        icon: editItem.icon || null,
        altText: editItem.icon?.altText || "",
      });
      setValue("title", editItem.title || "");
      setValue("description", editItem.description || "");
      setValue("icon", editItem.icon || null);
      setValue("altText", editItem.icon?.altText || "");
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
      icon: null,
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
    setFormData({ ...formData, icon: file });
    setValue("icon", file, { shouldValidate: true });
  };

  const onSubmit = async () => {
    setSubmitting(true);

    if (
      !formData.title ||
      !formData.description ||
      !formData.icon ||
      !formData.altText
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("description", formData.description);
    payload.append("altText", formData.altText);

    if (formData.icon instanceof File) {
      payload.append("icon", formData.icon);
    }

    try {
      let res;
      if (editId !== null) {
        res = await putRequest(`/academy/grade-levels/${editId}`, payload);
        if (res.success) {
          const updated = data.map((item) =>
            item._id === editId ? res.data : item
          );
          setData(updated);
          toast.success("Content updated successfully!");
        } else {
          toast.error(res.message || "Update failed");
        }
      } else {
        res = await postFormData("/academy/grade-levels", payload);
        if (res.success) {
          setData([res.data, ...data]);
          toast.success("Content added successfully!");
        } else {
          toast.error(res.message || "Creation failed");
        }
      }
      toggleModal();
      setSubmitting(false);
    } catch (error) {
      toast.error("An error occurred while submitting.");
    }
  };

  const onDeleteClick = async (id) => {
    const res = await deleteRequest(`/academy/grade-levels/${id}`);
    if (res.success) {
      setData(data.filter((item) => item._id !== id));
      toast.success("Deleted successfully!");
    } else {
      toast.error(res.message || "Failed to delete");
    }
  };
  return (
    <>
      <Head title='Grade Content' />
      <Content>
        <BlockHead size='sm'>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag='h3' page>
                Grade Section
              </BlockTitle>
              <BlockDes className='text-soft'>
                <p>Manage your Grade content items here.</p>
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
                <span>Description</span>
              </DataTableRow>
              <DataTableRow>
                <span>Icon</span>
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

            {Array.isArray(data) &&
              data.map((item) => (
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
                    {item.icon?.url && (
                      <img
                        src={item.icon?.url}
                        alt={item.icon?.altText || "item image"}
                        width={30}
                        height={30}
                      />
                    )}
                  </DataTableRow>
                  <DataTableRow>
                    <span>{item.icon?.altText}</span>
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
                {editId ? "Edit Grade Content" : "Add Grade Content"}
              </h5>
              <Form className='row gy-4' onSubmit={handleSubmit(onSubmit)}>
                <Col md='12'>
                  <label className='form-label'>Title</label>
                  <input
                    className='form-control'
                    {...register("title", { required: "Title is required" })}
                    name='title'
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                  {errors.title && (
                    <span className='invalid'>{errors.title.message}</span>
                  )}
                </Col>

                <Col md='12'>
                  <label className='form-label'>Description</label>
                  <Controller
                    name='description'
                    control={control}
                    rules={{ required: "Description is required" }}
                    render={({ field }) => (
                      <ReactQuill
                        theme='snow'
                        value={field.value}
                        onChange={(val) => {
                          field.onChange(val);
                          setFormData({ ...formData, description: val });
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

                <Col
                  md='12'
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <label className='form-label'>Icon (Max 100KB)</label>
                  {!formData.icon ? (
                    <input
                      className='form-control'
                      type='file'
                      accept='image/*'
                      onChange={handleFileChange}
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
                            typeof formData.icon === "string"
                              ? formData.icon
                              : formData.icon.url
                              ? formData.icon.url
                              : URL.createObjectURL(formData.icon)
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
                            setFormData({ ...formData, icon: null });
                            setValue("icon", null, { shouldValidate: true });
                          }}
                        >
                          <Icon name='cross' />
                        </Button>
                      </div>
                    </div>
                  )}
                  {/* Hidden field for validation */}
                  <input
                    type='hidden'
                    {...register("icon", {
                      required: "Icon is required",
                      validate: {
                        fileSize: (file) => {
                          if (!file) return "Icon is required";
                          if (file instanceof File) {
                            return (
                              file.size <= 102400 ||
                              "Icon must be less than 100KB"
                            );
                          }
                          if (typeof file === "string" || file?.url) {
                            return true;
                          }
                          return "Invalid icon format";
                        },
                      },
                    })}
                  />
                  {errors.icon && (
                    <span className='invalid d-block mt-1'>
                      {errors.icon.message}
                    </span>
                  )}
                </Col>

                <Col md='12'>
                  <label className='form-label'>Alt Text</label>
                  <input
                    className='form-control'
                    {...register("altText", {
                      required: "Alt Text is required",
                    })}
                    value={formData.altText}
                    onChange={(e) =>
                      setFormData({ ...formData, altText: e.target.value })
                    }
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

export default Grade;
