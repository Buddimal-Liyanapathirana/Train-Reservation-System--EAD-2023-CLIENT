import React, { useEffect, useState } from "react";
import { getAxiosInstance } from "../utils/axios";
import "react-toastify/dist/ReactToastify.css";
import { Schedules, Reservations } from "../utils/api";
import ticket_icon from "../assets/icons/ticket-solid.svg";
import { Table, Pagination, Dropdown, Modal, Button , Form  } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

const ReservationManagement = () => {
  const [Reservations, setReservations] = useState([]);
  const [schedules, setSchedules] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(8);

  const [selectedReservation, setSelectedReservation] = useState(null);
  const [selectedReservationForSchedule, setSelectedReservationForSchedule] = useState(null);
  const [selectedReservationForEdit, setSelectedReservationForEdit] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showCreateReservationModal, setShowCreateReservationModal] = useState(false);
  const [showEditReservationModal, setShowEditReservationModal] = useState(false);

  const tostConfig = {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  }

  useEffect(() => {
    getReservations();
    getSchedules()
  }, []);

  const getReservations = async () => {
    //fetch the Reservations
    try {
      const res = await getAxiosInstance().get(Reservations.getAll);
      setReservations(res.data.data);
    } catch (error) {
      const message = error.response
        ? error.response.data.message
        : "Unexpected error occurred. Please contact administrators.";
      console.error(message);
    }
  };

  const handleCreateReservation = async ()=>{
    try {
      const res = await getAxiosInstance().post(Reservations.create,ReservationInfo);
      setReservationInfo({
        ReservationName: "",
        luxurySeatCount: 0,
        economySeatCount: 0
      })
      handleCloseSCreateReservationModal()
      await displayToast(res.data.message,res.data.success)
    } catch (error) {
      const message = error.response
        ? error.response.data.message
        : "Unexpected error occurred. Please contact administrators.";
      console.error(message);
    }
  }

  const handleEditReservation = async ()=>{
    try {
      const res = await getAxiosInstance().put(Reservations.update+"/"+selectedReservationForEdit,ReservationInfo);
      handleCloseSEditReservationModal()
      setReservationInfo({
        ReservationName: "",
        luxurySeatCount: 0,
        economySeatCount: 0
      })
      await displayToast(res.data.message,res.data.success)
    } catch (error) {
      const message = error.response
        ? error.response.data.message
        : "Unexpected error occurred. Please contact administrators.";
      console.error(message);
    }
  }

  const getSchedules = async () => {
    //fetch the schedules
    try {
      const res = await getAxiosInstance().get(Schedules.getAll);
      setSchedules(res.data.data);
    } catch (error) {
      const message = error.response
        ? error.response.data.message
        : "Unexpected error occurred. Please contact administrators.";
      console.error(message);
    }
  };

  const handleAddSchedule = async (scheduleId) => {
    //assigns schedule to Reservations
    try {
      const res = await getAxiosInstance().put(Reservations.addSchedule+"/"+selectedReservationForSchedule+"/"+scheduleId); 
      updateReservation(selectedReservationForSchedule,true)
      handleCloseScheduleModal()
      await displayToast(res.data.message,res.data.success)
    } catch (error) {
      const message = error.response
        ? error.response.data.message
        : "Unexpected error occurred. Please contact administrators.";
        await displayToast(message,false)
    }
  };

  const handleDelete = async (id)=>{
    //handles deletion of Reservation
    try {
      const res = await getAxiosInstance().delete(Reservations.delete+"/"+id);
      const message = res.data.message
      removeReservation(id)
      handleCloseModal()
      await displayToast(res.data.message,res.data.success)
    } catch (error) {
      const message = error.response
        ? error.response.data.message
        : "Unexpected error occurred. Please contact administrators.";
        await displayToast(message,false)
    }
  }

  const handleDeactivate = async (id)=>{
    //handles deactivation of Reservation
    try {
      const res = await getAxiosInstance().put(Reservations.deactivate+"/"+id);
      updateReservation(id,false)
      handleCloseModal()
      await displayToast(res.data.message,res.data.success)
    } catch (error) {
      const message = error.response
        ? error.response.data.message
        : "Unexpected error occurred. Please contact administrators.";
      await displayToast(message,false)
    }
  }

  //handlers for open and close Reservation info modal
  const handleRowClick = (Reservation) => {
    setSelectedReservation(Reservation);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setSelectedReservation(null);
    setShowModal(false);
  };

  //handlers for open and close schedule modal
  const handleAddScheduleClick = (ReservationId) => {
    setSelectedReservationForSchedule(ReservationId)
    setShowScheduleModal(true);
  };
  const handleCloseScheduleModal = () => {
    setSelectedReservationForSchedule(null)
    setShowScheduleModal(false);
  };

  //handlers for open and close create Reservation modal
  const handleCreateReservationClick = () => {
    setShowCreateReservationModal(true);
  };
  const handleCloseSCreateReservationModal = () => {
    setShowCreateReservationModal(false);
  };

  //handlers for open and close edit Reservation modal
  const handleEditReservationClick = (oldReservation) => {
    setSelectedReservationForEdit(oldReservation.id)
    const Reservation = {
      ReservationName: oldReservation.ReservationName,
      luxurySeatCount: oldReservation.luxurySeatCount,
      economySeatCount: oldReservation.economySeatCount
    };
    setReservationInfo(Reservation)
    setShowEditReservationModal(true);
  };
  const handleCloseSEditReservationModal = () => {
    setSelectedReservationForEdit(null)
    setShowEditReservationModal(false);
    setReservationInfo({
      ReservationName: "",
      luxurySeatCount: 0,
      economySeatCount: 0
    })
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReservationInfo((prevReservationInfo) => ({
      ...prevReservationInfo,
      [name]: value
    }));
  };


  const removeReservation = (ReservationIdToRemove) => {
    //remove Reservation from state upon deletion
    const updatedReservations = Reservations.filter(Reservation => Reservation.id !== ReservationIdToRemove);
    setReservations(updatedReservations);
  };

  const updateReservation = (id,activation) => {
    //update Reservation active status state
    const index = Reservations.findIndex(Reservation => Reservation.id === id);
    if (index !== -1) {
      const updatedReservation = { ...Reservations[index], isActive: activation };
      const updatedReservations = [...Reservations.slice(0, index), updatedReservation, ...Reservations.slice(index + 1)];
      setReservations(updatedReservations);
    }
  };
  
  const displayToast = async (message,success) => {
    //display toast message
    if(success){
      toast.success(message, tostConfig);
    }else{
      toast.error(message,tostConfig)
    }
  }

  const displayAddReservationForm = () => 
  //display add reservation form{
    return (
      <Modal show={showCreateReservationModal} onHide={handleCloseSCreateReservationModal}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: 'black' }}>Add Reservations</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formReservationName">
              <Form.Label>Reservation Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Reservation name"
                name="ReservationName"
                value={ReservationInfo.ReservationName}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formLuxurySeatCount">
              <Form.Label>Luxury Seat Count</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter luxury seat count"
                name="luxurySeatCount"
                value={ReservationInfo.luxurySeatCount}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formEconomySeatCount">
              <Form.Label>Economy Seat Count</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter economy seat count"
                name="economySeatCount"
                value={ReservationInfo.economySeatCount}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSCreateReservationModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateReservation}>
            Create Reservation
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const displayEdtReservationForm = () => {
    return (
      <Modal show={showEditReservationModal} onHide={handleCloseSEditReservationModal}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: 'black' }}>Edit Reservation information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formReservationName">
              <Form.Label>Reservation Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Reservation name"
                name="ReservationName"
                value={ReservationInfo.ReservationName}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formLuxurySeatCount">
              <Form.Label>Luxury Seat Count</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter luxury seat count"
                name="luxurySeatCount"
                value={ReservationInfo.luxurySeatCount}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formEconomySeatCount">
              <Form.Label>Economy Seat Count</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter economy seat count"
                name="economySeatCount"
                value={ReservationInfo.economySeatCount}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSEditReservationModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditReservation}>
            Edit Reservation
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const displayReservationInfo = ()=>{
    //modal to display Reservation info
    return(
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: 'black' }}>Reservation Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReservation && (
            <div style={{ color: 'black' }}>
              <p><strong>Reservation Name:</strong> {selectedReservation.ReservationName}</p>
              <p><strong>Luxury Seats:</strong> {selectedReservation.luxurySeatCount}</p>
              <p><strong>Economy Seats:</strong> {selectedReservation.economySeatCount}</p>
              <p><strong>Status:</strong> {selectedReservation.isActive ? "Active" : "Inactive"}</p>
              <p><strong>Reservation:</strong> {selectedReservation.reservations.length > 0 ? "Reserved" : "Unreserved"}</p>
              {/* ... Add more information as needed */}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
        <Button variant="warning" onClick={()=>handleDeactivate(selectedReservation.id)}>
            Deactivate
          </Button>
        <Button variant="danger" onClick={()=>handleDelete(selectedReservation.id)}>
            Delete
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  const renderTableRows = () => {
    return Reservations.map((Reservations) => (
      <tr key={Reservations.id}>
        <td onClick={() => handleRowClick(Reservations)}>{Reservations.id}</td>
        <td onClick={() => handleRowClick(Reservations)}>{Reservations.name}</td>
        <td onClick={() => handleRowClick(Reservations)}>{Reservations.role}</td>
        <td onClick={() => handleRowClick(Reservations)}>
          <span
            style={{
              height: '10px',
              width: '10px',
              borderRadius: '50%',
              display: 'inline-block',
              backgroundColor: Reservations.isActive ? 'green' : 'red',
              marginRight: '5px',
            }}
          ></span>
          {Reservations.isActive ? "Active" : "Inactive"}
        </td>
        <td className="justify-content-center">
          <Button style={{marginLeft:'80px'}} variant="success" onClick={() => handleEditReservationClick(Reservations)}> Edit </Button>
        </td>
      </tr>
    ));
  };
  
 

  //pagination properties
  const totalPages = Math.ceil(Reservations.length / perPage);
  const indexOfLastReservation = currentPage * perPage;
  const indexOfFirstReservation = indexOfLastReservation - perPage;
  const currentReservations = Reservations.slice(indexOfFirstReservation, indexOfLastReservation);

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' , marginBottom:'10px'}}>
        <h2 style={{ color: '#4F4F4F' }}>Reservations</h2>
        <Button onClick={()=>handleCreateReservationClick()}  variant="success" style={{ color: "white", marginRight: '67px' }}>Create</Button>
      </div>
      <ToastContainer/>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Reservation Id</th>
            <th>Reservation Name</th>
            <th>Reservation Role</th>
            <th>Status</th>
            <th>Edit</th> 
          </tr>
        </thead>
        <tbody>{renderTableRows()}</tbody>
      </Table>

      <Pagination>
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
      {displayReservationInfo()}
      {displayScheduleInfo()}
      {displayAddReservationForm()}
      {displayEdtReservationForm()}
    </div>
  );
};

export default ReservationManagement;
