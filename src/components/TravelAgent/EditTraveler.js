import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import firebase from "../../firebase";
import { Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./travelagentdashboard.css";

function EditTraveler(props) {
  const [travelerNIC, setTravelerNIC] = useState(props.id);
  const [travelerName, setTravelerName] = useState("");
  const [travelerPhone, setTravelerPhone] = useState("");
  const [travelerEmail, setTravelerEmail] = useState("");
  const [travelerPassword, setTravelerPassword] = useState("");
  const db = firebase.firestore();

  useEffect(() => {
    db.collection("travelers")
      .where("travelerNIC", "==", travelerNIC)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          setTravelerName(doc.data().travelerName);
          setTravelerPhone(doc.data().travelerPhone);
          setTravelerEmail(doc.data().travelerEmail);
          setTravelerPassword(doc.data().travelerPassword);
        } else {
          console.log("No such document!");
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
  }, [db, travelerNIC]);

  function editdata(e) {
    e.preventDefault();
    if (
      window.confirm("Are you sure you want to edit this traveler's details?")
    ) {
      alert("Traveler details have been successfully edited.");
      const updatedTraveler = {
        travelerNIC,
        travelerName,
        travelerPhone,
        travelerEmail,
        travelerPassword,
      };
      console.log(updatedTraveler);

      db.collection("travelers").doc(travelerNIC).update(updatedTraveler);
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
        <h2 style={{ color: "#f0ad4e" }}>Edit Traveler</h2>
      </center>
      <Form onSubmit={editdata}>
        <Form.Group controlId="formBasicName">
          <Form.Label>
            Traveler's Full Name (Required Format: Must Only Contain
            Letters and Spaces)
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="example: Prad Bitt"
            required
            pattern="^[A-Za-z \s*]+$"
            value={travelerName}
            onChange={(e) => {
              setTravelerName(e.target.value);
            }}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPhoneNo">
          <Form.Label>
            Traveler's Contact Number (Required Format: Must
            Only Contain Ten Numbers)
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="example: 0776499829"
            required
            pattern="[0-9]{10}"
            value={travelerPhone}
            onChange={(e) => {
              setTravelerPhone(e.target.value);
            }}
          />
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>
            Traveler's Email Address (Required Format: Must
            Match Standard E-mail Formal As Shown In Example)
          </Form.Label>
          <Form.Control
            type="email"
            placeholder="example: bangelina.molie@gmail.com"
            required
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            value={travelerEmail}
            onChange={(e) => {
              setTravelerEmail(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group controlId="formBasicName">
          <Form.Label>
            Traveler's Password (Required Format: include a mix of uppercase letters, lowercase letters, digits, and special characters,
            with a minimum length of 12 characters and no whitespace allowed)
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="example: P@ssw0rd#2023!"
            required
            pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@#$%^&+=!])(?!.*\s).{12,}$"
            value={travelerPassword}
            onChange={(e) => {
              setTravelerPassword(e.target.value);
            }}
          />
        </Form.Group>
        <Button variant="warning" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default EditTraveler;
