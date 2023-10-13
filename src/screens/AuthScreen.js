import React, { useState } from "react";
import Login from "../components/Login";
import logo from "../assets/train.png";

const AuthScreen = () => {
  return (
    <div className="auth" style={{marginTop:"60px" }}>
      <center>
        <img width={150} src={logo} />
      </center>
      <div className="container">
        <div className="row justify-content-center">
          <div className="">
                <Login />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
