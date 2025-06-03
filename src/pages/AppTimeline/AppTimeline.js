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
  postRequest,
  putRequest,
} from "../../api/api";
import { Spinner } from "reactstrap";

const AppTimeline = () => {
  const [data, setData] =  useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    items: [{ date: "", title: "" }],
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm();

  useEffect(() => {
    fetchTimelineData();
  }, []);

  const fetchTimelineData = async () => {
    const res = await getRequest("/scholarships/application-timeline");
    if (res.success) {
      console.log("Apptimeline created:", res.data);

      setData(res.data);
    } else {
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
      items: [{ date: "", title: "" }],
    });
    reset();
  };

  const selectorDeleteUser = () => {
    const updated = data.filter((item) => !item.checked);
    setData(updated);
  };

  const handleEventChange = (index, field, value) => {
    const updatedEvents = [...formData.items];
    updatedEvents[index][field] = value;
    setFormData({ ...formData, items: updatedEvents });
  };

  const addEvent = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { date: "", title: "" }],
    });
  };

  const removeEvent = (index) => {
    const updatedEvents = formData.events.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedEvents });
  };

  const onSubmit = async () => {
    setSubmitting(true);

    const isValid = await trigger();
    if (!isValid) {
      setSubmitting(false);
      return;
    }

    const payload = {
      title: formData.title,
      items: formData.items.map((e) => ({ title: e.title, date: e.date })),
    };

    try {
      let res;

      if (editId) {
        res = await putRequest(
          `/scholarships/application-timeline/${editId}`,
          payload
        );
        if (res.success) {
          toast.success("Timeline updated!");
        } else {
          toast.error(res.message);
          return;
        }
      } else {
        res = await postRequest("/scholarships/application-timeline", payload);
        if (res.success) {
          toast.success("Timeline created!");
        } else {
          toast.error(res.message);
          return;
        }
      }

      fetchTimelineData();
      toggleModal();
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };

  const onDeleteClick = async (id) => {
    const res = await deleteRequest(`/scholarships/application-timeline/${id}`);
    if (res.success) {
      toast.success("Deleted successfully");
      fetchTimelineData();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <>
      <Head title='App Timeline Content' />
      <Content>
        <BlockHead size='sm'>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag='h3' page>
                App Timeline Section
              </BlockTitle>
              <BlockDes className='text-soft'>
                <p>Manage your App Timeline content items here.</p>
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
                <span>Events</span>
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
                  <ul>
                    {(item.items || []).map((event, index) => (
                      <li key={index}>
                        <strong>{event.date}</strong>: {event.title}
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
                {editId
                  ? "Edit App Timeline Content"
                  : "Add App Timeline Content"}
              </h5>
              <Form className='row gy-4' onSubmit={handleSubmit(onSubmit)}>
                <Col md='12'>
                  <label className='form-label'>Title</label>
                  <input
                    className='form-control'
                    {...register("title", { required: "Required" })}
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

                {formData.items.map((event, index) => (
                  <div key={index} className='border rounded p-3 mb-3'>
                    <Col md='6'>
                      <label className='form-label'>Date</label>
                      <input
                        className='form-control'
                        {...register(`items[${index}].date`, {
                          required: "Required",
                        })}
                        value={event.date}
                        onChange={(e) =>
                          handleEventChange(index, "date", e.target.value)
                        }
                      />
                    </Col>
                    <Col md='6'>
                      <label className='form-label'>Event Title</label>
                      <input
                        className='form-control'
                        {...register(`items[${index}].title`, {
                          required: "Required",
                        })}
                        value={event.title}
                        onChange={(e) =>
                          handleEventChange(index, "title", e.target.value)
                        }
                      />
                    </Col>
                    <Button
                      color='danger'
                      size='sm'
                      onClick={() => removeEvent(index)}
                    >
                      Remove Event
                    </Button>
                  </div>
                ))}
                <div>
                  <Button
                    color='primary'
                    size='md'
                    style={{ width: "auto" }}
                    onClick={addEvent}
                  >
                    Add More Event
                  </Button>
                </div>

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

export default AppTimeline;
