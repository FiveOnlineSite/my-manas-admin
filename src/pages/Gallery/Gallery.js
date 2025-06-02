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
  DataTableItem,
  DataTableRow,
} from "../../components/table/DataTable";
import Content from "../../layout/content/Content";
import Head from "../../layout/head/Head";
import TooltipComponent from "../../components/tooltip/Tooltip";
import { GalleryContext } from "./GalleryContext";
import { toast } from "react-toastify";
import { Spinner } from "reactstrap";

import {
  deleteRequest,
  getRequest,
  postFormData,
  putRequest,
} from "../../api/api";

const Gallery = () => {
  const { contextData } = useContext(GalleryContext);
  const [data, setData] = contextData;
  const [submitting, setSubmitting] = useState(false);

  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [fileError, setFileError] = useState(""); // To store file validation error
  const [formData, setFormData] = useState({
    file: null,
    altText: "",
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

  const selectorDeleteUser = () => {
    const updated = data.filter((item) => !item.checked);
    setData(updated);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const fetchGallery = async () => {
    const res = await getRequest("/home/gallery");
    if (res.success) {
      console.log("gallery created:", res.data);

      setData(res.data);
    } else {
      console.error("Failed to fetch gallery:", res.message);
    }
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
      setSubmitting(false);
    } catch (err) {
      toast.error("Operation failed. Please try again.");
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
          <div className='nk-tb-list is-separate is-medium mb-3'>
            <DataTableHead>
              <DataTableRow>
                <span>Preview</span>
              </DataTableRow>
              <DataTableRow>
                <span>Alt Text</span>
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
                  {item.url ? (
                    item.url.type?.startsWith("video") ||
                    item.url?.name?.match(/\.(mp4|webm)$/i) ? (
                      <video src={item?.url} width='100' height='60' controls />
                    ) : (
                      <img
                        src={item?.url}
                        alt={item?.altText}
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
                  <span>{item?.altText}</span>
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

export default Gallery;
