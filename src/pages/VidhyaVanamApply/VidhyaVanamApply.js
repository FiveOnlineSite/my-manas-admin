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

const VidhyaVanamApply = () => {
  const [data, setData] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    whatsapp: "",
    instagram: "",
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
    const res = await getRequest("/vidhyavanam/how-to-apply");
    if (res.success) {
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
      whatsapp: "",
      instagram: "",
    });
    reset();
  };

  const selectorDeleteUser = () => {
    const updated = data.filter((item) => !item.checked);
    setData(updated);
  };

  const onSubmit = async () => {
    setSubmitting(true);

    if (!formData.whatsapp) {
      toast.error("WhatsApp number is required");
      return;
    }

    try {
      if (editId !== null) {
        const res = await putRequest(
          `/vidhyavanam/how-to-apply/${editId}`,
          formData
        );
        if (res.success) {
          const updated = data.map((item) =>
            item._id === editId ? res.data : item
          );
          setData(updated);
          toast.success("Updated successfully");
        } else {
          toast.error(res.message || "Update failed");
        }
      } else {
        const res = await postRequest("/vidhyavanam/how-to-apply", formData);
        if (res.success) {
          setData([res.data, ...data]);
          toast.success("Added successfully");
        } else {
          toast.error(res.message || "Create failed");
        }
      }
      toggleModal();
      setSubmitting(false);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const onDeleteClick = async (id) => {
    const res = await deleteRequest(`/vidhyavanam/how-to-apply/${id}`);
    if (res.success) {
      setData(data.filter((item) => item._id !== id));
      toast.success("Deleted successfully");
    } else {
      toast.error(res.message || "Delete failed");
    }
  };

  return (
    <>
      <Head title='How To Apply Content' />
      <Content>
        <BlockHead size='sm'>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag='h3' page>
                How To Apply Section
              </BlockTitle>
              <BlockDes className='text-soft'>
                <p>Manage your How To Apply content items here.</p>
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
                <span>WhatsApp Number</span>
              </DataTableRow>
              <DataTableRow>
                <span>Instagram Profile</span>
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
                  <span>{item.whatsapp}</span>
                </DataTableRow>
                <DataTableRow>
                  <span>{item.instagram ? item.instagram : "Coming soon"}</span>
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
                    <li
                      className='nk-tb-action-hidden'
                      onClick={() => onDeleteClick(item._id)}
                    >
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
                  ? "Edit How To Apply Content"
                  : "Add How To Apply Content"}
              </h5>
              <Form className='row gy-4' onSubmit={handleSubmit(onSubmit)}>
                <Col md='12'>
                  <label className='form-label'>WhatsApp Number</label>
                  <input
                    className='form-control'
                    {...register("whatsapp", {
                      required: "WhatsApp number is required",
                      pattern: {
                        value: /^\+?[1-9]\d{9,14}$/,
                        message:
                          "Invalid number. Format: +1234567890 (10 to 15 digits, no letters)",
                      },
                    })}
                    name='whatsapp'
                    value={formData.whatsapp}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        whatsapp: e.target.value,
                      })
                    }
                  />
                  {errors.whatsapp && (
                    <span className='invalid'>{errors.whatsapp.message}</span>
                  )}
                </Col>
                <Col md='12'>
                  <label className='form-label'>Instagram Profile</label>
                  <input
                    className='form-control'
                    {...register("instagram", { required: false })}
                    name='instagram'
                    value={formData.instagram}
                    onChange={(e) =>
                      setFormData({ ...formData, instagram: e.target.value })
                    }
                  />
                  {errors.instagram && (
                    <span className='invalid'>{errors.instagram.message}</span>
                  )}
                </Col>

                <Col size='12'>
                  <ul className='align-center flex-wrap flex-sm-nowrap gx-4 gy-2'>
                    <li>
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

export default VidhyaVanamApply;
