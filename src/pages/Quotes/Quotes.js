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
import { QuotesContext } from "./QuotesContext"; // Assume context is created
import { toast } from "react-toastify";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "../../api/api";

const Quotes = () => {
  const { contextData } = useContext(QuotesContext);
  const [data, setData] = contextData;
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    const res = await getRequest("/masterquote");
    if (res.success) setData(res.data);
  };

  const [formData, setFormData] = useState({
    page: "",
    quote: "",
    buttonText: "",
    buttonLink: "",
  });

  const toggleModal = (editItem = null) => {
    if (editItem) {
      setEditId(editItem._id);
      setFormData(editItem);
      Object.entries(editItem).forEach(([key, value]) => setValue(key, value));
    } else {
      resetForm();
    }
    setModal(!modal);
  };

  const resetForm = () => {
    setFormData({
      page: "",
      quote: "",
      buttonText: "",
      buttonLink: "",
    });
    reset();
    setEditId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = async () => {
    try {
      let res;
      if (editId !== null) {
        res = await putRequest(`/masterquote/${editId}`, formData);
        if (res.success) {
          const updated = data.map((d) => (d._id === editId ? res.data : d));
          setData(updated);
          toast.success("Quote updated successfully!");
        }
      } else {
        res = await postRequest("/masterquote", formData);
        if (res.success) {
          setData([res.data, ...data]);
          toast.success("Quote added successfully!");
        }
      }
      toggleModal();
    } catch {
      toast.error("Something went wrong.");
    }
  };

  const onDeleteClick = async (id) => {
    const res = await deleteRequest(`/masterquote/${id}`);
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
      <Head title='Quotes Section' />
      <Content>
        <BlockHead size='sm'>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag='h3' page>
                Quotes Section
              </BlockTitle>
              <BlockDes className='text-soft'>
                <p>Manage quotes here.</p>
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
                <span>Page</span>
              </DataTableRow>
              <DataTableRow>
                <span>Quote</span>
              </DataTableRow>
              <DataTableRow>
                <span>Button Text</span>
              </DataTableRow>
              <DataTableRow>
                <span>Button Link</span>
              </DataTableRow>
              <DataTableRow className='nk-tb-col-tools text-end'>
                <UncontrolledDropdown>
                  <DropdownToggle
                    color='transparent'
                    className='btn btn-icon btn-trigger me-n1'
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
                  <span>{item.page}</span>
                </DataTableRow>
                <DataTableRow>
                  <span>{item.quote}</span>
                </DataTableRow>
                <DataTableRow>
                  <span>{item.buttonText}</span>
                </DataTableRow>
                <DataTableRow>
                  <span>{item.buttonLink}</span>
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
              <h5 className='title'>{editId ? "Edit Quote" : "Add Quote"}</h5>
              <Form className='row gy-4' onSubmit={handleSubmit(onSubmit)}>
                <Col md='12'>
                  <label className='form-label'>Page</label>
                  <select
                    className='form-control'
                    {...register("page", { required: "Required" })}
                    name='page'
                    value={formData.page}
                    onChange={handleInputChange}
                  >
                    <option value=''>Select Page</option>
                    <option value='home'>home</option>
                    <option value='about'>about</option>
                    <option value='services'>donate</option>
                    <option value='contact'>scholarship</option>
                    <option value='contact'>academy</option>
                    <option value='contact'>contact</option>
                    <option value='contact'>vidhyavanam</option>
                    <option value='contact'>news</option>
                  </select>
                  {errors.page && (
                    <span className='invalid'>{errors.page.message}</span>
                  )}
                </Col>
                <Col md='12'>
                  <label className='form-label'>Quote</label>
                  <textarea
                    className='form-control'
                    {...register("quote", { required: "Required" })}
                    name='quote'
                    value={formData.quote}
                    onChange={handleInputChange}
                  />
                  {errors.quote && (
                    <span className='invalid'>{errors.quote.message}</span>
                  )}
                </Col>
                <Col md='6'>
                  <label className='form-label'>Button Text</label>
                  <input
                    className='form-control'
                    {...register("buttonText", { required: "Required" })}
                    name='buttonText'
                    value={formData.buttonText}
                    onChange={handleInputChange}
                  />
                  {errors.buttonText && (
                    <span className='invalid'>{errors.buttonText.message}</span>
                  )}
                </Col>
                <Col md='6'>
                  <label className='form-label'>Button Link</label>
                  <input
                    className='form-control'
                    {...register("buttonLink", { required: "Required" })}
                    name='buttonLink'
                    value={formData.buttonLink}
                    onChange={handleInputChange}
                  />
                  {errors.buttonLink && (
                    <span className='invalid'>{errors.buttonLink.message}</span>
                  )}
                </Col>
                <Col size='12'>
                  <ul className='align-center flex-wrap flex-sm-nowrap gx-4 gy-2'>
                    <li>
                      <Button color='primary' size='md' type='submit'>
                        Submit
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

export default Quotes;
