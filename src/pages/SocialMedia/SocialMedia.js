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
import {
  deleteRequest,
  getRequest,
  postFormData,
  putRequest,
} from "../../api/api";
import { Spinner } from "reactstrap";

const SocialMediaLinks = () => {
  const [data, setData] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
const [confirmModal, setConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null); 
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    icon: null,
    link: "",
    altText: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm();

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    setLoading(true)
    const res = await getRequest("/social");
    if (res.success) { setData(res.data) }
    setLoading(false);
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
    setFormData({ icon: null, link: "", altText: "" });
    reset();
  };

  const onSubmit = async () => {
    setSubmitting(true);

    const formPayload = new FormData();
    formPayload.append("link", formData.link);
    formPayload.append("altText", formData.altText || "");
    if (formData.icon instanceof File) {
      formPayload.append("icon", formData.icon);
    }

    try {
      let res;
      if (editId !== null) {
        res = await putRequest(`/social/${editId}`, formPayload);
        if (res.success) {
          const updated = data.map((item) =>
            item._id === editId ? res.data : item
          );
          setData(updated);
          toast.success("Updated successfully!");
        }
      } else {
        res = await postFormData("/social", formPayload);
        if (res.success) {
          setData([res.data, ...data]);
          toast.success("Added successfully!");
        }
      }
      toggleModal();
      setSubmitting(false);
    } catch {
      toast.error("Something went wrong.");
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setConfirmModal(true);
  };

  const onDeleteClick = async (id) => {
    const res = await deleteRequest(`/social/${id}`);
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
      <Head title='Social Media Links' />
      <Content>
        <BlockHead size='sm'>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag='h3' page>
                Social Media Links
              </BlockTitle>
              <BlockDes className='text-soft'>
                <p>Manage your social media links here.</p>
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
                  <span>Icon</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Link</span>
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
                    {item.icon?.url ? (
                      <img
                        src={item.icon.url}
                        alt={item.icon.altText}
                        width={40}
                        height={40}
                      />
                    ) : (
                      "No Icon"
                    )}
                  </DataTableRow>
                  <DataTableRow>
                    <span>{item.link}</span>
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
                {editId ? "Edit Social Media Link" : "Add Social Media Link"}
              </h5>
              <Form className='row gy-4' onSubmit={handleSubmit(onSubmit)}>
                <Col md='12'>
                  <label className='form-label'>Icon Upload (Max 500KB) <span className="danger">*</span></label>
                  <input
                    className='form-control'
                    type='file'
                    accept='image/*'
                    onChange={(e) => {
                      const file = e.target.files[0];
                       if (file) {
          // Check the file size (Max 500KB)
          if (file.size > 512000) {
            // Set error for the field using React Hook Form
            setError("icon", {
              type: "manual",
              message: "Image must be less than 500KB",
            });
          } else {
            // Clear the error if the file is valid
            clearErrors("icon");
            setFormData({ ...formData, icon: file });
          }
        }
      }}
    />
    
    {errors.icon && (
      <span className="text-danger small">{errors.icon.message}</span>
    )}

    {formData.icon && (
      <div
        style={{
          position: "relative",
          display: "inline-block",
          marginTop: 10,
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
            width: 60,
            height: 60,
            objectFit: "contain",
            borderRadius: "4px",
            border: "1px solid #ccc",
            padding: "4px",
            backgroundColor: "#fff",
          }}
        />
        <Button
          size="sm"
          color="danger"
          className="btn-icon"
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
          onClick={() => setFormData({ ...formData, icon: null })}
        >
          <Icon name="cross" />
        </Button>
      </div>
    )}
  </Col>

                <Col md='12'>
                  <label className='form-label'>Link <span className="danger">*</span></label>
                  <input
                    className='form-control'
                    {...register("link", { required: "Link is required" })}
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                  />
                  {errors.link && (
                    <span className='invalid'>{errors.link.message}</span>
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
                  const res = await deleteRequest(`/social/${deleteId}`);
                  if (res.success) {
                    toast.success("Deleted successfully");
                    fetchLinks();
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

export default SocialMediaLinks;
