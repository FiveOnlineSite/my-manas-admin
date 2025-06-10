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
  Spinner,
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

const ContactForm = () => {
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    subtitle: "",
    title: "",
    buttonText: "",
    fullName: "",
    number: "",
    email: "",
    inquiryType: "",
    message: "",
    originPage: "",
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
    const res = await getRequest("/mastercontact");
    if (res.success) {
      setData(res.data);
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
      subtitle: "",
      title: "",
      buttonText: "",
      fullName: "",
      number: "",
      email: "",
      inquiryType: "",
      message: "",
      originPage: "",
      // image: null,
    });
    reset();
  };

  const onSubmit = async () => {
    const formPayload = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        formPayload.append(key, value);
      }
    });

    try {
      let res;
      if (editId !== null) {
        res = await putRequest(`/mastercontact/${editId}`, formPayload);
        if (res.success) {
          const updated = data.map((d) => (d._id === editId ? res.data : d));
          setData(updated);
          toast.success("Updated successfully!");
        } else {
          toast.error("Update failed.");
        }
      } else {
        res = await postFormData("/mastercontact", formPayload);
        if (res.success) {
          setData([res.data, ...data]);
          toast.success("Created successfully!");
        } else {
          toast.error("Creation failed.");
        }
      }
      resetForm();
      setModal(false);
    } catch (error) {
      toast.error("An error occurred.");
    }
  };

  const onDeleteClick = async (id) => {
    const res = await deleteRequest(`/mastercontact/${id}`);
    if (res.success) {
      setData(data.filter((item) => item._id !== id));
      toast.success("Deleted successfully!");
    } else {
      toast.error("Failed to delete.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // const handleImageUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setFormData({ ...formData, image: file });
  //   }
  // };

  // const handleImageRemove = () => {
  //   setFormData({ ...formData, image: null });
  // };

  const selectorDeleteUser = () => {
    const updated = data.filter((item) => !item.checked);
    setData(updated);
  };

  return (
    <>
      <Head title='Contact Form Section' />
      <Content>
        <BlockHead size='sm'>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag='h3' page>
                Contact Form Section
              </BlockTitle>
              <BlockDes className='text-soft'>
                <p>Manage your Contact Form content here.</p>
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
                  <span>Sr. No.</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Subtitle</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Title</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Button Text</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Full Name</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Number</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Email</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Inquiry Type</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Message</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Origin Page</span>
                </DataTableRow>
                {/* <DataTableRow>
                  <span>Image</span>
                </DataTableRow> */}
                {/* <DataTableRow className='nk-tb-col-tools text-end'>
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
                </DataTableRow> */}
              </DataTableHead>
              {data.map((item, index) => (
                <DataTableItem key={item._id}>
                  <DataTableRow>
                    <span>{index + 1}</span>
                  </DataTableRow>
                  <DataTableRow>
                    <span>{item.subtitle}</span>
                  </DataTableRow>
                  <DataTableRow>
                    <span>{item.title}</span>
                  </DataTableRow>
                  <DataTableRow>
                    <span>{item.buttonText}</span>
                  </DataTableRow>
                  <DataTableRow>
                    <span>{item.fullName}</span>
                  </DataTableRow>
                  <DataTableRow>
                    <span>{item.number}</span>
                  </DataTableRow>
                  <DataTableRow>
                    <span>{item.email}</span>
                  </DataTableRow>
                  <DataTableRow>
                    <span>{item.inquiryType}</span>
                  </DataTableRow>
                  <DataTableRow>
                    <span>{item.message}</span>
                  </DataTableRow>
                  <DataTableRow>
                    <span>{item.originPage}</span>
                  </DataTableRow>
                  {/* <DataTableRow>
                    {item.image?.url ? (
                      <img
                        src={
                          item.image?.url
                            ? item.image.url
                            : typeof item.image === "string"
                              ? item.image
                              : item.image instanceof File
                                ? URL.createObjectURL(item.image)
                                : ""
                        }
                        alt='Uploaded'
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </DataTableRow> */}
                  {/* <DataTableRow className='nk-tb-col-tools'>
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
                  </DataTableRow> */}
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
                <Col md='6'>
                  <label className='form-label'>Subtitle</label>
                  <input
                    className='form-control'
                    {...register("subtitle", {
                      required: "Subtitle is required",
                    })}
                    value={formData.subtitle}
                    onChange={(e) =>
                      setFormData({ ...formData, subtitle: e.target.value })
                    }
                  />
                  {errors.subtitle && (
                    <span className='invalid'>{errors.subtitle.message}</span>
                  )}
                </Col>

                <Col md='6'>
                  <label className='form-label'>Title</label>
                  <input
                    className='form-control'
                    {...register("title", { required: "Title is required" })}
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                  {errors.title && (
                    <span className='invalid'>{errors.title.message}</span>
                  )}
                </Col>

                <Col md='6'>
                  <label className='form-label'>Submit Button Text</label>
                  <input
                    className='form-control'
                    {...register("buttonText", {
                      required: "Button text is required",
                    })}
                    value={formData.buttonText}
                    onChange={(e) =>
                      setFormData({ ...formData, buttonText: e.target.value })
                    }
                  />
                  {errors.buttonText && (
                    <span className='invalid'>{errors.buttonText.message}</span>
                  )}
                </Col>

                <Col md='6'>
                  <label className='form-label'>Full Name</label>
                  <input
                    className='form-control'
                    {...register("fullName", {
                      required: "Full Name is required",
                    })}
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                  {errors.fullName && (
                    <span className='invalid'>{errors.fullName.message}</span>
                  )}
                </Col>

                <Col md='6'>
                  <label className='form-label'>Number</label>
                  <input
                    className='form-control'
                    {...register("number", {
                      required: "number  is required",
                      pattern: {
                        value: /^\+?[1-9]\d{9,14}$/,
                        message:
                          "Invalid number. Format: +1234567890 (10 to 15 digits, no letters)",
                      },
                    })}
                    value={formData.number}
                    onChange={(e) =>
                      setFormData({ ...formData, number: e.target.value })
                    }
                  />
                  {errors.number && (
                    <span className='invalid'>{errors.number.message}</span>
                  )}
                </Col>

                <Col md='6'>
                  <label className='form-label'>Email</label>
                  <input
                    type='email'
                    className='form-control'
                    {...register("email", {
                      required: "Email is required",
                    })}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  {errors.email && (
                    <span className='invalid'>{errors.email.message}</span>
                  )}
                </Col>

                <Col md='6'>
                  <label className='form-label'>Inquiry Type</label>
                  <select
                    className='form-control'
                    {...register("inquiryType", {
                      required: "Inquiry Type is required",
                    })}
                    value={formData.inquiryType}
                    onChange={(e) =>
                      setFormData({ ...formData, inquiryType: e.target.value })
                    }
                  >
                    <option value=''>Select Inquiry Type</option>
                    <option value='Admission'>
                      New Admission – Manas Academy
                    </option>
                    <option value='VidhyaVanam'>
                      New Admission – Vidhya Vanam
                    </option>
                    <option value='Scholarships'>
                      Scholarships / Financial Aid
                    </option>
                    <option value='Employment'>Employment Opportunities</option>
                    <option value='Vendor'>
                      Vendor / Supplier Opportunities
                    </option>
                    <option value='Volunteer'>Volunteer Opportunities</option>
                    <option value='Donate'>Want to Donate</option>
                    <option value='General'>General Information Request</option>
                  </select>
                  {errors.inquiryType && (
                    <span className='invalid'>
                      {errors.inquiryType.message}
                    </span>
                  )}
                </Col>
                {/* <Col md='12'>
                  <label className='form-label'>
                    Image Upload (optional, max 500KB)
                  </label>
                  <input
                    className='form-control'
                    type='file'
                    accept='image/*'
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && file.size > 512000) {
                        toast.error("Image must be less than 500KB");
                        return;
                      }
                      setFormData({ ...formData, image: file });
                    }}
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
                        onClick={() =>
                          setFormData({ ...formData, image: null })
                        }
                      >
                        <Icon name='cross' />
                      </Button>
                    </div>
                  )}
                </Col> */}

                <Col md='6'>
                  <label className='form-label'>Message</label>
                  <textarea
                    className='form-control'
                    {...register("message", {
                      required: "Message is required",
                    })}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />
                  {errors.message && (
                    <span className='invalid'>{errors.message.message}</span>
                  )}
                </Col>

                <Col md='6'>
                  <label className='form-label'>Origin Page</label>
                  {/* <input
                    className='form-control'
                    {...register("originPage", {
                      required: "Origin Page is required",
                    })}
                    value={formData.originPage}
                    onChange={(e) =>
                      setFormData({ ...formData, originPage: e.target.value })
                    }
                  /> */}
                  <select
                    className='form-control'
                    {...register("originPage", { required: "Required" })}
                    name='originPage'
                    value={formData.originPage}
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
                  {errors.originPage && (
                    <span className='invalid'>{errors.originPage.message}</span>
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

export default ContactForm;
