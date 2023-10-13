import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, Button, ButtonGroup, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./backofficedashboard.css";

function DisplayTrains() {
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
            placeholder="Search by Train's Name..."
          />
        </Form.Group>
      </center>
      <Button style={{ borderRadius: "10px 10px 0 0" }} variant="primary">
        Add Train
      </Button>
      <Table bordered size="sm">
        <thead>
          <tr>
            <th style={{ display: "none" }}>Train ID</th>
            <th style={{ textAlign: "center" }}>
              Train Name
            </th>
            <th style={{ textAlign: "center" }}>Luxury Seat Count</th>
            <th style={{ textAlign: "center" }}>
              Economy Seat Count
            </th>
            <th style={{ textAlign: "center" }}>
              Schedule
            </th>
            <th style={{ textAlign: "center" }}>
              Status
            </th>
            <th style={{ textAlign: "center", verticalAlign: "middle" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ display: "none" }}></td>
            <td style={{ textAlign: "center", verticalAlign: "middle" }}>

            </td>
            <td style={{ textAlign: "center", verticalAlign: "middle" }}>

            </td>
            <td style={{ textAlign: "center", verticalAlign: "middle" }}>

            </td>
            <td style={{ textAlign: "center", verticalAlign: "middle" }}>

            </td>
            <td style={{ textAlign: "center", verticalAlign: "middle" }}>
              <Form>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  checked={isChecked}
                  onChange={handleToggleChange}
                />
              </Form>
            </td>
            <td style={{ textAlign: "center" }}>
              <ButtonGroup>

                <Button
                  style={{ borderRadius: "5px 0 0 5px" }}
                  variant="warning"

                >
                  Edit
                </Button>

                <Button
                  style={{ borderRadius: "0 5px 5px 0" }}
                  variant="danger"
                >
                  Delete
                </Button>
              </ButtonGroup>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}

export default DisplayTrains;
