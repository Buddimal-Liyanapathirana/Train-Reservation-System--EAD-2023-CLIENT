import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAxiosInstance } from "../utils/axios";
import { Auth } from "../utils/api";
import { useDispatch, useSelector } from 'react-redux';
import { setToken } from '../redux/actions';

const Login = () => {
  const [nic, setNic] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
 
  const handleLogin = async (e) => {
    e.preventDefault();
    try {

      if(nic==="" || password===""){
        displayToast("Please fill all the fields")
        return;
      }

      const res = await getAxiosInstance().post(Auth.login, {
        nic,
        password
      });

      console.log(res.data.data,"Data")
      dispatch(setToken('LOGIN-TOKEN'));
      localStorage.setItem("isLogin", true);
      localStorage.setItem("token", res.data.data);

      displayToast("Successfully logged in")
      window.location.href = '/';

    } catch (error) {
      const message = error.response ? error.response.data.message : "Enexpected error occured . Please contact administrators"
      
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  
  };

  const displayToast = async (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div style={{ margin: "auto", alignItems: "center", padding: "5px" , marginTop:"20px" }}>
        <div
          style={{ margin: "auto", alignItems: "center", textAlign: "center" }}
        >
          <h2>Login</h2>
        </div>
        <form>
          <div className="mb-3">
            <label htmlFor="nic" className="form-label">
              NIC number
            </label>
            <input
              type="text"
              className="form-control"
              id="nic"
              placeholder="138812859v"
              onChange={(e) => setNic(e.target.value)}
            />
          </div>
          <label htmlFor="passord" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="passord"
            className="form-control"
            aria-describedby="passwordHelpBlock"
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <br />
          <center>
            <button onClick={handleLogin} className="btn btn-primary">
              Login
            </button>
          </center>
        </form>
      </div>
    </>
  );
};

export default Login;
