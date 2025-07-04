import React, { useEffect } from "react";
import { Modal, ModalBody, Form } from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import { Button, Col, Icon } from "../../components/Component";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Spinner } from "reactstrap";

const EditModal = ({
  modal,
  closeModal,
  onSubmit,
  formData,
  setFormData,
  submitting,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
    trigger,
  } = useForm();

  useEffect(() => {
    reset(formData);
    for (const key in formData) {
      setValue(key, formData[key]);
    }
  }, [formData, reset, setValue]);

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  //   setValue(name, value, { shouldValidate: true });
  //   trigger(name);
  // };

  const handleInputChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
    images: {
      ...prev.images,
      [name === "desktopAlt" ? "desktop" : "mobile"]: {
        ...prev.images?.[name === "desktopAlt" ? "desktop" : "mobile"],
        altText: value || "",
      },
    },
  }));
  setValue(name, value, { shouldValidate: true });
  trigger(name);
};


  const handleImageChange = (e, key) => {
  const file = e.target.files[0]; // Get the selected file
  if (file) { // If a file is selected
    const url = URL.createObjectURL(file); // Create a URL for the file
    setFormData((prev) => ({
      ...prev,
      [key]: file,
      images: {
        ...prev.images,
        [key === "desktopImage" ? "desktop" : "mobile"]: {
          ...prev.images?.[key === "desktopImage" ? "desktop" : "mobile"],
          url,
           altText: prev.images?.[key === "desktopImage" ? "desktop" : "mobile"]
            ?.altText || "", 
        },
      },
    }));
    setValue(key, file, { shouldValidate: true }); // Update the form value
    trigger(key); // Trigger validation (if needed)
  }
};


  // const handleImageChange = (e, key) => {
  //   const file = e.target.files[0];
  //   if (file && file.size <= 512000) {
  //     const url = URL.createObjectURL(file);
  //     setFormData((prev) => ({
  //       ...prev,
  //       [key]: file,
  //       images: {
  //         ...prev.images,
  //         [key === "desktopImage" ? "desktop" : "mobile"]: {
  //           ...prev.images?.[key === "desktopImage" ? "desktop" : "mobile"],
  //           url,
  //         },
  //       },
  //     }));
  //     setValue(key, file, { shouldValidate: true });
  //     trigger(key);
  //   }
  // };

  const handleImageRemove = (key) => {
    setFormData((prev) => ({
      ...prev,
      [key]: null,
      images: {
        ...prev.images,
        [key === "desktopImage" ? "desktop" : "mobile"]: {
          ...prev.images[key === "desktopImage" ? "desktop" : "mobile"],
          url: "",
        },
      },
    }));
    setValue(key, null, { shouldValidate: true });
    trigger(key);
  };

  return (
    <Modal
      isOpen={modal}
      toggle={closeModal}
      className='modal-dialog-centered'
      size='lg'
    >
      <ModalBody>
        <a
          href='#cancel'
          onClick={(e) => {
            e.preventDefault();
            closeModal();
          }}
          className='close'
        >
          <Icon name='cross-sm' />
        </a>
        <div className='p-2'>
          <h5 className='title'>Edit Content</h5>
          <div className='mt-4'>
            <Form className='row gy-4' onSubmit={handleSubmit(onSubmit)}>
              {/* Title */}
              <Col md='12'>
                <label className='form-label'>Title</label>
                <input
                  className='form-control'
                  {...register("title", { required: "Title is required" })}
                  name='title'
                  value={formData.title || ""}
                  onChange={handleInputChange}
                />
                {errors.title && (
                  <span className='invalid'>{errors.title.message}</span>
                )}
              </Col>

              {/* Description */}
              <Col md='12'>
                <label className='form-label'>Description</label>
                <Controller
                  name='description'
                  control={control}
                  rules={{ required: "Description is required" }}
                  render={({ field }) => (
                    <ReactQuill
                      theme='snow'
                      value={field.value}
                      onChange={(val) => {
                        setFormData((prev) => ({ ...prev, description: val }));
                        field.onChange(val);
                      }}
                    />
                  )}
                />
                {errors.description && (
                  <span className='invalid'>{errors.description.message}</span>
                )}
              </Col>

              {/* Button Text & Link */}
              <Col md='6'>
                <label className='form-label'>Button Text</label>
                <input
                  className='form-control'
                  {...register("buttonText", {
                    required: "Button text is required",
                  })}
                  name='buttonText'
                  value={formData.buttonText || ""}
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
                  {...register("buttonLink", {
                    required: "Button link is required",
                  })}
                  name='buttonLink'
                  value={formData.buttonLink || ""}
                  onChange={handleInputChange}
                />
                {errors.buttonLink && (
                  <span className='invalid'>{errors.buttonLink.message}</span>
                )}
              </Col>

              {/* Desktop Image Upload */}
              <Col md='6'>
                <label className='form-label'>Desktop Image (Max 500KB)</label>
                <input
                  type='file'
                  className='form-control'
                  accept='image/*'
                  onChange={(e) => handleImageChange(e, "desktopImage")}
                />
                {formData?.images?.desktop?.url && (
                  <div
                    style={{
                      position: "relative",
                      display: "inline-block",
                      marginTop: "10px",
                    }}
                  >
                    {" "}
                    <img
                      src={formData?.images?.desktop?.url}
                      alt='Desktop Preview'
                      style={{
                        width: 100,
                        height: 80,
                        objectFit: "contain",
                        border: "1px solid #ccc",
                      }}
                    />
                    <Button
                      size='sm'
                      type='button'
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
                      onClick={() => handleImageRemove("desktopImage")}
                    >
                      <Icon name='cross' />
                    </Button>
                  </div>
                )}
                {!formData?.images?.desktop?.url && (
                  <span className='invalid'>Desktop image is required</span>
                )}
              </Col>

              {/* Desktop Alt Text */}
              <Col md='6'>
                <label className='form-label'>Alt Text (Desktop)</label>
                <input
                  className='form-control'
                  name='desktopAlt'
                  value={formData?.images?.desktop?.altText || ""}
                  onChange={handleInputChange}
                />
                {!formData?.images?.desktop?.altText && (
                  <span className='invalid'>Desktop alt text is required</span>
                )}
              </Col>

              {/* Mobile Image Upload */}
              <Col md='6'>
                <label className='form-label'>Mobile Image (Max 500KB)</label>
                <input
                  type='file'
                  className='form-control'
                  accept='image/*'
                  onChange={(e) => handleImageChange(e, "mobileImage")}
                />
                {formData?.images?.mobile?.url && (
                  <div
                    style={{
                      position: "relative",
                      display: "inline-block",
                      marginTop: "10px",
                    }}
                  >
                    <img
                      src={formData?.images?.mobile?.url}
                      alt='Mobile Preview'
                      style={{
                        width: 100,
                        height: 80,
                        objectFit: "contain",
                        border: "1px solid #ccc",
                      }}
                    />
                    <Button
                      size='sm'
                      type='button'
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
                      onClick={() => handleImageRemove("mobileImage")}
                    >
                      <Icon name='cross' />
                    </Button>
                  </div>
                )}
                {!formData?.images?.mobile?.url && (
                  <span className='invalid'>Mobile image is required</span>
                )}
              </Col>

              {/* Mobile Alt Text */}
              <Col md='6'>
                <label className='form-label'>Alt Text (Mobile)</label>
                <input
                  className='form-control'
                  name='mobileAlt'
                  value={formData?.images?.mobile?.altText || ""}
                  onChange={handleInputChange}
                />
                {!formData?.images?.mobile?.altText && (
                  <span className='invalid'>Mobile alt text is required</span>
                )}
              </Col>

              {/* Buttons */}
              <Col size='12'>
                <ul className='align-center flex-wrap flex-sm-nowrap gx-4 gy-2'>
                  <li>
                    <Button
                      color='primary'
                      size='md'
                      type='submit'
                      disabled={submitting}
                    >
                      Update{" "}
                      {submitting && <Spinner className='spinner-xs' />}
                    </Button>
                  </li>

                  <li>
                    <a
                      href='#cancel'
                      onClick={(e) => {
                        e.preventDefault();
                        closeModal();
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
        </div>
      </ModalBody>
    </Modal>
  );
};

export default EditModal;
