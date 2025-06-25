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
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  deleteRequest,
  getRequest,
  postFormData,
  postRequest,
  putRequest,
} from "../../api/api";
import { toast } from "react-toastify";
import { Spinner } from "reactstrap";

const ScopeOverview = () => {
  const [data, setData] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
const [confirmModal, setConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    description: "",
  });

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true); // Show loader

    const res = await getRequest("/ourscope/overview");
    if (res.success) {
      console.log("overview created:", res.data);

      setData(res.data);
    } else {
    }
    setLoading(false); // Show loader

  };

  useEffect(() => {
    register("description", {
      validate: (value) =>
        value && value !== "<p><br></p>" ? true : "Description is required",
    });
  }, [register]);

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
      description: "",
    });
    reset();
  };

  const selectorDeleteUser = () => {
    const updated = data.filter((item) => !item.checked);
    setData(updated);
  };

  const handleInputChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  const onSubmit = async () => {
    setSubmitting(true);

    const isValid = await trigger();
    if (!isValid) return;

    const payload = { description: formData.description };

    try {
      let res;
      if (editId !== null) {
        res = await putRequest(`/ourscope/overview/${editId}`, payload);
        if (res.success) {
          const updated = data.map((item) =>
            item._id === editId ? res.data : item
          );
          setData(updated);
          toast.success("Content updated successfully!");
        } else {
          toast.error(res.message);
          return;
        }
      } else {
        res = await postRequest("/ourscope/overview", payload);
        if (res.success) {
          setData([res.data, ...data]);
          toast.success("Content created successfully!");
        } else {
          toast.error(res.message);
          return;
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
    const res = await deleteRequest(`/ourscope/overview/${id}`);
    if (res.success) {
      setData(data.filter((item) => item._id !== id));
      toast.success("Deleted successfully!");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <>
      <Head title='Scope Overview Content' />
      <Content>
        <BlockHead size='sm'>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag='h3' page>
                Scope Overview Section
              </BlockTitle>
              <BlockDes className='text-soft'>
                <p>Manage your Scope Overview content items here.</p>
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
                    <span
                      dangerouslySetInnerHTML={{
                        __html: item.description,
                      }}
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
                {editId
                  ? "Edit Scope Overview Content"
                  : "Add Scope Overview Content"}
              </h5>
              <Form className='row gy-4' onSubmit={handleSubmit(onSubmit)}>
                <Col md='12'>
                  <label className='form-label'>Description</label>
                  <ReactQuill
                    theme='snow'
                    value={formData.description}
                    onChange={(value) => {
                      setFormData({ ...formData, description: value });
                      setValue("description", value);
                      trigger("description");
                    }}
                    className={errors.description ? "invalid" : ""}
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
                          const res = await deleteRequest(`/ourscope/overview/${deleteId}`);
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

export default ScopeOverview;
