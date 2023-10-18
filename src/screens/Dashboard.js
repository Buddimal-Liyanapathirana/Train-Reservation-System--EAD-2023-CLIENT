import React, { useState } from "react";
import user_icon from "../assets/icons/user-solid.svg";
import dashboard_icon from "../assets/icons/gauge-solid.svg";
import ticket_icon from "../assets/icons/ticket-solid.svg";
import train_icon from "../assets/icons/train-solid.svg";
import track_icon from "../assets/icons/track.svg";
import Home from "../components/Home";
import UserManagement from "../components/UserManagement";
import ReservationManagement from "../components/ReservationManagement";
import TrainManagement from "../components/TrainManagement";
import ScheduleManagement from "../components/ScheduleManagement";
import Profile from "../components/Profile";
import RouteManagement from "../components/RouteManagement";


const Dashboard = () => {
    const [isHomeSelected, setIsHomeSelected]=useState(true)
    const [isUserManagementSelected, setIsUserManagementSelected]=useState(false)
    const [isReservationManagementSelected, setIsReservationManagementSelected]=useState(false)
    const [isTrainManagementSelected, setIsTrainManagementSelected]=useState(false)
    const [isScheduleManagementSelected, setIsScheduleManagementSelected]=useState(false)
    const [isProfileSelected, setIsProfileSelected]=useState(false)
    const [isRouteManagementSelected, setIsRouteManagementSelected]=useState(false)
    
  return (
    <div style={{ display: "flex", width: "100%" }}>
      <div className="nav_side_bar" style={{}}>
        
        <div
          className={isHomeSelected ? "nav_item_selected" : "nav_item"}
          onClick={() => {
            setIsHomeSelected(true);
            setIsUserManagementSelected(false);
            setIsReservationManagementSelected(false);
            setIsTrainManagementSelected(false);
            setIsScheduleManagementSelected(false);
            setIsProfileSelected(false);
            setIsRouteManagementSelected(false);
          }}
        >
          <img width={20} src={dashboard_icon} />
          <div className="nav_text">Home</div>
        </div>

        <div
          className={
            isUserManagementSelected ? "nav_item_selected" : "nav_item"
          }
          onClick={() => {
            setIsHomeSelected(false);
            setIsUserManagementSelected(true);
            setIsReservationManagementSelected(false);
            setIsTrainManagementSelected(false);
            setIsScheduleManagementSelected(false);
            setIsProfileSelected(false);
            setIsRouteManagementSelected(false);
          }}
        >
          <img width={20} src={user_icon} />

          <div className="nav_text">User Management</div>
        </div>

        <div
          className={
            isReservationManagementSelected ? "nav_item_selected" : "nav_item"
          }
          onClick={() => {
            setIsHomeSelected(false);
            setIsUserManagementSelected(false);
            setIsReservationManagementSelected(true);
            setIsTrainManagementSelected(false);
            setIsScheduleManagementSelected(false);
            setIsProfileSelected(false);
            setIsRouteManagementSelected(false);
          }}
        >
          <img width={20} src={ticket_icon} />

          <div className="nav_text">Reservation Management</div>
        </div>

        <div
          className={
            isTrainManagementSelected ? "nav_item_selected" : "nav_item"
          }
          onClick={() => {
            setIsHomeSelected(false);
            setIsUserManagementSelected(false);
            setIsReservationManagementSelected(false);
            setIsTrainManagementSelected(true);
            setIsScheduleManagementSelected(false);
            setIsProfileSelected(false);
            setIsRouteManagementSelected(false);
          }}
        >
          <img width={20} src={train_icon} />

          <div className="nav_text">Train Management</div>
        </div>

        <div
          className={
            isScheduleManagementSelected ? "nav_item_selected" : "nav_item"
          }
          onClick={() => {
            setIsHomeSelected(false);
            setIsUserManagementSelected(false);
            setIsReservationManagementSelected(false);
            setIsTrainManagementSelected(false);
            setIsScheduleManagementSelected(true);
            setIsProfileSelected(false);
            setIsRouteManagementSelected(false);
          }}
        >
          <img width={20} src={track_icon} />

          <div className="nav_text">Schedule Management</div>
        </div>

        <div
          className={
            isRouteManagementSelected ? "nav_item_selected" : "nav_item"
          }
          onClick={() => {
            setIsHomeSelected(false);
            setIsUserManagementSelected(false);
            setIsReservationManagementSelected(false);
            setIsTrainManagementSelected(false);
            setIsScheduleManagementSelected(false);
            setIsProfileSelected(false);
            setIsRouteManagementSelected(true);
          }}
        >
          <img width={20} src={track_icon} />

          <div className="nav_text">Route Management</div>
        </div>

        <div
          className={isProfileSelected ? "nav_item_selected" : "nav_item"}
          onClick={() => {
            setIsHomeSelected(false);
            setIsUserManagementSelected(false);
            setIsReservationManagementSelected(false);
            setIsTrainManagementSelected(false);
            setIsScheduleManagementSelected(false);
            setIsProfileSelected(true);
            setIsRouteManagementSelected(false);
          }}
        >
          <img width={20} src={dashboard_icon} />
          <div className="nav_text">Profile</div>
        </div>
      </div>
      <div className="dash">
        {isHomeSelected && <Home />}
        {isUserManagementSelected && <UserManagement />}
        {isReservationManagementSelected && <ReservationManagement />}
        {isTrainManagementSelected && <TrainManagement />}
        {isScheduleManagementSelected && <ScheduleManagement />}
        {isProfileSelected && <Profile />}
        {isRouteManagementSelected && <RouteManagement />}
      </div>
    </div>
  );
};

export default Dashboard;
