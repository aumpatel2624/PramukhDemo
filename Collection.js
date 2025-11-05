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

  const [collections, setCollections] = useState([]);

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

  const handleSubmitCancel = () => {
    setmodal_list(false);
    setValues(initialState);
    setIsSubmit(false);
  };

  const handleClick = (e) => {
    e.preventDefault();
    setFormErrors({});
    let errors = validate(values);
    setFormErrors(errors);
    setIsSubmit(true);
    const dataToSend = {
        ...values,
    }
    if (
      Object.keys(errors).length === 0
    ) {
        setIsLoading(true);
        createCollection(dataToSend)
        .then((res) => {
          if (res.data.isOk) {
            toast.success("Collection Added Successfully!");
            setmodal_list(!modal_list);
            setValues(initialState);
            fetchCollections();
          }
        })
        .catch((error) => {
          console.log("Error creating collection:", error);
        }).finally(() => {
          setIsLoading(false);
        });
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
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    let erros = validate(values);
    setFormErrors(erros);
    setIsSubmit(true);

    if (Object.keys(erros).length === 0) {
      setIsLoading(true);
      updateCollection(_id, values)
        .then((res) => {
          setmodal_edit(!modal_edit);
          fetchCollections();
          toast.success("Collection Updated Successfully!");
        })
        .catch((err) => {
          console.log(err);
        }).finally(() => {
          setIsLoading(false);
        });
    }
  };

  const validate = (values) => {
    const errors = {};

    if (values.title === "") {
      errors.title = "Title is required!";
    }

    if (values.image === "") {
      errors.image = "Image is required!";
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
            <div className="form-floating mb-3">
              <Input
                type="text"
                required
                name="image"
                value={values.image}
                onChange={handleChange}
              />
              <Label>
                Image <span className="text-danger">*</span>
              </Label>
              {isSubmit && (
                <p className="text-danger">{formErrors.image}</p>
              )}
              {values.image && (
                <div className="mt-2">
                  <img
                    src={values.image}
                    alt="Collection Preview"
                    style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'contain' }}
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
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
            <div className="form-floating mb-3">
              <Input
                type="text"
                required
                name="image"
                value={values.image}
                onChange={handleChange}
              />
              <Label>
                Image <span className="text-danger">*</span>
              </Label>
              {isSubmit && (
                <p className="text-danger">{formErrors.image}</p>
              )}
              {values.image && (
                <div className="mt-2">
                  <img
                    src={values.image}
                    alt="Collection Preview"
                    style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'contain' }}
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
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
