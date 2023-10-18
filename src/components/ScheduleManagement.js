import React, { useEffect, useState } from "react";
import { getAxiosInstance } from "../utils/axios";
import "react-toastify/dist/ReactToastify.css";
import { Schedules} from "../utils/api";
import ticket_icon from "../assets/icons/ticket-solid.svg";
import { Table, Pagination, Dropdown, Modal, Button , Form  } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

const ScheduleManagement = () => {
  const [token , setToken] = useState("")
  const [schedules, setSchedules] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(8);

  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedScheduleForEdit, setSelectedScheduleForEdit] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showCreateScheduleModal, setShowCreateScheduleModal] = useState(false);
  const [showEditScheduleModal, setShowEditScheduleModal] = useState(false);

  const [scheduleInfo, setScheduleInfo] = useState({
    scheduleRoute: "",
    scheduleLuxuryFare: 0,
    scheduleEconomyFare: 0,
    scheduleOperatingDays: [
      0
    ],
    scheduleDepartureTime: "",
    scheduleArrivalTime: ""
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
    setToken(localStorage.getItem("token"))
    getSchedules()
  }, []);

  const getSchedules = async () => {
    //fetch the schedules
    const token = localStorage.getItem("token");
    try {
      const res = await getAxiosInstance().get(Schedules.getAll,{
        headers: { Authorization: `bearer ${token}` },
      });
      setSchedules(res.data.data);
    } catch (error) {
      const message = error.response
        ? error.response.data.message
        : "Unexpected error occurred. Please contact administrators.";
      console.error(message);
    }
  };

  const resetScheduleObj = ()=>{
    setScheduleInfo({
      scheduleRoute: "",
      scheduleLuxuryFare: 0,
      scheduleEconomyFare: 0,
      scheduleOperatingDays: [
        0
      ],
      scheduleDepartureTime: ``,
      scheduleArrivalTime: ``
    })
  }

  const handleCreateSchedule = async ()=>{
    //handles creation of schedule  
    const token = localStorage.getItem("token");
    scheduleInfo.scheduleDepartureTime = `2023-10-16T${scheduleInfo.scheduleDepartureTime}:29.707Z`
    scheduleInfo.scheduleArrivalTime = `2023-10-16T${scheduleInfo.scheduleArrivalTime}:29.707Z`
    try {
      const res = await getAxiosInstance().post(Schedules.create,scheduleInfo,{
        headers: { Authorization: `bearer ${token}` },
      });
      handleCloseSCreateScheduleModal()
      resetScheduleObj()
      await displayToast(res.data.message,res.data.success)
    } catch (error) {
      const message = error.response
        ? error.response.data.message
        : "Unexpected error occurred. Please contact administrators.";
      console.error(message);
    }
  }

  const handleUpdateSchedule =async () =>{
    //updates schedule 
    const token = localStorage.getItem("token");
    scheduleInfo.scheduleDepartureTime = `2023-10-16T${scheduleInfo.scheduleDepartureTime}:29.707Z`//formats input time
    scheduleInfo.scheduleArrivalTime = `2023-10-16T${scheduleInfo.scheduleArrivalTime}:29.707Z`//formats input time
    try {
      const res = await getAxiosInstance().put(Schedules.update+"/"+selectedScheduleForEdit,scheduleInfo,{
        headers: { Authorization: `bearer ${token}` },
        
      });
      handleCloseSCreateScheduleModal()
      resetScheduleObj()
      await displayToast(res.data.message,res.data.success)
    } catch (error) {
      const message = error.response
        ? error.response.data.message
        : "Unexpected error occurred. Please contact administrators.";
      console.error(message);
    }
  }

  const handleDelete = async (id)=>{
    //handles deletion of schedule
    const token = localStorage.getItem("token");
    try {
      const res = await getAxiosInstance().delete(Schedules.delete+"/"+id);
      const message = res.data.message
      removeSchedule(id)
      handleCloseModal()
      await displayToast(res.data.message,res.data.success)
    } catch (error) {
      const message = error.response
        ? error.response.data.message
        : "Unexpected error occurred. Please contact administrators.";
        await displayToast(message,false)
    }
  }

  //handlers for open and close schedule info modal
  const handleRowClick = (schedule) => {
    setSelectedSchedule(schedule);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setSelectedSchedule(null);
    setShowModal(false);
  };

  //handlers for open and close create schedule modal
  const handleCreateScheduleClick = () => {
    setShowCreateScheduleModal(true);
  };
  const handleCloseSCreateScheduleModal = () => {
    setShowCreateScheduleModal(false);
  };

  //handlers for open and close edit schedule modal
  const handleEditScheduleClick = (oldSchedule) => {
    setSelectedScheduleForEdit(oldSchedule.id);
    // Set the initial state for the scheduleInfo object
    setScheduleInfo({
      scheduleRoute: oldSchedule.route,
      scheduleLuxuryFare: oldSchedule.luxuryFare,
      scheduleEconomyFare: oldSchedule.economyFare,
      scheduleOperatingDays: oldSchedule.operatingDays, 
      scheduleDepartureTime: extractHoursMinutes(oldSchedule.departureTime),
      scheduleArrivalTime: extractHoursMinutes(oldSchedule.arrivalTime),
    });
    setShowEditScheduleModal(true);
  };
  
  const handleCloseSEditScheduleModal = () => {
    setSelectedScheduleForEdit(null)
    setShowEditScheduleModal(false);
    resetScheduleObj()
  };

  const handleInputChange = (e) => {
    //handler for onchange inputs
    const { name, value } = e.target;
    setScheduleInfo((prevScheduleInfo) => ({
      ...prevScheduleInfo,
      [name]: value
    }));
  };

  const removeSchedule = (scheduleIdToRemove) => {
    //remove schedule from state upon deletion
    const updatedSchedules = schedules.filter(schedule => schedule.id !== scheduleIdToRemove);
    setSchedules(updatedSchedules);
  };
  
  const displayToast = async (message,success) => {
    //display toast message
    if(success){
      toast.success(message, tostConfig);
    }else{
      toast.error(message,tostConfig)
    }
  }

  const displayAddScheduleForm = () => {
    //display add schedule modal form
    return (
      <Modal show={showCreateScheduleModal} onHide={handleCloseSCreateScheduleModal}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: 'black' }}>Schedule Information</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{color:'black'}}>
          <Form>
            <Form.Group controlId="formRoute">
              <Form.Label>Route</Form.Label>
              <Form.Control
                type="text"
                placeholder="Route name"
                name="scheduleRoute"
                value={scheduleInfo.scheduleRoute}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formLuxuryFare">
              <Form.Label>Luxury fare</Form.Label>
              <Form.Control
                type="number"
                placeholder="Luxury fare"
                name="scheduleLuxuryFare"
                value={scheduleInfo.scheduleLuxuryFare}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formEconomyFare">
              <Form.Label>Economy fare</Form.Label>
              <Form.Control
                type="number"
                placeholder="Economy fare"
                name="scheduleEconomyFare"
                value={scheduleInfo.scheduleEconomyFare}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formArrivalTime">
              <Form.Label>Arrival time</Form.Label>
              <Form.Control
                type="time"
                placeholder="Arrival time"
                name="scheduleArrivalTime"
                value={scheduleInfo.scheduleArrivalTime}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formDepartureTime">
              <Form.Label>Departure time</Form.Label>
              <Form.Control
                type="time"
                placeholder="Departure time"
                name="scheduleDepartureTime"
                value={scheduleInfo.scheduleDepartureTime}
                onChange={handleInputChange}s
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSCreateScheduleModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateSchedule}>
            Create Schedule
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const displayScheduleInfo = ()=>{
    const role = localStorage.getItem("UserRole")
    //modal to display schedule info
    return(
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: 'black' }}>Schedule Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSchedule && (
            <div style={{ color: 'black' }}>
              <p><strong>Route:</strong> {selectedSchedule.route}</p>
              <p><strong>Arrival station:</strong> {selectedSchedule.arrivalStation+" at "+extractHoursMinutes(selectedSchedule.arrivalTime)}</p>
              <p><strong>Departure:</strong> {selectedSchedule.departureStation+" at "+extractHoursMinutes(selectedSchedule.departureTime)}</p>
              <p><strong>Economy fare:</strong> {`LKR ${selectedSchedule.economyFare}` }</p>
              <p><strong>Luxury fare:</strong> {`LKR ${selectedSchedule.luxuryFare}`}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
        {role==="BACK_OFFICER" && <Button variant="danger" onClick={()=>handleDelete(selectedSchedule.id)}>
            Delete
          </Button>}
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  const displayEdtScheduleForm = () => {
    return (
      <Modal show={showEditScheduleModal} onHide={handleCloseSEditScheduleModal}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: 'black' }}>Edit train information</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{color:'black'}}>
          <Form>
            <Form.Group controlId="formRoute">
              <Form.Label>Route</Form.Label>
              <Form.Control
                type="text"
                placeholder="Route name"
                name="scheduleRoute"
                value={scheduleInfo.scheduleRoute}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formLuxuryFare">
              <Form.Label>Luxury fare</Form.Label>
              <Form.Control
                type="number"
                placeholder="Luxury fare"
                name="scheduleLuxuryFare"
                value={scheduleInfo.scheduleLuxuryFare}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formEconomyFare">
              <Form.Label>Economy fare</Form.Label>
              <Form.Control
                type="number"
                placeholder="Economy fare"
                name="scheduleEconomyFare"
                value={scheduleInfo.scheduleEconomyFare}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formArrivalTime">
              <Form.Label>Arrival time</Form.Label>
              <Form.Control
                type="time"
                placeholder="Arrival time"
                name="scheduleArrivalTime"
                value={scheduleInfo.scheduleArrivalTime}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formDepartureTime">
              <Form.Label>Departure time</Form.Label>
              <Form.Control
                type="time"
                placeholder="Departure time"
                name="scheduleDepartureTime"
                value={scheduleInfo.scheduleDepartureTime}
                onChange={handleInputChange}s
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSEditScheduleModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateSchedule} >
            Edit Train
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };
  
  const renderTableRows = () => {
    //body of shedule table  
    return currentSchedules.map((schedule) => (
      <tr key={schedule.id}>
        <td onClick={() => handleRowClick(schedule)}>{schedule.route}</td>
        <td onClick={() => handleRowClick(schedule)}>{schedule.arrivalStation}</td>
        <td onClick={() => handleRowClick(schedule)}>{extractHoursMinutes(schedule.arrivalTime)}</td>
        <td onClick={() => handleRowClick(schedule)}>{schedule.departureStation}</td>
        <td onClick={() => handleRowClick(schedule)}>{extractHoursMinutes(schedule.departureTime)}</td>
        <td onClick={() => handleRowClick(schedule)}>{`LKR ${schedule.luxuryFare}`}</td>
        <td onClick={() => handleRowClick(schedule)}>{`LKR ${schedule.economyFare}`}</td>
        {localStorage.getItem("UserRole")==="BACK_OFFICER"&&<td className="justify-content-center">
          <Button style={{marginLeft:'80px'}} variant="success" onClick={() => handleEditScheduleClick(schedule)}> Edit </Button>
        </td>}
      </tr>
    ));
  };
  
  function extractHoursMinutes(inputString) {
    //formats time output to hh:hh
    const pattern = /\d{4}-\d{2}-\d{2}T(\d{2}:\d{2}).*Z/;
    const match = inputString.match(pattern);
    if (match) {
      const hoursMinutes = match[1];
      return hoursMinutes;
    } else {
      return null; // Return null if no match is found
    }
  }
  
  //pagination properties
  const totalPages = Math.ceil(schedules.length / perPage);
  const indexOfLastSchedule = currentPage * perPage;
  const indexOfFirstSchedule = indexOfLastSchedule - perPage;
  const currentSchedules = schedules.slice(indexOfFirstSchedule, indexOfLastSchedule);

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' , marginBottom:'10px'}}>
        <h2 style={{ color: '#4F4F4F' }}>Schedules</h2>
        {localStorage.getItem("UserRole")==="BACK_OFFICER"&&
        <Button onClick={()=>handleCreateScheduleClick()}  variant="success" style={{ color: "white", marginRight: '67px' }}>
          Create
        </Button>}
      </div>
      <ToastContainer/>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Route</th>
            <th>Arrival</th>
            <th>Time</th>
            <th>Departure</th>
            <th>Time</th>
            <th>Luxury fare</th>
            <th>Economy fare</th>
            {localStorage.getItem("UserRole")==="BACK_OFFICER"&&<th>Edit</th> }
          </tr>
        </thead>
        <tbody>{renderTableRows()}</tbody>
      </Table>


      <div style={{display:"flex", flexDirection:'row'}}>
      <Pagination style={{marginRight:'10px'}} >
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
      {displayScheduleInfo()}
      {displayScheduleInfo()}
      {displayAddScheduleForm()}
      {displayEdtScheduleForm()}
    </div>
  );
};

export default ScheduleManagement;
