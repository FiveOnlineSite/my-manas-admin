// MasterMetaData.js
import React, { useEffect, useState } from "react";
import {
  Block, BlockHead, BlockBetween, BlockHeadContent, BlockTitle, BlockDes,
  Button, Icon
} from "../../components/Component";
import { Spinner, Modal, ModalBody, Form, Col, UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem, } from "reactstrap";
import { useForm } from "react-hook-form";
import Content from "../../layout/content/Content";
import Head from "../../layout/head/Head";
import { getRequest, postFormData, putRequest, deleteRequest } from "../../api/api";
import { toast } from "react-toastify";
import { DataTableHead, DataTableRow, DataTableItem } from "../../components/table/DataTable";
import TooltipComponent from "../../components/tooltip/Tooltip";


const MasterMetaData = () => {
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState(false);
const [deleteId, setDeleteId] = useState(null);
const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, setValue } = useForm();

  const [formData, setFormData] = useState({
    page: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const res = await getRequest("/mastermetadata");
    if (res.success) setData(res.data);
    else toast.error("Failed to fetch meta data.");
    setLoading(false);
  };

  const toggleModal = (item = null) => {
    if (item) {
      setEditId(item._id);
      setFormData(item);
      Object.entries(item).forEach(([key, val]) => setValue(key, val));
    } else {
      setEditId(null);
      resetForm();
    }
    setModal(!modal);
  };

  const resetForm = () => {
    setFormData({ page: "", metaTitle: "", metaDescription: "", metaKeywords: "" });
    reset();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = async () => {
  setSubmitting(true);
  const formPayload = new FormData();
  for (let key in formData) formPayload.append(key, formData[key]);

  const res = editId
    ? await putRequest(`/mastermetadata/${editId}`, formPayload)
    : await postFormData("/mastermetadata", formPayload);

  if (res.success) {
    fetchData();
    toast.success(`${editId ? "Updated" : "Created"} successfully!`);
    toggleModal();
  } else {
    toast.error(`${editId ? "Update" : "Creation"} failed.`);
  }
  setSubmitting(false);
};

  const confirmDelete = (id) => {
  setDeleteId(id);
  setConfirmModal(true);
};

const onDeleteClick = async () => {
  const res = await deleteRequest(`/mastermetadata/${deleteId}`);
  if (res.success) {
    toast.success("Deleted successfully!");
    fetchData();
  } else {
    toast.error("Failed to delete.");
  }
  setConfirmModal(false);
  setDeleteId(null);
};

  return (
    <>
      <Head title="Master Meta Data" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag="h3" page>Meta Data Management</BlockTitle>
              <BlockDes><p>Manage meta tags for pages.</p></BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              {/* <Button color="primary" className="btn-icon" onClick={() => toggleModal()}>
                <Icon name="plus" />
              </Button> */}
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          {loading ? (
            <div className="text-center p-5"><Spinner color="primary" size="lg" /></div>
          ) : (
            <div className="nk-tb-list is-separate is-medium mb-3">
              <DataTableHead>
                <DataTableRow><span>Page</span></DataTableRow>
                <DataTableRow><span>Meta Title</span></DataTableRow>
                <DataTableRow><span>Meta Description</span></DataTableRow>
                <DataTableRow><span>Meta Keywords</span></DataTableRow>
                <DataTableRow className='nk-tb-col-tools text-end'>
                  <UncontrolledDropdown>
                    <DropdownToggle
                      color='transparent'
                      className='btn btn-icon btn-trigger me-n1'
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
                  <DataTableRow><span>{item.page}</span></DataTableRow>
                  <DataTableRow><span>{item.metaTitle}</span></DataTableRow>
                  <DataTableRow><span>{item.metaDescription}</span></DataTableRow>
                  <DataTableRow><span>{item.metaKeywords}</span></DataTableRow>
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
  isOpen={confirmModal}
  toggle={() => setConfirmModal(false)}
  className="modal-dialog-centered"
  size="sm"
>
  <ModalBody className="text-center">
    <h5 className="mt-3">Confirm Deletion</h5>
    <p>Are you sure you want to delete this meta data entry?</p>
    <div className="d-flex justify-content-center gap-2 mt-4">
      <Button color="danger" className="p-2" onClick={onDeleteClick}>
        OK
      </Button>
      <Button color="light" className="p-2" onClick={() => setConfirmModal(false)}>
        Cancel
      </Button>
    </div>
  </ModalBody>
</Modal>

        <Modal isOpen={modal} toggle={toggleModal} className="modal-dialog-centered" size="lg">
          <ModalBody>
            <a href="#cancel" onClick={(e) => { e.preventDefault(); toggleModal(); }} className="close">
              <Icon name="cross-sm" />
            </a>
            <div className="p-2">
              <h5 className="title">{editId ? "Edit Meta Data" : "Add Meta Data"}</h5>
              <Form className="row gy-4" onSubmit={handleSubmit(onSubmit)}>
                <Col md="12">
                  <label className="form-label">Page <span className="danger">*</span></label>
                  <select name="page" className="form-control" value={formData.page} onChange={handleInputChange} disabled={!!editId}>
                    <option value="">Select Page</option>
                    <option value="home">home</option>
                    <option value="about">about</option>
                    <option value="scope">scope</option>
                    <option value="scholarship">scholarship</option>
                    <option value="institutions">institutions</option>
                    <option value="academy">academy</option>
                    <option value="vidhyavanam">vidhyavanam</option>
                    <option value="contact">contact</option>
                    <option value="donate">donate</option>
                    <option value="news">news</option>
                  </select>
                </Col>
                <Col md="12">
                  <label className="form-label">Meta Title <span className="danger">*</span></label>
                  <input type="text" className="form-control" name="metaTitle" value={formData.metaTitle} onChange={handleInputChange} />
                </Col>
                <Col md="12">
                  <label className="form-label">Meta Description <span className="danger">*</span></label>
                  <textarea className="form-control" name="metaDescription" value={formData.metaDescription} onChange={handleInputChange} />
                </Col>
                <Col md="12">
                  <label className="form-label">Meta Keywords <span className="danger">*</span></label>
                  <input type="text" className="form-control" name="metaKeywords" value={formData.metaKeywords} onChange={handleInputChange} />
                </Col>
                <Col size="12">
  <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
    <li>
      <Button color="primary" size="md" type="submit" disabled={submitting}>
        {editId ? "Update" : "Add"}
        {submitting && <Spinner className="spinner-xs ms-2" />}
      </Button>
    </li>
    <li>
      <a
        href="#cancel"
        onClick={(e) => {
          e.preventDefault();
          toggleModal();
        }}
        className="link link-light"
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

export default MasterMetaData;
