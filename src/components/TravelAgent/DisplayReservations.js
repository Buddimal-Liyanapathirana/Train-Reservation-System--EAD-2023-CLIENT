import React, { useState, useEffect } from "react";
import firebase from "../../firebase";
import { Link } from "react-router-dom";
import { Form, Table, Button, ButtonGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function DisplayReservations(props) {
  const [reservations, setReservations] = useState([]);
  const [travelerNICs, setTravelerNICs] = useState([]);
  const [trainSearch, setTrainSearch] = useState("");
  const [trainNumbers, setTrainNumbers] = useState([]);
  const [editingReservation, setEditingReservation] = useState(props);
  const [travelerSearch, setTravelerSearch] = useState("");
  const db = firebase.firestore();

  useEffect(() => {
    db.collection("reservations").onSnapshot((snapshot) => {
      const arr = snapshot.docs.map((doc) => ({
        ID: doc.id,
        data: doc.data(),
      }));

      console.log(arr);
      setReservations(arr);
    });
  }, [db]);

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

  function deleteReservation(ID) {
    db.collection("reservations")
      .doc(ID)
      .delete()
      .then(() => {
        alert("Reservation successfully deleted!");
      })
      .catch((err) => {
        console.error("Error removing document: ", err);
      });
  }

  function editReservation(id) {
    //alert("Edit Reservation: ", id);
    editingReservation.editReservationHandler(id);
  }

  return (
    <div style={{ paddingRight: "20px", paddingLeft: "20px" }}>
      <center>
        <br />
        <h3 style={{ color: "#f0ad4e" }}>
          <b>
            <u>Reservation History</u>
          </b>
        </h3>
        <br />
        <Form.Control
          style={{ width: "250px" }}
          as="select"
          onChange={(event) => {
            setTravelerSearch(event.target.value);
          }}
        >
          <option value="">Select Traveler NIC</option>
          {travelerNICs.map((travelerNICs) => (
            <option value={travelerNICs}>{travelerNICs}</option>
          ))}
        </Form.Control>

        <br />
        <Form.Control
          style={{ width: "250px" }}
          as="select"
          onChange={(event) => {
            setTrainSearch(event.target.value);
          }}
        >
          <option value="">Select Train Number</option>
          {trainNumbers.map((trainNumber) => (
            <option value={trainNumber}>{trainNumber}</option>
          ))}
        </Form.Control>
      </center>
      <br />
      <Link to="/dashboard/TravelAgentDashboard/AddReservation">
        <Button style={{ borderRadius: "10px 10px 0 0" }} variant="primary">
          Make New Reservation
        </Button>
      </Link>

      <Table bordered size="sm">
        <thead>
          <tr>
            <th style={{ display: "none" }}>Document ID</th>
            <th style={{ textAlign: "center" }}>Traveler's NIC</th>
            <th style={{ textAlign: "center" }}>Train Number</th>
            <th style={{ textAlign: "center" }}>Reservation Seat Count</th>
            <th style={{ textAlign: "center" }}>Reservation Fare</th>
            <th style={{ textAlign: "center" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations
            .filter((reservation) => {
              if (travelerSearch == "") {
                return reservation;
              } else if (reservation.data.travelerNIC == travelerSearch) {
                if (trainSearch == "") {
                  return reservation;
                } else if (reservation.data.trainNumber == trainSearch) {
                  return reservation;
                }
              }
            })
            .map((reservation) => (
              <tr>
                <td style={{ display: "none" }}>{reservation.ID}</td>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                  {reservation.data.travelerNIC}
                </td>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                  {reservation.data.trainNumber}
                </td>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                  {reservation.data.reservationSeatCount}
                </td>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                  {reservation.data.reservationFare}
                </td>
                <td style={{ textAlign: "center" }}>
                  <ButtonGroup>
                    <Link to="/dashboard/TravelAgentDashboard/EditReservation">
                      <Button
                        style={{ borderRadius: "5px 0 0 5px" }}
                        variant="warning"
                        onClick={() => {
                          editReservation(reservation.ID);
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
                            "Are you sure you want to delete this payment's details? This action is irreversible!"
                          )
                        ) {
                          deleteReservation(reservation.ID);
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

export default DisplayReservations;
