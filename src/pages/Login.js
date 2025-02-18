import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import skincareImage from "../assets/skincare.jpg";
import { notification } from "antd";

const Login = () => {
  console.log("Login component loaded!");

  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "", rememberMe: false });
  const [errors, setErrors] = useState({}); // Thêm state lưu lỗi

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Hàm kiểm tra email hợp lệ
  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra lỗi trước khi gửi request
    let newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required!";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format!";
    }
    if (!formData.password) {
      newErrors.password = "Password is required!";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/auth/login", formData);
      console.log("Login success:", response.data);
      localStorage.setItem("token", response.data.token);
      if (formData.rememberMe) {
        localStorage.setItem("rememberMe", formData.email);
      } else {
        localStorage.removeItem("rememberMe");
      }
      notification.success({ message: "Login successful!" });
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error.response?.data);
      notification.error({ message: "Sai tài khoản hoặc mật khẩu!" });
    }
  };

  return (
    <div className="login-page">
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
            required
          />
          {errors.email && <p className="error-message">{errors.email}</p>} {/* Hiển thị lỗi email */}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className="error-message">{errors.password}</p>} {/* Hiển thị lỗi password */}

          <div className="login-options">
            <a href="/forgot-password" className="forgot-password">Forgot password?</a>
          </div>
          <button type="submit">Login</button>
        </form>
        <p className="register-link">
          Don't have an account? <a href="/register">Sign up now</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
