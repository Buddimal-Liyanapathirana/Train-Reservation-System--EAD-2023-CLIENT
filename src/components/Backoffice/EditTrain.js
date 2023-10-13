import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./backofficedashboard.css";

function EditTrain() {

    return (
        <div className="container">
            <br />

            <Button variant="primary">Back</Button>

            <br />
            <center>
                <h2 style={{ color: "#f0ad4e" }}>Edit Train</h2>
            </center>
            <Form>
                <Form.Group controlId="formBasicName">
                    <Form.Label>
                        Train Name (Required Format: Must Only Contain
                        Letters and Spaces)
                    </Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="example: Podi Manike"
                        required
                        pattern="^[A-Za-z\s]+$"
                    />
                </Form.Group>
                <br />
                <Form.Control
                    style={{ width: "400px" }}
                    as="select"
                    required
                >
                    <option value="">Select Schedule</option>
                </Form.Control>
                <br />

                <Form.Group controlId="formBasicNumber">
                    <Form.Label>Luxury Seat Count</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="example: 5"
                        required
                    />
                </Form.Group>
                <br />
                <Form.Group controlId="formBasicNumber">
                    <Form.Label>Economy Seat Count</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="example: 5"
                        required
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

export default EditTrain;