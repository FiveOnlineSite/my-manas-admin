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
import { deleteRequest, getRequest, postFormData, putRequest } from "../../api/api";
import { Spinner } from "reactstrap";


const VidhyavanamLeadership = () => {
  const [data, setData] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
const [confirmModal, setConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null); 
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    members: [
      {
        name: "",
        description: "",
        image: null,
        altText: "",
      },
    ],
  });



  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
    trigger,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      altText: "",
      image: null,
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true)
    const res = await getRequest("/vidhyavanam/leadership-team");
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
      // setFormData(editItem);
         const mappedMembers = editItem.members.map((m) => ({
      name: m.name || "",
      description: m.description || "",
      image: m.image || null,
      altText: m.image?.altText || "", 
    }));

    setFormData({ members: mappedMembers });
    } else {
      resetForm();
      setEditId(null);
    }
    setModal(!modal);
  };

  const resetForm = () => {
    setFormData({
      members: [
        {
          name: "",
          description: "",
          image: null,
          altText: "",
        },
      ],
    });
    reset();
  };

  const addMember = () => {
    setFormData({
      ...formData,
      members: [
        ...formData.members,
        { name: "", description: "", image: null, altText: "" },
      ],
    });
  };

  const removeMember = (index) => {
    const updated = [...formData.members];
    updated.splice(index, 1);
    setFormData({ ...formData, members: updated });
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...formData.members];
    updated[index][field] = value;
    setFormData({ ...formData, members: updated });
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    handleMemberChange(index, "image", file);
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };

  const selectorDeleteUser = () => {
    const updated = data.filter((item) => !item.checked);
    setData(updated);
  };

  const onSubmit = async () => {
    setSubmitting(true);

    const member = formData.members[0];

    const hasErrors =
      !member.name.trim() ||
      !member.description.trim() ||
      !member.altText.trim() ||
      !member.image;

    if (hasErrors) {
      // Do not submit if validation fails, just allow inline errors to show
      return;
    }
    const payload = new FormData();
const membersWithFlag = formData.members.map((member) => ({
  ...member,
  hasNewImage: member.image instanceof File,
}));

payload.append("members", JSON.stringify(membersWithFlag));

    formData.members.forEach((member) => {
      if (member.image instanceof File) {
        payload.append("files", member.image);
      }
    });

    try {
      let res;
      if (editId) {
        res = await putRequest(`/vidhyavanam/leadership-team/${editId}`, payload);
      } else {
        res = await postFormData("/vidhyavanam/leadership-team", payload);
      }

      if (res.success) {
        toast.success("Leadership team saved!");
        fetchData();
        toggleModal();
        setSubmitting(false);

      } else {
        toast.error(res.message || "Failed to save");
      }
    } catch (err) {
      toast.error("An error occurred during submission");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setConfirmModal(true);
  };

  const onDeleteClick = async (id) => {
    const res = await deleteRequest(`/vidhyavanam/leadership-team/${id}`);
    if (res.success) {
      setData(data.filter((item) => item._id !== id));
      toast.success("Deleted successfully!");
    } else {
      toast.error(res.message || "Failed to delete");
    }
  };


  return (
    <>
      <Head title='Leadership Team' />
      <Content>
        <BlockHead size='sm'>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag='h3' page>
                Leadership Team
              </BlockTitle>
              <BlockDes className='text-soft'>
                <p>Manage your leadership team members here.</p>
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
                  <span>Name</span>
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
                <DataTableRow className='nk-tb-col-tools text-end' />
              </DataTableHead>

              {data.length > 0 && data.map((item) => (
  <DataTableItem key={item._id}>
    {/* Name list */}
    <DataTableRow>
      <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
        {item.members.map((member, idx) => (
          <li key={idx}>{member.name}</li>
        ))}
      </ul>
    </DataTableRow>

    {/* Description list */}
    <DataTableRow>
      <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
        {item.members.map((member, idx) => (
          <li key={idx}>
            <div dangerouslySetInnerHTML={{ __html: member.description }} />
          </li>
        ))}
      </ul>
    </DataTableRow>

    {/* Image list */}
    <DataTableRow>
      <div style={{ display: "flex", gap: "10px",flexDirection:"column" }}>
        {item.members.map((member, idx) =>
          member.image?.url ? (
            <img
              key={idx}
              src={member.image.url}
              alt={member.image.altText || "member"}
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

    {/* Alt Text list */}
    <DataTableRow>
      <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
        {item.members.map((member, idx) => (
          <li key={idx}>{member.image?.altText || "-"}</li>
        ))}
      </ul>
    </DataTableRow>

    {/* Actions */}
    <DataTableRow className='nk-tb-col-tools'>
      <ul className='nk-tb-actions gx-1'>
        <li onClick={() => toggleModal(item)}>
          <TooltipComponent
            tag='a'
            id={`edit-${item._id}`}
            containerClassName='btn btn-trigger btn-icon'
            icon='edit-alt-fill'
            direction='top'
            text='Edit'
          />
        </li>
        {/* <li onClick={() => confirmDelete(item._id)}>
          <TooltipComponent
            tag='a'
            id={`delete-${item._id}`}
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
                {editId ? "Edit Members" : "Add Members"}
              </h5>
              <Form className='row gy-4' onSubmit={handleSubmit(onSubmit)}>
                {formData.members.map((member, index) => (
                  <div key={index} className='border p-3 rounded mb-3'>
                    <Col md='12'>
                      <label className='form-label'>Name <span className="danger">*</span></label>
                      <input
                        className='form-control'
                        value={member.name}
                        onChange={(e) =>
                          handleMemberChange(index, "name", e.target.value)
                        }
                      />
                      {!member.name?.trim() && (
                        <span className='invalid'>Name is required</span>
                      )}
                    </Col>

                    <Col md='12'>
                      <label className='form-label'>Description <span className="danger">*</span></label>
                      <ReactQuill
                        theme='snow'
                        value={member.description}
                        onChange={(value) =>
                          handleMemberChange(index, "description", value)
                        }
                      />
                      {!member.description?.trim() && (
                        <span className='invalid'>Description is required</span>
                      )}
                    </Col>

                    <Col md='12'>
                      <label className='form-label'>Image (Max 500KB) <span className="danger">*</span></label>
                      <input
                        type='file'
                        accept='image/*'
                        onChange={(e) => handleImageChange(e, index)}
                        className='form-control'
                      />
                      {!member.image && (
                        <span className='invalid'>Image is required</span>
                      )}
                      {member.image && (
                        <div
                          style={{
                            position: "relative",
                            display: "inline-block",
                            marginTop: "10px",
                          }}
                        >
                          <img
                            src={
                              member.image instanceof File
                                ? URL.createObjectURL(member.image)
                                : member.image?.url || ""
                            }
                            alt={member.altText}
                            width={100}
                            style={{
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
                              height: "20px",
                              width: "20px",
                              padding: 0,
                              lineHeight: 1,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                            }}
                            onClick={() =>
                              handleMemberChange(index, "image", null)
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
                        value={member.altText}
                        onChange={(e) =>
                          handleMemberChange(index, "altText", e.target.value)
                        }
                      />
                      {!member.altText?.trim() && (
                        <span className='invalid'>Alt Text is required</span>
                      )}
                    </Col>

                    <Button
                    type="button"
                      color='danger'
                      size='sm'
                      onClick={() => removeMember(index)}
                      className='mt-2'
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
                    type='button'
                    onClick={addMember}
                  >
                    Add More Member
                  </Button>
                </div>

                <Col size='12' className='mt-3'>
                  <Button
                    color='primary'
                    size='md'
                    type='submit'
                    disabled={submitting}
                  >
                    {editId ? "Update" : "Add"}
                    {submitting && <Spinner className='spinner-xs' />}
                  </Button>
                  <Button
                    className='ms-2'
                    onClick={() => toggleModal()}
                    type='button'
                  >
                    Cancel
                  </Button>
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
                  const res = await deleteRequest(`/vidhyavanam/leadership-team/${deleteId}`);
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

export default VidhyavanamLeadership;
