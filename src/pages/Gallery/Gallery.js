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
  DataTableItem,
  DataTableRow,
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

const Gallery = () => {
  const [data, setData] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);


  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [fileError, setFileError] = useState(""); // To store file validation error
  const [formData, setFormData] = useState({
    file: null,
    file2: null,
    altText: "",
     removeFile2: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const toggleModal = (editItem = null) => {
    setFileError("");
    if (editItem) {
      setEditId(editItem._id);
      setFormData(editItem);
      setFormData({
        file: editItem.url,
        file2: editItem.url2 || null,
        altText: editItem.altText,
      });
    } else {
      resetForm();
      setEditId(null);
    }
    setModal(!modal);
  };

  const resetForm = () => {
    setFormData({ file: null, altText: "" });
    reset();
    setFileError(""); // Reset file error on form reset
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isImage = file.type.startsWith("image");
    const isVideo = file.type.startsWith("video");

    if (!isImage && !isVideo) {
      setFileError("Only image or video files are allowed.");
      return;
    }

    // if (isImage && file.size > 512000) {
    //   setFileError("Image must be less than 500KB.");
    //   return;
    // }

    // if (isVideo && file.size > 10 * 1024 * 1024) {
    //   setFileError("Video must be less than 10MB.");
    //   return;
    // }

    setFileError(""); // Reset file error
    setFormData({ ...formData, file });
  };
  const handleFileChange2 = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("video")) {
      setFileError("Second file must be a video.");
      return;
    }

    setFileError("");
    setFormData({ ...formData, file2: file });
  };


  const selectorDeleteUser = () => {
    const updated = data.filter((item) => !item.checked);
    setData(updated);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const fetchGallery = async () => {
    setLoading(true); // Show loader

    const res = await getRequest("/home/gallery");
    if (res.success) {
      console.log("gallery created:", res.data);

      setData(res.data);
    } else {
      console.error("Failed to fetch gallery:", res.message);
    }
    setLoading(false); // Hide loader

  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // If no file and not editing, it's a new item with no file -> invalid
    if (!formData.file && !editId) {
      setFileError("File is required");
      return;
    }

    const formPayload = new FormData();
    formPayload.append("altText", formData.altText);

    // Only append the file if it's a new upload (a File object)
    if (formData.file instanceof File) {
      formPayload.append("file", formData.file);
    }

    if (formData.file2 instanceof File) {
      formPayload.append("file2", formData.file2);
    }

    if (formData.removeFile2) {
  formPayload.append("removeUrl2", "true"); // your backend supports this
}

    try {
      if (editId) {
        const res = await putRequest(`/home/gallery/${editId}`, formPayload);
        if (res.success) {
          const updated = data.map((item) =>
            item._id === editId ? res.data : item
          );
          setData(updated);
          toast.success("Gallery item updated");
        }
      } else {
        const res = await postFormData("/home/gallery", formPayload);
        if (res.success) {
          setData([res.data, ...data]);
          toast.success("Gallery item added");
        }
      }
      toggleModal();
      // setSubmitting(false);
    } catch (err) {
      toast.error("Operation failed. Please try again.");
    }
    finally {
      setSubmitting(false);
    }
  };

  const onDeleteClick = async (id) => {
    const res = await deleteRequest(`/home/gallery/${id}`);
    if (res.success) {
      toast.success("Deleted successfully");
      fetchGallery();


    } else {
      toast.error("Delete failed");
    }
  };

  return (
    <>
      <Head title='Gallery Manager' />
      <Content>
        <BlockHead size='sm'>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag='h3' page>
                Gallery
              </BlockTitle>
              <BlockDes className='text-soft'>
                <p>Manage your media gallery.</p>
              </BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <Button color='primary' onClick={() => toggleModal()}>
                <Icon name='plus' />
                <span>Add Media</span>
              </Button>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          {loading ? (
            <div className="text-center p-5">
              <Spinner color="primary" size="lg" />
            </div>
          ) : (
            <div className='nk-tb-list is-separate is-medium mb-3'>
              <DataTableHead>
                <DataTableRow>
                  <span>Preview</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Alt Text</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Secondary Video</span>
                </DataTableRow>
                <DataTableRow className='nk-tb-col-tools text-end'>
                  {/* Actions dropdown */}
                </DataTableRow>
              </DataTableHead>

              {data.map((item) => (
                <DataTableItem key={item._id}>
                  <DataTableRow>
                    {item.url ? (
                      item.url.match(/\.(mp4|webm)$/i) ? (
                        <video src={item.url} width='100' height='60' controls />
                      ) : (
                        <img
                          src={item.url}
                          alt={item.altText}
                          width='100'
                          height='60'
                          style={{ objectFit: "cover" }}
                        />
                      )
                    ) : (
                      <span>No media</span>
                    )}
                  </DataTableRow>
                  <DataTableRow>
                    <span>{item.altText}</span>
                  </DataTableRow>
                  <DataTableRow>
                    {item.url2 ? (
                      item.url2.match(/\.(mp4|webm)$/i) ? (
                        <video src={item.url2} width='100' height='60' controls />
                      ) : (
                        <span>Invalid file</span>
                      )
                    ) : (
                      <span>None</span>
                    )}
                  </DataTableRow>
                  <DataTableRow className='nk-tb-col-tools'>
                    <ul className='nk-tb-actions gx-1'>
                      <li onClick={() => toggleModal(item)}>
                        <TooltipComponent
                        
                          tag='a'
                          containerClassName='btn btn-trigger btn-icon'
                          id={`edit-${item._id}`}
                          icon='edit-alt-fill'
                          text='Edit'
                        />
                      </li>
                      <li onClick={() => {
                        setDeleteId(item._id);
                        setConfirmModal(true);
                      }}>
                        <TooltipComponent
                          tag='a'
                          containerClassName='btn btn-trigger btn-icon'
                          id={`delete-${item._id}`}
                          icon='trash-fill'
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
                {editId ? "Edit Gallery Item" : "Add Gallery Item"}
              </h5>
              <Form className='row gy-4' onSubmit={(e) => onSubmit(e)}>
                <Col
                  md='12'
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <label className='form-label'>Upload File</label>
                  {!formData.file ? (
                    <input
                      className='form-control'
                      type='file'
                      accept='image/*,video/*'
                      onChange={handleFileChange}
                    />
                  ) : (
                    <div
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
                        {formData.file instanceof File ? (
                          formData.file.type.startsWith("video") ? (
                            <video
                              src={URL.createObjectURL(formData.file)}
                              width='150'
                              controls
                            />
                          ) : (
                            <img
                              src={URL.createObjectURL(formData.file)}
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
                          )
                        ) : typeof formData.file === "string" ||
                          formData.file?.url ? (
                          formData.file?.url?.match(/\.(mp4|webm)$/i) ? (
                            <video
                              src={formData.file.url || formData.file}
                              width='150'
                              controls
                            />
                          ) : (
                            <img
                              src={formData.file.url || formData.file}
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
                          )
                        ) : null}

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
                            setFormData({ ...formData, file: null })
                          }
                        >
                          <Icon name='cross' />
                        </Button>
                      </div>
                    </div>
                  )}

                  {fileError && <span className='invalid'>{fileError}</span>}
                </Col>
                <Col md='12'>
                  <label className='form-label'>Alt Text</label>
                  <input
                    className='form-control'
                    {...register("altText", {
                      required: "Alt text is required",
                    })}
                    name='altText'
                    value={formData.altText}
                    onChange={handleInputChange}
                  />
                  {errors.altText && (
                    <span className='invalid'>{errors.altText.message}</span>
                  )}
                </Col>
                {/* <Col md='12' style={{ display: "flex", flexDirection: "column" }}>
                  <label className='form-label'>Optional Video Upload</label>
                  {!formData.file2 ? (
                    <input
                      className='form-control'
                      type='file'
                      accept='video/*'
                      onChange={handleFileChange2}
                    />
                  ) : (
                    <div style={{ display: "inline-flex", alignItems: "flex-start", gap: "12px", marginTop: "8px" }}>
                      <div style={{ position: "relative", display: "inline-block" }}>
                        {formData.file2 instanceof File ? (
                          <video src={URL.createObjectURL(formData.file2)} width='150' controls />
                        ) : (
                          <video src={formData.file2.url || formData.file2} width='150' controls />
                        )}
                        <Button
                          size='sm'
                          color='danger'
                          className='btn-icon'
                          style={{
                            position: "absolute",
                            top: "-8px",
                            right: "-8px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                            zIndex: 10,
                            height: "20px",
                            width: "20px",
                          }}
                          onClick={() => setFormData({ ...formData, file2: null })}
                        >
                          <Icon name='cross' />
                        </Button>
                      </div>
                    </div>
                  )}
                </Col> */}

                <Col md='12' style={{ display: "flex", flexDirection: "column" }}>
  <label className='form-label'>Optional Video Upload</label>
  <input
    className='form-control mb-2'
    type='file'
    accept='video/*'
    onChange={(e) => {
      handleFileChange2(e);
      setFormData((prev) => ({ ...prev, removeFile2: false }));
    }}
  />

  {formData.file2 && (
    <div className='mt-2'>
      <video
        width='150'
        controls
        src={
          formData.file2 instanceof File
            ? URL.createObjectURL(formData.file2)
            : formData.file2?.url || formData.file2
        }
      />
    </div>
  )}
<div style={{width:"auto"}}>
  <Button
  type="button"
    color='danger'
    size='sm'
    className='mt-2'
    onClick={() =>
      setFormData((prev) => ({
        ...prev,
        file2: null,
        removeFile2: true,
      }))
    }
  >
    Remove Video
  </Button>
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
        <Modal
          isOpen={confirmModal}
          toggle={() => setConfirmModal(false)}
          className='modal-dialog-centered'
          size='sm'
        >
          <ModalBody className='text-center'>
            {/* <Icon name='alert-circle' className='text-danger' style={{ fontSize: "30px" }} /> */}
            <h5 className='mt-3'>Confirm Deletion</h5>
            <p>Are you sure you want to delete this  item?</p>
            <div className='d-flex justify-content-center gap-2 mt-4'>
              <Button
                color='danger'
                className="p-3"
                onClick={async () => {
                  const res = await deleteRequest(`/home/gallery/${deleteId}`);
                  if (res.success) {
                    toast.success("Deleted successfully");
                    fetchGallery();
                  } else {
                    toast.error("Delete failed");
                  }
                  setConfirmModal(false);
                  setDeleteId(null);
                }}
              >
                OK
              </Button>
              <Button color='light' className="p-3" onClick={() => setConfirmModal(false)}>
                Cancel
              </Button>
            </div>
          </ModalBody>
        </Modal>

      </Content>
    </>
  );
};

export default Gallery;
