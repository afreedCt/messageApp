import React, { useState } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginAPI, registerAPI } from "../server/allAPI";
import { Spinner } from "react-bootstrap";

const Home = () => {
  const [login, setLogin] = useState(true);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading,setLoading]=useState(false)

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = userData;
    setLoading(true)
    if (!email || email.trim() === "" || !password || password.trim() === "") {
      toast.warning("Please fill all fields");
      return;
    }
    try {
      const res = await loginAPI({ email, password });
      if (res.status === 401) {
        toast.error("Invalid credentials");
        return;
      }
      if (res.status === 200) {
        navigate("/chats");
        toast.success("Login successful");
        sessionStorage.setItem("user", JSON.stringify(res.data.user));
        setUserData({ username: "", email: "", password: "" });
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error(error.message);
    }finally{
      setLoading(false)

    }
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    const { username, email, password } = userData;
    if (
      !username ||
      username.trim() === "" ||
      !email ||
      email.trim() === "" ||
      !password ||
      password.trim() === ""
    ) {
      toast.warning("Please fill all fields");
      return;
    }
    
    try {
      const res = await registerAPI(userData);
      if (res.status === 400) {
        toast.error("User already exists");
        return;
      }
      if (res.status === 200) {
        navigate("/chats");
        toast.success("Register successful");
        setUserData({ username: "", email: "", password: "" });
        setLogin(true);
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error(error.message);
    }
  };
  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div
        className="auth container-fluid p-4 bg-white shadow-sm rounded "
        style={{ maxWidth: "400px" }}
      >
        <h2 className="fw-bold text-center">
          ChatApp - {login ? "Login" : "Register"}
        </h2>

        <form action="">
          <div className="p-4 d-flex align-items-center flex-column">
            {!login && (
              <FloatingLabel
                controlId="floatingInput"
                label="Username"
                className="mb-3 "
              >
                <Form.Control
                  onChange={(e) =>
                    setUserData({ ...userData, username: e.target.value })
                  }
                  value={userData.username}
                  type="text"
                  placeholder="jhon"
                />
              </FloatingLabel>
            )}

            <FloatingLabel
              controlId="floatingInput"
              label="Email address"
              className="mb-3 "
            >
              <Form.Control
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                value={userData.email}
                type="email"
                placeholder="name@example.com"
              />
            </FloatingLabel>

            <FloatingLabel
              className=""
              controlId="floatingPassword"
              label="Password"
            >
              <Form.Control
                onChange={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
                value={userData.password}
                type="password"
                placeholder="Password"
              />
            </FloatingLabel>

            <div className="mt-2">
              {!login && (
                <p>
                  Already have an acount ?{" "}
                  <span
                    className="fw-bold cursor text-decoration-underline"
                    onClick={() => setLogin(true)}
                  >
                    Login
                  </span>
                </p>
              )}
              {login && (
                <p>
                  Dont have an acount ?{" "}
                  <span
                    className="fw-bold cursor text-decoration-underline"
                    onClick={() => setLogin(false)}
                  >
                    Register
                  </span>
                </p>
              )}
            </div>

            {login && (
              <button
                onClick={handleLogin}
                className="btn btn-light mt-1 w-100"
                disabled={loading}
              >
                 {loading?<Spinner className="ms-2" size="sm" variant="primary" animation="border" />:"Login"}
              </button>
            )}
            {!login && (
              <button
                onClick={handleRegister}
                className="btn btn-light mt-1 w-100"
                disabled={loading}
              >
                {loading?<Spinner className="ms-2" size="sm" variant="primary" animation="border" />:"Register"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
