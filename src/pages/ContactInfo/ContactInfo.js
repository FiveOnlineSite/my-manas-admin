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
  DropdownMenu,
  UncontrolledDropdown,
  DropdownToggle,
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
  postRequest,
  putRequest,
} from "../../api/api";
import { Spinner } from "reactstrap";


const ContactInfo = () => {
  const [data, setData] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
const [confirmModal, setConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null); 

  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    email: "",
    address: "",
    resumeLink: "",
  });

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
    setLoading(true)
    const res = await getRequest("/academy/contact-info");
    if (res.success) {
      setData(res.data);
    } else {
    }
    setLoading(false)
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
      email: "",
      address: "",
      resumeLink: "",
    });
    reset();
  };

  const selectorDeleteUser = () => {
    const updated = data.filter((item) => !item.checked);
    setData(updated);
  };

  const onSubmit = async () => {
    setSubmitting(true);

    if (
      !formData.title ||
      !formData.email ||
      !formData.address ||
      !formData.resumeLink
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      if (editId !== null) {
        const res = await putRequest(
          `/academy/contact-info/${editId}`,
          formData
        );
        if (res.success) {
          const updated = data.map((item) =>
            item._id === editId ? res.data : item
          );
          setData(updated);
          toast.success("Contact info updated successfully!");
        } else {
          toast.error(res.message || "Update failed");
        }
      } else {
        const res = await postRequest("/academy/contact-info", formData);
        if (res.success) {
          setData([res.data, ...data]);
          toast.success("Contact info added successfully!");
        } else {
          toast.error(res.message || "Creation failed");
        }
      }
      toggleModal(); // close and reset modal
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
    const res = await deleteRequest(`/academy/contact-info/${id}`);
    if (res.success) {
      setData(data.filter((item) => item._id !== id));
      toast.success("Deleted successfully!");
    } else {
      toast.error(res.message || "Failed to delete");
    }
  };

  return (
    <>
      <Head title='Contact Info Section' />
      <Content>
        <BlockHead size='sm'>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag='h3' page>
                Contact Information Section
              </BlockTitle>
              <BlockDes className='text-soft'>
                <p>Manage your Contact Information content items here.</p>
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
                  <span>Email</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Address</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Resume Link</span>
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
                    <span>{item.email}</span>
                  </DataTableRow>
                  <DataTableRow>
                    <span>{item.address}</span>
                  </DataTableRow>
                  <DataTableRow>
                    <span>{item.resumeLink}</span>
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
                      {/* <li
                        onClick={() => confirmDelete(item._id)}
                      >
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
                {editId ? "Edit Contact Info" : "Add Contact Info"}
              </h5>
              <Form className='row gy-4' onSubmit={handleSubmit(onSubmit)}>
                <Col md='12'>
                  <label className='form-label'>Give Title <span className="danger">*</span></label>
                  <input
                    className='form-control'
                    {...register("title", {
                      required: "Give Title is required",
                    })}
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
                  <label className='form-label'>Email <span className="danger">*</span></label>
                  <input
                    type='email'
                    className='form-control'
                    {...register("email", {
                      required: "Email is required",
                      // pattern: {
                      //   value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                      //   message: "Invalid email format",
                      // },
                    })}
                    name='email'
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  {errors.email && (
                    <span className='invalid'>{errors.email.message}</span>
                  )}
                </Col>

                <Col md='12'>
                  <label className='form-label'>Address <span className="danger">*</span></label>
                  <textarea
                    className='form-control'
                    {...register("address", {
                      required: "Address is required",
                    })}
                    name='address'
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                  {errors.address && (
                    <span className='invalid'>{errors.address.message}</span>
                  )}
                </Col>

                <Col md='12'>
                  <label className='form-label'>Resume Link <span className="danger">*</span></label>
                  <input
                    className='form-control'
                    {...register("resumeLink", {
                      required: "Resume Link is required",
                    })}
                    name='resumeLink'
                    value={formData.resumeLink}
                    onChange={(e) =>
                      setFormData({ ...formData, resumeLink: e.target.value })
                    }
                  />
                  {errors.resumeLink && (
                    <span className='invalid'>{errors.resumeLink.message}</span>
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
                  const res = await deleteRequest(`/academy/contact-info/${deleteId}`);
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

export default ContactInfo;
