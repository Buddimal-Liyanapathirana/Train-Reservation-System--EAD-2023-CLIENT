import React, { useEffect, useState } from "react";
import { getAxiosInstance } from "../utils/axios";
import "react-toastify/dist/ReactToastify.css";
import { Schedules, Trains } from "../utils/api";
import ticket_icon from "../assets/icons/ticket-solid.svg";
import { Table, Pagination, Dropdown, Modal, Button , Form  } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

const TrainManagement = () => {
  const [trains, setTrains] = useState([]);
  const [schedules, setSchedules] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(8);

  const [selectedTrain, setSelectedTrain] = useState(null);
  const [selectedTrainForSchedule, setSelectedTrainForSchedule] = useState(null);
  const [selectedTrainForEdit, setSelectedTrainForEdit] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showCreateTrainModal, setShowCreateTrainModal] = useState(false);
  const [showEditTrainModal, setShowEditTrainModal] = useState(false);

  const [trainInfo, setTrainInfo] = useState({
    trainName: "",
    luxurySeatCount: 0,
    economySeatCount: 0
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
  }

  useEffect(() => {
    getTrains();
    getSchedules()
  }, []);

  const getTrains = async () => {
    //fetch the trains
    try {
      const res = await getAxiosInstance().get(Trains.getAll);
      setTrains(res.data.data);
    } catch (error) {
      const message = error.response
        ? error.response.data.message
        : "Unexpected error occurred. Please contact administrators.";
      console.error(message);
    }
  };

  const handleCreateTrain = async ()=>{
    try {
      const res = await getAxiosInstance().post(Trains.create,trainInfo);
      setTrainInfo({
        trainName: "",
        luxurySeatCount: 0,
        economySeatCount: 0
      })
      handleCloseSCreateTrainModal()
      await displayToast(res.data.message,res.data.success)
    } catch (error) {
      const message = error.response
        ? error.response.data.message
        : "Unexpected error occurred. Please contact administrators.";
      console.error(message);
    }
  }

  const handleEditTrain = async ()=>{
    try {
      const res = await getAxiosInstance().put(Trains.update+"/"+selectedTrainForEdit,trainInfo);
      handleCloseSEditTrainModal()
      setTrainInfo({
        trainName: "",
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
    //assigns schedule to trains
    try {
      const res = await getAxiosInstance().put(Trains.addSchedule+"/"+selectedTrainForSchedule+"/"+scheduleId); 
      updateTrain(selectedTrainForSchedule,true)
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
    //handles deletion of train
    try {
      const res = await getAxiosInstance().delete(Trains.delete+"/"+id);
      const message = res.data.message
      removeTrain(id)
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
    //handles deactivation of train
    try {
      const res = await getAxiosInstance().put(Trains.deactivate+"/"+id);
      updateTrain(id,false)
      handleCloseModal()
      await displayToast(res.data.message,res.data.success)
    } catch (error) {
      const message = error.response
        ? error.response.data.message
        : "Unexpected error occurred. Please contact administrators.";
      await displayToast(message,false)
    }
  }

  //handlers for open and close train info modal
  const handleRowClick = (train) => {
    setSelectedTrain(train);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setSelectedTrain(null);
    setShowModal(false);
  };

  //handlers for open and close schedule modal
  const handleAddScheduleClick = (trainId) => {
    setSelectedTrainForSchedule(trainId)
    setShowScheduleModal(true);
  };
  const handleCloseScheduleModal = () => {
    setSelectedTrainForSchedule(null)
    setShowScheduleModal(false);
  };

  //handlers for open and close create train modal
  const handleCreateTrainClick = () => {
    setShowCreateTrainModal(true);
  };
  const handleCloseSCreateTrainModal = () => {
    setShowCreateTrainModal(false);
  };

  //handlers for open and close edit train modal
  const handleEditTrainClick = (oldTrain) => {
    setSelectedTrainForEdit(oldTrain.id)
    const train = {
      trainName: oldTrain.trainName,
      luxurySeatCount: oldTrain.luxurySeatCount,
      economySeatCount: oldTrain.economySeatCount
    };
    setTrainInfo(train)
    setShowEditTrainModal(true);
  };
  const handleCloseSEditTrainModal = () => {
    setSelectedTrainForEdit(null)
    setShowEditTrainModal(false);
    setTrainInfo({
      trainName: "",
      luxurySeatCount: 0,
      economySeatCount: 0
    })
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTrainInfo((prevTrainInfo) => ({
      ...prevTrainInfo,
      [name]: value
    }));
  };


  const removeTrain = (trainIdToRemove) => {
    //remove train from state upon deletion
    const updatedTrains = trains.filter(train => train.id !== trainIdToRemove);
    setTrains(updatedTrains);
  };

  const updateTrain = (id,activation) => {
    //update train active status state
    const index = trains.findIndex(train => train.id === id);
    if (index !== -1) {
      const updatedTrain = { ...trains[index], isActive: activation };
      const updatedTrains = [...trains.slice(0, index), updatedTrain, ...trains.slice(index + 1)];
      setTrains(updatedTrains);
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

  const displayAddTrainForm = () => {
    return (
      <Modal show={showCreateTrainModal} onHide={handleCloseSCreateTrainModal}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: 'black' }}>Train Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTrainName">
              <Form.Label>Train Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter train name"
                name="trainName"
                value={trainInfo.trainName}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formLuxurySeatCount">
              <Form.Label>Luxury Seat Count</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter luxury seat count"
                name="luxurySeatCount"
                value={trainInfo.luxurySeatCount}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formEconomySeatCount">
              <Form.Label>Economy Seat Count</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter economy seat count"
                name="economySeatCount"
                value={trainInfo.economySeatCount}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSCreateTrainModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateTrain}>
            Create Train
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const displayEdtTrainForm = () => {
    return (
      <Modal show={showEditTrainModal} onHide={handleCloseSEditTrainModal}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: 'black' }}>Edit train information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTrainName">
              <Form.Label>Train Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter train name"
                name="trainName"
                value={trainInfo.trainName}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formLuxurySeatCount">
              <Form.Label>Luxury Seat Count</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter luxury seat count"
                name="luxurySeatCount"
                value={trainInfo.luxurySeatCount}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formEconomySeatCount">
              <Form.Label>Economy Seat Count</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter economy seat count"
                name="economySeatCount"
                value={trainInfo.economySeatCount}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSEditTrainModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditTrain}>
            Edit Train
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const displayTrainInfo = ()=>{
    //modal to display train info
    return(
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: 'black' }}>Train Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTrain && (
            <div style={{ color: 'black' }}>
              <p><strong>Train Name:</strong> {selectedTrain.trainName}</p>
              <p><strong>Luxury Seats:</strong> {selectedTrain.luxurySeatCount}</p>
              <p><strong>Economy Seats:</strong> {selectedTrain.economySeatCount}</p>
              <p><strong>Status:</strong> {selectedTrain.isActive ? "Active" : "Inactive"}</p>
              <p><strong>Reservation:</strong> {selectedTrain.reservations.length > 0 ? "Reserved" : "Unreserved"}</p>
              {/* ... Add more information as needed */}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
        <Button variant="warning" onClick={()=>handleDeactivate(selectedTrain.id)}>
            Deactivate
          </Button>
        <Button variant="danger" onClick={()=>handleDelete(selectedTrain.id)}>
            Delete
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  const displayScheduleInfo = () => {
    const scheduleStyles = { borderStyle:'solid', borderRadius: '5px', borderColor: 'grey', marginBottom: '5px', padding: '10px' , borderWidth:'2px', position: 'relative' }
    //modal to display schedule info
    return (
      <Modal show={showScheduleModal} onHide={handleCloseScheduleModal} style={{ overflowY: 'auto' }}>
        <Modal.Header closeButton style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1000, borderRadius: '5px', marginBottom: '5px' }}>
          <Modal.Title style={{ color: 'black' }}>Available schedules</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: 'black', overflowY: 'auto', maxHeight: '60vh', padding: '20px' }}>
          {schedules && schedules.map((schedule) => (
            <div key={schedule.id} style={scheduleStyles}>
              <Button onClick={()=>handleAddSchedule(schedule.id)} variant="success" style={{ position: 'absolute', top: '5px', right: '5px', borderRadius: '5px' }}>+</Button>
              <p><strong>Route:</strong> {schedule.route}</p>
              <p><strong>Arrival:</strong> {schedule.arrivalStation + ` at ${formatTimeWithAMPM(schedule.arrivalTime)}`}</p>
              <p><strong>Departure:</strong> {schedule.departureStation + ` at ${formatTimeWithAMPM(schedule.departureTime)}`}</p>
              {/* Add more properties as needed */}
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer style={{ position: 'sticky', bottom: 0, backgroundColor: 'white', zIndex: 1000, borderRadius: '5px', marginTop: '5px' }}>
          <Button variant="secondary" onClick={handleCloseScheduleModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };
  
  const renderTableRows = () => {
    return currentTrains.map((train) => (
      <tr key={train.id}>
        <td onClick={() => handleRowClick(train)}>{train.trainName}</td>
        <td onClick={() => handleRowClick(train)}>{train.luxurySeatCount}</td>
        <td onClick={() => handleRowClick(train)}>{train.economySeatCount}</td>
        <td onClick={() => handleRowClick(train)}>
          <span
            style={{
              height: '10px',
              width: '10px',
              borderRadius: '50%',
              display: 'inline-block',
              backgroundColor: train.isActive ? 'green' : 'red',
              marginRight: '5px',
            }}
          ></span>
          {train.isActive ? "Active" : "Inactive"}
        </td>
        <td className="justify-content-center">
          <Button style={{marginLeft:'80px'}} variant="success" onClick={() => handleAddScheduleClick(train.id)}> + </Button>
        </td>
        <td className="justify-content-center">
          <Button style={{marginLeft:'80px'}} variant="success" onClick={() => handleEditTrainClick(train)}> Edit </Button>
        </td>
      </tr>
    ));
  };
  
  function formatTimeWithAMPM(datetimeString) {
    //formats incominf datetime string
    const date = new Date(datetimeString);
  
    if (isNaN(date)) {
      return 'Invalid Date';
    }
    // Convert the date to a UTC-formatted string
    const utcTimeString = date.toUTCString();
    // Extract the time part from the UTC string
    const timePart = utcTimeString.split(' ')[4];
    return timePart.split(':')[0]+":"+timePart.split(':')[1]
  }

  //pagination properties
  const totalPages = Math.ceil(trains.length / perPage);
  const indexOfLastTrain = currentPage * perPage;
  const indexOfFirstTrain = indexOfLastTrain - perPage;
  const currentTrains = trains.slice(indexOfFirstTrain, indexOfLastTrain);

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' , marginBottom:'10px'}}>
        <h2 style={{ color: '#4F4F4F' }}>Trains</h2>
        <Button onClick={()=>handleCreateTrainClick()}  variant="success" style={{ color: "white", marginRight: '67px' }}>Create</Button>
      </div>
      <ToastContainer/>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Train Name</th>
            <th>Luxury Seats</th>
            <th>Economy Seats</th>
            <th>Status</th>
            <th className="d-flex justify-content-center">Schedule</th> 
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
      {displayTrainInfo()}
      {displayScheduleInfo()}
      {displayAddTrainForm()}
      {displayEdtTrainForm()}
    </div>
  );
};

export default TrainManagement;
