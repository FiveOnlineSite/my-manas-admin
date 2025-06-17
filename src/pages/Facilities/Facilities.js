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

const Facilities = () => {
  const [data, setData] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({
    image: "",
    video: "",
  });

  const [formData, setFormData] = useState({
    // title: "",
    image: null,
    video: null,
    imageAltText: "",
    videoAltText: "",
    featuredImage: null,
    isFeatured: false,
    moreFeaturedImages: [], // new array for additional
    moreFeaturedVideos: [], // new array for additional
      removedImages: [],            
  removedVideos: [],   
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    trigger,
  } = useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true)
    const res = await getRequest("/academy/facilities");
    if (res.success) { setData(res.data) };
    setLoading(false)
  };

  const toggleModal = (editItem = null) => {
    if (editItem) {
      setEditId(editItem._id);
      const resources = editItem.resources || {};
      const initialData = {
        // title: editItem.title || "",
        image: resources.image || null,
        video: resources.video || null,
        imageAltText: resources.image?.altText || "",
        videoAltText: resources.video?.altText || "",
        featuredImage: resources.featuredImage || null,
        isFeatured: editItem.isFeatured || false,
        moreFeaturedImages: resources.moreFeaturedImages || [], // 🔁 fix here
        moreFeaturedVideos: resources.moreFeaturedVideos || [], // 🔁 fix here
        removedImages: [], // ✅ init empty
  removedVideos: [],
      };
      setFormData(initialData);
      // setValue("title", initialData.title);
      setValue("image", initialData.image);
      setValue("video", initialData.video);
      setValue("imageAltText", initialData.imageAltText);
      setValue("videoAltText", initialData.videoAltText);
      setValue("featuredImage", initialData.featuredImage);
      setValue("isFeatured", initialData.isFeatured);
    } else {
      resetForm();
      setEditId(null);
    }
    setModal(!modal);
  };

  const resetForm = () => {
    setFormData({
      // title: "",
      image: null,
      video: null,
      imageAltText: "",
      videoAltText: "",
      featuredImage: null,
      isFeatured: false,
      moreFeaturedImages: [], // ✅ add this
      moreFeaturedVideos: [],
      removedImages: [], // ✅
    removedVideos: [], 
    });
    reset();
  };

  const selectorDeleteUser = () => {
    const updated = data.filter((item) => !item.checked);
    setData(updated);
  };

  const addMoreField = (type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], null],
    }));
  };

 const removeMoreField = (type, index) => {
  setFormData((prev) => {
    const removedItem = prev[type][index];

    const isExistingFile = !(removedItem instanceof File);
    const removalKey = type === "moreFeaturedImages" ? "removedImages" : "removedVideos";

    return {
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
      [removalKey]: isExistingFile
        ? [...prev[removalKey], removedItem]
        : prev[removalKey],
    };
  });
};

  const updateMoreFile = (e, type, index) => {
    const file = e.target.files[0];
    setFormData((prev) => {
      const updated = [...prev[type]];
      updated[index] = file;
      return { ...prev, [type]: updated };
    });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, [type]: file }));
    setValue(type, file, { shouldValidate: true });

    // Trigger validation manually
    trigger(type);
  };

  const onSubmit = async () => {
    setSubmitting(true);

    const errors = {};

    // Manual file validations
    if (!formData.image) {
      toast.error("Image is required");
      setSubmitting(false);
      return;
    }
    // if (!formData.video) {
    //   toast.error("Video is required");
    //   setSubmitting(false);
    //   return;
    // }

    const formPayload = new FormData();
    // formPayload.append("title", formData.title);
    formPayload.append("imageAltText", formData.imageAltText);
    formPayload.append("videoAltText", formData.videoAltText);
    formPayload.append("isFeatured", formData.isFeatured);

    if (formData.image instanceof File)
      formPayload.append("image", formData.image);
    if (formData.video instanceof File)
      formPayload.append("video", formData.video);
    if (formData.featuredImage instanceof File)
      formPayload.append("featuredImage", formData.featuredImage);

    formData.moreFeaturedImages.forEach((file, i) => {
      if (file instanceof File) {
        formPayload.append(`moreFeaturedImages[${i}]`, file);
      }
    });

    formData.moreFeaturedVideos.forEach((file, i) => {
      if (file instanceof File) {
        formPayload.append(`moreFeaturedVideos[${i}]`, file);
      }
    });

  formData.removedImages.forEach((file, i) => {
  const url = typeof file === "string" ? file : file?.url;
  if (url) formPayload.append(`removedImages[${i}]`, url);
});

formData.removedVideos.forEach((file, i) => {
  if (file?.url) formPayload.append(`removedVideos[${i}]`, file.url);
});



    try {
      let res;
      if (editId) {
        res = await putRequest(`/academy/facilities/${editId}`, formPayload);
      } else {
        res = await postFormData("/academy/facilities", formPayload);
      }

      if (res.success) {
  toast.success(`${editId ? "Updated" : "Created"} successfully!`);
  toggleModal();
  fetchData(); // ✅ This will re-fetch the updated backend data
}
else {
        toast.error("Submission failed.");
      }
    } catch {
      toast.error("An error occurred.");
    }

    setSubmitting(false);
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setConfirmModal(true);
  };

  const onDeleteClick = async (id) => {
    const res = await deleteRequest(`/academy/facilities/${id}`);
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
          {loading ? (
            <div className="text-center p-5">
              <Spinner color="primary" size="lg" />
            </div>) : (
            <div className='nk-tb-list is-separate is-medium mb-3'>
              <DataTableHead>
                {/* <DataTableRow>
                  <span>Title</span>
                </DataTableRow> */}
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
                <DataTableRow>
                  <span>More Images</span>
                </DataTableRow>
                <DataTableRow>
                  <span>More Videos</span>
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
                  {/* <DataTableRow>
                    <span>{item.title}</span>
                  </DataTableRow> */}

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

                  {/* More Featured Images */}
                  <DataTableRow>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {item.resources?.moreFeaturedImages?.length > 0 ? (
                        item.resources.moreFeaturedImages.map((img, idx) => (
                          <img
                            key={idx}
                            src={img.url}
                            alt={img.altText || `MoreImage-${idx}`}
                            width={50}
                            height={35}
                            style={{ objectFit: "cover", borderRadius: "4px", border: "1px solid #ccc" }}
                          />
                        ))
                      ) : (
                        <span>No additional images</span>
                      )}
                    </div>
                  </DataTableRow>

                  {/* More Featured Videos */}
                  <DataTableRow>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {item.resources?.moreFeaturedVideos?.length > 0 ? (
                        item.resources.moreFeaturedVideos.map((vid, idx) => (
                          <video
                            key={idx}
                            width={60}
                            height={40}
                            controls
                            style={{ borderRadius: "4px", objectFit: "cover", border: "1px solid #ccc" }}
                          >
                            <source src={vid.url} />
                            Your browser does not support video playback.
                          </video>
                        ))
                      ) : (
                        <span>No additional videos</span>
                      )}
                    </div>
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
              <h5 className='title'>{editId ? "Edit" : "Add"} Upload Item</h5>
              <Form className='row gy-4' onSubmit={handleSubmit(onSubmit)}>
                {/* <Col md='12'>
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
                </Col> */}

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
                          src={
                            formData.image instanceof File
                              ? URL.createObjectURL(formData.image)
                              : typeof formData.image === "string"
                                ? formData.image
                                : formData.image?.url || ""
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
                  {/* <input
                    type='hidden'
                    {...register("image", {
                      validate: () =>
                        formData.image !== null && formData.image !== undefined
                          ? true
                          : "Image is required",
                    })}

                  /> */}
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
                          <source
                            src={
                              formData.video instanceof File
                                ? URL.createObjectURL(formData.video)
                                : typeof formData.video === "string"
                                  ? formData.video
                                  : formData.video?.url || ""
                            }
                          />
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
                  {/* <input
                    type='hidden'
                    {...register("video", {
                      validate: () =>
                        formData.video !== null && formData.video !== undefined
                          ? true
                          : "Video is required",
                    })}
                  /> */}
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
                          src={
                            formData.featuredImage instanceof File
                              ? URL.createObjectURL(formData.featuredImage)
                              : typeof formData.featuredImage === "string"
                                ? formData.featuredImage
                                : formData.featuredImage?.url || ""
                          }
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
                      validate: () =>
                        formData.featuredImage !== null && formData.featuredImage !== undefined
                          ? true
                          : "Featured image is required",
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

                {/* Additional Featured Images */}
                <Col md="12">
                  <label className="form-label mt-2">More Featured Images</label>
                  {formData.moreFeaturedImages.map((file, index) => (
  <div key={index} className="d-flex align-items-center mb-2">
    <div style={{ position: "relative", marginRight: "8px" }}>
      <img
        src={
          file instanceof File
            ? URL.createObjectURL(file)
            : typeof file === "string"
              ? file
              : file?.url || ""
        }
        alt={`preview-${index}`}
        style={{
          width: 80,
          height: 50,
          objectFit: "cover",
          borderRadius: 4,
          border: "1px solid #ccc",
        }}
      />
    </div>
    <input
      type="file"
      accept="image/*"
      className="form-control me-2"
      onChange={(e) => updateMoreFile(e, "moreFeaturedImages", index)}
    />
    <Button
    type="button"
      size="sm"
      color="danger"
      onClick={() => removeMoreField("moreFeaturedImages", index)}
    >
      Remove
    </Button>
  </div>
))}

                  {/* <Button
                    color="secondary"
                    size="sm"
                    onClick={() => addMoreField("moreFeaturedImages")}
                  >
                    + Add More Featured Image
                  </Button> */}
                  <div>
                    <Button
                      type="button"
                      color='primary'
                      size='sm'
                      style={{ width: "auto" }}
                      onClick={() => addMoreField("moreFeaturedImages")}
                    >
                      Add More Item
                    </Button>
                  </div>
                </Col>

                {/* Additional Featured Videos */}
                <Col md="12">
                  <label className="form-label mt-2">More Featured Videos</label>
                  {formData.moreFeaturedVideos.map((file, index) => (
  <div key={index} className="d-flex align-items-center mb-2">
    <div style={{ position: "relative", marginRight: "8px" }}>
      <video
        width={100}
        height={60}
        controls
        style={{
          borderRadius: 4,
          border: "1px solid #ccc",
          objectFit: "cover",
        }}
      >
        <source
          src={
            file instanceof File
              ? URL.createObjectURL(file)
              : typeof file === "string"
                ? file
                : file?.url || ""
          }
        />
        Your browser does not support the video tag.
      </video>
    </div>
    <input
      type="file"
      accept="video/*"
      className="form-control me-2"
      onChange={(e) => updateMoreFile(e, "moreFeaturedVideos", index)}
    />
    <Button
    type="button"
      size="sm"
      color="danger"
      onClick={() => removeMoreField("moreFeaturedVideos", index)}
    >
     Remove
    </Button>
  </div>
))}


                  <div>
                    <Button
                      type="button"
                      color='primary'
                      size='sm'
                      style={{ width: "auto" }}
                      onClick={() => addMoreField("moreFeaturedVideos")}
                    >
                      Add More Item
                    </Button>
                  </div>
                  {/* <Button
                    color="secondary"
                    size="sm"
                    onClick={() => addMoreField("moreFeaturedVideos")}
                  >
                    + Add More Featured Video
                  </Button> */}
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
                  const res = await deleteRequest(`/academy/facilities/${deleteId}`);
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

export default Facilities;
