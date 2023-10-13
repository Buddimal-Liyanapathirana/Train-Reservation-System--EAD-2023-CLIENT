import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./backofficedashboard.css";
import firebase from "../../firebase";

function AddSchedule() {
  const [departureStation, setDepartureStation] = useState("");
  const [arrivalStation, setArrivalStation] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const db = firebase.firestore();

  function sendData(e) {
    e.preventDefault();
    if (
      window.confirm(
        "Are you sure you want to add a traveler with these details?"
      )
    ) {
      alert("Done!");
      const newSchedule = {
        departureStation,
        departureTime,
        departureTime,
        arrivalTime,
      };
      console.log(newSchedule);

      db.collection("schedules")
        .doc()
        .set(newSchedule)
        .then(() => {
          console.log("Document successfully written!");
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });

      setDepartureStation("");
      setArrivalStation("");
      setDepartureTime("");
      setArrivalTime("");
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
        <h2 style={{ color: "#f0ad4e" }}>Add New Schedule</h2>
      </center>
      <Form onSubmit={sendData}>
        <Form.Group controlId="formBasicName">
          <Form.Label>
            Departure Station (Required Format: Must Only Contain Letters and Spaces)
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="example: Kandy"
            required
            pattern="^[A-Za-z\s]+$"
            value={departureStation}
            onChange={(e) => {
              setDepartureStation(e.target.value);
            }}
          />
        </Form.Group>

        <Form.Group controlId="formBasicName">
          <Form.Label>
            Arrival Station (Required Format: Must Only Contain
            Letters and Spaces)
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="example: Colombo"
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

export default AddSchedule;
