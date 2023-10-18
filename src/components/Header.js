import React, { useEffect } from "react";
import logo from "../assets/train.png";
import logout from "../assets/logout.svg";
import { useDispatch, useSelector } from "react-redux";


const Header = () => {
  const isLoggedIn = true

  const user = {
    name: "Admin",
    imagePath: "https://www.w3schools.com/howto/img_avatar.png",
  }

  const handleLogout=()=>{
    localStorage.removeItem("isLogin");
    localStorage.removeItem("token");
    window.location.href = '/';
  }

  return (
    <nav className="navbar navbar navbar-expand-lg" style={{ backgroundColor: '#2980B9' }} data-bs-theme="dark">
      <div className="container-fluid">
        <img
            src={logo}
            alt="Bootstrap"
            width="30"
            height="24"
            className="d-inline-block align-text-top"
            >
        </img>
        <a className="navbar-brand" href="/" style={{ paddingLeft: '10px' }}>
              Travel Mate
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
          <div>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {isLoggedIn && user && (
                <>
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img
                        src={user.imagePath}
                        width={30}
                        className="profile_image"
                      ></img>
                      {localStorage.getItem("UserName")}
                    </a>
                    <ul className="dropdown-menu dropdown-menu-start dropdown-menu-lg-start" >
                      <li style={{width:'50px'}}>
                        <a className="dropdown-item" href="/profile">
                          Profile
                        </a>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li style={{width:'50px'}}>
                        <div onClick={handleLogout} className="dropdown-item logout">
                          <i className="fa fa-sign-out"></i>
                          Logout
                        </div>
                      </li>
                    </ul>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
