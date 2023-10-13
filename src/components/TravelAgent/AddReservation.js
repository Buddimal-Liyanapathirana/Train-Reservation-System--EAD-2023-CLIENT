import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import firebase from "../../firebase";
import { Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./travelagentdashboard.css";

function AddReservation() {
  const [travelerNICs, setTravelerNICs] = useState([]);
  const [travelerNIC, setTravelerNIC] = useState("");
  const [trainNumbers, setTrainNumbers] = useState([]);
  const [trainNumber, setTrainNumber] = useState("");
  const [reservationSeatCount, setReservationSeatCount] = useState("");
  const [reservationFare, setReservationFare] = useState("");
  const db = firebase.firestore();

  useEffect(() => {
    db.collection("travelers").onSnapshot((snapshot) => {
      const arr = snapshot.docs.map((doc) => doc.data().travelerNIC);
      setTravelerNICs(arr);
    });
  }, [db]);

  useEffect(() => {
    db.collection("trains").onSnapshot((snapshot) => {
      const arr = snapshot.docs.map((doc) => doc.data().trainNumber);
      setTrainNumbers(arr);
    });
  }, [db]);

  function sendData(e) {
    e.preventDefault();
    if (
      window.confirm(
        "Are you sure you want to make a reservation with these details?"
      )
    ) {
      alert("The reservation has been successfully added!");

      const newReservation = {
        travelerNIC,
        trainNumber,
        reservationSeatCount,
        reservationFare: parseFloat(reservationFare),
      };

      console.log(newReservation);

      db.collection("reservations")
        .doc()
        .set(newReservation)
        .then(() => {
          console.log("Document successfully written!");
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });

      setTravelerNIC("");
      setTrainNumber("");
      setReservationSeatCount("");
      setReservationFare("");
    }
  }

  return (
    <div className="container">
      <br />
      <Link to="/dashboard/TravelAgentDashboard">
        <Button variant="primary">Back</Button>
      </Link>
      <br />
      <center>
        <h2 style={{ color: "#f0ad4e" }}>Make New Reservation</h2>
      </center>
      <br />
      <Form onSubmit={sendData}>
        <center>
          <Form.Control
            style={{ width: "400px" }}
            as="select"
            required
            onChange={(e) => {
              setTravelerNIC(e.target.value);
            }}
          >
            <option value="">Select Traveler NIC</option>
            {travelerNICs.map((travelerNIC) => (
              <option value={travelerNIC}>{travelerNIC}</option>
            ))}
          </Form.Control>
          <br />
          <Form.Control
            style={{ width: "400px" }}
            as="select"
            required
            onChange={(e) => {
              setTrainNumber(e.target.value);
            }}
          >
            <option value="">Select Train Number</option>
            {trainNumbers.map((trainNumber) => (
              <option value={trainNumber}>{trainNumber}</option>
            ))}
          </Form.Control>
          <br />
          <Form.Group controlId="formBasicNumber">
            <Form.Label>Seat Count</Form.Label>
            <Form.Control
              type="number"
              placeholder="example: 5"
              required
              value={reservationSeatCount}
              onChange={(e) => {
                setReservationSeatCount(e.target.value);
              }}
            />
          </Form.Group>
          <br />
          <Form.Group controlId="formBasicNumber">
            <Form.Label>Reservation Fare</Form.Label>
            <Form.Control
              type="number"
              placeholder="example: 5000"
              required
              value={reservationFare}
              onChange={(e) => {
                setReservationFare(e.target.value);
              }}
            />
          </Form.Group>

          <br />
          <Button variant="warning" type="submit">
            Submit
          </Button>
        </center>
      </Form>
    </div>
  );
}

export default AddReservation;