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
import {
  deleteRequest,
  getRequest,
  postFormData,
  putRequest,
} from "../../api/api";
import { toast } from "react-toastify";
import { Spinner } from "reactstrap";

const ScholarshipAwardees = () => {
  const [data, setData] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    awardees: [
      {
        name: "",
        review: "",
        year: "",
        institute: "",
        image: null,
      },
    ],
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
    const res = await getRequest("/scholarships/scholarship-awardees");
    if (res.success) {
      setData(res.data);
    } else {
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
      awardees: [
        {
          name: "",
          review: "",
          year: "",
          institute: "",
          image: null,
        },
      ],
    });
    reset();
  };

  const selectorDeleteUser = () => {
    const updated = data.filter((item) => !item.checked);
    setData(updated);
  };

  const handleAwardeeChange = (index, field, value) => {
    const updatedAwardees = JSON.parse(JSON.stringify(formData.awardees));
    updatedAwardees[index][field] = value;
    setFormData({ ...formData, awardees: updatedAwardees });
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    // if (file && file.size > 512000) {
    //   alert("Image must be less than 500KB");
    //   return;
    // }
    handleAwardeeChange(index, "image", file);
  };

  const addAwardee = () => {
    setFormData({
      ...formData,
      awardees: [
        ...formData.awardees,
        { name: "", review: "", year: "", institute: "", image: null },
      ],
    });
  };

  const removeAwardee = (index) => {
    const updatedAwardees = formData.awardees.filter((_, i) => i !== index);
    setFormData({ ...formData, awardees: updatedAwardees });
  };

  const onSubmit = async () => {
    setSubmitting(true);

    const isValid =
      formData.title.trim() !== "" &&
      formData.awardees.every(
        (a) =>
          a.name.trim() !== "" &&
          a.review.trim() !== "" &&
          a.year.trim() !== "" &&
          a.institute.trim() !== ""
      );

    if (!isValid) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const payload = new FormData();
    payload.append("title", formData.title);
    const preparedAwardees = formData.awardees.map((a) => ({
      name: a.name,
      review: a.review,
      year: a.year,
      institute: a.institute,
      hasNewImage: a.image instanceof File,
image: !(a.image instanceof File) ? a.image : null,    }));

    payload.append("awardees", JSON.stringify(preparedAwardees));


    formData.awardees.forEach((awardee) => {
      if (awardee.image instanceof File) {
        payload.append("awardeesImages", awardee.image);
      }
    });

    try {
      let res;
      if (editId !== null) {
        res = await putRequest(
          `/scholarships/scholarship-awardees/${editId}`,
          payload
        );
        if (res.success) {
          const updated = data.map((item) =>
            item._id === editId ? res.data : item
          );
          setData(updated);
          toast.success("Content updated successfully!");
        } else {
          toast.error(res.message || "Update failed");
          return;
        }
      } else {
        res = await postFormData("/scholarships/scholarship-awardees", payload);
        if (res.success) {
          setData([res.data, ...data]);
          toast.success("Content added successfully!");
        } else {
          toast.error(res.message || "Creation failed");
          return;
        }
      }

      toggleModal();
      setSubmitting(false);
    } catch (err) {
      toast.error("An error occurred while submitting.");
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setConfirmModal(true);
  };

  const onDeleteClick = async (id) => {
    const res = await deleteRequest(`/scholarships/scholarship-awardees/${id}`);
    if (res.success) {
      setData(data.filter((item) => item._id !== id));
      toast.success("Deleted successfully!");
    } else {
      toast.error(res.message || "Failed to delete");
    }
  };

  return (
    <>
      <Head title='Scholarship Awardees Content' />
      <Content>
        <BlockHead size='sm'>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag='h3' page>
                Scholarship Awardees Section
              </BlockTitle>
              <BlockDes className='text-soft'>
                <p>Manage your Scholarship Awardees content items here.</p>
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
                  <span>Name</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Review</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Year</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Institute</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Image</span>
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
      <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
        {item.awardees.map((awardee, i) => (
          <li key={i}>{awardee.name}</li>
        ))}
      </ul>
    </DataTableRow>

    <DataTableRow>
      <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
        {item.awardees.map((awardee, i) => (
          <li key={i}>
            <div
              dangerouslySetInnerHTML={{
                __html: awardee.review,
              }}
            />
          </li>
        ))}
      </ul>
    </DataTableRow>

    <DataTableRow>
      <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
        {item.awardees.map((awardee, i) => (
          <li key={i}>{awardee.year}</li>
        ))}
      </ul>
    </DataTableRow>

    <DataTableRow>
      <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
        {item.awardees.map((awardee, i) => (
          <li key={i}>{awardee.institute}</li>
        ))}
      </ul>
    </DataTableRow>

    <DataTableRow>
      <div style={{ display: "flex", flexDirection:"column", gap: "10px" }}>
        {item.awardees.map((awardee, i) =>
          awardee.image?.url ? (
            <img
              key={i}
              src={awardee.image.url}
              alt={`Awardee ${i}`}
              width={30}
              height={30}
              style={{ objectFit: "cover", borderRadius: "4px" }}
            />
          ) : (
            <span key={i}>No image</span>
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
                {editId
                  ? "Edit Scholarship Awardees Content"
                  : "Add Scholarship Awardees Content"}
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

                {formData.awardees.map((awardee, index) => (
                  <div key={index} className='border rounded p-3 mb-3'>
                    <Col md='12'>
                      <label className='form-label'>Name</label>
                      <input
                        className='form-control'
                        value={awardee.name}
                        onChange={(e) =>
                          handleAwardeeChange(index, "name", e.target.value)
                        }
                      />
                    </Col>
                    <Col md='12'>
                      <label className='form-label'>Review</label>
                      <ReactQuill
                        theme='snow'
                        value={awardee.review}
                        onChange={(value) =>
                          handleAwardeeChange(index, "review", value)
                        }
                      />
                      {!awardee.review && (
                        <span className='invalid'>Review is required</span>
                      )}
                    </Col>
                    <Col md='6'>
                      <label className='form-label'>Year</label>
                      <input
                        className='form-control'
                        value={awardee.year}
                        onChange={(e) =>
                          handleAwardeeChange(index, "year", e.target.value)
                        }
                      />
                    </Col>
                    <Col md='6'>
                      <label className='form-label'>Institute Name</label>
                      <input
                        className='form-control'
                        value={awardee.institute}
                        onChange={(e) =>
                          handleAwardeeChange(
                            index,
                            "institute",
                            e.target.value
                          )
                        }
                      />
                    </Col>
                    <Col
                      md='12'
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                      <label className='form-label'>
                        Image Upload (Max 500KB)
                      </label>
                      {!awardee.image ? (
                        <input
                          className='form-control'
                          type='file'
                          accept='image/*'
                          onChange={(e) => handleFileChange(e, index)}
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
                                awardee.image
                                  ? typeof awardee.image === "string"
                                    ? awardee.image
                                    : awardee.image instanceof File
                                      ? URL.createObjectURL(awardee.image)
                                      : awardee.image.url || ""
                                  : ""

                              }
                              alt={awardee.name}
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
                                handleAwardeeChange(index, "image", null)
                              }
                            >
                              <Icon name='cross' />
                            </Button>
                          </div>
                        </div>
                      )}
                    </Col>

                    <Button
                    type="button"
                      color='danger'
                      size='sm'
                      onClick={() => removeAwardee(index)}
                    >
                      Remove Awardee
                    </Button>
                  </div>
                ))}
                <div>
                  <Button
                    color='primary'
                    type="button"
                    size='sm'
                    style={{ width: "auto" }}
                    onClick={addAwardee}
                  >
                    Add More Awardee
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
                  const res = await deleteRequest(`/scholarships/scholarship-awardees/${deleteId}`);
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

export default ScholarshipAwardees;
