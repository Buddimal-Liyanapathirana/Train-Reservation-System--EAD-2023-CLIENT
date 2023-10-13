import React, { useState, useEffect } from "react";
import firebase from "../../firebase";
import { Link } from "react-router-dom";
import { Table, Button, ButtonGroup, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./backofficedashboard.css";

function DisplaySchedules(props) {
  const [schedules, setSchedules] = useState([]);
  const [editingSchedule, setEditingSchedule] = useState(props);
  const [searchTerm, setSearchTerm] = useState("");
  const db = firebase.firestore();


  useEffect(() => {
    db.collection("schedules").onSnapshot((snapshot) => {
      const arr = snapshot.docs.map((doc) => ({
        scheduleId: doc.id,
        data: doc.data(),
      }));

      setSchedules(arr);
    });
  }, [db]);

  function deleteSchedule(scheduleId) {
    db.collection("schedules")
      .doc(scheduleId)
      .delete()
      .then(() => {
        alert(scheduleId, "Document successfully deleted!");
      })
      .catch((err) => {
        console.error("Error removing document: ", err);
      });
  }

  function editSchedule(id) {
    //alert("Edit Traveler: ", id);
    editingSchedule.editScheduleHandler(id);
  }

  return (
    <div style={{ paddingRight: "20px", paddingLeft: "20px" }}>
      <br />
      <Link to="/dashboard/BackofficeDashboard/AddSchedule">
        <Button style={{ borderRadius: "10px 10px 0 0" }} variant="primary">
          Add New Schedule
        </Button>
      </Link>
      <Table bordered size="sm">
        <thead>
          <tr>
            <th style={{ display: "none" }}>Schedule's ID</th>
            <th style={{ textAlign: "center" }}>
              Schedule's ID
            </th>
            <th style={{ textAlign: "center" }}>Departure Station</th>
            <th style={{ textAlign: "center" }}>
              Arrival Station
            </th>
            <th style={{ textAlign: "center" }}>
              Departure Time
            </th>
            <th style={{ textAlign: "center" }}>
              Arrival Time
            </th>
            <th style={{ textAlign: "center" }}>
              Operating Days
            </th>
            <th style={{ textAlign: "center", verticalAlign: "middle" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule) => (
            <tr>
              <td style={{ textAlign: "center" }}>{schedule.scheduleId}</td>
              <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                {schedule.data.departureStation}
              </td>
              <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                {schedule.data.arrivalStation}
              </td>
              <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                {schedule.data.departureTime}
              </td>
              <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                {schedule.data.arrivalTime}
              </td>
              <td style={{ textAlign: "center", verticalAlign: "middle" }}>

              </td>
              <td style={{ textAlign: "center" }}>
                <ButtonGroup>
                  <Link to="/dashboard/BackofficeDashboard/EditSchedule">
                    <Button
                      style={{ borderRadius: "5px 0 0 5px" }}
                      variant="warning"
                      onClick={() => {
                        editSchedule(schedule.scheduleId);
                      }}
                    >
                      Edit
                    </Button>
                  </Link>
                  <Button
                    style={{ borderRadius: "0 5px 5px 0" }}
                    variant="danger"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this client's details? This action is irreversible!"
                        )
                      ) {
                        deleteSchedule(schedule.scheduleId);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default DisplaySchedules;
