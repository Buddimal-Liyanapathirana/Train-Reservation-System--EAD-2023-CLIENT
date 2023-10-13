import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import firebase from "../../firebase";
import { Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./travelagentdashboard.css";

function EditReservation(props) {

  const [reservationSeatCount, setReservationSeatCount] = useState("");
  const [reservationFare, setReservationFare] = useState("");
  const [travelerNIC, setTravelerNIC] = useState("");
  const [travelerNICs, setTravelerNICs] = useState([]);
  const [trainNumber, setTrainNumber] = useState("");
  const [trainNumbers, setTrainNumbers] = useState([]);
  const [reservationId, setReservationId] = useState(props.id);
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

  useEffect(() => {
    db.collection("reservations")
      .doc(reservationId.toString())
      .get()
      .then(function (doc) {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          setTravelerNIC(doc.data().travelerNIC);
          setTrainNumber(doc.data().trainNumber);
          setReservationSeatCount(doc.data().reservationSeatCount);
          setReservationFare(doc.data().reservationFare);
        } else {
          // doc.data() will be undefined in this case

          console.log("No such document!");
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
  }, [db, reservationId]);

  function editdata(e) {
    e.preventDefault();
    if (
      window.confirm("Are you sure you want to edit this payment's details?")
    ) {
      alert("Payment details have been successfully edited!");

      const updatedReservation = {
        travelerNIC,
        trainNumber,
        reservationSeatCount,
        reservationFare: parseFloat(reservationFare),
      };

      console.log(updatedReservation);

      db.collection("reservations").doc(reservationId).update(updatedReservation);
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
        <h2 style={{ color: "#f0ad4e" }}>Edit Reservation</h2>
      </center>
      <br />

      <Form onSubmit={editdata}>
        <center>
          <Form.Control
            style={{ width: "400px" }}
            as="select"
            required
            value={travelerNIC}
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
            value={trainNumber}
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
            <Form.Label>Reservation Seat Count</Form.Label>
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

export default EditReservation;
