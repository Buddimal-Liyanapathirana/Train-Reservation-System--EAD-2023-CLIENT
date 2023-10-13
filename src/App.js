import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./screens/Dashboard";
import AuthScreen from "./screens/AuthScreen";
import Header from "./components/Header";
import { useEffect } from "react";
import Footer from "./components/Footer";
import Profile from "./components/Profile";


function App() {
  

  var isLoggedIn = localStorage.getItem("isLogin");
  var token = localStorage.getItem("token");


  useEffect(() => {
    if (isLoggedIn && isLoggedIn) {
      const getInfo = async () => {
       
      };
      getInfo();
    }
  }, [isLoggedIn, token]);

  return (
    <>
          <Header />
          <main className="main">
            <Router>
              <Routes>
                <Route
                  path="/"
                  element={
                    isLoggedIn ?
                        <Dashboard />
                       : 
                      <AuthScreen />
                  }
                />
                <Route
                  path="/profile"
                  element={
                    isLoggedIn ?      
                        <Profile /> 
                     : 
                      <AuthScreen />
                  }
                />
              </Routes>
            </Router>
          </main>
          <Footer />
        </>
  );
}

export default App;
