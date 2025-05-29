import React, { useEffect } from "react";
import { Button, Col, Modal, ModalBody, Form } from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Spinner } from "reactstrap";

const AddModal = ({
  modal,
  formData,
  setFormData,
  closeModal,
  onSubmit,
  submitting,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    trigger,
  } = useForm();

  const defaultFormData = {
    title: "",
    description: "",
    buttonText: "",
    buttonLink: "",
    desktopImage: null,
    desktopAlt: "",
    mobileImage: null,
    mobileAlt: "",
  };

  useEffect(() => {
    if (modal) {
      setFormData({ ...defaultFormData });
    }
  }, [modal]);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    // if (file && file.size <= 512000) {
    setFormData({ ...formData, [type]: file });
    // } else {
    // alert("Image must be under 500KB");
    // }
    trigger(type);
  };

  const handleImageRemove = (type) => {
    setFormData({ ...formData, [type]: null });
    setValue(type, null);
    trigger(type);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
          <i className='icon ni ni-cross-sm' />
        </a>
        <div className='p-2'>
          <h5 className='title'>Add Banner</h5>
          <Form
            className='row gy-4'
            onSubmit={handleSubmit(() => onSubmit(formData))}
          >
            <Col md='12'>
              <label className='form-label'>Title</label>
              <input
                className='form-control'
                name='title'
                value={formData.title}
                {...register("title", { required: "Title is required" })}
                onChange={handleInputChange}
              />
              {errors.title && (
                <span className='invalid'>{errors.title.message}</span>
              )}
            </Col>

            <Col md='12'>
              <label className='form-label'>Description</label>
              <Controller
                name='description'
                control={control}
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                  <ReactQuill
                    theme='snow'
                    value={formData.description}
                    onChange={(val) => {
                      setFormData({ ...formData, description: val });
                      field.onChange(val);
                    }}
                  />
                )}
              />
              {errors.description && (
                <span className='invalid'>{errors.description.message}</span>
              )}
            </Col>

            <Col md='6'>
              <label className='form-label'>Button Text</label>
              <input
                className='form-control'
                name='buttonText'
                value={formData.buttonText}
                {...register("buttonText", {
                  required: "Button Text is required",
                })}
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
                name='buttonLink'
                value={formData.buttonLink}
                {...register("buttonLink", {
                  required: "Button Link is required",
                })}
                onChange={handleInputChange}
              />
              {errors.buttonLink && (
                <span className='invalid'>{errors.buttonLink.message}</span>
              )}
            </Col>

            <Col md='6'>
              <label className='form-label'>Desktop Image</label>
              <input
                type='file'
                accept='image/*'
                className='form-control'
                {...register("desktopImage", {
                  required: "Desktop image is required",
                })}
                onChange={(e) => handleFileChange(e, "desktopImage")}
              />
              {formData.desktopImage && (
                <div className='mt-2 position-relative d-inline-block'>
                  <img
                    src={URL.createObjectURL(formData.desktopImage)}
                    alt='preview'
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
                    onClick={() => handleImageRemove("desktopImage")}
                  >
                    <i className='ni ni-cross' />
                  </Button>
                </div>
              )}
              {errors.desktopImage && (
                <span className='invalid'>{errors.desktopImage.message}</span>
              )}
            </Col>

            <Col md='6'>
              <label className='form-label'>Alt Text (Desktop)</label>
              <input
                className='form-control'
                name='desktopAlt'
                value={formData.desktopAlt}
                {...register("desktopAlt", {
                  required: "Desktop Alt Text is required",
                })}
                onChange={handleInputChange}
              />
              {errors.desktopAlt && (
                <span className='invalid'>{errors.desktopAlt.message}</span>
              )}
            </Col>

            <Col md='6'>
              <label className='form-label'>Mobile Image</label>
              <input
                type='file'
                accept='image/*'
                className='form-control'
                {...register("mobileImage", {
                  required: "Mobile image is required",
                })}
                onChange={(e) => handleFileChange(e, "mobileImage")}
              />
              {formData.mobileImage && (
                <div className='mt-2 position-relative d-inline-block'>
                  <img
                    src={URL.createObjectURL(formData.mobileImage)}
                    alt='preview'
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
                    onClick={() => handleImageRemove("mobileImage")}
                  >
                    <i className='ni ni-cross' />
                  </Button>
                </div>
              )}
              {errors.mobileImage && (
                <span className='invalid'>{errors.mobileImage.message}</span>
              )}
            </Col>

            <Col md='6'>
              <label className='form-label'>Alt Text (Mobile)</label>
              <input
                className='form-control'
                name='mobileAlt'
                value={formData.mobileAlt}
                {...register("mobileAlt", {
                  required: "Mobile Alt Text is required",
                })}
                onChange={handleInputChange}
              />
              {errors.mobileAlt && (
                <span className='invalid'>{errors.mobileAlt.message}</span>
              )}
            </Col>

            <Col size='12'>
              <ul className='align-center flex-wrap flex-sm-nowrap gx-4 gy-2'>
                <li>
                  <Button
                    color='primary'
                    disabled={submitting}
                    size='md'
                    type='submit'
                  >
                    Submit
                    {submitting ? <Spinner className='spinner-xs' /> : ""}
                  </Button>
                </li>
                <li>
                  <Button color='light' size='md' onClick={closeModal}>
                    Cancel
                  </Button>
                </li>
              </ul>
            </Col>
          </Form>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default AddModal;
