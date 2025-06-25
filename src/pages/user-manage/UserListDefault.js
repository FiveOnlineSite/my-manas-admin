import React, { useContext, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  DropdownItem,
  Spinner,
  Modal,
  ModalBody,
} from "reactstrap";
import EditModal from "./EditModal";
import AddModal from "./AddModal";
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Button,
  Icon,
} from "../../components/Component";
import {
  DataTableHead,
  DataTableItem,
  DataTableRow,
} from "../../components/table/DataTable";
import TooltipComponent from "../../components/tooltip/Tooltip";
import { PreviewAltCard } from "../../components/preview/Preview";
import PaginationComponent from "../../components/pagination/Pagination";
import Content from "../../layout/content/Content";
import Head from "../../layout/head/Head";
import {
  deleteRequest,
  getRequest,
  postFormData,
  putRequest,
} from "../../api/api";
import { toast } from "react-toastify";
import { set } from "react-hook-form";

const HomeBanner = () => {
  const [data, setData] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [sm, updateSm] = useState(false);
  const [modal, setModal] = useState({ edit: false, add: false });
  const [editId, setEditedId] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(10);

  const defaultFormData = {
    title: "",
    description: "",
    buttonText: "",
    buttonLink: "",
    desktopImage: null,
    desktopAlt: "",
    mobileImage: null,
    mobileAlt: "",
  };

  const [formData, setFormData] = useState({ ...defaultFormData });
  const [editFormData, setEditFormData] = useState({ ...defaultFormData });

  const fetchBannerData = async () => {
    setLoading(true); // Show loader

    try {
      const result = await getRequest("/home/banner");
      // console.log(result, "resultfgrgfg");

      setData(result.data);
    } catch (error) {
      // console.error("Failed to fetch banners:", error);
    }
    setLoading(false); // Show loader

  };

  useEffect(() => {
    fetchBannerData();
    // setData((prev) =>
    //   prev.map((item) => ({
    //     ...item,
    //     checked: false,
    //   }))
    // );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onSelectChange = (e, id) => {
    const updated = data.map((item) =>
      item.id === id ? { ...item, checked: e.currentTarget.checked } : item
    );
    setData(updated);
  };

  const resetForm = () => {
    setFormData({ ...defaultFormData });
  };

  const closeModal = () => {
    setModal({ add: false });
    resetForm();
  };

  // console.log(data, "datagfgfg");

  const closeEditModal = () => {
    setModal({ edit: false });
    resetForm();
  };

  const onFormSubmit = async (submitData) => {
    // if (submitting) return;
    setSubmitting(true);
    const formDetail = new FormData();
    formDetail.append("title", formData.title);
    formDetail.append("description", formData.description);
    formDetail.append("buttonText", formData.buttonText);
    formDetail.append("buttonLink", formData.buttonLink);
    formDetail.append("desktopImage", formData.desktopImage);
    formDetail.append("desktopAlt", formData.desktopAlt);
    formDetail.append("mobileImage", formData.mobileImage);
    formDetail.append("mobileAlt", formData.mobileAlt);

    const res = await postFormData("/home/banner", formData);

    if (res.success) {
      toast.success("banner added successfully!");
      fetchBannerData();
      // console.log("Banner created:", res.data);
    } else {
      // console.error("Error creating banner:", res.message);
      toast.error("something went wrong. please try again.");
    }
    setSubmitting(false);
    resetForm();
    closeModal();
  };

  const onEditClick = (item) => {
    // const item = data.find((d) => d.id === id);
    if (item) {
      // Ensure images are not nullified on edit open
      setEditFormData(item);
      setModal({ edit: true });
      setEditedId(item._id);
    }
  };

  const onEditSubmit = async () => {
    const formDetail = new FormData();
    formDetail.append("title", editFormData.title);
    formDetail.append("description", editFormData.description);
    formDetail.append("buttonText", editFormData.buttonText);
    formDetail.append("buttonLink", editFormData.buttonLink);
    if (editFormData.desktopImage)
      formDetail.append("desktopImage", editFormData.desktopImage);
    formDetail.append("desktopAlt", editFormData.desktopAlt);
    if (editFormData.mobileImage)
      formDetail.append("mobileImage", editFormData.mobileImage);
    formDetail.append("mobileAlt", editFormData.mobileAlt);

    const res = await putRequest(`/home/banner/${editId}`, formDetail);
    // console.log("Banner updated:", res.data);

    if (res.success) {
      toast.success("banner updated successfully!");
      fetchBannerData();
      closeEditModal();
    } else {
      // console.error("Error editing banner:", res.message);
      toast.error("something went wrong. please try again.");
    }
    setSubmitting(false);
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setConfirmModal(true);
  };
  
  const onDeleteClick = async (id) => {
    if (!id) return;

    const res = await deleteRequest(`/home/banner/${id}`);

    if (res.success) {
      fetchBannerData(); // Refresh data
      toast.success("Banner deleted successfully!");
    } else {
      toast.error("Failed to delete banner. Please try again.");
    }
  };

  const selectorDeleteUser = () => {
    const updated = data.filter((item) => !item.checked);
    setData(updated);
  };

  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <React.Fragment>
      <Head title='Content Manager' />
      <Content>
        <BlockHead size='sm'>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag='h3' page>
                Banner Items
              </BlockTitle>
              <BlockDes className='text-soft'>
                <p>You have total {data.length} Banner items.</p>
              </BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className='toggle-wrap nk-block-tools-toggle'>
                <Button
                  className={`btn-icon btn-trigger toggle-expand me-n1 ${sm ? "active" : ""
                    }`}
                  onClick={() => updateSm(!sm)}
                >
                  <Icon name='menu-alt-r' />
                </Button>
                <div
                  className='toggle-expand-content'
                  style={{ display: sm ? "block" : "none" }}
                >
                  <ul className='nk-block-tools g-3'>
                    <li className='nk-block-tools-opt'>
                      {/* <Button
                        color='primary'
                        className='btn-icon'
                        onClick={() => setModal({ add: true })}
                      >
                        <Icon name='plus' />
                      </Button> */}
                    </li>
                  </ul>
                </div>
              </div>
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
                  <span className='sub-text'>Title</span>
                </DataTableRow>
                <DataTableRow>
                  <span className='sub-text'>Description</span>
                </DataTableRow>
                <DataTableRow>
                  <span className='sub-text'>Button Text</span>
                </DataTableRow>
                <DataTableRow>
                  <span className='sub-text'>Button Link</span>
                </DataTableRow>
                <DataTableRow>
                  <span className='sub-text'>Desktop Images</span>
                </DataTableRow>
                <DataTableRow>
                  <span className='sub-text'>Mobile Images</span>
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

              {currentItems.map((item) => (
                <DataTableItem key={item.id}>
                  <DataTableRow>
                    <span className='tb-lead'>{item.title}</span>
                  </DataTableRow>
                  <DataTableRow>
                    <div dangerouslySetInnerHTML={{ __html: item.description }} />
                  </DataTableRow>
                  <DataTableRow>
                    <span>{item.buttonText}</span>
                  </DataTableRow>
                  <DataTableRow>
                    <a
                      href={item.buttonLink}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {item.buttonLink}
                    </a>
                  </DataTableRow>
                  <DataTableRow>
                    {item?.images?.desktop?.url ? (
                      <img
                        src={item?.images?.desktop?.url}
                        alt={item?.images?.desktop?.url || "No Alt Text"}
                        width={60}
                        height={40}
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <span>No image</span>
                    )}
                    {!item?.images?.desktop?.altText && (
                      <span className='text-danger'>Missing Alt</span>
                    )}
                  </DataTableRow>
                  <DataTableRow>
                    {item?.images?.mobile?.url ? (
                      <img
                        src={item?.images?.mobile?.url}
                        alt={item.mobileAlt || "No Alt Text"}
                        width={60}
                        height={40}
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <span>No image</span>
                    )}
                    {!item?.images?.mobile?.altText && (
                      <span className='text-danger'>Missing Alt</span>
                    )}
                  </DataTableRow>
                  <DataTableRow className='nk-tb-col-tools'>
                    <ul className='nk-tb-actions gx-1'>
                      <li
                        className='nk-tb-action-hidden'
                        onClick={() => onEditClick(item)}
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
                      {/* <li
                      
                        onClick={() => confirmDelete(item._id)}
                      >
                        <TooltipComponent
                          tag='a'
                          containerClassName='btn btn-trigger btn-icon '
                          id={"delete" + item.id}
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

          <PreviewAltCard>
            {data.length > 0 ? (
              <PaginationComponent
                itemPerPage={itemPerPage}
                totalItems={data.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            ) : (
              <div className='text-center'>
                <span className='text-silent'>No content available</span>
              </div>
            )}
          </PreviewAltCard>
        </Block>

        {/* Modals */}
        <AddModal
          modal={modal.add}
          formData={formData}
          setFormData={setFormData}
          closeModal={closeModal}
          onSubmit={onFormSubmit}
          submitting={submitting}
        />
        <EditModal
          modal={modal.edit}
          formData={editFormData}
          setFormData={setEditFormData}
          closeModal={closeEditModal}
          onSubmit={onEditSubmit}
        />
        <Modal
          isOpen={confirmModal}
          toggle={() => setConfirmModal(false)}
          className='modal-dialog-centered'
          size='sm'
        >
          <ModalBody className='text-center'>
            <h5 className='mt-3'>Confirm Deletion</h5>
            <p>Are you sure you want to delete this banner item?</p>
            <div className='d-flex justify-content-center gap-2 mt-4'>
              <Button
                color='danger'
                className='p-3'
                onClick={async () => {
                  const res = await deleteRequest(`/home/banner/${deleteId}`);
                  if (res.success) {
                    toast.success("Deleted successfully");
                    fetchBannerData();
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

    </React.Fragment>
  );
};

export default HomeBanner;
