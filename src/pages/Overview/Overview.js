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
import { Controller, useForm } from "react-hook-form";
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

const Overview = () => {
  const [data, setData] =  useState([]);;
  const [submitting, setSubmitting] = useState(false);

  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description1: "",
    description2: "",
    bodName: "",
    bodImage: null,
    bodSignature: null,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    trigger,
    reset,
    control,
    setError,
    clearErrors,
  } = useForm();

  // Fetch Overview entries
  const fetchData = async () => {
    const res = await getRequest("/about/overview");
    if (res.success) {
      setData(res.data);
    } else {
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    register("description1", { required: "Description1 is required" });
    register("description2", { required: "Description2 is required" });
    register("bodName", { required: "bodName is required" });
    register("bodImage", { required: "BOD Image is required" });
    register("bodSignature", { required: "BOD Signature is required" });
  }, [register]);

  const toggleModal = (item = null) => {
    clearErrors();
    if (item) {
      setEditId(item._id);

      // ✅ Update react-hook-form
      reset({
        title: item.title || "",
        description1: item.description1 || "",
        description2: item.description2 || "",
        bodName: item.bodName || "",
        bodImage: item.bodImage || null,
        bodSignature: item.bodSignature || null,
      });

      // ✅ Also update formData for image previews
      setFormData({
        title: item.title || "",
        description1: item.description1 || "",
        description2: item.description2 || "",
        bodName: item.bodName || "",
        bodImage: item.bodImage || null,
        bodSignature: item.bodSignature || null,
      });
    } else {
      setEditId(null);
      resetForm();
    }
    setModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description1: "",
      description2: "",
      bodName: "",
      bodImage: null,
      bodSignature: null,
    });
    reset({
      title: "",
      description1: "",
      description2: "",
      bodName: "",
      bodImage: null,
      bodSignature: null,
    });
    reset();
  };

  const selectorDeleteUser = () => {
    const updated = data.filter((item) => !item.checked);
    setData(updated);
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 512000) {
      setError(field, {
        type: "manual",
        message: "File must be less than 500KB",
      });
      setValue(field, null);
      setFormData((prev) => ({ ...prev, [field]: null })); // clear preview
      return;
    }

    clearErrors(field);
    setValue(field, file, { shouldValidate: true });
    setFormData((prev) => ({ ...prev, [field]: file })); //
  };

  const handleRemoveFile = (field) => {
    setValue(field, null, { shouldValidate: true });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageRemove = (field) => {
    setFormData({ ...formData, [field]: null });
    setValue(field, null, { shouldValidate: true });
    trigger(field);
  };

  const onSubmit = async (formValues) => {
    // Validate BOD images required
    setSubmitting(true);

    if (!formValues.bodImage && !formData.bodImage?.url) {
      setError("bodImage", {
        type: "manual",
        message: "BOD Image is required",
      });
      return;
    }
    if (!formValues.bodSignature) {
      setError("bodSignature", {
        type: "manual",
        message: "BOD Signature is required",
      });
      return;
    }

    const formPayload = new FormData();
    formPayload.append("title", formValues.title);
    formPayload.append("description1", formValues.description1);
    formPayload.append("description2", formValues.description2);
    formPayload.append("bodName", formValues.bodName);

    if (formValues.bodImage instanceof File) {
      formPayload.append("bodImage", formValues.bodImage);
    }

    if (formValues.bodSignature instanceof File) {
      formPayload.append("bodSignature", formValues.bodSignature);
    }

    try {
      let res;
      if (editId) {
        res = await putRequest(`/about/overview/${editId}`, formPayload);
        if (res.success) {
          const updated = data.map((d) => (d._id === editId ? res.data : d));
          setData(updated);
          toast.success("Updated successfully!");
        } else {
          toast.error("Update failed.");
          return;
        }
      } else {
        res = await postFormData("/about/overview", formPayload);
        if (res.success) {
          setData([res.data, ...data]);
          toast.success("Created successfully!");
        } else {
          toast.error("Creation failed.");
          return;
        }
      }
      resetForm();
      setModal(false);
      setSubmitting(false);
    } catch {
      toast.error("An error occurred.");
    }
  };

  const onDeleteClick = async (id) => {
    const res = await deleteRequest(`/about/overview/${id}`);
    if (res.success) {
      setData(data.filter((item) => item._id !== id));
      toast.success("Deleted successfully!");
    } else {
      toast.error("Failed to delete.");
    }
  };

  return (
    <>
      <Head title='Overview Content' />
      <Content>
        <BlockHead size='sm'>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag='h3' page>
                Overview Section
              </BlockTitle>
              <BlockDes className='text-soft'>
                <p>Manage your Overview content items here.</p>
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
                <span>Title</span>
              </DataTableRow>
              <DataTableRow>
                <span>Description 1</span>
              </DataTableRow>
              <DataTableRow>
                <span>Description 2</span>
              </DataTableRow>
              <DataTableRow>
                <span>BOD Name</span>
              </DataTableRow>
              <DataTableRow>
                <span>BOD Image</span>
              </DataTableRow>
              <DataTableRow>
                <span>BOD Signature</span>
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
                            // Add delete functionality if needed
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
                  <div
                    dangerouslySetInnerHTML={{ __html: item.description1 }}
                  />
                </DataTableRow>
                <DataTableRow>
                  <div
                    dangerouslySetInnerHTML={{ __html: item.description2 }}
                  />
                </DataTableRow>
                <DataTableRow>
                  <span>{item.bodName}</span>
                </DataTableRow>
                <DataTableRow>
                  {item.bodImage?.url ? (
                    <img
                      src={item.bodImage.url}
                      alt='BOD'
                      width={60}
                      height={60}
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    "No Image"
                  )}
                </DataTableRow>
                <DataTableRow>
                  {item.bodSignature?.url ? (
                    <img
                      src={item.bodSignature.url}
                      alt='Signature'
                      width={60}
                      height={40}
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    "No Signature"
                  )}
                </DataTableRow>
                <DataTableRow className='nk-tb-col-tools'>
                  <ul className='nk-tb-actions gx-1'>
                    <li onClick={() => toggleModal(item)}>
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
                {editId ? "Edit Overview Content" : "Add Overview Content"}
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
                  <label className='form-label'>Description 1</label>
                  <Controller
                    control={control}
                    name='description1'
                    rules={{ required: "Required" }}
                    render={({ field }) => (
                      <ReactQuill
                        theme='snow'
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.description1 && (
                    <span className='invalid'>
                      {errors.description1.message}
                    </span>
                  )}
                </Col>

                <Col md='12'>
                  <label className='form-label'>Description 2</label>
                  <Controller
                    control={control}
                    name='description2'
                    rules={{ required: "Required" }}
                    render={({ field }) => (
                      <ReactQuill
                        theme='snow'
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.description2 && (
                    <span className='invalid'>
                      {errors.description2.message}
                    </span>
                  )}
                </Col>

                <Col md='12'>
                  <label className='form-label'>BOD Name</label>
                  <input
                    className='form-control'
                    {...register("bodName", { required: "Required" })}
                    name='bodName'
                    value={formData.bodName}
                    onChange={handleInputChange}
                  />
                  {errors.bodName && (
                    <span className='invalid'>{errors.bodName.message}</span>
                  )}
                </Col>
                <Col md='12'>
                  <label className='form-label'>
                    BOD Image Upload (Max 500KB)
                  </label>
                  <input
                    className='form-control'
                    type='file'
                    accept='image/*'
                    onChange={(e) => handleFileChange(e, "bodImage")}
                  />
                  {formData.bodImage && (
                    <div
                      style={{
                        position: "relative",
                        display: "inline-block",
                        marginTop: "10px",
                      }}
                    >
                      <img
                        src={
                          formData.bodImage instanceof File
                            ? URL.createObjectURL(formData.bodImage)
                            : formData.bodImage?.url
                        }
                        alt='BOD'
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
                        onClick={() => handleImageRemove("bodImage")}
                      >
                        <Icon name='cross' />
                      </Button>
                    </div>
                  )}
                  {errors.bodImage && (
                    <span className='invalid'>{errors.bodImage.message}</span>
                  )}
                </Col>
                <Col md='12'>
                  <label className='form-label'>
                    BOD Signature Upload (Max 500KB)
                  </label>
                  <input
                    className='form-control'
                    type='file'
                    accept='image/*'
                    onChange={(e) => handleFileChange(e, "bodSignature")}
                  />
                  {formData.bodSignature && (
                    <div
                      style={{
                        position: "relative",
                        display: "inline-block",
                        marginTop: "10px",
                      }}
                    >
                      <img
                        src={
                          formData.bodSignature instanceof File
                            ? URL.createObjectURL(formData.bodSignature)
                            : formData.bodSignature?.url
                        }
                        alt='Signature'
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
                        onClick={() => handleImageRemove("bodSignature")}
                      >
                        <Icon name='cross' />
                      </Button>
                    </div>
                  )}
                  {errors.bodSignature && (
                    <span className='invalid'>
                      {errors.bodSignature.message}
                    </span>
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

export default Overview;
