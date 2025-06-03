import React, { useContext, useState } from "react";
import { useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import the Quill styles
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
import {
  deleteRequest,
  getRequest,
  postFormData,
  putRequest,
} from "../../api/api";
import { Spinner } from "reactstrap";

const OurGoal = () => {
  const [data, setData] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    additionalItems: [{ images: [], title: "", description: "" }],
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    reset,
    control,
  } = useForm();

  const fetchData = async () => {
    const res = await getRequest("/scholarships/our-goal");
    if (res.success) {
      console.log("goal created:", res.data);

      setData(res.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleModal = (editItem = null) => {
    if (editItem) {
      setEditId(editItem._id);
      const normalizedItems = editItem.goals.map((goal) => ({
        title: goal.title,
        description: goal.description,
        images: goal.images || [], // Ensure array exists
      }));

      const editData = {
        title: editItem.title,
        description: editItem.description,
        additionalItems: normalizedItems,
      };
  

      setFormData(editData);
      reset(editData);
    } else {
      resetForm();
      setEditId(null);
    }
    setModal(!modal);
  };

  const resetForm = () => {
    const empty = {
      title: "",
      description: "",
      additionalItems: [{ title: "", description: "", images: [] }],
    };
    setFormData(empty);
    reset(empty); // ✅ sync with form
  };
  

  const selectorDeleteUser = () => {
    const updated = data.filter((item) => !item.checked);
    setData(updated);
  };

  const handleFileChange = (e, index) => {
    const files = Array.from(e.target.files);
    // if (file && file.size > 512000) {
    //   alert("Image must be less than 500KB");
    //   return;
    // }
    const updatedItems = [...formData.additionalItems];
    updatedItems[index].images = files;
    setFormData({ ...formData, additionalItems: updatedItems });
  };

  const handleInputChange = (value, index, field) => {
    if (index !== undefined) {
      const updatedItems = [...formData.additionalItems];
      updatedItems[index][field] = value;
      setFormData({ ...formData, additionalItems: updatedItems });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const addAdditionalItem = () => {
    setFormData({
      ...formData,
      additionalItems: [
        ...formData.additionalItems,
        { image: null, title: "", description: "" },
      ],
    });
  };

  const removeAdditionalItem = (index) => {
    const updatedItems = formData.additionalItems.filter((_, i) => i !== index);
    setFormData({ ...formData, additionalItems: updatedItems });
  };

  const onSubmit = async () => {
    setSubmitting(true);

    const isValid = await trigger();
    if (!isValid) return;

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("description", formData.description);

    const goalsToSend = formData.additionalItems.map((item, index) => {
      if (item.images?.length) {
        item.images.forEach((file) => {
          payload.append("goalImages", file); // Multiple files for all goals
        });
      }
      return {
        title: item.title,
        description: item.description,
      };
    });

    payload.append("goals", JSON.stringify(goalsToSend));

    if (formData.image instanceof File) {
      payload.append("image", formData.image);
    }

    let response;
    if (editId !== null) {
      response = await putRequest(`/scholarships/our-goal/${editId}`, payload);
    } else {
      response = await postFormData("/scholarships/our-goal", payload);
    }

    if (response.success) {
      const res = await getRequest("/scholarships/our-goal");
      if (res.success) setData(res.data);
      toggleModal();
      setSubmitting(false);
    }
  };

  useEffect(() => {
    register("description", { required: true });

    formData.additionalItems.forEach((_, index) => {
      register(`additionalItems.${index}.description`, {
        required: "Additional Description is required",
      });
    });
  }, [register, formData.additionalItems]);

  const handleDelete = async (id) => {
    const res = await deleteRequest(`/scholarships/our-goal/${id}`);
    if (res.success) {
      const updated = data.filter((item) => item._id !== id);
      setData(updated);
    }
  };

  return (
    <>
      <Head title='Our Goal Content' />
      <Content>
        <BlockHead size='sm'>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag='h3' page>
                Our Goal Section
              </BlockTitle>
              <BlockDes className='text-soft'>
                <p>Manage your Our Goal content items here.</p>
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
                <span>Main Title</span>
              </DataTableRow>
              <DataTableRow>
                <span>Main Description</span>
              </DataTableRow>
              <DataTableRow>
                <span>Additional Image</span>
              </DataTableRow>
              <DataTableRow>
                <span>Additional Title</span>
              </DataTableRow>
              <DataTableRow>
                <span>Additional Description</span>
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
              <DataTableItem key={item.id}>
                <DataTableRow>
                  <span>{item.title}</span>
                </DataTableRow>
                <DataTableRow>
                  <span
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                </DataTableRow>
                {item.goals?.map((additional, index) => (
                  <>
                    <DataTableRow key={index}>
                      {additional.images && additional.images.length > 0
                        ? additional.images.map((img, imgIndex) => (
                            <img
                              key={imgIndex}
                              src={img.url}
                              alt={img.altText || `Image ${imgIndex + 1}`}
                              width={60}
                              height={40}
                              style={{
                                objectFit: "cover",
                                marginRight: "5px",
                                borderRadius: "4px",
                              }}
                            />
                          ))
                        : "No image"}
                    </DataTableRow>
                    <DataTableRow>
                      <span>{additional.title}</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: additional.description,
                        }}
                      />
                    </DataTableRow>
                  </>
                ))}
                <DataTableRow className='nk-tb-col-tools'>
                  <ul className='nk-tb-actions gx-1'>
                    <li
                      className='nk-tb-action-hidden'
                      onClick={() => toggleModal(item)}
                    >
                      <TooltipComponent
                        tag='a'
                        containerClassName='btn btn-trigger btn-icon'
                        id={"edit" + item.id}
                        icon='edit-alt-fill'
                        direction='top'
                        text='Edit'
                      />
                    </li>
                    <li onClick={() => handleDelete(item._id)}>
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
                {editId ? "Edit Our Goal Content" : "Add Our Goal Content"}
              </h5>
              <Form className='row gy-4' onSubmit={handleSubmit(onSubmit)}>
                <Col md='12'>
                  <label className='form-label'>Main Title</label>
                  <input
                    className='form-control'
                    {...register("title", { required: "Required" })}
                    name='title'
                    value={formData.title}
                    onChange={(e) =>
                      handleInputChange(e.target.value, undefined, "title")
                    }
                  />
                  {errors.title && (
                    <span className='invalid'>{errors.title.message}</span>
                  )}
                </Col>
                <Col md='12'>
                  <label className='form-label'>Main Description</label>
                  <Controller
                    name='description'
                    control={control}
                    defaultValue={formData.description || ""}
                    rules={{ required: "Main Description is required" }}
                    render={({ field }) => (
                      <ReactQuill
                        theme='snow'
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value); // this updates the form state
                          handleInputChange(value, undefined, "description"); // optional: keep your local state updated
                        }}
                      />
                    )}
                  />
                  {errors.description && (
                    <span className='invalid'>
                      {errors.description.message}
                    </span>
                  )}
                </Col>

                {formData.additionalItems.map((additional, index) => (
                  <React.Fragment key={index}>
                    <div key={index} className='border rounded p-3 mb-3'>
                      <Col md='12'>
                        <label className='form-label'>Additional Title</label>
                        <input
                          className='form-control'
                          {...register(`additionalItems.${index}.title`, {
                            required: "Additional Title is required",
                          })}
                          value={additional.title}
                          onChange={(e) =>
                            handleInputChange(e.target.value, index, "title")
                          }
                        />
                        {errors?.additionalItems?.[index]?.title && (
                          <span className='invalid'>
                            {errors.additionalItems[index].title.message}
                          </span>
                        )}
                      </Col>

                      <Col md='12'>
                        <label className='form-label'>
                          Additional Description
                        </label>
                        <Controller
                          name={`additionalItems.${index}.description`}
                          control={control}
                          defaultValue={additional.description || ""}
                          rules={{
                            required: "Additional Description is required",
                          }}
                          render={({ field }) => (
                            <ReactQuill
                              theme='snow'
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value);
                                handleInputChange(value, index, "description");
                              }}
                            />
                          )}
                        />
                        {errors?.additionalItems?.[index]?.description && (
                          <span className='invalid'>
                            {errors.additionalItems[index].description.message}
                          </span>
                        )}
                      </Col>

                      <Col md='12'>
                        <label className='form-label'>
                          Additional Image (Max 500KB)
                        </label>
                        <input
                          className='form-control'
                          type='file'
                          accept='image/*'
                          multiple
                          onChange={(e) => handleFileChange(e, index)}
                        />
                        <div className='d-flex flex-wrap mt-2'>
                          {additional.images &&
                            additional.images.map((img, imgIdx) => (
                              <div
                                key={imgIdx}
                                style={{
                                  position: "relative",
                                  display: "inline-block",
                                  margin: "5px",
                                }}
                              >
                                <img
                                  src={
                                    img instanceof File
                                      ? URL.createObjectURL(img)
                                      : typeof img === "string"
                                      ? img
                                      : img?.url || ""
                                  }
                                  alt={`Preview ${imgIdx + 1}`}
                                  style={{
                                    width: "80px",
                                    height: "80px",
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                    border: "1px solid #ccc",
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
                                    padding: "0",
                                    height: "20px",
                                    width: "20px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    zIndex: 2,
                                    boxShadow: "0 0 6px rgba(0,0,0,0.3)",
                                  }}
                                  onClick={() => {
                                    const updated = [
                                      ...formData.additionalItems,
                                    ];
                                    updated[index].images.splice(imgIdx, 1);
                                    setFormData({
                                      ...formData,
                                      additionalItems: updated,
                                    });
                                  }}
                                >
                                  <Icon name='cross' />
                                </Button>
                              </div>
                            ))}
                        </div>
                      </Col>

                      <Button
                        color='danger'
                        size='sm'
                        onClick={() => removeAdditionalItem(index)}
                      >
                        Remove Item
                      </Button>
                    </div>
                  </React.Fragment>
                ))}
                <div>
                  <Button
                    color='primary'
                    size='sm'
                    onClick={addAdditionalItem}
                    style={{ width: "auto" }}
                  >
                    Add More Items
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

export default OurGoal;
