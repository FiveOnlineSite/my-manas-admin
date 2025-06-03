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
import { useForm, Controller } from "react-hook-form"; // Import Controller
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
import { deleteRequest, getRequest, postFormData, putRequest } from "../../api/api";
import { Spinner } from "reactstrap";


const Scholarship = () => {
  const [data, setData] =  useState([]);
    const [submitting, setSubmitting] = useState(false);
  
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    subtitle: "",
    title: "",
    description: "",
    image1: null,
    image2: null,
    buttonText: "",
    buttonLink: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control, // Add control to use with Controller
    setValue,
    trigger,
    setError,
  } = useForm();


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getRequest("/ourscope/scholarship");
    if (res.success) {
      setData(res.data);
    } else {
      toast.error(res.message);
    }
  };

  const toggleModal = (editItem = null) => {
    if (editItem) {
      setEditId(editItem._id);
      setFormData({
        subtitle: editItem.subtitle,
        title: editItem.title,
        description: editItem.description,
        image1: editItem.image1,
        image2: editItem.image2,
        buttonText: editItem.buttonText,
        buttonLink: editItem.buttonLink,
      });
      setValue("subtitle", editItem.subtitle || "");
      setValue("title", editItem.title || "");
      setValue("description", editItem.description || ""); // <- IMPORTANT
      setValue("buttonText", editItem.buttonText || "");
      setValue("buttonLink", editItem.buttonLink || "");
      setValue("image1", editItem.image1 || null);
      setValue("image2", editItem.image2 || null);
      
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
      description: "",
      image1: null,
      image2: null,
      buttonText: "",
      buttonLink: "",
    });
    reset();
  };

  const selectorDeleteUser = () => {
    const updated = data.filter((item) => !item.checked);
    setData(updated);
  };

  const handleImageChange = (e, imageField) => {
    const file = e.target.files[0];
    if (file && file.size > 512000) {
      alert("Image must be less than 500KB");
      return;
    }
    setFormData({ ...formData, [imageField]: file });
    setValue(imageField, file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setValue(name, value);
  };

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  const handleImageRemove = (imageField) => {
    setFormData({ ...formData, [imageField]: null });
    setValue(imageField, null);
  };

  const onSubmit = async () => {
    setSubmitting(true);

    const isValid = await trigger();
    if (!isValid) return;

    if (
      !formData.description ||
      formData.description.trim() === "" ||
      formData.description === "<p><br></p>"
    ) {
      toast.error("Description is required");
      return;
    }

    const formPayload = new FormData();
    formPayload.append("subtitle", formData.subtitle);
    formPayload.append("title", formData.title);
    formPayload.append("description", formData.description);
    formPayload.append("buttonText", formData.buttonText);
    formPayload.append("buttonLink", formData.buttonLink);

    if (formData.image1 instanceof File)
      formPayload.append("image1", formData.image1);
    if (formData.image2 instanceof File)
      formPayload.append("image2", formData.image2);

    let res;
    try {
      if (editId !== null) {
        res = await putRequest(`/ourscope/scholarship/${editId}`, formPayload);
      } else {
        res = await postFormData("/ourscope/scholarship", formPayload);
      }

      if (res.success) {
        toast.success(
          editId ? "Updated successfully!" : "Created successfully!"
        );
        fetchData(); // refresh data
        toggleModal();
        setSubmitting(false);

      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };
  

  const onDeleteClick = async (id) => {
    const res = await deleteRequest(`/ourscope/scholarship/${id}`);
    if (res.success) {
      setData(data.filter((item) => item._id !== id));
      toast.success("Deleted successfully!");
    } else {
      toast.error(res.message);
    }
  };
  

  return (
    <>
      <Head title='Scholarship Content' />
      <Content>
        <BlockHead size='sm'>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag='h3' page>
                Scholarship Section
              </BlockTitle>
              <BlockDes className='text-soft'>
                <p>Manage your Scholarship content items here.</p>
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
                <span>Subtitle</span>
              </DataTableRow>
              <DataTableRow>
                <span>Title</span>
              </DataTableRow>
              <DataTableRow>
                <span>Description</span>
              </DataTableRow>
              <DataTableRow>
                <span>Image 1</span>
              </DataTableRow>
              <DataTableRow>
                <span>Image 2</span>
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
                  <span>{item.subtitle}</span>
                </DataTableRow>
                <DataTableRow>
                  <span>{item.title}</span>
                </DataTableRow>
                <DataTableRow>
                  <div dangerouslySetInnerHTML={{ __html: item.description }} />
                </DataTableRow>
                <DataTableRow>
                  {item.image1?.url ? (
                    <img
                      src={item.image1?.url}
                      alt={item.image1?.altText}
                      width={60}
                      height={40}
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    "No image"
                  )}
                </DataTableRow>
                <DataTableRow>
                  {item.image2?.url ? (
                    <img
                      src={item.image2?.url}
                      alt={item.image2?.altText}
                      width={60}
                      height={40}
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    "No image"
                  )}
                </DataTableRow>
                <DataTableRow>
                  <span>{item.buttonText}</span>
                </DataTableRow>
                <DataTableRow>
                  <a href={item.buttonLink} target='_blank' rel='noreferrer'>
                    {item.buttonLink}
                  </a>
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
                  ? "Edit Scholarship Content"
                  : "Add Scholarship Content"}
              </h5>
              <Form className='row gy-4' onSubmit={handleSubmit(onSubmit)}>
                <Col md='12'>
                  <label className='form-label'>Subtitle</label>
                  <input
                    className='form-control'
                    {...register("subtitle", { required: "Required" })}
                    name='subtitle'
                    value={formData.subtitle}
                    onChange={handleInputChange}
                  />
                  {errors.subtitle && (
                    <span className='invalid'>{errors.subtitle.message}</span>
                  )}
                </Col>
                <Col md='12'>
                  <label className='form-label'>Title</label>
                  <input
                    className='form-control'
                    {...register("title", { required: "Required" })}
                    name='title'
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                  {errors.title && (
                    <span className='invalid'>{errors.title.message}</span>
                  )}
                </Col>
                <Col md='12'>
                  <label className='form-label'>Description</label>
                  <Controller
                    control={control}
                    name='description'
                    rules={{ required: "Description is required" }}
                    render={({ field }) => (
                      <ReactQuill
                        theme='snow'
                        value={formData.description}
                        onChange={(value) => {
                          setFormData({ ...formData, description: value });
                          field.onChange(value);
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

                <Col md='12'>
                  <label className='form-label'>Image 1 (Max 500KB)</label>
                  <input
                    className='form-control'
                    type='file'
                    accept='image/*'
                    onChange={(e) => handleImageChange(e, "image1")}
                  />
                  {formData.image1 && (
                    <div
                      style={{
                        position: "relative",
                        display: "inline-block",
                        marginTop: "10px",
                      }}
                    >
                      <img
                        src={
                          typeof formData.image1 === "string"
                            ? formData.image1
                            : formData.image1.url
                            ? formData.image1.url
                            : URL.createObjectURL(formData.image1)
                        }
                        alt='Image 1'
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
                        onClick={() => handleImageRemove("image1")}
                      >
                        <Icon name='cross' />
                      </Button>
                    </div>
                  )}
                  <input
                    type='hidden'
                    {...register("image1", { required: "Image 1 is required" })}
                  />
                  {errors.image1 && (
                    <span className='invalid'>{errors.image1.message}</span>
                  )}
                </Col>

                <Col md='12'>
                  <label className='form-label'>Image 2 (Max 500KB)</label>
                  <input
                    className='form-control'
                    type='file'
                    accept='image/*'
                    onChange={(e) => handleImageChange(e, "image2")}
                  />
                  {formData.image2 && (
                    <div
                      style={{
                        position: "relative",
                        display: "inline-block",
                        marginTop: "10px",
                      }}
                    >
                      <img
                        src={
                          typeof formData.image2 === "string"
                            ? formData.image2
                            : formData.image2.url
                            ? formData.image2.url
                            : URL.createObjectURL(formData.image2)
                        }
                        alt='Image 2'
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
                        onClick={() => handleImageRemove("image2")}
                      >
                        <Icon name='cross' />
                      </Button>
                    </div>
                  )}
                  <input
                    type='hidden'
                    {...register("image2", { required: "Image 2 is required" })}
                  />
                  {errors.image2 && (
                    <span className='invalid'>{errors.image2.message}</span>
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

export default Scholarship;
