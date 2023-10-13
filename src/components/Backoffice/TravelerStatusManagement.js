import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, Button, ButtonGroup, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./backofficedashboard.css";

function TravelerStatusManagement() {
  const [travelers, setTravelers] = useState([]);
  const [isChecked, setIsChecked] = useState(false);

  const handleToggleChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div style={{ paddingRight: "20px", paddingLeft: "20px" }}>
      <br />
      <center>
        <Form.Group controlId="formBasicSearchBar">
          <Form.Control
            type="text"
            placeholder="Search by Traveler's NIC..."
          />
        </Form.Group>
      </center>
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

          <tr>
            <td style={{ textAlign: "center" }}></td>
            <td style={{ textAlign: "center", verticalAlign: "middle" }}>

            </td>
            <td style={{ textAlign: "center", verticalAlign: "middle" }}>

            </td>
            <td style={{ textAlign: "center", verticalAlign: "middle" }}>

            </td>
            <td style={{ textAlign: "center", verticalAlign: "middle" }}>

            </td>
            <td style={{ textAlign: "center", verticalAlign: "middle" }}>
              <Form.Check
                type="switch"
                id="traveler-status-switch"
                checked={isChecked}
                onChange={handleToggleChange}
              />

            </td>
          </tr>

        </tbody>
      </Table>
    </div>
  );
}

export default TravelerStatusManagement;
