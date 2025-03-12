import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import skincareImage from "../../assets/skincare.jpg";
import { loginAPI } from "../../services/authService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Kiểm tra email hợp lệ
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      toast.error(" Email is required!");
      return;
    }
    if (!validateEmail(formData.email)) {
      toast.error(" Invalid email format!");
      return;
    }
    if (!formData.password) {
      toast.error(" Password is required!");
      return;
    }

    try {
      const data = await loginAPI(formData);
      sessionStorage.setItem("token", data.token);

      toast.success(" Login successful!", {
        onClose: () => navigate("/"),
      });

    } catch (error) {
      toast.error(" Incorrect email or password!");
    }
  };

  return (
    <div className="login-page">
      <ToastContainer />
      <div className="login-container">
        <img src={skincareImage} alt="Skincare" className="login-image" />
        <h2>Sign in for your beauty</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            name="email"
            placeholder="Username or email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <div className="login-options">
            <a className="forgot-password" onClick={() => navigate("/forgot-password")}>
              Forgot password?
            </a>
          </div>
          <button type="submit">Login</button>
        </form>
        <p className="register-link">
          Don't have an account?{" "}
          <a className="signup" onClick={() => navigate("/register")}>
            Sign up now
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
