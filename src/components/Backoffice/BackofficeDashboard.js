import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import DisplaySchedules from "./DisplaySchedules";
import AddSchedule from "./AddSchedule";
import EditSchedule from "./EditSchedule";
import AddTrain from "./AddTrain";
import React, { useState } from "react";
import DisplayTrains from "./DisplayTrains";
import EditTrain from "./EditTrain";

function BackofficeDashboard() {
    const [editingSchedule, setEditingSchedule] = useState("");
    const [editingTrain, setEditingTrain] = useState("");

    function editScheduleHandler(SchedID) {
        setEditingSchedule(SchedID);
    }

    function editTrainHandler(TraID) {
        setEditingTrain(TraID);
    }

    return (
        <div>
            <Router>
                <Switch>
                    <Route
                        path="/dashboard/BackOfficeDashboard"
                        exact
                        component={(DisplaySchedules, DisplayTrains)}
                    >
                        <DisplaySchedules editScheduleHandler={editScheduleHandler} />
                        <DisplayTrains editTrainHandler={editTrainHandler} />
                    </Route>

                    <Route path="/dashboard/BackofficeDashboard/AddSchedule">
                        <AddSchedule />
                    </Route>

                    <Route path="/dashboard/BackofficeDashboard/EditSchedule">
                        <EditSchedule id={editingSchedule} />
                    </Route>

                    <Route path="/dashboard/BackofficeDashboard/AddTrain">
                        <AddTrain />
                    </Route>

                    <Route path="/dashboard/BackofficeDashboard/EditTrain">
                        <EditTrain id={editingTrain} />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default BackofficeDashboard;