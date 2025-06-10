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
  postRequest,
  putRequest,
} from "../../api/api";
import { Spinner } from "reactstrap";

const AboutDonate = () => {
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
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true)
    const res = await getRequest("/donate/about-us");
    if (res.success) {
      setData(res.data);
    }
    setLoading(false)
  };

  const toggleModal = (editItem = null) => {
    if (editItem) {
      setEditId(editItem._id);
      setFormData(editItem);
      setValue("title", editItem.title);
      setValue("description", editItem.description);
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
    });
    reset();
  };

  const selectorDeleteUser = () => {
    const updated = data.filter((item) => !item.checked);
    setData(updated);
  };

  const onSubmit = async () => {
    setSubmitting(true);

    try {
      if (editId !== null) {
        const res = await putRequest(`/donate/about-us/${editId}`, formData);
        if (res.success) {
          const updated = data.map((item) =>
            item._id === editId ? res.data : item
          );
          setData(updated);
          toast.success("Updated successfully!");
        } else {
          toast.error("Update failed");
        }
      } else {
        const res = await postRequest("/donate/about-us", formData);
        if (res.success) {
          setData([res.data, ...data]);
          toast.success("Added successfully!");
        } else {
          toast.error("Creation failed");
        }
      }
      toggleModal();
      setSubmitting(false);
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setConfirmModal(true);
  };


  const onDeleteClick = async (id) => {
    try {
      const res = await deleteRequest(`/donate/about-us/${id}`);
      if (res.success) {
        setData(data.filter((item) => item._id !== id));
        toast.success("Deleted successfully");
      } else {
        toast.error("Delete failed");
      }
    } catch (err) {
      toast.error("Error deleting item");
    }
  };

  return (
    <>
      <Head title='About Donate Section' />
      <Content>
        <BlockHead size='sm'>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag='h3' page>
                About Donate Section
              </BlockTitle>
              <BlockDes className='text-soft'>
                <p>Manage About Donate items here.</p>
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
                {editId ? "Edit About Donate" : "Add About Donate"}
              </h5>
              <Form className='row gy-4' onSubmit={handleSubmit(onSubmit)}>
                <Col md='12'>
                  <label className='form-label'>Give Title</label>
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
                  <label className='form-label'>Description</label>
                  <Controller
                    name='description'
                    control={control}
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
                  const res = await deleteRequest(`/donate/about-us/${deleteId}`);
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

export default AboutDonate;
