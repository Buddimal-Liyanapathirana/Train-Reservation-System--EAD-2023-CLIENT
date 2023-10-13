import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./travelagentdashboard.css";
import firebase from "../../firebase";

function AddTraveler() {
  const [travelerNIC, setTravelerNIC] = useState("");
  const [travelerName, setTravelerName] = useState("");
  const [travelerPhone, setTravelerPhone] = useState("");
  const [travelerEmail, setTravelerEmail] = useState("");
  const [travelerPassword, setTravelerPassword] = useState("");
  const db = firebase.firestore();

  function sendData(e) {
    e.preventDefault();
    if (
      window.confirm(
        "Are you sure you want to add a traveler with these details?"
      )
    ) {
      alert("Done!");
      const newTraveler = {
        travelerNIC,
        travelerName,
        travelerPhone,
        travelerEmail,
        travelerPassword,
      };
      console.log(newTraveler);

      db.collection("travelers")
        .doc()
        .set(newTraveler)
        .then(() => {
          console.log("Document successfully written!");
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });

      setTravelerNIC("");
      setTravelerName("");
      setTravelerPhone("");
      setTravelerEmail("");
      setTravelerPassword("");
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
        <h2 style={{ color: "#f0ad4e" }}>Add New Traveler</h2>
      </center>
      <Form onSubmit={sendData}>
        <Form.Group controlId="formBasicName">
          <Form.Label>
            Traveler's NIC (Required Format: Can Not Contain Letters and Spaces)
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="example: N5755679"
            required
            pattern="/^[^A-Za-z\s]+$/"
            value={travelerNIC}
            onChange={(e) => {
              setTravelerNIC(e.target.value);
            }}
          />
        </Form.Group>

        <Form.Group controlId="formBasicName">
          <Form.Label>
            Traveler's Full Name (Required Format: Must Only Contain
            Letters and Spaces)
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="example: Bangelina Molie"
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
            placeholder="example: 0764204204"
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
            pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@#$%^&+=!])(?!.*\s).{12,}$"
            value={travelerPassword}
            onChange={(e) => {
              setTravelerPassword(e.target.value);
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

export default AddTraveler;
