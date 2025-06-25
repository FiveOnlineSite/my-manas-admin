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

const Contribution = () => {
  const [data, setData] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null); 
  const [formData, setFormData] = useState({
    title: "",
    items: [{ title: "", description: "" }],
  });
  const [errors, setErrors] = useState({});

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true)
    const res = await getRequest("/donate/contribution");
    if (res.success) {
      setData(res.data);
    }
    setLoading(false)
  };

  const toggleModal = (editItem = null) => {
    setErrors({});
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
      items: [{ title: "", description: "" }],
    });
    reset();
    setErrors({});
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...formData.items];
    updated[index][field] = value;
    setFormData({ ...formData, items: updated });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { title: "", description: "" }],
    });
  };

  const removeItem = (index) => {
    const updated = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updated });
  };

  const onSubmit = async () => {
    setSubmitting(true);

    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Main title is required";

    formData.items.forEach((c, i) => {
      if (!c.title.trim()) newErrors[`items.${i}.title`] = "Title is required";
      if (!c.description.trim())
        newErrors[`items.${i}.description`] = "Description is required";
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      let res;
      if (editId !== null) {
        res = await putRequest(`/donate/contribution/${editId}`, formData);
      } else {
        res = await postRequest("/donate/contribution", formData);
      }

      if (res.success) {
        const updatedData = editId
          ? data.map((item) => (item._id === editId ? res.data : item))
          : [res.data, ...data];

        setData(updatedData);
        toast.success(`${editId ? "Updated" : "Created"} successfully!`);
        toggleModal();
        setSubmitting(false);
      } else {
        toast.error("Save failed");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const selectorDeleteUser = () => {
    const updated = data.filter((item) => !item.checked);
    setData(updated);
  };

   const confirmDelete = (id) => {
    setDeleteId(id);
    setConfirmModal(true);
  };

  const onDeleteClick = async (id) => {
    try {
      const res = await deleteRequest(`/donate/contribution/${id}`);
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
      <Head title='Contributions' />
      <Content>
        <BlockHead size='sm'>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag='h3' page>
                Contributions
              </BlockTitle>
              <BlockDes className='text-soft'>
                <p>Manage your contribution sections here.</p>
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
                  <span>Contributions</span>
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
                    <ul className='gy-1'  style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                      {(item.items || []).map((c, i) => (
                        <li key={i}>
                          <strong>{c.title}:</strong>{" "}
                          <span
                            dangerouslySetInnerHTML={{ __html: c.description }}
                          />
                        </li>
                      ))}
                    </ul>
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
                {editId ? "Edit Contribution" : "Add Contribution"}
              </h5>
              <Form className='row gy-4' onSubmit={handleSubmit(onSubmit)}>
                <Col md='12'>
                  <label className='form-label'>Title</label>
                  <input
                    className='form-control'
                    {...register("title")}
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                  {errors.title && (
                    <span className='invalid'>{errors.title}</span>
                  )}
                </Col>

                <Col md='12'>
                  <label className='form-label'>Contributions</label>
                  {formData.items.map((c, index) => (
                    <div key={index} className='border p-3 mb-2 rounded'>
                      <Row className='gx-3 gy-2'>
                        <Col md='5'>
                          <label className='form-label'>Title</label>
                          <input
                            className='form-control'
                            placeholder='Contribution Title'
                            value={c.title}
                            onChange={(e) =>
                              handleItemChange(index, "title", e.target.value)
                            }
                          />
                          {errors[`items.${index}.title`] && (
                            <span className='invalid'>
                              {errors[`items.${index}.title`]}
                            </span>
                          )}
                        </Col>
                        <Col md='7'>
                          <label className='form-label'>Description</label>
                          <ReactQuill
                            theme='snow'
                            value={c.description}
                            onChange={(val) =>
                              handleItemChange(index, "description", val)
                            }
                          />
                          {errors[`items.${index}.description`] && (
                            <span className='invalid'>
                              {errors[`items.${index}.description`]}
                            </span>
                          )}
                        </Col>
                      </Row>
                       {formData.items.length > 1 && (
      <div className='d-flex justify-content-end mt-2'>
        <Button
        type="button"
          color='danger'
          size='sm'
          onClick={() => removeItem(index)}
        >
           Remove
        </Button>
      </div>
    )}
                    </div>
                  ))}
                  <div className='mt-2'>
                    <Button color='primary' type='button' onClick={addItem}>
                      <Icon name='plus' /> Add More
                    </Button>
                  </div>
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
                  const res = await deleteRequest(`/donate/contribution/${deleteId}`);
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

export default Contribution;
