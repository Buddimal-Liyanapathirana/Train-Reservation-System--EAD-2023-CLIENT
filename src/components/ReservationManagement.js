import React, { useEffect, useState } from "react";
import { getAxiosInstance } from "../utils/axios";
import { Reservations, Schedules, Trains, Users } from "../utils/api";
import { Table, Modal, Button, Form, Pagination, Dropdown } from "react-bootstrap";
import {toastConfig} from "../utils/toastConfig";
import { ToastContainer, toast } from "react-toastify";

const ReservationManagement = () => {
  const [reservations, setReservations] = useState([]);
  const [travelers, setTravelers] = useState([]);
  const [trains, setTrains] = useState([]);
  const [schedule, setSchedule] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(8);

  const [selectedReservation, setSelectedReservation] = useState(null);

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showTrainsModal, setShowTrainsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [editFormData, setEditFormData] = useState({
    luxurySeats: 0,
    economySeats: 0,
    reservationDate: "2023-10-17T04:15:08.288Z",
    startStation: "string",
    endStation: "string"
  });

  const [createFormData, setCreateFormData] = useState({
    luxurySeats: 0,
    economySeats: 0,
    reservationDate: "",
    userNIC: "",
    trainId: "",
    startStation: "",
    endStation: ""
  });

  useEffect(() => {
    getReservations();
    getUsers()
    getTrains()
  }, []);

  const getReservations = async () => {
    //get all the reservations
    const token = localStorage.getItem("token");
    try {
      const res = await getAxiosInstance().get(Reservations.getAll,{
        headers: { Authorization: `bearer ${token}`},
      });
      setReservations(res.data.data);
    } catch (error) {
      const message = error.response
        ? error.response.data.message
        : "Unexpected error occurred. Please contact administrators.";
      console.error(message);
    }
  };

  const getSchedule = async (schId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await getAxiosInstance().get(Schedules.getOne+"/"+schId,{
        headers: { Authorization: `bearer ${token}`},
      });
      setSchedule(res.data.data);
    } catch (error) {
      const message = error.response
        ? error.response.data.message
        : "Unexpected error occurred. Please contact administrators.";
      console.error(message);
    }
  };
  

  const getUsers = async () => {
    const token = localStorage.getItem("token");
    //get all users and filter travelers and active users
    try {
      const res = await getAxiosInstance().get(Users.getAll,{
        headers: { Authorization: `bearer ${token}`},
      });
      const travelerUsers = res.data.data
      .filter((user) => user.role === "TRAVELER")
      .filter((user) => user.isActive === true);
      setTravelers(travelerUsers);
    } catch (error) {
      const message = error.response
        ? error.response.data.message
        : "Unexpected error occurred. Please contact administrators.";
      console.error(message);
    }
  };

  const getTrains = async () => {
    const token = localStorage.getItem("token");
    //get all trains and filter active ones
    try {
      const res = await getAxiosInstance().get(Trains.getAll,{
        headers: { Authorization: `bearer ${token}`},
      });
      const trains = res.data.data
      .filter((user) => user.isActive === true);
      setTrains(trains);
    } catch (error) {
      const message = error.response
        ? error.response.data.message
        : "Unexpected error occurred. Please contact administrators.";
      console.error(message);
    }
  };

  const handleEditSubmit = async () => {
    //edits a reservation
    const token = localStorage.getItem("token");
    try {
      const res = await getAxiosInstance().put(Reservations.update+"/"+selectedReservation.id, editFormData,{
        headers: { Authorization: `bearer ${token}`},
      });
      await displayToast(res.data.message,res.data.success)
    } catch (error) {
      const message = error.response
        ? error.response.data.message
        : "Unexpected error occurred. Please contact administrators.";
      console.error(message);
    }
    setShowEditModal(false);
  };

  const handleCreateSubmit = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await getAxiosInstance().post(Reservations.create, createFormData,{
        headers: { Authorization: `bearer ${token}`},
      });
      await displayToast(res.data.message,res.data.success)
    } catch (error) {
      const message = error.response
        ? error.response.data.message
        : "Unexpected error occurred. Please contact administrators.";
      console.error(message);
    }
    setShowCreateModal(false);
  };

  const handleCompleteReservation = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await getAxiosInstance().put(Reservations.complete+"/"+selectedReservation.id,{
        headers: { Authorization: `bearer ${token}`},
      });
      await displayToast(res.data.message,res.data.success)
    } catch (error) {
      const message = error.response
        ? error.response.data.message
        : "Unexpected error occurred. Please contact administrators.";
      console.error(message);
    }
    setShowInfoModal(false);
  }

  const handleDeleteReservation = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await getAxiosInstance().delete(Reservations.delete+"/"+selectedReservation.id,{
        headers: { Authorization: `bearer ${token}`},
      });
      await displayToast(res.data.message,res.data.success)
    } catch (error) {
      const message = error.response
        ? error.response.data.message
        : "Unexpected error occurred. Please contact administrators.";
      console.error(message);
    }
    setShowInfoModal(false);
  }

  const handleRowClick = (reservation) => {
    
    //handles the click of a row
    const formattedDate = reservation.reservedOn.split("T")[0];
    setSelectedReservation(reservation);
    setEditFormData({
      luxurySeats: reservation.luxurySeats,
      economySeats: reservation.economySeats,
      reservationDate: formattedDate,
      startStation: reservation.startStation,
      endStation: reservation.endStation
    });
    setShowInfoModal(true);
  };

  const handleRowEditClick =async (reservation) => {
    //handles open edit modal
    const train = trains.find((train) => train.id === reservation.trainId);
    await getSchedule(train.schedule)

    const formattedDate = reservation.reservedOn.split("T")[0];
    setSelectedReservation(reservation);
    setEditFormData({
      luxurySeats: reservation.luxurySeats,
      economySeats: reservation.economySeats,
      reservationDate: formattedDate,
      startStation: reservation.startStation,
      endStation: reservation.endStation
    });
    setShowEditModal(true)
  };

  const handleCloseEditModal = () => { 
    //handles close edit modal
    setShowEditModal(false);
    setEditFormData({
      luxurySeats: 0,
      economySeats: 0,
      reservationDate: "",
      startStation: "",
      endStation: ""
    })
   }

   const handleSelectUser = (userNic) => {
    // handles the selection of a user NIC for the reservation
    setCreateFormData((prevData) => ({
      ...prevData,
      userNIC: userNic,
    }));
    setShowUsersModal(false);
  };

  const handleSelectTrain = (train) => {
    // handles the selection of a train for the reservation
    setCreateFormData((prevData) => ({
      ...prevData,
      trainId: train.id,
    }));
    getSchedule(train.schedule)
    setShowTrainsModal(false);
  };
  
  const handleCloseInfoModal = () => {
    setSelectedReservation(null);
    setShowInfoModal(false);
  };

  const handleEditFormChange = (e) => {
    //onchange handler for edit form  
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleCreateFormChange = (e) => {
    //onchange handler for create form  
    const { name, value } = e.target;
    setCreateFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const displayToast = async (message,success) => {
    //display toast message
    if(success){
      toast.success(message, toastConfig);
    }else{
      toast.error(message,toastConfig)
    }
  }

  const renderTableRows = () => {
    return currentReservations.map((reservation) => (
      <tr key={reservation.id}>
        <td onClick={() => handleRowClick(reservation)}>
          {reservation.isCompleted ? "Completed" : "Not Completed"}
        </td>
        <td onClick={() => handleRowClick(reservation)}>
          {`LKR ${reservation.totalFare}`}
        </td>
        <td onClick={() => handleRowClick(reservation)}>
          {reservation.economySeats}
        </td>
        <td onClick={() => handleRowClick(reservation)}>
          {reservation.luxurySeats}
        </td>
        <td onClick={() => handleRowClick(reservation)}>
          {reservation.startStation}
        </td>
        <td onClick={() => handleRowClick(reservation)}>
          {reservation.endStation}
        </td>
        <td onClick={() => handleRowClick(reservation)}>
          {formatDate(reservation.reservedOn)}
        </td>
        <td>
          <Button variant="success" onClick={() => handleRowEditClick(reservation)}>
            Edit
          </Button>
        </td>
      </tr>
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const displayReservationInfo = () => {
    return (
      <Modal show={showInfoModal} onHide={handleCloseInfoModal}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "black" }}>
            Reservation Information
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{color:'grey'}}>
          {selectedReservation && (
            <div style={{ color: "black" }}>
              <p>
                <strong>Is Completed:</strong>{" "}
                {selectedReservation.isCompleted ? "Yes" : "No"}
              </p>
              <p>
                <strong>Total Fare:</strong>{" "}
                {`LKR ${selectedReservation.totalFare}`}
              </p>
              <p>
                <strong>Economy Seats:</strong>{" "}
                {selectedReservation.economySeats}
              </p>
              <p>
                <strong>Luxury Seats:</strong>{" "}
                {selectedReservation.luxurySeats}
              </p>
              <p>
                <strong>Reserved On:</strong>{" "}
                {formatDate(selectedReservation.reservedOn)}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseInfoModal}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDeleteReservation}>
            Delete
          </Button>
          <Button variant="success" onClick={handleCompleteReservation}>
            Complete
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const displayEditForm = () => {
    return (
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "black" }}>Edit Reservation</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{color:'grey'}}>
          <Form>
            <Form.Group controlId="formLuxurySeats">
              <Form.Label>Luxury Seats</Form.Label>
              <Form.Control
                type="number"
                placeholder="Luxury Seats"
                name="luxurySeats"
                value={editFormData.luxurySeats}
                onChange={handleEditFormChange}
              />
            </Form.Group>

            <Form.Group controlId="formEconomySeats">
              <Form.Label>Economy Seats</Form.Label>
              <Form.Control
                type="number"
                placeholder="Economy Seats"
                name="economySeats"
                value={editFormData.economySeats}
                onChange={handleEditFormChange}
              />
            </Form.Group>

            <Form.Group controlId="formEndStation">
              <Form.Label>Reserved on</Form.Label>
              <Form.Control
                type="date"
                placeholder="End Station"
                name="reservationDate"
                value={editFormData.reservationDate}
                onChange={handleEditFormChange}
              />
            </Form.Group>

            <Form.Group controlId="formStartStation">
              <Form.Label>Start Station</Form.Label>
              <Form.Control
                as="select"
                name="startStation"
                value={editFormData.startStation}
                onChange={handleEditFormChange}  
              >
                <option value="">Select a station</option>
                {schedule && schedule.stopStations && schedule.stopStations.map((station) => (
                  <option key={station} value={station}>
                    {station}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formEndStation">
              <Form.Label>End Station</Form.Label>
              <Form.Control
                as="select"
                name="endStation"
                value={editFormData.endStation}
                onChange={handleEditFormChange}
              >
                <option value="">Select a station</option>
                {schedule &&
                  schedule.stopStations &&
                  schedule.stopStations
                    .filter((station) => station > editFormData.startStation)
                    .map((station) => (
                      <option key={station} value={station}>
                        {station}
                      </option>
                    ))}
              </Form.Control>
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const displayAddForm = () => {
    return (
      <Modal show={showCreateModal} onHide={()=>setShowCreateModal(false)} >
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "black" }}>Create Reservation</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{color:'grey'}}>
          <Form>
          <Form.Group controlId="formuserNIC">
              <Form.Label>User</Form.Label>
              <div style={{display:'flex', flexDirection:'row'}}>
                <Form.Control style={{marginRight:'10px'}}
                  type="text"
                  placeholder="User"
                  name="userNIC"
                  value={createFormData.userNIC}
                  onChange={handleCreateFormChange}
                  disabled={true}
                />
              <Button variant="primary" onClick={()=>setShowUsersModal(true)}>
                Search
              </Button>
             </div>
            </Form.Group>

            <Form.Group controlId="formtrainId">
              <Form.Label>Train</Form.Label>
              <div style={{display:'flex', flexDirection:'row'}}>
                <Form.Control style={{marginRight:'10px'}}
                  type="text"
                  placeholder="Train"
                  name="trainId"
                  value={createFormData.trainId}
                  onChange={handleCreateFormChange}
                  disabled={true}
                />
              <Button variant="primary" onClick={()=>setShowTrainsModal(true)}>
                Search
              </Button>
             </div>
            </Form.Group>

            <Form.Group controlId="formStartStation">
              <Form.Label>Start Station</Form.Label>
              <Form.Control
                as="select"
                name="startStation"
                value={createFormData.startStation}
                onChange={handleCreateFormChange}
                disabled={createFormData.trainId?false:true}     
              >
                <option value="">Select a station</option>
                {schedule && schedule.stopStations && schedule.stopStations.map((station) => (
                  <option key={station} value={station}>
                    {station}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formEndStation">
              <Form.Label>End Station</Form.Label>
              <Form.Control
                as="select"
                name="endStation"
                value={createFormData.endStation}
                onChange={handleCreateFormChange}
                disabled={!createFormData.startStation}
              >
                <option value="">Select a station</option>
                {schedule &&
                  schedule.stopStations &&
                  schedule.stopStations
                    .filter((station) => station > createFormData.startStation) // Filter stations after the selected start station
                    .map((station) => (
                      <option key={station} value={station}>
                        {station}
                      </option>
                    ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formLuxurySeats">
              <Form.Label>Luxury Seats</Form.Label>
              <Form.Control
                type="number"
                placeholder="Luxury Seats"
                name="luxurySeats"
                value={createFormData.luxurySeats}
                onChange={handleCreateFormChange}
              />
            </Form.Group>

            <Form.Group controlId="formEconomySeats">
              <Form.Label>Economy Seats</Form.Label>
              <Form.Control
                type="number"
                placeholder="Economy Seats"
                name="economySeats"
                value={createFormData.economySeats}
                onChange={handleCreateFormChange}
              />
            </Form.Group>

            <Form.Group controlId="formResDate">
              <Form.Label>Reserved on</Form.Label>
              <Form.Control
                type="date"
                placeholder="Date"
                name="reservationDate"
                value={createFormData.reservationDate}
                onChange={handleCreateFormChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setShowCreateModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const displayUsersModel = () => {
    const modalStyles = { borderStyle:'solid', borderRadius: '5px', borderColor: 'grey', marginBottom: '5px', padding: '10px' , borderWidth:'2px', position: 'relative' }
    //modal to display users info
    return (
      <Modal show={showUsersModal} onHide={()=>setShowUsersModal(false)} style={{ overflowY: 'auto'}}>
        <Modal.Header closeButton style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1000, borderRadius: '5px', marginBottom: '5px' }}>
          <Modal.Title style={{ color: 'black' }}>Active Travelers</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: 'black', overflowY: 'auto', maxHeight: '60vh', padding: '20px' }}>
          {travelers && travelers.map((traveler) => (
            <div key={traveler.nic} style={modalStyles}>
              <Button onClick={()=>handleSelectUser(traveler.nic)} variant="success" style={{ position: 'absolute', top: '5px', right: '5px', borderRadius: '5px' }}>+</Button>
              <p><strong>NIC:</strong> {traveler.nic}</p>
              <p><strong>Username:</strong> {traveler.userName}</p>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer style={{height:"140px", position: 'sticky', bottom: 0, backgroundColor: 'white', zIndex: 1000, borderRadius: '5px', marginTop: '5px' }}>
          <Button variant="secondary" onClick={()=>setShowUsersModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const displayTrainsModel = () => {
    const modalStyles = { borderStyle:'solid', borderRadius: '5px', borderColor: 'grey', marginBottom: '5px', padding: '10px' , borderWidth:'2px', position: 'relative' }
    //modal to display trains info
    return (
      <Modal show={showTrainsModal} onHide={()=>setShowTrainsModal(false)} style={{ overflowY: 'auto'}}>
        <Modal.Header closeButton style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1000, borderRadius: '5px', marginBottom: '5px' }}>
          <Modal.Title style={{ color: 'black' }}>Active Trains</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: 'black', overflowY: 'auto', maxHeight: '60vh', padding: '20px' }}>
          {trains && trains.map((train) => (
            <div key={train.id} style={modalStyles}>
              <Button onClick={()=>handleSelectTrain(train)} variant="success" style={{ position: 'absolute', top: '5px', right: '5px', borderRadius: '5px' }}>+</Button>
              <p><strong>Name:</strong> {train.trainName}</p>
              <p><strong>ID:</strong> {train.id}</p>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer style={{height:"140px", position: 'sticky', bottom: 0, backgroundColor: 'white', zIndex: 1000, borderRadius: '5px', marginTop: '5px' }}>
          <Button variant="secondary" onClick={()=>setShowTrainsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

    //pagination properties
    const totalPages = Math.ceil(reservations.length / perPage);
    const indexOfLastSchedule = currentPage * perPage;
    const indexOfFirstSchedule = indexOfLastSchedule - perPage;
    const currentReservations = reservations.slice(indexOfFirstSchedule, indexOfLastSchedule);


  return (
    <div>
       <ToastContainer/>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' , marginBottom:'10px'}}>
        <h2 style={{ color: "#4F4F4F" }}>Reservations</h2>
        <Button onClick={()=>setShowCreateModal(true)}  variant="success" style={{ color: "white", marginRight: '50px' }}>Create</Button>
      </div>
      {displayReservationInfo()}
      {displayEditForm()}
      {displayAddForm()}
      {displayUsersModel()}
      {displayTrainsModel()}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Status</th>
            <th>Total Fare</th>
            <th>Economy Seats</th>
            <th>Luxury Seats</th>
            <th>From</th>
            <th>To</th>
            <th>Reserved On</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{renderTableRows()}</tbody>
      </Table>

      <div style={{display:"flex", flexDirection:'row'}}>
      <Pagination style={{marginRight:'10px'}} >
        <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
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
    </div>
  );
};

export default ReservationManagement;
