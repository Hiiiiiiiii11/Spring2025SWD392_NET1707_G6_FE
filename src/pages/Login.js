import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import skincareImage from "../assets/skincare.jpg"; // Đảm bảo đúng đường dẫn

const Login = () => {
  console.log("Login component loaded!");

  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "", rememberMe: false });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/login", formData);
      console.log("Login success:", response.data);
      localStorage.setItem("token", response.data.token);
      if (formData.rememberMe) {
        localStorage.setItem("rememberMe", formData.username);
      } else {
        localStorage.removeItem("rememberMe");
      }
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error.response?.data);
      alert("Sai tài khoản hoặc mật khẩu!");
    }
  };

  return (
    <div className="login-container">
      <img src={skincareImage} alt="Skincare" className="login-image" />
      <h2>Sign in for your beauty</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <div className="login-options">
          <label>
            <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} />
            Remember me
          </label>
          <a href="/forgot-password" className="forgot-password">Forgot password?</a>
        </div>
        <button type="submit">Login</button>
      </form>
      <p className="register-link">
        Don't have an account? <a href="/register">Sign up now</a>
      </p>
    </div>
  );
};

export default Login;
