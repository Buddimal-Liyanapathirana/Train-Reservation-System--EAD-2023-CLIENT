// Import necessary dependencies
import React, { useEffect, useState } from "react";
import { getAxiosInstance } from "../utils/axios";
import "react-toastify/dist/ReactToastify.css";
import { Users } from "../utils/api";
import { Table, Pagination, Dropdown, Modal, Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import {toastConfig} from "../utils/toastConfig";

// Define the UserManagement component
const UserManagement = () => {
  // State variables
  const [token, setToken] = useState("");
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(8);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showEditUserModel, setShowEditUserModal] = useState(false);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [editPw, setEditPw] = useState("");

  const [createUserData, setCreateUserData] = useState({
    userNIC: "",
    userName: "",
    userEmail: "",
    userPassword: "",
    userRole: ""
  });
  
  const [editUserData, setEditUserData] = useState({
    userName: "",
    userEmail: "",
    userPassword: "",
    userRole: ""
  });

  const resetCreateUserData = () => {
    // Reset create user form data
    setCreateUserData({
      userNIC: "",
      userName: "",
      userEmail: "",
      userPassword: "",
      userRole: ""
    });
  };

  const resetEditUserData = () => {
    // Reset update user form data
    setEditUserData({
      userName: "",
      userEmail: "",
      userPassword: "",
      userRole: ""
    });
  };

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    getUsers();
  }, []);

  const getUsers = async () => {
    // Fetch users from the server
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("UserRole");
    try {
      const res = await getAxiosInstance().get(Users.getAll, {
        headers: { Authorization: `bearer ${token}` },
      });
      const users = res.data.data;
      const filteredUsers = filterUsers(users,role)
      setUsers(filteredUsers);
    } catch (error) {
      const message = error.response
        ? error.response.data.message
        : "Unexpected error occurred. Please contact administrators.";
      console.error(message);
    }
  };

  const filterUsers = (users, role) => {
    const normalUsers = users.filter(user => user.role !== "SUPER_USER")
    if(role === "SUPER_USER"){
      return normalUsers
    }else{
      return normalUsers.filter(user => user.role === "TRAVELER")
    }

  }

  const handleCreateUser = async () => {
    if(!validateInputs()){
      await displayToast("Please fill all the fields", false);
      return;
    }
    const token = localStorage.getItem("token");
    try {
      const res = await getAxiosInstance().post(Users.create, createUserData, {
        headers: { Authorization: `bearer ${token}` },
      });
      handleCloseCreateUserModal();
      resetCreateUserData();
      await displayToast(res.data.message, res.data.success);
    } catch (error) {
      const message = error.response
        ? error.response.data.message
        : "Unexpected error occurred. Please contact administrators.";
      console.error(message);
    }
  };

  const handleUpdateUser = async () => {
      // Handle update user form submit
      if(!validateEditInputs()){
        await displayToast("Please fill all the fields", false);
        return;
      }
      const token = localStorage.getItem("token");
      console.log(editUserData , selectedUser.nic)
      try {
        const res = await getAxiosInstance().put(Users.update+"/"+selectedUser.nic, editUserData, {
          headers: { Authorization: `bearer ${token}` },
        });
        handleCloseCreateUserModal();
        resetCreateUserData();
        await displayToast(res.data.message, res.data.success);
      } catch (error) {
        const message = error.response
          ? error.response.data.message
          : "Unexpected error occurred. Please contact administrators.";
        console.error(message);
      }
    };

    const handleDeactivateUser = async () => {
      //Handle deactivation of a user
      try {
        const res = await getAxiosInstance().put(Users.deactivate + "/" + selectedUser.nic, {
          headers: { Authorization: `bearer ${token}` },
        });
        updateUser(selectedUser.nic,false)
        handleCloseUserInfoModal();
        await displayToast(res.data.message, res.data.success);
      } catch (error) {
        const message = error.response
          ? error.response.data.message
          : "Unexpected error occurred. Please contact administrators.";
        await displayToast(message, false);
      }
    };

    const handleActivateUser = async () => {
      //Handle activation of a user
      try {
        const res = await getAxiosInstance().put(Users.activate + "/" + selectedUser.nic, {
          headers: { Authorization: `bearer ${token}` },
        });
        handleCloseUserInfoModal();
        updateUser(selectedUser.nic,true)
        await displayToast(res.data.message, res.data.success);
      } catch (error) {
        const message = error.response
          ? error.response.data.message
          : "Unexpected error occurred. Please contact administrators.";
        await displayToast(message, false);
      }
    };

    const handleDeleteUser = async (nic) => {
      try {
        const res = await getAxiosInstance().delete(Users.delete + "/" + selectedUser.nic, {
          headers: { Authorization: `bearer ${token}` },
        });
        handleCloseUserInfoModal();
        removeUser(selectedUser.nic);
        await displayToast(res.data.message, res.data.success);
      } catch (error) {
        const message = error.response
          ? error.response.data.message
          : "Unexpected error occurred. Please contact administrators.";
        await displayToast(message, false);
      }
    };

  const displayToast = async (message,success) => {
    //display toast messages
    if(success){
      toast.success(message, toastConfig);
    }else{
      toast.error(message,toastConfig)
    }
  }

  const removeUser = (userNICToRemove) => {
    // Remove user from UI state upon deletion
    const updatedUsers = users.filter((user) => user.nic !== userNICToRemove);
    setUsers(updatedUsers);
  };

  const handleRowClick = (user) => {
    // Handle row click to show user details
    setSelectedUser(user);
    setShowUserInfoModal(true);
  };

  const handleCloseUserInfoModal = () => {
    // Handle close user info modal
    setSelectedUser(null);
    setShowUserInfoModal(false);
  };

  const handleCloseCreateUserModal = () => {
    // Handle close create user modal
    setSelectedUser(null);
    setShowCreateUserModal(false);
  };

  const updateUser = (nic,activation) => {
    //update train active status state in the UI
    const index = users.findIndex(user => user.nic === nic);
    if (index !== -1) {
      const updatedUser = { ...users[index], isActive: activation };
      const updatedUsers = [...users.slice(0, index), updatedUser, ...users.slice(index + 1)];
      setUsers(updatedUsers);
    }
  };

  
  const handleEditUserClick = (user) => {
    setSelectedUser(user)
    setEditUserData({
      userName: user.userName,
      userEmail: user.email,
      userPassword: "",
      userRole: user.role
    })
    setShowEditUserModal(true)
    //update train active status state in the UI
 
  };
  const handleCloseEditUserModal = () => {
    setShowEditUserModal(false)
    //update train active status state in the UI
 
  };
  const handleCreateUserFormChange = (e) => {
    // Handle change in create user form inputs
    const { name, value } = e.target;
    setCreateUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleEditUserFormChange = (e) => {
    // Handle change in create user form inputs
    const { name, value } = e.target;
    setEditUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const validateInputs = () => {
    // Validate create user form inputs
    if (
      createUserData.userNIC === "" ||
      createUserData.userName === "" ||
      createUserData.userEmail === "" ||
      createUserData.userPassword === "" ||
      createUserData.userRole === ""
    ) {
      return false;
    }
    return true;
  }

  const validateEditInputs = () => {
    // Validate edit user form inputs
    if (
      editUserData.userName === "" ||
      editUserData.userEmail === "" ||
      editUserData.userRole === ""
    ) {
      return false;
    }
    return true;
  }

  const displayUserInfoModal = () => {
    // Display user info modal for row click
    return (
      <Modal show={showUserInfoModal} onHide={handleCloseUserInfoModal}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "black" }}>User Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div style={{ color: "black" }}>
              <p>
                <strong>NIC:</strong> {selectedUser.nic}
              </p>
              <p>
                <strong>Name:</strong> {selectedUser.userName}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email || "N/A"}
              </p>
              <p>
                <strong>Activation Status:</strong>{" "}
                {selectedUser.isActivationPending ? "Pending" : "Activated"}
              </p>
              <p>
                <strong>Reservations:</strong>{" "}
                {selectedUser.reservationIds.length > 0 ? "Yes" : "No"}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUserInfoModal}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            Delete
          </Button>
          {selectedUser&& selectedUser.isActive ? <Button variant="warning" onClick={handleDeactivateUser}>
            Deactivate
          </Button>:
          <Button variant="success" onClick={handleActivateUser}>
            Activate
          </Button>}
        </Modal.Footer>
      </Modal>
    );
  };

  const displayCreateUserForm = () => {
    // Display create user modal form
    return (
      <Modal show={showCreateUserModal} onHide={handleCloseCreateUserModal}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "black" }}>Create User</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: "black" }}>
          <Form>
            <Form.Group controlId="formNIC">
              <Form.Label>NIC</Form.Label>
              <Form.Control
                type="text"
                placeholder="NIC"
                name="userNIC"
                value={createUserData.userNIC}
                onChange={handleCreateUserFormChange}
              />
            </Form.Group>

            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                name="userName"
                value={createUserData.userName}
                onChange={handleCreateUserFormChange}
              />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                name="userEmail"
                value={createUserData.userEmail}
                onChange={handleCreateUserFormChange}
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="userPassword"
                value={createUserData.userPassword}
                onChange={handleCreateUserFormChange}
              />
            </Form.Group>

            <Form.Group controlId="formRole">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                name="userRole"
                value={createUserData.userRole}
                onChange={handleCreateUserFormChange}
              >
                <option value="">Select a role</option>
                <option value="TRAVELER">Traveler</option>
                {/* Add other roles as needed */}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCreateUserModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateUser}>
            Create User
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const displayEditUserForm = () => {
    // Display create user modal form
    return (
      <Modal show={showEditUserModel} onHide={handleCloseEditUserModal}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "black" }}>Update User</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: "black" }}>
          <Form>

            <Form.Group controlId="formNIC">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Username"
                name="userName"
                value={editUserData.userName}
                onChange={handleEditUserFormChange}
              />
            </Form.Group>
 
            <Form.Group controlId="formName">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Email"
                name="userEmail"
                value={editUserData.userEmail}
                onChange={handleEditUserFormChange}
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="text"
                placeholder="Role"
                name="userRole"
                value={editUserData.userRole}
                onChange={handleEditUserFormChange}
                disabled={true}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditUserModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateUser}>
            Edit User
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const renderTableRows = () => {
    // Render table rows
    return currentUsers.map((user) => (
      <tr key={user.nic}>
        <td  onClick={() => handleRowClick(user)}>{user.nic}</td>
        <td  onClick={() => handleRowClick(user)}>{user.userName}</td>
        <td  onClick={() => handleRowClick(user)}>{user.email || "N/A"}</td>
        <td  onClick={() => handleRowClick(user)}>
        <span
            style={{
              height: '10px',
              width: '10px',
              borderRadius: '50%',
              display: 'inline-block',
              backgroundColor: user.isActive ? 'green' : 'red',
              marginRight: '5px',
            }}
            
          ></span>
          {user.isActive? "Active" : "Inactive"}
        </td>
        <td  onClick={() => handleRowClick(user)}>{user.isActivationPending ? "Yes" : "No"}</td>
        <td  onClick={() => handleRowClick(user)}>{user.reservationIds.length > 0 ? user.reservationIds.length : "No"}</td>
        <td className="justify-content-center">
          <Button style={{marginLeft:'80px'}} variant="success" onClick={() => handleEditUserClick(user)}> Edit </Button>
        </td>
      </tr>
    ));
  };

  // Pagination properties
  const totalPages = Math.ceil(users.length / perPage);
  const indexOfLastUser = currentPage * perPage;
  const indexOfFirstUser = indexOfLastUser - perPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <h2 style={{ color: "#4F4F4F" }}>Users</h2>
        <Button
          onClick={() => setShowCreateUserModal(true)}
          variant="success"
          style={{ color: "white", marginRight: "67px" }}
        >
          Create
        </Button>
      </div>
      <ToastContainer />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>NIC</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Requested Activation</th>
            <th>Reservations</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{renderTableRows()}</tbody>
      </Table>

      <div style={{display:"flex", flexDirection:'row'}}>
      <Pagination style={{marginRight:'10px'}} >
        <Pagination.Prev
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {Array.from({ length: totalPages }).map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
      </Pagination>

      <Dropdown>
        <Dropdown.Toggle variant="success" id="pagination-dropdown">
          Per Page: {perPage}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {[5, 8].map((option) => (
            <Dropdown.Item key={option} onClick={() => setPerPage(option)}>
              {option}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      </div>
      {displayUserInfoModal()}
      {displayCreateUserForm()}
      {displayEditUserForm()}
    </div>
  );
};

export default UserManagement;
