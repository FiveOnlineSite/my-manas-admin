import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
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
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
} from "../../api/api";
import { Spinner } from "reactstrap";

const ApplicationDocument = () => {
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [editId, setEditId] = useState(null);
  const [contentErrors, setContentErrors] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
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
    const res = await getRequest("/scholarships/application-content");
    if (res.success) {
      setData(res.data);
    }
    setLoading(false)
  };

  const toggleModal = (item = null) => {
    if (item) {
      setEditId(item._id);
      setFormData(item);
    } else {
      resetForm();
    }
    setModal(!modal);
  };

  const resetForm = () => {
    setFormData({ title: "", contents: [""] });
    setEditId(null);
    reset();
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContentChange = (index, value) => {
    const newContents = [...formData.contents];
    newContents[index] = value;
    setFormData({ ...formData, contents: newContents });
  };

  const addContent = () => {
    setFormData({ ...formData, contents: [...formData.contents, ""] });
  };

  const removeContent = (index) => {
    const newContents = formData.contents.filter((_, i) => i !== index);
    setFormData({ ...formData, contents: newContents });
  };

  const onSubmit = async () => {
    setSubmitting(true);

    const contentValidation = formData.contents.map((c) => c.trim() === "");
    const isValidContents = !contentValidation.includes(true);

    setContentErrors(contentValidation);

    if (!formData.title || !isValidContents) return;

    const payload = {
      title: formData.title,
      contents: formData.contents,
    };

    let res;
    if (editId) {
      res = await putRequest(
        `/scholarships/application-content/${editId}`,
        payload
      );
    } else {
      res = await postRequest("/scholarships/application-content", payload);
    }

    if (res.success) {
      fetchData();
      toast.success(`Successfully ${editId ? "updated" : "created"}`);
      toggleModal();
      setSubmitting(false);
    } else {
      toast.error(res.message || "Operation failed");
    }
  };

  const onDelete = async (id) => {
    const res = await deleteRequest(`/scholarships/application-content/${id}`);
    if (res.success) {
      setData(data.filter((item) => item._id !== id));
      toast.success("Deleted");
    } else {
      toast.error(res.message || "Delete failed");
    }
  };

  return (
    <>
      <Head title='Application Documents' />
      <Content>
        <BlockHead size='sm'>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag='h3'>Application Documents</BlockTitle>
              <BlockDes>
                <p>Manage required application documents here.</p>
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
                  <span>Contents</span>
                </DataTableRow>
                <DataTableRow className='nk-tb-col-tools text-end'></DataTableRow>
              </DataTableHead>

              {data.map((item) => (
                <DataTableItem key={item._id}>
                  <DataTableRow>
                    <span>{item.title}</span>
                  </DataTableRow>
                  <DataTableRow>
                    <ul>
                      {item.contents.map((c, i) => (
                        <li key={i} dangerouslySetInnerHTML={{ __html: c }} />
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
                          id={`edit-${item._id}`}
                          containerClassName='btn btn-trigger btn-icon'
                          icon='edit-alt-fill'
                          text='Edit'
                        />
                      </li>
                      <li onClick={() => onDelete(item._id)}>
                        <TooltipComponent
                          tag='a'
                          id={`delete-${item._id}`}
                          containerClassName='btn btn-trigger btn-icon'
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
            <div className='p-2'>
              <h5 className='title'>
                {editId ? "Edit" : "Add"} Application Document
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

                {formData.contents.map((content, index) => (
                  <Col md='12' key={index}>
                    <label className='form-label'>Content {index + 1}</label>
                    <ReactQuill
                      theme='snow'
                      value={content}
                      onChange={(value) => handleContentChange(index, value)}
                    />
                    {contentErrors[index] && (
                      <span className='invalid'>Content is required</span>
                    )}
                    <Button
                      size='sm'
                      color='danger'
                      onClick={() => removeContent(index)}
                      className='mt-2'
                    >
                      Remove
                    </Button>
                  </Col>
                ))}

                <div>
                  <Button
                    color='primary'
                    size='sm'
                    onClick={addContent}
                    style={{ width: "auto" }}
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

export default ApplicationDocument;
