import React, { useState } from "react";
import "./Register.css";
import registerImage from "../assets/skincare.jpg"; // Import ảnh
import axios from "axios";
import { notification } from "antd"; // Thêm thư viện notification

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({}); // State lưu lỗi

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Hàm kiểm tra email hợp lệ
  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  // Hàm kiểm tra mật khẩu mạnh
  const validatePassword = (password) => {
    return password.length >= 6 && /\d/.test(password); // Ít nhất 6 ký tự, có số
  };

  // Hàm kiểm tra số điện thoại hợp lệ (chỉ chứa số, độ dài 9-11 số)
  const validatePhone = (phone) => {
    return /^[0-9]{9,11}$/.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!formData.fullName) newErrors.fullName = "Full Name is required!";
    if (!formData.email) {
      newErrors.email = "Email is required!";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format!";
    }
    if (!formData.password) {
      newErrors.password = "Password is required!";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 6 characters and contain a number!";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password!";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match!";
    }
    if (!formData.phone) {
      newErrors.phone = "Phone Number is required!";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Invalid phone number!";
    }
    if (!formData.address) newErrors.address = "Address is required!";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/auth/register", formData);
      console.log("Register success:", response.data);
      notification.success({ message: "Account created successfully!" });
      // Redirect nếu cần
      // navigate("/login");

    } catch (error) {
      console.error("Registration failed:", error.response?.data);
      notification.error({ message: "Registration failed. Please try again." });
    }
  };

  return (
    <div className="register-container">
      <div className="register-image-container">
        <img src={registerImage} alt="Register" className="register-image" />
      </div>

      <div className="register-form-container">
        <h2>Create an Account</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
          />
          {errors.fullName && <p className="error-message">{errors.fullName}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error-message">{errors.password}</p>}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <p className="error-message">{errors.phone}</p>}

          <input
            type="text"
            name="address"
            placeholder="Your Address"
            value={formData.address}
            onChange={handleChange}
          />
          {errors.address && <p className="error-message">{errors.address}</p>}

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
