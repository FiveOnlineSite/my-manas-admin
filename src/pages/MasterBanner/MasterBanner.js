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
import { toast } from "react-toastify";
import {
  deleteRequest,
  getRequest,
  postFormData,
  putRequest,
} from "../../api/api";
import { Spinner } from "reactstrap";

const MasterBanner = () => {
  const [data, setData] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
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
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true)
    const res = await getRequest("/masterbanner");
    if (res.success) {
      setData(res.data);
    } else {
      toast.error("Failed to fetch banner data.");
    }
    setLoading(false)
  };

  // React.useEffect(() => {
  //   register("description", { required: "Required" });
  //   register("image", { required: "Image is required" }); // Add image required validation
  //   register("buttonText", { required: "buttonText is required" }); // Add image required validation
  //   register("buttonLink", { required: "buttonLink is required" }); // Add image required validation
  // }, [register]);

  const [formData, setFormData] = useState({
    page: "",
    subtitle: "",
    title: "",
    description: "",
    buttonText: "",
    buttonLink: "",
    image: null,
    altText: "",
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
      subtitle: "",
      title: "",
      description: "",
      buttonText: "",
      buttonLink: "",
      image: null,
      altText: "",
    });
    reset();
    setEditId(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    // if (file && file.size > 512000) {
    //   alert("Image must be less than 500KB");
    //   setValue("image", null, { shouldValidate: true });
    //   return;
    // }
    setFormData({ ...formData, image: file });
    // Reset the image error message if the file is valid
    setValue("image", file, { shouldValidate: true });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = async () => {
    setSubmitting(true);

    const formPayload = new FormData();

    formPayload.append("page", formData.page);
    formPayload.append("subtitle", formData.subtitle);
    formPayload.append("title", formData.title);
    formPayload.append("description", formData.description);
    formPayload.append("buttonText", formData.buttonText);
    formPayload.append("buttonLink", formData.buttonLink);
    formPayload.append("altText", formData.altText);

    if (formData.image) {
      formPayload.append("image", formData.image); // <-- critical!
    }

    try {
      let res;
      if (editId !== null) {
        res = await putRequest(`/masterbanner/${editId}`, formPayload);
        if (res.success) {
          const updated = data.map((d) => (d._id === editId ? res.data : d));
          setData(updated);
          toast.success("Updated successfully!");
        } else {
          toast.error("Update failed.");
        }
      } else {
        res = await postFormData("/masterbanner", formPayload);
        if (res.success) {
          setData([res.data, ...data]);
          toast.success("Created successfully!");
        } else {
          toast.error("Creation failed.");
        }
      }

      resetForm();
      setModal(false);
    } catch {
      toast.error("An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const onDeleteClick = async (id) => {
    const res = await deleteRequest(`/masterbanner/${id}`);
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
      <Head title='Master Banner' />
      <Content>
        <BlockHead size='sm'>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag='h3' page>
                Master Banner Section
              </BlockTitle>
              <BlockDes className='text-soft'>
                <p>Manage master banner content here.</p>
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
                  <span>Page</span>
                </DataTableRow>
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
                  <span>Button Text</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Button Link</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Image</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Alt Text</span>
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
                    <span>{item.subtitle}</span>
                  </DataTableRow>
                  <DataTableRow>
                    <span>{item.title}</span>
                  </DataTableRow>
                  <DataTableRow>
                    <div
                      dangerouslySetInnerHTML={{ __html: item.description }}
                      style={{ maxWidth: "300px", overflow: "hidden" }}
                    />
                  </DataTableRow>

                  <DataTableRow>
                    <span>{item.buttonText}</span>
                  </DataTableRow>
                  <DataTableRow>
                    <span>{item.buttonLink}</span>
                  </DataTableRow>
                  <DataTableRow>
                    {item.image ? (
                      <img
                        src={
                          item.image?.url
                            ? item.image.url // Use Cloudinary URL directly
                            : typeof item.image === "string"
                              ? item.image
                              : item.image instanceof File
                                ? URL.createObjectURL(item.image)
                                : ""
                        }
                        alt={item.altText || item.image?.altText || ""}
                        width={60}
                        height={40}
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      "No image"
                    )}
                  </DataTableRow>
                  <DataTableRow>
                    <span>{item.image?.altText}</span>
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
                {editId ? "Edit Master Banner" : "Add Master Banner"}
              </h5>
              <Form className='row gy-4' onSubmit={handleSubmit(onSubmit)}>
                <Col md='12'>
                  <label className='form-label'>Page</label>
                  <select
                    className='form-control'
                    // {...register("page", { required: "Required" })}
                    name='page'
                    value={formData.page}
                    onChange={handleInputChange}
                  >
                    <option value=''>Select Page</option>
                    <option value='home'>home</option>
                    <option value='about'>about</option>
                    <option value='donate'>donate</option>
                    <option value='instituions'>instituions</option>
                    <option value='scholarship'>scholarship</option>
                    <option value='academy'>academy</option>
                    <option value='contact'>contact</option>
                    <option value='vidhyavanam'>vidhyavanam</option>
                    <option value='news'>news</option>
                  </select>
                  {errors.page && (
                    <span className='invalid'>{errors.page.message}</span>
                  )}
                </Col>
                <Col md='12'>
                  <label className='form-label'>Subtitle</label>
                  <input
                    className='form-control'
                    // {...register("subtitle", { required: "Required" })}
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
                    // {...register("title", { required: "Required" })}
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
                  <ReactQuill
                    theme='snow'
                    value={formData.description}
                    onChange={(value) => {
                      setFormData({ ...formData, description: value });
                      setValue("description", value, { shouldValidate: true });
                    }}
                  />
                  {errors.description && (
                    <span className='invalid'>
                      {errors.description.message}
                    </span>
                  )}
                </Col>

                {/* Image Upload Section */}
                <Col md='12'>
                  <label className='form-label'>Image Upload (Max 500KB)</label>
                  <input
                    className='form-control'
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                  />
                  {errors.image && (
                    <span className='invalid'>{errors.image.message}</span>
                  )}
                  <div>
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
                              : formData.image.url
                                ? formData.image.url
                                : URL.createObjectURL(formData.image)
                          }
                          alt={formData.altText}
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
                          onClick={() => {
                            setFormData({ ...formData, image: null });
                            setValue("image", null, { shouldValidate: true });
                          }}
                        >
                          <Icon name='cross' />
                        </Button>
                      </div>
                    )}
                  </div>
                </Col>

                <Col md='12'>
                  <label className='form-label'>Alt Text</label>
                  <input
                    className='form-control'
                    // {...register("altText", { required: "Required" })}
                    name='altText'
                    value={formData.altText}
                    onChange={handleInputChange}
                  />
                  {errors.altText && (
                    <span className='invalid'>{errors.altText.message}</span>
                  )}
                </Col>

                <Col md='12'>
                  <label className='form-label'>Button Text</label>
                  <input
                    className='form-control'
                    // {...register("buttonText", { required: "Required" })}
                    name='buttonText'
                    value={formData.buttonText}
                    onChange={handleInputChange}
                  />
                  {errors.buttonText && (
                    <span className='invalid'>{errors.buttonText.message}</span>
                  )}
                </Col>

                <Col md='12'>
                  <label className='form-label'>Button Link</label>
                  <input
                    className='form-control'
                    // {...register("buttonLink", { required: "Required" })}
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

export default MasterBanner;
