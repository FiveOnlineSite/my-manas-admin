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
import { deleteRequest, getRequest, postRequest, putRequest } from "../../api/api";
import { toast } from "react-toastify";
import { Spinner } from "reactstrap";


const ScholarshipOverview = () => {
  const [data, setData] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    description: "", // Default to an empty string
  });

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    defaultValues: {
      description: "", // Default to an empty string
    },
    // Validation rules
    mode: "onBlur", // Triggers validation on blur
    criteriaMode: "all", // Show all validation errors
    resolver: (data) => {
      const errors = {};
      if (!data.description) {
        errors.description = { message: "Description is required" };
      }
      return { values: data, errors };
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true)
    const res = await getRequest("/scholarships/overview");
    if (res.success) {
      setData(res.data);
    }
    setLoading(false)
  };


  const toggleModal = (editItem = null) => {
    if (editItem) {
      setEditId(editItem._id);
      reset({ description: editItem.description || "" });// Ensure description is always a string
    } else {
      resetForm();
      setEditId(null);
    }
    setModal(!modal);
  };

  const resetForm = () => {
    setFormData({
      description: "",
    });
    reset();
  };

  const selectorDeleteUser = () => {
    const updated = data.filter((item) => !item._checked);
    setData(updated);
  };

  const onSubmit = async (data) => {
    setSubmitting(true);

    let res;
    if (editId) {
      res = await putRequest(`/scholarships/overview/${editId}`, {
        description: data.description,
      });
    } else {
      res = await postRequest("/scholarships/overview", {
        description: data.description,
      });
    }

    if (res.success) {
      fetchData();
      toast.success("Saved successfully!");
      toggleModal();
      setSubmitting(false);

    } else {
    }
  };

  const onDeleteClick = async (id) => {
    const res = await deleteRequest(`/scholarships/overview/${id}`);
    if (res.success) {
      fetchData();
      toast.success("Deleted successfully!");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <>
      <Head title='Scholarship Overview Content' />
      <Content>
        <BlockHead size='sm'>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag='h3' page>
                Scholarship Overview Section
              </BlockTitle>
              <BlockDes className='text-soft'>
                <p>Manage your Scholarship Overview content items here.</p>
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
                  <span>Description</span>
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
                    <div
                      dangerouslySetInnerHTML={{
                        __html: item.description,
                      }}
                    />
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
                  ? "Edit Scholarship Overview Content"
                  : "Add Scholarship Overview Content"}
              </h5>
              <Form className='row gy-4' onSubmit={handleSubmit(onSubmit)}>
                <Col md='12'>
                  <label className='form-label'>Description</label>
                  <Controller
                    name='description'
                    control={control}
                    defaultValue={formData.description || ""}
                    render={({ field }) => (
                      <ReactQuill
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                      />
                    )}
                  />
                  {errors.description && (
                    <span className='invalid'>
                      {errors.description.message}
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

export default ScholarshipOverview;
