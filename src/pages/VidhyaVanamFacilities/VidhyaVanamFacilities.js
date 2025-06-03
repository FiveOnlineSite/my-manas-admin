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
import { Spinner } from "reactstrap";
import {
  deleteRequest,
  getRequest,
  postFormData,
  putRequest,
} from "../../api/api";

const VidhyaVanamFacilities = () => {
  const [data, setData] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    image: null,
    video: null,
    imageAltText: "",
    videoAltText: "",
    featuredImage: null,
    isFeatured: false,
  });

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
    const res = await getRequest("/vidhyavanam/facilities");
    if (res.success) setData(res.data);
  };

  const toggleModal = (editItem = null) => {
    if (editItem) {
      setEditId(editItem._id);
      setFormData({ ...editItem });
    } else {
      resetForm();
      setEditId(null);
    }
    setModal(!modal);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      image: null,
      video: null,
      imageAltText: "",
      videoAltText: "",
      featuredImage: null,
      isFeatured: false,
    });
    reset();
  };

  const selectorDeleteUser = () => {
    const updated = data.filter((item) => !item.checked);
    setData(updated);
  };
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    setFormData({ ...formData, [type]: file });
    setValue(type, file, { shouldValidate: true });
  };

  const onSubmit = async () => {
    setSubmitting(true);

    const formPayload = new FormData();
    formPayload.append("title", formData.title);
    formPayload.append("imageAltText", formData.imageAltText);
    formPayload.append("videoAltText", formData.videoAltText);
    formPayload.append("isFeatured", formData.isFeatured);

    if (formData.image instanceof File)
      formPayload.append("image", formData.image);
    if (formData.video instanceof File)
      formPayload.append("video", formData.video);
    if (formData.featuredImage instanceof File)
      formPayload.append("featuredImage", formData.featuredImage);

    try {
      let res;
      if (editId) {
        res = await putRequest(
          `/vidhyavanam/facilities/${editId}`,
          formPayload
        );
      } else {
        res = await postFormData("/vidhyavanam/facilities", formPayload);
      }

      if (res.success) {
        const updatedData = editId
          ? data.map((item) => (item._id === editId ? res.data : item))
          : [res.data, ...data];

        setData(updatedData);
        toast.success(`${editId ? "Updated" : "Created"} successfully!`);
        toggleModal();
      } else {
        toast.error("Submission failed.");
      }
    } catch {
      toast.error("An error occurred.");
    }

    setSubmitting(false);
  };

  const onDeleteClick = async (id) => {
    const res = await deleteRequest(`/vidhyavanam/facilities/${id}`);
    if (res.success) {
      setData(data.filter((item) => item._id !== id));
      toast.success("Deleted successfully!");
    } else {
      toast.error("Failed to delete.");
    }
  };

  return (
    <>
      <Head title='Facilities' />
      <Content>
        <BlockHead size='sm'>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag='h3' page>
                Facilities Section
              </BlockTitle>
              <BlockDes>
                <p>Manage your Facilities here.</p>
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
                <span>Image</span>
              </DataTableRow>
              <DataTableRow>
                <span>Video</span>
              </DataTableRow>
              <DataTableRow>
                <span>Image Alt Text</span>
              </DataTableRow>
              <DataTableRow>
                <span>Video Alt Text</span>
              </DataTableRow>
              <DataTableRow>
                <span>Featured Image</span>{" "}
                {/* New column for Featured Image */}
              </DataTableRow>
              <DataTableRow>
                <span>Is Featured</span>
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
                  {item.resources?.image ? (
                    <img
                      src={
                        item.image instanceof File
                          ? URL.createObjectURL(item?.resources?.image)
                          : typeof item?.resources?.image === "string"
                          ? item?.resources?.image
                          : item?.resources?.image?.url || ""
                      }
                      alt={
                        item?.resources?.imageAltText ||
                        item.image?.altText ||
                        "Image"
                      }
                      width={60}
                      height={40}
                      style={{ objectFit: "cover", borderRadius: "4px" }}
                    />
                  ) : (
                    "No image"
                  )}
                </DataTableRow>

                <DataTableRow>
                  <span>
                    <DataTableRow>
                      {item?.resources?.video ? (
                        <video
                          width={80}
                          height={50}
                          style={{ borderRadius: "4px", objectFit: "cover" }}
                          controls
                        >
                          <source
                            src={
                              item?.resources?.video instanceof File
                                ? URL.createObjectURL(item?.resources?.video)
                                : typeof item?.resources?.video === "string"
                                ? item?.resources?.video
                                : item?.resources?.video?.url || ""
                            }
                          />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        "No video"
                      )}
                    </DataTableRow>
                  </span>
                </DataTableRow>

                <DataTableRow>
                  <span>
                    {item?.resources?.image?.altText || "No Alt Text"}
                  </span>
                </DataTableRow>

                <DataTableRow>
                  <span>
                    {item?.resources?.video?.altText || "No Alt Text"}
                  </span>
                </DataTableRow>

                {/* Display featured image */}
                <DataTableRow>
                  <DataTableRow>
                    {item.resources?.featuredImage ? (
                      <img
                        src={
                          item.image instanceof File
                            ? URL.createObjectURL(
                                item?.resources?.featuredImage
                              )
                            : typeof item?.resources?.featuredImage === "string"
                            ? item?.resources?.featuredImage
                            : item?.resources?.featuredImage?.url || ""
                        }
                        alt={
                          item?.resources?.imageAltText ||
                          item.featuredImage?.altText ||
                          "Image"
                        }
                        width={60}
                        height={40}
                        style={{ objectFit: "cover", borderRadius: "4px" }}
                      />
                    ) : (
                      "No image"
                    )}
                  </DataTableRow>
                </DataTableRow>

                <DataTableRow>
                  <span>{item.isFeatured ? "Yes" : "No"}</span>
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
              <h5 className='title'>{editId ? "Edit" : "Add"} Upload Item</h5>
              <Form className='row gy-4' onSubmit={handleSubmit(onSubmit)}>
                <Col md='12'>
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

                {/* Image Upload */}
                <Col md='6'>
                  <label className='form-label'>Upload Image (Max 500KB)</label>
                  {!formData.image ? (
                    <input
                      type='file'
                      accept='image/*'
                      className='form-control'
                      onChange={(e) => handleFileChange(e, "image")}
                    />
                  ) : (
                    <div
                      className='image-preview-wrapper'
                      style={{
                        display: "inline-flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        marginTop: "8px",
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          display: "inline-block",
                        }}
                      >
                        <img
                          src={URL.createObjectURL(formData.image)}
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
                          onClick={() => {
                            setFormData({ ...formData, image: null });
                            setValue("image", null, { shouldValidate: true });
                          }}
                        >
                          <Icon name='cross' />
                        </Button>
                      </div>
                    </div>
                  )}
                  <input
                    type='hidden'
                    {...register("image", {
                      required: "Image is required",
                      // validate: (file) =>
                      //   file instanceof File
                      //     ? file.size <= 512000 ||
                      //       "Image must be less than 500KB"
                      //     : true,
                    })}
                  />
                  {errors.image && (
                    <span className='invalid'>{errors.image.message}</span>
                  )}
                </Col>

                {/* Image Alt Text */}
                <Col md='6'>
                  <label className='form-label'>Image Alt Text</label>
                  <input
                    className='form-control'
                    {...register("imageAltText", {
                      required: formData.image
                        ? "Image alt text is required"
                        : false,
                    })}
                    value={formData.imageAltText || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, imageAltText: e.target.value })
                    }
                  />
                  {errors.imageAltText && (
                    <span className='invalid'>
                      {errors.imageAltText.message}
                    </span>
                  )}
                </Col>

                {/* Video Upload */}
                <Col md='6'>
                  <label className='form-label'>Upload Video (Max 10MB)</label>
                  {!formData.video ? (
                    <input
                      type='file'
                      accept='video/*'
                      className='form-control'
                      onChange={(e) => handleFileChange(e, "video")}
                    />
                  ) : (
                    <div
                      className='video-preview-wrapper'
                      style={{
                        display: "inline-flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        marginTop: "8px",
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          display: "inline-block",
                        }}
                      >
                        <video
                          width='200'
                          height='auto'
                          controls
                          style={{
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                            padding: "4px",
                            backgroundColor: "#fff",
                          }}
                        >
                          <source src={URL.createObjectURL(formData.video)} />
                          Your browser does not support the video tag.
                        </video>
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
                            setFormData({ ...formData, video: null });
                            setValue("video", null, { shouldValidate: true });
                          }}
                        >
                          <Icon name='cross' />
                        </Button>
                      </div>
                    </div>
                  )}
                  <input
                    type='hidden'
                    {...register("video", {
                      required: "Video is required",
                      // validate: (file) =>
                      //   file instanceof File
                      //     ? file.size <= 10 * 1024 * 1024 ||
                      //       "Video must be less than 10MB"
                      //     : true,
                    })}
                  />
                  {errors.video && (
                    <span className='invalid'>{errors.video.message}</span>
                  )}
                </Col>

                {/* Video Alt Text */}
                <Col md='6'>
                  <label className='form-label'>Video Alt Text</label>
                  <input
                    className='form-control'
                    {...register("videoAltText", {
                      required: formData.video
                        ? "Video alt text is required"
                        : false,
                    })}
                    value={formData.videoAltText || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, videoAltText: e.target.value })
                    }
                  />
                  {errors.videoAltText && (
                    <span className='invalid'>
                      {errors.videoAltText.message}
                    </span>
                  )}
                </Col>

                {/* Featured Image Upload */}
                <Col md='6'>
                  <label className='form-label'>
                    Upload Featured Image (Max 500KB)
                  </label>
                  {!formData.featuredImage ? (
                    <input
                      type='file'
                      accept='image/*'
                      className='form-control'
                      onChange={(e) => handleFileChange(e, "featuredImage")}
                    />
                  ) : (
                    <div
                      className='image-preview-wrapper'
                      style={{
                        display: "inline-flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        marginTop: "8px",
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          display: "inline-block",
                        }}
                      >
                        <img
                          src={URL.createObjectURL(formData.featuredImage)}
                          alt='Featured Preview'
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
                            setFormData({ ...formData, featuredImage: null });
                            setValue("featuredImage", null, {
                              shouldValidate: true,
                            });
                          }}
                        >
                          <Icon name='cross' />
                        </Button>
                      </div>
                    </div>
                  )}
                  <input
                    type='hidden'
                    {...register("featuredImage", {
                      required: "Featured image is required",
                      // validate: (file) =>
                      //   file instanceof File
                      //     ? file.size <= 512000 ||
                      //       "Featured image must be less than 500KB"
                      //     : true,
                    })}
                  />
                  {errors.featuredImage && (
                    <span className='invalid'>
                      {errors.featuredImage.message}
                    </span>
                  )}
                </Col>
                {/* Is Featured Checkbox */}
                <Col md='6'>
                  <div className='form-check mt-2'>
                    <input
                      type='checkbox'
                      className='form-check-input'
                      id='isFeatured'
                      checked={formData.isFeatured}
                      {...register("isFeatured")}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isFeatured: e.target.checked,
                        })
                      }
                    />
                    <label className='form-check-label' htmlFor='isFeatured'>
                      Mark as Featured
                    </label>
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
      </Content>
    </>
  );
};

export default VidhyaVanamFacilities;
