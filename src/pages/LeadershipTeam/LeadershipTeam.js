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

const LeadershipTeam = () => {
  const [data, setData] = useState([]);
  const [submitting, setSubmitting] = useState(false);
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

  const { handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getRequest("/academy/leadership-team");
    if (res.success) {
      setData(res.data);
    } else {
      toast.error(res.message || "Failed to fetch data");
    }
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
    payload.append("members", JSON.stringify(formData.members));

    formData.members.forEach((member) => {
      if (member.image instanceof File) {
        payload.append("files", member.image);
      }
    });

    try {
      let res;
      if (editId) {
        res = await putRequest(`/academy/leadership-team/${editId}`, payload);
      } else {
        res = await postFormData("/academy/leadership-team", payload);
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
    }
  };

  const onDeleteClick = async (id) => {
    const res = await deleteRequest(`/academy/leadership-team/${id}`);
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

            {data.length > 0 &&
              data[0]?.members?.map((member, index) => (
                <DataTableItem key={index}>
                  <DataTableRow>
                    <span>{member.name}</span>
                  </DataTableRow>
                  <DataTableRow>
                    <span
                      dangerouslySetInnerHTML={{ __html: member.description }}
                    />
                  </DataTableRow>
                  <DataTableRow>
                    {member.image?.url ? (
                      <img
                        src={member.image.url}
                        alt={member.image.altText}
                        width={60}
                        height={40}
                      />
                    ) : (
                      "No image"
                    )}
                  </DataTableRow>
                  <DataTableRow>
                    <span>{member.image?.altText}</span>
                  </DataTableRow>
                  <DataTableRow className='nk-tb-col-tools'>
                    <ul className='nk-tb-actions gx-1'>
                      <li onClick={() => toggleModal(data[0])}>
                        <TooltipComponent
                          tag='a'
                          id={`edit-${index}`}
                          containerClassName='btn btn-trigger btn-icon'
                          icon='edit-alt-fill'
                          direction='top'
                          text='Edit'
                        />
                      </li>
                      <li onClick={() => onDeleteClick(data[0]._id)}>
                        <TooltipComponent
                          tag='a'
                          id={`delete-${index}`}
                          containerClassName='btn btn-trigger btn-icon'
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
                {editId ? "Edit Members" : "Add Members"}
              </h5>
              <Form className='row gy-4' onSubmit={handleSubmit(onSubmit)}>
                {formData.members.map((member, index) => (
                  <div key={index} className='border p-3 rounded mb-3'>
                    <Col md='12'>
                      <label className='form-label'>Name</label>
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
                      <label className='form-label'>Description</label>
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
                      <label className='form-label'>Image (Max 500KB)</label>
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
                      <label className='form-label'>Alt Text</label>
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
                    color='primary'
                    size='sm'
                    type='button'
                    onClick={addMember}
                    style={{ width: "auto" }}
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
      </Content>
    </>
  );
};

export default LeadershipTeam;
