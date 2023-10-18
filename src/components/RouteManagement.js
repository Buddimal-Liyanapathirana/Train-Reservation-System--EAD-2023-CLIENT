import React, { useEffect, useState } from "react";
import { getAxiosInstance } from "../utils/axios";
import { Routes } from "../utils/api";
import { Table, Pagination, Dropdown, Modal, Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedRouteForEdit, setSelectedRouteForEdit] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showCreateRouteModal, setShowCreateRouteModal] = useState(false);
  const [showEditRouteModal, setShowEditRouteModal] = useState(false);

  const [routeInfo, setRouteInfo] = useState({
    name: "",
    stations: [],
  });

  const tostConfig = {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  useEffect(() => {
    getRoutes();
  }, []);

  const getRoutes = async () => {
    try {
      const res = await getAxiosInstance().get(Routes.getAll);
      setRoutes(res.data.data);
    } catch (error) {
      const message = error.response
        ? error.response.data.message
        : "Unexpected error occurred. Please contact administrators.";
      console.error(message);
    }
  };

  const resetRouteObj = () => {
    setRouteInfo({
      name: "",
      stations: [],
    });
  };

  const handleCreateRoute = async () => {
    try {
      const res = await getAxiosInstance().post(Routes.create, routeInfo);
      handleCloseCreateRouteModal();
      resetRouteObj();
      await displayToast(res.data.message, res.data.success);
    } catch (error) {
      const message = error.response
        ? error.response.data.message
        : "Unexpected error occurred. Please contact administrators.";
      console.error(message);
    }
  };

  const handleDelete = async (name) => {
    try {
      const res = await getAxiosInstance().delete(Routes.delete + "/" + name);
      removeRoute(name);
      handleCloseModal();
      await displayToast(res.data.message, res.data.success);
    } catch (error) {
      const message = error.response
        ? error.response.data.message
        : "Unexpected error occurred. Please contact administrators.";
      await displayToast(message, false);
    }
  };

  const handleRowClick = (route) => {
    setSelectedRoute(route);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedRoute(null);
    setShowModal(false);
  };

  const handleCreateRouteClick = () => {
    setShowCreateRouteModal(true);
  };

  const handleCloseCreateRouteModal = () => {
    setShowCreateRouteModal(false);
  };

  const handleEditRouteClick = (oldRoute) => {
    setSelectedRouteForEdit(oldRoute.name);
    setRouteInfo({
      name: oldRoute.name,
      stations: oldRoute.stations.join(", "),
    });
    setShowEditRouteModal(true);
  };

  const handleCloseEditRouteModal = () => {
    setSelectedRouteForEdit(null);
    setShowEditRouteModal(false);
    resetRouteObj();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRouteInfo((prevRouteInfo) => ({
      ...prevRouteInfo,
      [name]: name === "stations" ? value.split(",") : value,
    }));
  };

  const removeRoute = (routeNameToRemove) => {
    const updatedRoutes = routes.filter((route) => route.name !== routeNameToRemove);
    setRoutes(updatedRoutes);
  };

  const displayToast = async (message, success) => {
    if (success) {
      toast.success(message, tostConfig);
    } else {
      toast.error(message, tostConfig);
    }
  };

  const displayRouteInfo = () => {
    return (
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "black" }}>Route Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRoute && (
            <div style={{ color: "black" }}>
              <p>
                <strong>Name:</strong> {selectedRoute.name}
              </p>
              <p>
                <strong>Stations:</strong> {selectedRoute.stations.join(", ")}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {localStorage.getItem("UserRole")==="BACK_OFFICER" &&<Button variant="danger" onClick={() => handleDelete(selectedRoute.name)}>
            Delete
          </Button>}
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const displayCreateRouteForm = () => {
    return (
      <Modal show={showCreateRouteModal} onHide={handleCloseCreateRouteModal}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "black" }}>Create Route</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: "black" }}>
          <Form>
            <Form.Group controlId="formRouteName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Route name"
                name="name"
                value={routeInfo.name}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formStations">
              <Form.Label>Stations</Form.Label>
              <Form.Control
                type="text"
                placeholder="Stations (comma-separated)"
                name="stations"
                value={routeInfo.stations.join(", ")}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCreateRouteModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateRoute}>
            Create Route
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const displayEditRouteForm = () => {
    return (
      <Modal show={showEditRouteModal} onHide={handleCloseEditRouteModal}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "black" }}>Edit Route</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: "black" }}>
          <Form>
            <Form.Group controlId="formRouteName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Route name"
                name="name"
                value={routeInfo.name}
                onChange={handleInputChange}
                disabled={true}
              />
            </Form.Group>

            <Form.Group controlId="formStations">
              <Form.Label>Stations</Form.Label>
              <Form.Control
                type="text"
                placeholder="Stations (comma-separated)"
                name="stations"
                value={routeInfo.stations.join(", ")}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditRouteModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateRoute}>
            Edit Route
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const renderTableRows = () => {
    return currentRoutes.map((route) => (
      <tr key={route.name}>
        <td onClick={() => handleRowClick(route)}>{route.name}</td>
        <td onClick={() => handleRowClick(route)}>{route.stations.join(", ")}</td>
        <td className="justify-content-center">
          {localStorage.getItem("UserRole")==="BACK_OFFICER" &&<Button variant="success" onClick={() => handleEditRouteClick(route)}>
            Edit
          </Button>}
        </td>
      </tr>
    ));
  };

  const handleUpdateRoute = async () => {
    try {
      const res = await getAxiosInstance().put(Routes.update + "/" + selectedRouteForEdit, routeInfo);
      handleCloseEditRouteModal();
      resetRouteObj();
      await displayToast(res.data.message, res.data.success);
    } catch (error) {
      const message = error.response
        ? error.response.data.message
        : "Unexpected error occurred. Please contact administrators.";
      console.error(message);
    }
  };

  const totalPages = Math.ceil(routes.length / perPage);
  const indexOfLastRoute = currentPage * perPage;
  const indexOfFirstRoute = indexOfLastRoute - perPage;
  const currentRoutes = routes.slice(indexOfFirstRoute, indexOfLastRoute);

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: "10px" }}>
        <h2 style={{ color: "#4F4F4F" }}>Routes</h2>
        {localStorage.getItem("UserRole")==="BACK_OFFICER" &&<Button onClick={() => handleCreateRouteClick()} variant="success" style={{ color: "white", marginRight: "67px" }}>
          Create
        </Button>}
      </div>
      <ToastContainer />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Stations</th>
            {localStorage.getItem("UserRole")==="BACK_OFFICER" &&<th>Edit</th>}
          </tr>
        </thead>
        <tbody>{renderTableRows()}</tbody>
      </Table>

      <div style={{ display: "flex", flexDirection: 'row' }}>
        <Pagination style={{ marginRight: '10px' }}>
          <Pagination.Prev
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {Array.from({ length: totalPages }).map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </Pagination>

        <Dropdown>
          <Dropdown.Toggle variant="success" id="pagination-dropdown">
            Per Page: {perPage}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {[5, 8].map((option) => (
              <Dropdown.Item key={option} onClick={() => setPerPage(option)}>
                {option}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      {displayRouteInfo()}
      {displayCreateRouteForm()}
      {displayEditRouteForm()}
    </div>
  );
};

export default RouteManagement;
