import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";

import { AxiosError } from "axios";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { server } from "../common";

const initialValues = {
  title: "",
  description: "",
};

const swalalert = withReactContent(Swal);

const TaskManager = ({ role }) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setIsEditMode(false);
    setSelectedData(null);
    formik.resetForm();
    setShow(true);
  };

  const handleShowEdit = (data) => {
    setSelectedData(data);
    setIsEditMode(true);
    setShow(true);
  };

  useEffect(() => {
    getData();
    if (isEditMode && selectedData) {
      formik.setValues({
        title: selectedData.title,
        description: selectedData.description,
      });
    }
  }, [isEditMode, selectedData]);

  const getData = () => {
    server
      .get("/task/getalltasks", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          setData(response.data);
        }
      })
      .catch((error) => {
        if (error instanceof AxiosError && error.response?.data?.message)
          toast.error(error.response.data.message);
        else if (error.response?.data?.error) {
          toast.error(error.response.data.error);
        } else toast.error("Failed to connect to server");
      });
  };

  const deleteData = (data) => {
    swalalert
      .fire({
        title: "Delete Confirmation!",
        text: `Are You Sure That You Want To Delete ${data.title} ?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      })
      .then((swalObject) => {
        if (swalObject.isConfirmed) {
          server
            .delete(`/task/deletetask/${data._id}`, {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then((response) => {
              if (response.status === 200 || response.status === 201) {
                swalalert.fire("Deleted!", "Task has been deleted.", "success");
                getData();
              }
            })
            .catch((error) => {
              toast.error(error.response.data.message);
            });
        } else {
          swalalert.fire(
            "Cancelled",
            "Your task is safe :)",
            "error"
          );
        }
      });
  };

  const handleUpdate = (values) => {
    server
      .put(`/task/updatetask/${selectedData._id}`, values, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        formik.resetForm();
        getData();
        toast.success("Task Updated successfully");
        handleClose();
      })
      .catch((error) => {
        if (error.response?.data?.message)
          toast.error(error.response.data.message);
        else if (error.response?.data?.error) {
          toast.error(error.response.data.error);
        } else toast.error("Failed to connect to server");
      });
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({
      title: Yup.string().required("Enter a Task title"),
      description: Yup.string().required("Enter a Description"),
    }),
    onSubmit: (values) => {
      if (isEditMode) {
        handleUpdate(values);
      } else {
        server
          .post("/task/addtask", values, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            if (response.status === 200 || response.status === 201) {
              toast.success("Task Added successfully");
              formik.resetForm();
              handleClose();
              getData();
            }
          })
          .catch((error) => {
            if (error.response?.data?.message)
              toast.error(error.response.data.message);
            else if (error.response?.data?.error) {
              toast.error(error.response.data.error);
            } else toast.error("Failed to connect to server");
          });
      }
    },
  });

  return (
    <div className="container mt-5">
      <div className="d-flex position-relative mb-3 justify-content-center ">
        <h5 className="m-auto text-center">Previous Tasks</h5>
        <Button variant="contained" color="info" onClick={handleShow}>
          Add Task
        </Button>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              {isEditMode ? "Edit Task Details" : "Add Task Details"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={formik.handleSubmit}>
              <div className="form-outline mb-2">
                <TextField
                  name="title"
                  margin="dense"
                  type="text"
                  placeholder="Title"
                  variant="outlined"
                  label="Task Title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  fullWidth
                  required
                />
                {formik.errors.title && (
                  <p className="text-danger">{formik.errors.title}</p>
                )}
              </div>

              <div className="form-outline mb-2">
                <TextField
                  name="description"
                  margin="dense"
                  type="text"
                  placeholder="Task Description"
                  variant="outlined"
                  label="Task Description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  fullWidth
                  required
                />
                {formik.errors.description && (
                  <p className="text-danger">{formik.errors.description}</p>
                )}
              </div>

              <div className="pt-1 mb-2 ">
                <Button variant="contained" type="submit">
                  {isEditMode ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </div>
      <div className="container" style={{ overflow: "scroll" }}>
        <table className="table table-striped border">
          <thead>
            <tr>
              <th scope="col">Sr. No.</th>
              <th scope="col">Title</th>
              <th scope="col">Description</th>
              <th scope="col">Update</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item._id}>
                <th scope="row">{index + 1}</th>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>
                  <Button variant="contained" color="info" onClick={() => handleShowEdit(item)}>
                    <AiFillEdit />
                  </Button>
                </td>
                <td>
                  <Button variant="contained" color="error" onClick={() => deleteData(item)}>
                    <AiFillDelete />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskManager;
