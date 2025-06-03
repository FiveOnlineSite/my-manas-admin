import React, { useContext, useEffect, useState } from "react";
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
import { toast } from "react-toastify";
import { Spinner } from "reactstrap";

const OurValues = () => {
  const [data, setData] =  useState([]);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [iconErrors, setIconErrors] = useState([]);
  const [valuesErrors, setValuesErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    values: [{ title: "", description: "", valueIcon: null }],
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
    trigger,
  } = useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getRequest("/about/our-values");
    if (res.success) {
      setData(res.data);
    }
  };

  const toggleModal = (item = null) => {
    setIconErrors([]);
    setValuesErrors([]);

    if (item) {
      setFormData({
        title: item.title || "",
        description: item.description || "",
        values: item.values?.length
          ? item.values.map((v) => ({
              title: v.title,
              description: v.description,
              valueIcon: v.icon?.url || null,
            }))
          : [{ title: "", description: "", valueIcon: null }],
      });
      setEditId(item._id);

      setValue("description", item.description || "");
    } else {
      resetForm();
    }

    setModal(!modal);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      values: [{ title: "", description: "", valueIcon: null }],
    });
    reset();
    setEditId(null);
  };

  const selectorDeleteUser = () => {
    const updated = data.filter((item) => !item.checked);
    setData(updated);
  };

  const handleValueChange = (index, field, value) => {
    const updatedValues = [...formData.values];
    updatedValues[index][field] = value;
    setFormData({ ...formData, values: updatedValues });
  };

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value });
    setValue("description", value); // set value for react-hook-form
    trigger("description"); // trigger validation on change
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file && file.size > 102400) {
      setValue(`values[${index}].valueIcon`, null, { shouldValidate: true });
    } else {
      handleValueChange(index, "valueIcon", file);
    }
  };

  const handleImageRemove = (index) => {
    handleValueChange(index, "valueIcon", null); // Clear the image
    setValue(`values[${index}].valueIcon`, null, { shouldValidate: true });
  };

  const addValue = () => {
    setFormData({
      ...formData,
      values: [
        ...formData.values,
        { title: "", description: "", valueIcon: null },
      ],
    });
  };

  const validateValues = () => {
    const errs = formData.values.map((item) => ({
      title: !item.title,
      description: !item.description,
      valueIcon: !item.valueIcon,
    }));
    console.log(errs, "iuhih");
    setValuesErrors(errs);

    // Also validate iconErrors have no strings (errors)
    const hasIconError = iconErrors.some((e) => e);
    return (
      errs.every((e) => !e.title && !e.description && !e.valueIcon) &&
      !hasIconError
    );
  };

  const removeValue = (index) => {
    const updatedValues = formData.values.filter((_, i) => i !== index);
    setFormData({ ...formData, values: updatedValues });
  };

  const onSubmit = async () => {
    setSubmitting(true);

    console.log(formData, "formData12232321");
    if (!validateValues()) return;

    const formPayload = new FormData();
    formPayload.append("title", formData.title);
    formPayload.append("description", formData.description);
    formPayload.append(
      "values",
      JSON.stringify(
        formData.values.map(({ title, description }) => ({
          title,
          description,
        }))
      )
    );

    // Append icons separately (key: valueIcons)
    formData.values.forEach((v, i) => {
      if (v.valueIcon instanceof File) {
        formPayload.append(`valueIcons`, v.valueIcon);
      }
    });

    try {
      let res;
      if (editId) {
        res = await putRequest(`/about/our-values/${editId}`, formPayload);
        if (res.success) {
          const updated = data.map((d) => (d._id === editId ? res.data : d));
          setData(updated);
          toast.success("Updated successfully!");
        } else {
          toast.error("Update failed.");
          return;
        }
      } else {
        res = await postFormData("/about/our-values", formPayload);
        if (res.success) {
          setData([res.data, ...data]);
          toast.success("Created successfully!");
        } else {
          toast.error("Creation failed.");
          return;
        }
      }

      toggleModal();
      setSubmitting(false);
    } catch {
      toast.error("An error occurred.");
    }
  };

  const onDeleteClick = async (id) => {
    const res = await deleteRequest(`/about/our-values/${id}`);
    if (res.success) {
      setData(data.filter((item) => item._id !== id));
      toast.success("Deleted successfully!");
    } else {
      toast.error("Failed to delete.");
    }
  };

  return (
    <>
      <Head title='Our Values Content' />
      <Content>
        <BlockHead size='sm'>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag='h3' page>
                Our Values Section
              </BlockTitle>
              <BlockDes className='text-soft'>
                <p>Manage your Our Values content items here.</p>
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
                <span>Description</span>
              </DataTableRow>
              <DataTableRow>
                <span>Value Title</span>
              </DataTableRow>
              <DataTableRow>
                <span>Value Description</span>
              </DataTableRow>
              <DataTableRow>
                <span>Value Icon</span>
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
              <>
                {item.values.map((value, index) => (
                  <DataTableItem key={`${item.id}-${index}`}>
                    {index === 0 && (
                      <>
                        <DataTableRow rowSpan={item.values.length}>
                          <span>{item.title}</span>
                        </DataTableRow>
                        <DataTableRow rowSpan={item.values.length}>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: item.description,
                            }}
                          ></span>
                        </DataTableRow>
                      </>
                    )}
                    <DataTableRow>
                      <span>{value?.title}</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: value?.description,
                        }}
                      ></span>
                    </DataTableRow>
                    <DataTableRow>
                      {value?.icon?.url ? (
                        <img
                          src={value.icon.url}
                          alt='icon'
                          width={30}
                          height={30}
                          style={{ marginLeft: "10px" }}
                        />
                      ) : (
                        "No Icon"
                      )}
                    </DataTableRow>
                    {index === 0 && (
                      <DataTableRow
                        rowSpan={item.values.length}
                        className='nk-tb-col-tools'
                      >
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
                    )}
                  </DataTableItem>
                ))}
              </>
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
                {editId ? "Edit Our Values Content" : "Add Our Values Content"}
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
                    onChange={handleDescriptionChange}
                  />
                  {errors.description && (
                    <span className='invalid'>
                      {errors.description.message}
                    </span>
                  )}
                </Col>

                {formData.values.map((value, index) => (
                  <div key={index} className='border rounded p-3 mb-3'>
                    <Col md='12'>
                      <label className='form-label'>Value Title</label>
                      <input
                        className='form-control'
                        {...register(`values[${index}].title`, {
                          required: "Required",
                        })}
                        value={value.title}
                        onChange={(e) =>
                          handleValueChange(index, "title", e.target.value)
                        }
                      />
                    </Col>

                    <Col md='12'>
                      <label className='form-label'>Value Description</label>
                      <Controller
                        defaultValue={value.description || ""}
                        name={`values[${index}].description`} 
                        control={control}
                        rules={{ required: "Value Description is required" }}
                        render={({ field }) => (
                          <ReactQuill
                            theme='snow'
                            value={field.value || ""}
                            onChange={(val) => {
                              field.onChange(val);
                              handleValueChange(index, "description", val);
                            }}
                          />
                        )}
                      />

                      {errors?.values?.[index]?.description && (
                        <span className='invalid'>
                          {errors.values[index].description.message}
                        </span>
                      )}
                    </Col>

                    <Col md='12'>
                      <label className='form-label'>
                        Value Icon (Max 100KB)
                      </label>
                      <input
                        className='form-control'
                        type='file'
                        accept='image/*'
                        {...register(`values[${index}].valueIcon`, {
                          validate: {
                            required: () =>
                              typeof formData.values[index].valueIcon ===
                                "string" ||
                              formData.values[index].valueIcon instanceof File
                                ? true
                                : "Icon is required",
                            size: (file) =>
                              file && file.size > 102400
                                ? "Icon size must be less than 100KB"
                                : true,
                          },
                        })}
                        onChange={(e) => handleFileChange(e, index)}
                      />
                      {errors?.values?.[index]?.valueIcon && (
                        <span className='invalid'>
                          {errors.values[index].valueIcon.message}
                        </span>
                      )}
                    </Col>

                    {value.valueIcon && (
                      <div
                        style={{
                          position: "relative",
                          display: "inline-block",
                          marginTop: "10px",
                        }}
                      >
                        <img
                          src={
                            value.valueIcon instanceof File
                              ? URL.createObjectURL(value.valueIcon)
                              : typeof value.valueIcon === "string"
                              ? value.valueIcon
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
                          onClick={() => handleImageRemove(index)}
                        >
                          <Icon name='cross' />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                <div>
                  <Button
                    color='primary'
                    size='sm'
                    onClick={addValue}
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
                      <button
                        type='button'
                        onClick={() => toggleModal()}
                        className='link link-light'
                      >
                        Cancel
                      </button>
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

export default OurValues;
