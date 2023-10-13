import React, { useState, useEffect } from "react";
import firebase from "../../firebase";
import { Link } from "react-router-dom";
import { Table, Button, ButtonGroup, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./travelagentdashboard.css";

function DisplayTravelers(props) {
  const [travelers, setTravelers] = useState([]);
  const [editingTraveler, setEditingTraveler] = useState(props);
  const [searchTerm, setSearchTerm] = useState("");
  const db = firebase.firestore();


  useEffect(() => {
    db.collection("travelers").onSnapshot((snapshot) => {
      const arr = snapshot.docs.map((doc) => ({
        travelerNIC: doc.data().travelerNIC,
        data: doc.data(),
      }));

      setTravelers(arr);
    });
  }, [db]);

  function deleteTraveler(travelerNIC) {
    db.collection("travelers")
      .doc(travelerNIC)
      .delete()
      .then(() => {
        alert(travelerNIC, "Document successfully deleted!");
      })
      .catch((err) => {
        console.error("Error removing document: ", err);
      });
  }

  function editTraveler(id) {
    //alert("Edit Traveler: ", id);
    editingTraveler.editTravelerHandler(id);
  }

  return (
    <div style={{ paddingRight: "20px", paddingLeft: "20px" }}>
      <br />
      <center>
        <Form.Group controlId="formBasicSearchBar">
          <Form.Control
            type="text"
            placeholder="Search by Traveler's NIC..."
            onChange={(event) => {
              setSearchTerm(event.target.value);
            }}
          />
        </Form.Group>
      </center>
      <Link to="/dashboard/TravelAgentDashboard/AddTraveler">
        <Button style={{ borderRadius: "10px 10px 0 0" }} variant="primary">
          Add New Traveler
        </Button>
      </Link>
      <Table bordered size="sm">
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}>Traveler's NIC</th>
            <th style={{ textAlign: "center" }}>
              Traveler's Full Name
            </th>
            <th style={{ textAlign: "center" }}>Traveler's Phone Number</th>
            <th style={{ textAlign: "center" }}>
              Traveler's Email Address
            </th>
            <th style={{ textAlign: "center" }}>
              Traveler's Password
            </th>
            <th style={{ textAlign: "center", verticalAlign: "middle" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {travelers
            .filter((traveler) => {
              if (searchTerm == "") {
                return traveler;
              } else if (
                traveler.travelerNIC
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              ) {
                return traveler;
              }
            })
            .map((traveler) => (
              <tr>
                <td style={{ textAlign: "center" }}>{traveler.travelerNIC}</td>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                  {traveler.data.travelerName}
                </td>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                  {traveler.data.travelerPhone}
                </td>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                  {traveler.data.travelerEmail}
                </td>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                  {traveler.data.travelerPassword}
                </td>
                <td style={{ textAlign: "center" }}>
                  <ButtonGroup>
                    <Link to="/dashboard/TravelAgentDashboard/EditTraveler">
                      <Button
                        style={{ borderRadius: "5px 0 0 5px" }}
                        variant="warning"
                        onClick={() => {
                          editTraveler(traveler.travelerNIC);
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
                          deleteTraveler(traveler.travelerNIC);
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

export default DisplayTravelers;
