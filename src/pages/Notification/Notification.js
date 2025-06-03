import React, { useContext, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import ReactQuill styles
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
import { toast } from "react-toastify";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "../../api/api";
import { Spinner } from "reactstrap";

const Notification = () => {
  const [data, setData] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [contentErrors, setContentErrors] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    contents: [""],
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
    const res = await getRequest("/scholarships/notification");
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
      description: "",
      contents: [""],
    });
    reset();
  };

  const selectorDeleteUser = () => {
    const updated = data.filter((item) => !item.checked);
    setData(updated);
  };

  const validateContents = () => {
    const errors = formData.contents.map((content) => content.trim() === "");
    setContentErrors(errors);
    return !errors.includes(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleContentChange = (index, value) => {
    setFormData((prevState) => {
      const updatedContents = [...prevState.contents];
      if (updatedContents[index] !== value) {
        updatedContents[index] = value;
        return { ...prevState, contents: updatedContents };
      }
      return prevState; // No update if the value is the same
    });
  };

  const addContent = () => {
    setFormData({ ...formData, contents: [...formData.contents, ""] });
  };

  const removeContent = (index) => {
    const updatedContents = formData.contents.filter((_, i) => i !== index);
    setFormData({ ...formData, contents: updatedContents });
  };

  const onSubmit = async () => {
    setSubmitting(true);

    const contentValidation = formData.contents.map(
      (content) => content.trim() === ""
    );
    const isValidContents = !contentValidation.includes(true);
    const isValidDescription = formData.description.trim() !== "";

    setContentErrors(contentValidation);

    if (!isValidContents || !isValidDescription) return;

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        contents: formData.contents,
      };

      let res;
      if (editId !== null) {
        res = await putRequest(`/scholarships/notification/${editId}`, payload);
        if (res.success) {
          const updated = data.map((item) =>
            item._id === editId ? res.data : item
          );
          setData(updated);
          toast.success("Notification updated successfully!");
        } else {
          toast.error(res.message || "Update failed");
          return;
        }
      } else {
        res = await postRequest("/scholarships/notification", payload);
        if (res.success) {
          setData([res.data, ...data]);
          toast.success("Notification added successfully!");
        } else {
          toast.error(res.message || "Creation failed");
          return;
        }
      }
      toggleModal();
      setSubmitting(false);
    } catch (err) {
      toast.error("An error occurred while submitting the form.");
    }
  };

  const onDeleteClick = async (id) => {
    const res = await deleteRequest(`/scholarships/notification/${id}`);
    if (res.success) {
      setData(data.filter((item) => item._id !== id));
      toast.success("Deleted successfully!");
    } else {
      toast.error(res.message || "Failed to delete");
    }
  };

  return (
    <>
      <Head title='Notification Content' />
      <Content>
        <BlockHead size='sm'>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag='h3' page>
                Notification Section
              </BlockTitle>
              <BlockDes className='text-soft'>
                <p>Manage your Notification content items here.</p>
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
                <DataTableRow>
                  <span>Title</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Description</span>
                </DataTableRow>
                <DataTableRow>
                  <span>Contents</span>
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
                    <span
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  </DataTableRow>
                  <DataTableRow>
                    <ul>
                      {item.contents.map((content, index) => (
                        <li
                          key={index}
                          dangerouslySetInnerHTML={{ __html: content }}
                        />
                      ))}
                    </ul>
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

                      <li onClick={() => onDeleteClick(item._id)}>
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
              <h5 className='title'>
                {editId
                  ? "Edit Notification Content"
                  : "Add Notification Content"}
              </h5>
              <Form className='row gy-4' onSubmit={handleSubmit(onSubmit)}>
                <Col md='12'>
                  <label className='form-label'>Title</label>
                  <input
                    className='form-control'
                    {...register("title", { required: "Title is required" })}
                    name='title'
                    value={formData.title}
                    onChange={handleInputChange}
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
                  {formData.description.trim() === "" && (
                    <span className='invalid'>Description is required</span>
                  )}
                </Col>

                {formData.contents.map((content, index) => (
                  <div key={index} className='border rounded p-3 mb-3'>
                    <Col md='12'>
                      <label className='form-label'>Content {index + 1}</label>
                      <ReactQuill
                        theme='snow'
                        value={content}
                        onChange={(value) => handleContentChange(index, value)}
                      />
                      {contentErrors[index] && (
                        <span className='invalid'>
                          Content {index + 1} is required
                        </span>
                      )}
                    </Col>
                    <Button
                      color='danger'
                      size='sm'
                      onClick={() => removeContent(index)}
                      className='mt-2'
                    >
                      Remove Content
                    </Button>
                  </div>
                ))}
                <div>
                  <Button
                    color='primary'
                    size='sm'
                    style={{ width: "auto" }}
                    onClick={addContent}
                  >
                    Add More Content
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
      </Content>
    </>
  );
};

export default Notification;
