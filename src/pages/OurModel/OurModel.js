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
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import {
  deleteRequest,
  getRequest,
  postFormData,
  putRequest,
} from "../../api/api";
import { Spinner } from "reactstrap";

const OurModel = () => {
  const [data, setData] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [descriptionError, setDescriptionError] = useState("");
  const [valueDescriptionErrors, setValueDescriptionErrors] = useState([]);
  const [valueTitleErrors, setValueTitleErrors] = useState([]);
  const [iconErrors, setIconErrors] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icons: [{ icon: null, title: "", description: "" }],
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
    const res = await getRequest("/institutions/our-model");
    if (res.success) {
      setData(res.data);
    } else {
      toast.error(res.message || "Failed to fetch data");
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
      title: "",
      description: "",
      icons: [{ icon: null, title: "", description: "" }],
    });
    reset();
  };

  const selectorDeleteUser = () => {
    const updated = data.filter((item) => !item.checked);
    setData(updated);
  };

  const handleIconChange = (index, field, value) => {
    const updatedIcons = [...formData.icons];
    updatedIcons[index][field] = value;
    setFormData({ ...formData, icons: updatedIcons });
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    handleIconChange(index, "icon", file);
  };

  const addIcon = () => {
    setFormData({
      ...formData,
      icons: [...formData.icons, { icon: null, title: "", description: "" }],
    });
  };

  const removeIcon = (index) => {
    const updatedIcons = formData.icons.filter((_, i) => i !== index);
    setFormData({ ...formData, icons: updatedIcons });
  };

  const onSubmit = async () => {
    setSubmitting(true);

    let hasError = false;

    // Validate description
    if (!formData.description || formData.description === "<p><br></p>") {
      setDescriptionError("Description is required");
      hasError = true;
    } else {
      setDescriptionError("");
    }

    const newValueTitleErrors = [];
    const newValueDescriptionErrors = [];
    const newIconErrors = [];

    formData.icons.forEach((val, i) => {
      if (!val.title.trim()) {
        newValueTitleErrors[i] = "Icon Title is required";
        hasError = true;
      }

      if (!val.description || val.description === "<p><br></p>") {
        newValueDescriptionErrors[i] = "Icon Description is required";
        hasError = true;
      }

      if (!val.icon) {
        newIconErrors[i] = "Icon is required";
        hasError = true;
      } else if (val.icon.size && val.icon.size > 102400) {
        newIconErrors[i] = "Icon must be less than 100KB";
        hasError = true;
      }
    });

    setValueTitleErrors(newValueTitleErrors);
    setValueDescriptionErrors(newValueDescriptionErrors);
    setIconErrors(newIconErrors);

    if (hasError) return;

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("description", formData.description);
    const preparedIcons = formData.icons.map((icon) => ({
      title: icon.title,
      description: icon.description,
      hasNewIcon: icon.icon instanceof File,
       icon: !(icon.icon instanceof File) ? icon.icon : null, 
    }));

    payload.append("icons", JSON.stringify(preparedIcons));


    formData.icons.forEach((val) => {
      if (val.icon instanceof File) {
        payload.append("iconsFiles", val.icon); // Update server to handle this field name
      }
    });

    try {
      let res;
      if (editId !== null) {
        res = await putRequest(`/institutions/our-model/${editId}`, payload);
      } else {
        res = await postFormData("/institutions/our-model", payload);
      }

      if (res.success) {
        const updatedList = editId
          ? data.map((item) => (item._id === editId ? res.data : item))
          : [res.data, ...data];

        setData(updatedList);
        toast.success(
          editId ? "Updated successfully!" : "Created successfully!"
        );
        toggleModal();
        setSubmitting(false);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Submission failed. Please try again.");
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setConfirmModal(true);
  };

  const onDeleteClick = async (id) => {
    const res = await deleteRequest(`/institutions/our-model/${id}`);
    if (res.success) {
      setData(data.filter((item) => item._id !== id));
      toast.success("Deleted successfully!");
    } else {
      toast.error(res.message || "Delete failed");
    }
  };

  return (
    <>
      <Head title='Our Model Content' />
      <Content>
        <BlockHead size='sm'>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag='h3' page>
                Our Model Section
              </BlockTitle>
              <BlockDes className='text-soft'>
                <p>Manage your Our Model content items here.</p>
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
                  <span>Title</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Description</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Value Title</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Value Description</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Icon</span>
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
      <div dangerouslySetInnerHTML={{ __html: item.description }} />
    </DataTableRow>

    <DataTableRow>
      <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
        {item.icons.map((icon, i) => (
          <li key={i}>{icon.title}</li>
        ))}
      </ul>
    </DataTableRow>

    <DataTableRow>
      <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
        {item.icons.map((icon, i) => (
          <li key={i}>
            <div
              dangerouslySetInnerHTML={{ __html: icon.description }}
            />
          </li>
        ))}
      </ul>
    </DataTableRow>

    <DataTableRow>
      <div style={{ display: "flex", gap: "10px", flexDirection:"column" }}>
        {item.icons.map((icon, i) =>
          icon.icon?.url ? (
            <img
              key={i}
              src={icon.icon.url}
              alt={icon.icon.altText || "icon"}
              width={30}
              height={30}
            />
          ) : (
            <span key={i}>No Icon</span>
          )
        )}
      </div>
    </DataTableRow>

    <DataTableRow className='nk-tb-col-tools'>
      <ul className='nk-tb-actions gx-1'>
        <li className='nk-tb-action-hidden' onClick={() => toggleModal(item)}>
          <TooltipComponent
            tag='a'
            containerClassName='btn btn-trigger btn-icon'
            id={"edit" + item._id}
            icon='edit-alt-fill'
            direction='top'
            text='Edit'
          />
        </li>
        {/* <li onClick={() => confirmDelete(item._id)}>
          <TooltipComponent
            tag='a'
            containerClassName='btn btn-trigger btn-icon'
            id={"delete" + item._id}
            icon='trash-fill'
            direction='top'
            text='Delete'
          />
        </li> */}
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
                {editId ? "Edit Our Model Content" : "Add Our Model Content"}
              </h5>
              <Form className='row gy-4' onSubmit={handleSubmit(onSubmit)}>
                <Col md='12'>
                  <label className='form-label'>Title</label>
                  <input
                    className='form-control'
                    {...register("title", { required: "Required" })}
                    name='title'
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
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
                    onChange={(value) =>
                      setFormData({ ...formData, description: value })
                    }
                  />
                  {descriptionError && (
                    <span className='invalid'>{descriptionError}</span>
                  )}
                </Col>

                {formData.icons.map((iconItem, index) => (
                  <div key={index} className='border rounded p-3 mb-3'>
                    <Col md='12'>
                      <label className='form-label'>Icon Title</label>
                      <input
                        className='form-control'
                        value={iconItem.title}
                        onChange={(e) =>
                          handleIconChange(index, "title", e.target.value)
                        }
                      />
                      {valueTitleErrors[index] && (
                        <span className='invalid'>
                          {valueTitleErrors[index]}
                        </span>
                      )}
                    </Col>

                    <Col md='12'>
                      <label className='form-label'>Icon Description</label>
                      <ReactQuill
                        theme='snow'
                        value={iconItem.description}
                        onChange={(val) =>
                          handleIconChange(index, "description", val)
                        }
                      />
                      {valueDescriptionErrors[index] && (
                        <span className='invalid'>
                          {valueDescriptionErrors[index]}
                        </span>
                      )}
                    </Col>

                    <Col md='12'>
                      <label className='form-label'>Icon Image</label>
                      <input
                        className='form-control'
                        type='file'
                        accept='image/*'
                        onChange={(e) => handleFileChange(e, index)}
                      />
                      {iconItem.icon && (
                        <div
                          style={{
                            position: "relative",
                            display: "inline-block",
                            marginTop: "10px",
                          }}
                        >
                          <img
                            src={
                              iconItem.icon
                                ? typeof iconItem.icon === "string"
                                  ? iconItem.icon
                                  : iconItem.icon instanceof File
                                    ? URL.createObjectURL(iconItem.icon)
                                    : iconItem.icon.url || ""
                                : ""
                            }
                            alt='icon preview'
                            width={100}
                            height={100}
                            style={{
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
                              handleIconChange(index, "icon", null)
                            }
                          >
                            <Icon name='cross' />
                          </Button>
                        </div>
                      )}

                      {iconErrors[index] && (
                        <span className='invalid'>{iconErrors[index]}</span>
                      )}
                    </Col>

                    <Button
                    type="button"
                      color='danger'
                      size='sm'
                      onClick={() => removeIcon(index)}
                    >
                      Remove Icon
                    </Button>
                  </div>
                ))}

                <div>
                  <Button
                    color='primary'
                    type="button"
                    size='sm'
                    onClick={addIcon}
                    style={{ width: "auto" }}
                  >
                    Add More Value
                  </Button>
                </div>

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
                  const res = await deleteRequest(`/institutions/our-model/${deleteId}`);
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

export default OurModel;
