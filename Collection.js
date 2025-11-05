import React, { useContext, useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Input,
  Row,
} from "reactstrap";
import axios from "axios";
import DataTable from "react-data-table-component";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import DeleteModal from "../../Components/Common/DeleteModal";
import FormsHeader from "../../Components/Common/FormsModalHeader";
import FormsFooter from "../../Components/Common/FormAddFooter";
import FormUpdateFooter from "../../Components/Common/FormUpdateFooter";
import { toast, ToastContainer } from "react-toastify";
import { createCollection, deleteCollection, getCollectionById, updateCollection } from "../../functions/Master/collectionMasterFunc";
import LoadingOverlay from "../../Components/Common/LoadingOverlay";
import { MenuContext } from "../../context/MenuContext";

const initialState = {
    title: "",
    image: "",
    description: "",
    isActive: false,
};

const Collection = () => {
  const { currentPagePermissions } = useContext(MenuContext);
  const [values, setValues] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [filter, setFilter] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [collections, setCollections] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [query, setQuery] = useState("");

  const [_id, set_Id] = useState("");
  const [remove_id, setRemove_id] = useState("");

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log("no errors");
    }
  }, [formErrors, isSubmit]);

  const [modal_list, setmodal_list] = useState(false);
  const tog_list = () => {
    setmodal_list(!modal_list);
    setValues(initialState);
    setSelectedFile(null);
    setImagePreview(null);
    setIsSubmit(false);
  };

  const [modal_delete, setmodal_delete] = useState(false);
  const tog_delete = (_id) => {
    setmodal_delete(!modal_delete);
    setRemove_id(_id);
  };

  const [modal_edit, setmodal_edit] = useState(false);

  const handleTog_edit = (_id) => {
    setmodal_edit(!modal_edit);
    setIsSubmit(false);
    setSelectedFile(null);
    setImagePreview(null);
    set_Id(_id);
    setIsLoading(true);
    getCollectionById(_id)
      .then((res) => {
        setValues({
          ...values,
          title: res.data.data.title,
          image: res.data.data.image || "",
          description: res.data.data.description || "",
          isActive: res.data.data.isActive,
        });
        // Set preview to existing image
        if (res.data.data.image) {
          setImagePreview(res.data.data.image);
        }
      })
      .catch((err) => {
        console.log(err);
      }).finally(() => {
        setIsLoading(false);
      });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCheck = (e) => {
    setValues({ ...values, [e.target.name]: e.target.checked });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only image files (JPEG, PNG, GIF, WEBP) are allowed!");
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should not exceed 5MB!");
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      setIsUploading(true);
      const response = await axios.post("/api/auth/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.isOk) {
        return response.data.data.url;
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image!");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitCancel = () => {
    setmodal_list(false);
    setValues(initialState);
    setSelectedFile(null);
    setImagePreview(null);
    setIsSubmit(false);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setFormErrors({});

    // Check if file is selected
    if (!selectedFile && !values.image) {
      setFormErrors({ image: "Image is required!" });
      setIsSubmit(true);
      return;
    }

    let errors = validate(values);
    setFormErrors(errors);
    setIsSubmit(true);

    if (Object.keys(errors).length === 0) {
      try {
        setIsLoading(true);

        // Upload image if a new file is selected
        let imageUrl = values.image;
        if (selectedFile) {
          imageUrl = await uploadImage(selectedFile);
        }

        const dataToSend = {
          ...values,
          image: imageUrl,
        };

        const res = await createCollection(dataToSend);
        if (res.data.isOk) {
          toast.success("Collection Added Successfully!");
          setmodal_list(!modal_list);
          setValues(initialState);
          setSelectedFile(null);
          setImagePreview(null);
          fetchCollections();
        }
      } catch (error) {
        console.log("Error creating collection:", error);
        toast.error("Failed to create collection!");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    setIsDeleteLoading(true);
    deleteCollection(remove_id)
      .then((res) => {
        setmodal_delete(!modal_delete);
        toast.success("Collection Removed Successfully!");
        fetchCollections();
      })
      .catch((err) => {
        console.log(err);
      }).finally(() => {
        setIsDeleteLoading(false);
      });
  };

  const handleDeleteClose = (e) => {
    e.preventDefault();
    setmodal_delete(false);
  };

  const handleUpdateCancel = (e) => {
    setmodal_edit(false);
    setIsSubmit(false);
    setFormErrors({});
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Check if file is selected or image exists
    if (!selectedFile && !values.image) {
      setFormErrors({ image: "Image is required!" });
      setIsSubmit(true);
      return;
    }

    let errors = validate(values);
    setFormErrors(errors);
    setIsSubmit(true);

    if (Object.keys(errors).length === 0) {
      try {
        setIsLoading(true);

        // Upload image if a new file is selected
        let imageUrl = values.image;
        if (selectedFile) {
          imageUrl = await uploadImage(selectedFile);
        }

        const dataToSend = {
          ...values,
          image: imageUrl,
        };

        const res = await updateCollection(_id, dataToSend);
        setmodal_edit(!modal_edit);
        fetchCollections();
        setSelectedFile(null);
        setImagePreview(null);
        toast.success("Collection Updated Successfully!");
      } catch (error) {
        console.log(error);
        toast.error("Failed to update collection!");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const validate = (values) => {
    const errors = {};

    if (values.title === "") {
      errors.title = "Title is required!";
    }

    return errors;
  };


  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(100);
  const [pageNo, setPageNo] = useState(0);
  const [column, setcolumn] = useState();
  const [sortDirection, setsortDirection] = useState();

  const handleSort = (column, sortDirection) => {
    setcolumn(column.sortField);
    setsortDirection(sortDirection);
  };

  useEffect(() => {
    fetchCollections();
  }, [pageNo, perPage, column, sortDirection, query, filter]);

  const fetchCollections = async () => {
    setLoading(true);
    let skip = (pageNo - 1) * perPage;
    if (skip < 0) {
      skip = 0;
    }

    await axios
      .post(
        `/api/auth/listbyparams/collection`,
        {
          skip: skip,
          per_page: perPage,
          sorton: column,
          sortdir: sortDirection,
          match: query,
          isActive: filter,
        },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(
                    "token"
                )}`,
            },
        }
      )
      .then((response) => {
        if (response.data.data.length > 0) {
          let res = response.data.data[0];
          setLoading(false);
          setTotalRows(res.count);
          setCollections(res.data);
        } else {
            setCollections([]);
        }
      });

    setLoading(false);
  };

  const handlePageChange = (page) => {
    setPageNo(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
  };

  const handleFilter = (e) => {
    setPageNo(1)
    setFilter(e.target.checked);
  };

  const col = [
    {
      name: "Sr No",
      selector: (row, index) => index + 1,
      sortable: true,
      maxWidth: "20px",
    },
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
      sortField: "title",
      minWidth: "150px",
    },
    {
      name: "Description",
      selector: (row) => row.description || "-",
      sortable: true,
      sortField: "description",
      minWidth: "200px",
    },
    {
      name: "Image",
      selector: (row) => {
        return row.image ? (
          <img
            src={row.image}
            alt={row.title}
            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
            onError={(e) => { e.target.style.display = 'none' }}
          />
        ) : (
          <span className="text-muted">No Image</span>
        );
      },
      minWidth: "100px",
    },
    {
      name: "Status",
      selector: (row) => (row.isActive ? "Active" : "Inactive"),
      minWidth: "150px",
    },
    {
      name: "Action",
      selector: (row) => {
        return (
          <React.Fragment>
            <div className="d-flex gap-2">
              {currentPagePermissions.edit && (
              <div className="edit">
                <button
                  className="btn btn-sm btn-success edit-item-btn "
                  data-bs-toggle="modal"
                  data-bs-target="#showModal"
                  onClick={() => handleTog_edit(row._id)}
                >
                  Edit
                </button>
              </div>
              )}
              {currentPagePermissions.delete && (
              <div className="remove">
                <button
                  className="btn btn-sm btn-danger remove-item-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteRecordModal"
                  onClick={() => tog_delete(row._id)}
                >
                  Remove
                </button>
              </div>
              )}
              {!currentPagePermissions.edit && !currentPagePermissions.delete && (
                <span className="text-muted">No actions available</span>
              )}
            </div>
          </React.Fragment>
        );
      },
      sortable: false,
      minWidth: "180px",
    },
  ];

  document.title = `Collection Master | Shree Balaji Trade-Wing`;

  return (
    <React.Fragment>
      <ToastContainer />
      <div className="page-content">
        {isDeleteLoading && <LoadingOverlay fullScreen />}
        <Container fluid>
          <BreadCrumb
            maintitle="Master"
            title="Collection"
            pageTitle="Master"
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <FormsHeader
                    formName="Collection"
                    filter={filter}
                    handleFilter={handleFilter}
                    tog_list={tog_list}
                    setQuery={setQuery}
                    showAddButton={currentPagePermissions.write}
                  />
                </CardHeader>

                <CardBody>
                  <div id="customerList">
                    <div className="table-responsive table-card mt-1 mb-1 text-right">
                      <DataTable
                        columns={col}
                        data={collections}
                        progressPending={loading}
                        sortServer
                        onSort={(column, sortDirection, sortedRows) => {
                          handleSort(column, sortDirection);
                        }}
                        pagination
                        paginationServer
                        paginationTotalRows={totalRows}
                        paginationPerPage={100}
                        paginationRowsPerPageOptions={[
                          50, 100, 200, 300, totalRows
                      ]}
                        onChangeRowsPerPage={handlePerRowsChange}
                        onChangePage={handlePageChange}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={modal_list}
        toggle={() => {
          tog_list();
        }}
        centered
      >
        <ModalHeader
          className="bg-light p-3"
          toggle={() => {
            setmodal_list(false);
            setIsSubmit(false);
          }}
        >
          Add Collection
        </ModalHeader>
        <form>
          {isLoading && <LoadingOverlay />}
          <ModalBody>
            <div className="form-floating mb-3">
              <Input
                type="text"
                required
                name="title"
                value={values.title}
                onChange={handleChange}
              />
              <Label>
                Title <span className="text-danger">*</span>
              </Label>
              {isSubmit && (
                <p className="text-danger">{formErrors.title}</p>
              )}
            </div>
            <div className="mb-3">
              <Label>
                Image <span className="text-danger">*</span>
              </Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              {isSubmit && formErrors.image && (
                <p className="text-danger">{formErrors.image}</p>
              )}
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Collection Preview"
                    style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'contain', border: '1px solid #ddd', padding: '5px', borderRadius: '4px' }}
                  />
                </div>
              )}
              {isUploading && (
                <div className="mt-2">
                  <span className="text-info">Uploading image...</span>
                </div>
              )}
            </div>
            <div className="form-floating mb-3">
              <Input
                type="textarea"
                name="description"
                value={values.description}
                onChange={handleChange}
                style={{ height: '100px' }}
              />
              <Label>
                Description
              </Label>
            </div>
            <div className="mb-3">
              <Input
                type="checkbox"
                className="form-check-input"
                name="isActive"
                checked={values.isActive}
                onChange={handleCheck}
              />
              <Label className="form-check-label ms-1">Is Active</Label>
            </div>
          </ModalBody>
          <ModalFooter>
            <FormsFooter
              handleSubmit={handleClick}
              handleSubmitCancel={handleSubmitCancel}
            />
          </ModalFooter>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={modal_edit}
        toggle={() => {
          handleTog_edit();
        }}
        centered
      >
        <ModalHeader
          className="bg-light p-3"
          toggle={() => {
            setmodal_edit(false);
            setIsSubmit(false);
          }}
        >
          Edit Collection
        </ModalHeader>
        <form>
          {isLoading && <LoadingOverlay />}
          <ModalBody>
            <div className="form-floating mb-3">
              <Input
                type="text"
                required
                name="title"
                value={values.title}
                onChange={handleChange}
              />
              <Label>
                Title <span className="text-danger">*</span>
              </Label>
              {isSubmit && (
                <p className="text-danger">{formErrors.title}</p>
              )}
            </div>
            <div className="mb-3">
              <Label>
                Image <span className="text-danger">*</span>
              </Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              {isSubmit && formErrors.image && (
                <p className="text-danger">{formErrors.image}</p>
              )}
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Collection Preview"
                    style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'contain', border: '1px solid #ddd', padding: '5px', borderRadius: '4px' }}
                  />
                </div>
              )}
              {isUploading && (
                <div className="mt-2">
                  <span className="text-info">Uploading image...</span>
                </div>
              )}
            </div>
            <div className="form-floating mb-3">
              <Input
                type="textarea"
                name="description"
                value={values.description}
                onChange={handleChange}
                style={{ height: '100px' }}
              />
              <Label>
                Description
              </Label>
            </div>
            <div className="mb-3">
              <Input
                type="checkbox"
                className="form-check-input"
                name="isActive"
                checked={values.isActive}
                onChange={handleCheck}
              />
              <Label className="form-check-label ms-1">Is Active</Label>
            </div>
          </ModalBody>

          <ModalFooter>
            <FormUpdateFooter
              handleUpdate={handleUpdate}
              handleUpdateCancel={handleUpdateCancel}
            />
          </ModalFooter>
        </form>
      </Modal>

      <DeleteModal
        show={modal_delete && !isDeleteLoading}
        handleDelete={handleDelete}
        toggle={handleDeleteClose}
        setmodal_delete={setmodal_delete}
      />
    </React.Fragment>
  );
};

export default Collection;
