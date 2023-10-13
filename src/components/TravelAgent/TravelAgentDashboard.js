import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import DisplayTravelers from "./DisplayTravelers";
import AddTraveler from "./AddTraveler";
import EditTraveler from "./EditTraveler";
import AddReservation from "./AddReservation";
import React, { useState } from "react";
import DisplayReservations from "./DisplayReservations";
import EditReservation from "./EditReservation";

function TravelAgentDashboard() {
    const [editingTraveler, setEditingTraveler] = useState("");
    const [editingReservation, setEditingReservation] = useState("");

    function editTravelerHandler(TravID) {
        setEditingTraveler(TravID);
    }

    function editReservationHandler(ResID) {
        setEditingReservation(ResID);
    }

    return (
        <div>
            <Router>
                <Switch>
                    <Route
                        path="/dashboard/TravelAgentDashboard"
                        exact
                        component={(DisplayTravelers, DisplayReservations)}
                    >
                        <DisplayTravelers editTravelerHandler={editTravelerHandler} />
                        <DisplayReservations editReservationHandler={editReservationHandler} />
                    </Route>

                    <Route path="/dashboard/TravelAgentDashboard/AddTraveler">
                        <AddTraveler />
                    </Route>

                    <Route path="/dashboard/TravelAgentDashboard/EditTraveler">
                        <EditTraveler id={editingTraveler} />
                    </Route>

                    <Route path="/dashboard/TravelAgentDashboard/AddReservation">
                        <AddReservation />
                    </Route>

                    <Route path="/dashboard/TravelAgentDashboard/EditReservation">
                        <EditReservation id={editingReservation} />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default TravelAgentDashboard;
