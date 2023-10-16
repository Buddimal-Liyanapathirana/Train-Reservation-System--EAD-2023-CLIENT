import React, { useState } from "react";
import {
  Table,
  Pagination,
  Modal,
  Button,
  Dropdown,
  Form,
} from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState(mockSchedules);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [scheduleInfo, setScheduleInfo] = useState({
    route: "",
    arrivalStation: "",
    arrivalTime: "",
    departureStation: "",
    departureTime: "",
  });

  const handleRowClick = (schedule) => {
    setSelectedSchedule(schedule);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedSchedule(null);
    setShowModal(false);
  };

  const handleCreateModal = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleEditModal = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleCreateSchedule = () => {
    // Implement create schedule logic here
    // For now, just close the modal
    handleCloseCreateModal();
  };

  const handleEditSchedule = () => {
    // Implement edit schedule logic here
    // For now, just close the modal
    handleCloseEditModal();
  };

  const renderTableRows = () => {
    return schedules.map((schedule) => (
      <tr key={schedule.id}>
        <td onClick={() => handleRowClick(schedule)}>{schedule.route}</td>
        <td onClick={() => handleRowClick(schedule)}>
          {formatTimeWithAMPM(schedule.arrivalTime)}
        </td>
        <td onClick={() => handleRowClick(schedule)}>
          {formatTimeWithAMPM(schedule.departureTime)}
        </td>
        {/* Add more columns as needed */}
      </tr>
    ));
  };

  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePerPageChange = (option) => {
    setPerPage(option);
  };

  const displayScheduleInfo = () => {
    const scheduleStyles = {
      borderStyle: "solid",
      borderRadius: "5px",
      borderColor: "grey",
      marginBottom: "5px",
      padding: "10px",
      borderWidth: "2px",
      position: "relative",
    };

    return (
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Schedule Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSchedule && (
            <div>
              <p>
                <strong>Route:</strong> {selectedSchedule.route}
              </p>
              <p>
                <strong>Arrival:</strong>{" "}
                {`${selectedSchedule.arrivalStation} at ${formatTimeWithAMPM(
                  selectedSchedule.arrivalTime
                )}`}
              </p>
              <p>
                <strong>Departure:</strong>{" "}
                {`${selectedSchedule.departureStation} at ${formatTimeWithAMPM(
                  selectedSchedule.departureTime
                )}`}
              </p>
              {/* Add more properties as needed */}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const displayCreateScheduleModal = () => {
    return (
      <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create Schedule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Add form fields for creating a schedule */}
            {/* Example: */}
            <Form.Group controlId="formRoute">
              <Form.Label>Route</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter route"
                name="route"
                value={scheduleInfo.route}
                onChange={(e) =>
                  setScheduleInfo({ ...scheduleInfo, route: e.target.value })
                }
              />
            </Form.Group>
            {/* Add more form fields as needed */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCreateModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateSchedule}>
            Create Schedule
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const displayEditScheduleModal = () => {
    return (
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Schedule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Add form fields for editing a schedule */}
            {/* Example: */}
            <Form.Group controlId="formRoute">
              <Form.Label>Route</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter route"
                name="route"
                value={scheduleInfo.route}
                onChange={(e) =>
                  setScheduleInfo({ ...scheduleInfo, route: e.target.value })
                }
              />
            </Form.Group>
            {/* Add more form fields as needed */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditSchedule}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  function formatTimeWithAMPM(datetimeString) {
    const date = new Date(datetimeString);

    if (isNaN(date)) {
      return "Invalid Date";
    }

    const utcTimeString = date.toUTCString();
    const timePart = utcTimeString.split(" ")[4];
    return timePart.split(":")[0] + ":" + timePart.split(":")[1];
  }

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <h2>Schedules</h2>
        <Button
          variant="success"
          style={{ marginLeft: "auto" }}
          onClick={handleCreateModal}
        >
          Create Schedule
        </Button>
        <Button variant="info" onClick={handleEditModal}>
          Edit Schedule
        </Button>
      </div>
      <ToastContainer />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Route</th>
            <th>Arrival Time</th>
            <th>Departure Time</th>
            {/* Add more headers as needed */}
          </tr>
        </thead>
        <tbody>{renderTableRows()}</tbody>
      </Table>

      <Pagination>
        {Array.from({ length: Math.ceil(schedules.length / perPage) }).map(
          (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePaginationClick(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          )
        )}
      </Pagination>

      <Dropdown>
        <Dropdown.Toggle variant="success" id="pagination-dropdown">
          Per Page: {perPage}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {[5, 10, 15].map((option) => (
            <Dropdown.Item
              key={option}
              onClick={() => handlePerPageChange(option)}
            >
              {option}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      {displayScheduleInfo()}
      {displayCreateScheduleModal()}
      {displayEditScheduleModal()}
    </div>
  );
};

export default ScheduleManagement;

// Placeholder data for testing
const mockSchedules = [
  {
    id: 1,
    route: "Route 1",
    arrivalStation: "Station A",
    arrivalTime: "2023-10-13T10:00:00Z",
    departureStation: "Station B",
    departureTime: "2023-10-13T12:00:00Z",
  },
  {
    id: 2,
    route: "Route 2",
    arrivalStation: "Station C",
    arrivalTime: "2023-10-13T14:00:00Z",
    departureStation: "Station D",
    departureTime: "2023-10-13T16:00:00Z",
  },
  // Add more schedule objects as needed
];
