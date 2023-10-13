import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import firebase from "../../firebase";
import { Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./backofficedashboard.css";

function EditSchedule(props) {
  const [scheduleId, setScheduleId] = useState(props.id);
  const [departureStation, setDepartureStation] = useState("");
  const [arrivalStation, setArrivalStation] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const db = firebase.firestore();

  useEffect(() => {
    db.collection("schedules")
      .doc(scheduleId)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          setDepartureStation(doc.data().departureStation);
          setArrivalStation(doc.data().arrivalStation);
          setDepartureTime(doc.data().departureTime);
          setArrivalTime(doc.data().arrivalTime);
        } else {
          console.log("No such document!");
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
  }, [db, scheduleId]);

  function editdata(e) {
    e.preventDefault();
    if (
      window.confirm("Are you sure you want to edit this traveler's details?")
    ) {
      alert("Traveler details have been successfully edited.");
      const updatedSchedule = {
        departureStation,
        arrivalStation,
        departureTime,
        arrivalTime,
      };
      console.log(updatedSchedule);

      db.collection("schedules").doc(scheduleId).update(updatedSchedule);
    }
  }

  return (
    <div className="container">
      <br />
      <Link to="/dashboard/BackofficeDashboard">
        <Button variant="primary">Back</Button>
      </Link>
      <br />
      <center>
        <h2 style={{ color: "#f0ad4e" }}>Edit Schedule</h2>
      </center>
      <Form onSubmit={editdata}>
        <Form.Group controlId="formBasicName">
          <Form.Label>
            Departure Station (Required Format: Must Only Contain Letters and Spaces)
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="example: Prad Bitt"
            required
            pattern="^[A-Za-z \s*]+$"
            value={departureStation}
            onChange={(e) => {
              setDepartureStation(e.target.value);
            }}
          />
        </Form.Group>

        <Form.Group controlId="formBasicName">
          <Form.Label>
            Arrival Station (Required Format: Must Only Contain Letters and Spaces)
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="example: Prad Bitt"
            required
            pattern="^[A-Za-z \s*]+$"
            value={arrivalStation}
            onChange={(e) => {
              setArrivalStation(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group controlId="formBasicTimestamp">
          <Form.Label>
            Departure Time (Required Format: YYYY-MM-DDTHH:MM)
          </Form.Label>
          <Form.Control
            type="datetime-local"
            placeholder="YYYY-MM-DDTHH:MM"
            required
            value={departureTime}
            onChange={(e) => {
              setDepartureTime(e.target.value);
            }}
          />
        </Form.Group>

        <Form.Group controlId="formBasicTimestamp">
          <Form.Label>
            Arrival Time (Required Format: YYYY-MM-DDTHH:MM)
          </Form.Label>
          <Form.Control
            type="datetime-local"
            placeholder="YYYY-MM-DDTHH:MM"
            required
            value={arrivalTime}
            onChange={(e) => {
              setArrivalTime(e.target.value);
            }}
          />
        </Form.Group>
        <br />
        <Button variant="warning" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default EditSchedule;
