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
import { useForm, Controller } from "react-hook-form";
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

const DonateAchievements = () => {
  const [data, setData] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
const [confirmModal, setConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null); 
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    items: [{ title: "", description: "", image: null, altText: "" }],
  });

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true)
    const res = await getRequest("/donate/achievements");
    // console.log(res.data, "resfdfdfdf");

    if (res.success) {
      setData(res?.data);
    } else {
      setData([]);
    }
    setLoading(false)
  };

  const toggleModal = (editItem = null) => {
    if (editItem) {
      setEditId(editItem._id);
      setFormData({
        title: editItem.title || "",
        items: Array.isArray(editItem.items)
          ? editItem.items.map((item) => ({
            title: item.title || "",
            description: item.description || "",
            image: item.image?.url || "",
            altText: item.image?.altText || "",
          }))
          : [],
      });
    } else {
      resetForm();
    }
    setModal(!modal);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      items: [{ title: "", description: "", image: null, altText: "" }],
    });
    setEditId(null);
    reset();
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    setFormData({ ...formData, items: updatedItems });
  };


  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    // if (file && file.size > 512000)
    // {
    //   toast.error("Image must be less than 500KB");
    //   return;
    // }
    handleItemChange(index, "image", file);
  };

  const addItem = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { title: "", description: "", image: null, altText: "" },
      ],
    });
  };

  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  const onSubmit = async () => {
    setSubmitting(true);

    const payload = new FormData();
    payload.append("title", formData.title);

   const itemsData = formData.items.map(
  ({ title, description, image, altText }) => ({
    title,
    description,
    image: {
      altText,
      url: image instanceof File ? null : image?.url || image,
    },
    hasNewImage: image instanceof File,
  })
);

    // console.log(formData, itemsData, "itemsDataaaaaaa");

    payload.append("items", JSON.stringify(itemsData));
    formData.items.forEach((item) => {
      if (item.image instanceof File) {
        // console.log(item.image, "feeeeeeeee");

        payload.append("images", item.image);
      }
    });

    let res;
    if (editId) {
      res = await putRequest(`/donate/achievements/${editId}`, payload);
    } else {
      res = await postFormData("/donate/achievements", payload);
    }

    if (res.success) {
      fetchData();
      toast.success(editId ? "Updated successfully!" : "Created successfully!");
      toggleModal();
      setSubmitting(false);
    } else {
      toast.error(res.message || "Submission failed.");
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setConfirmModal(true);
  };

  const onDeleteClick = async (id) => {
    const res = await deleteRequest(`/donate/achievements/${id}`);
    if (res.success) {
      fetchData();
      toast.success("Deleted successfully!");
    } else {
      toast.error(res.message || "Delete failed.");
    }
  };

  return (
    <>
      <Head title='Achievements Content' />
      <Content>
        <BlockHead size='sm'>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag='h3' page>
                Achievements Section
              </BlockTitle>
              <BlockDes className='text-soft'>
                <p>Manage your Achievements content here.</p>
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
                  <span>Main Title</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Item Title</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Description</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Image</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Alt Text</span>
                </DataTableRow>
                <DataTableRow className='nk-tb-col-tools text-end'>
                  <span>Actions</span>
                </DataTableRow>
              </DataTableHead>
              {/* {console.log(data, "datadddddddddd")} */}
              {data &&
  data.length > 0 &&
  data.map((achievement) => (
    <DataTableItem key={achievement._id}>
      {/* Main Title */}
      <DataTableRow>
        <span>{achievement.title}</span>
      </DataTableRow>

      {/* Item Titles */}
      <DataTableRow>
        <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
          {achievement.items.map((item, idx) => (
            <li key={idx}>{item.title}</li>
          ))}
        </ul>
      </DataTableRow>

      {/* Descriptions */}
      <DataTableRow>
        <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
          {achievement.items.map((item, idx) => (
            <li key={idx}>
              <div dangerouslySetInnerHTML={{ __html: item.description }} />
            </li>
          ))}
        </ul>
      </DataTableRow>

      {/* Images */}
      <DataTableRow>
        <div style={{ display: "flex", gap: "10px", flexDirection:"column" }}>
          {achievement.items.map((item, idx) =>
            item.image?.url || typeof item.image === "string" ? (
              <img
                key={idx}
                src={typeof item.image === "string" ? item.image : item.image?.url}
                alt={item.altText || "achievement"}
                width={30}
                height={30}
                style={{ objectFit: "cover", borderRadius: "4px" }}
              />
            ) : (
              <span key={idx}>No image</span>
            )
          )}
        </div>
      </DataTableRow>

      {/* Alt Texts */}
      <DataTableRow>
        <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
          {achievement.items.map((item, idx) => (
            <li key={idx}>{item.image?.altText}</li>
          ))}
        </ul>
      </DataTableRow>

      {/* Actions */}
      <DataTableRow className='nk-tb-col-tools'>
        <ul className='nk-tb-actions gx-1'>
          <li onClick={() => toggleModal(achievement)}>
            <TooltipComponent
              tag='a'
              id={`edit-${achievement._id}`}
              containerClassName='btn btn-trigger btn-icon'
              icon='edit-alt-fill'
              direction='top'
              text='Edit'
            />
          </li>
          {/* <li onClick={() => confirmDelete(achievement._id)}>
            <TooltipComponent
              tag='a'
              id={`delete-${achievement._id}`}
              containerClassName='btn btn-trigger btn-icon'
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
                {editId ? "Edit Achievement" : "Add Achievement"}
              </h5>
              <Form className='row gy-4' onSubmit={handleSubmit(onSubmit)}>
                <Col md='12'>
                  <label className='form-label'>Main Title <span className="danger">*</span></label>
                  <input
                    className='form-control'
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </Col>

                {formData.items.map((item, index) => (
                  <div key={index} className='border rounded p-3 mb-3'>
                    <Col md='12'>
                      <label className='form-label'>Item Title <span className="danger">*</span></label>
                      <input
                        className='form-control'
                        value={item.title}
                        onChange={(e) =>
                          handleItemChange(index, "title", e.target.value)
                        }
                      />
                    </Col>
                    <Col md='12'>
                      <label className='form-label'>Item Description <span className="danger">*</span></label>
                      <ReactQuill
                        theme='snow'
                        value={item.description}
                        onChange={(val) =>
                          handleItemChange(index, "description", val)
                        }
                      />
                    </Col>
                    <Col md='12'>
                      <label className='form-label'>Image <span className="danger">*</span></label>
                      <input
                        className='form-control'
                        type='file'
                        accept='image/*'
                        onChange={(e) => handleImageChange(e, index)}
                      />
                      {item.image && (
                        <div
                          style={{
                            position: "relative",
                            display: "inline-block",
                            marginTop: "10px",
                          }}
                        >
                          <img
                            src={
                              typeof item.image === "string"
                                ? item.image
                                : item.image?.url
                                  ? item.image.url
                                  : URL.createObjectURL(item.image)
                            }
                            alt={item.altText || "Preview"}
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
                              handleItemChange(index, "image", null)
                            }
                          >
                            <Icon name='cross' />
                          </Button>
                        </div>
                      )}
                    </Col>

                    <Col md='12'>
                      <label className='form-label'>Alt Text <span className="danger">*</span></label>
                      <input
                        className='form-control'
                        value={item.altText}
                        onChange={(e) =>
                          handleItemChange(index, "altText", e.target.value)
                        }
                      />
                    </Col>
                    <Button
                    type="button"
                      size='sm'
                      color='danger'
                      onClick={() => removeItem(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}

                <div>
                  <Button
                    style={{ width: "auto" }}
                    color='primary'
                    size='sm'
                    onClick={(e) => {
                      addItem(e);
                    }}
                  >
                    Add More Item
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
                  const res = await deleteRequest(`/donate/achievements/${deleteId}`);
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

export default DonateAchievements;
