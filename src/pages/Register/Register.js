import React, { useState } from "react";
import "./Register.css";
import registerImage from "../../assets/skincare.jpg";
import { notification } from "antd";
import { registerAPI } from "../../services/authService";// Import API service

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Kiểm tra email hợp lệ
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // Kiểm tra mật khẩu mạnh
  const validatePassword = (password) => password.length >= 6 && /\d/.test(password);

  // Kiểm tra số điện thoại hợp lệ (9-11 số)
  const validatePhone = (phone) => /^[0-9]{9,11}$/.test(phone);

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
      const data = await registerAPI(formData);
      console.log("Register success:", data);
      notification.success({ message: "Account created successfully!" });
      // Điều hướng nếu cần
      // navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      notification.error({ message: "Registration failed. Please try again." });
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-image-container">
          <img src={registerImage} alt="Register" className="register-image" />
        </div>

        <div className="register-form-container">
          <h2>Create an Account</h2>
          <form onSubmit={handleSubmit} className="register-form">
            <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} />
            {errors.fullName && <p className="error-message">{errors.fullName}</p>}

            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
            {errors.email && <p className="error-message">{errors.email}</p>}

            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
            {errors.password && <p className="error-message">{errors.password}</p>}

            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
            {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}

            <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
            {errors.phone && <p className="error-message">{errors.phone}</p>}

            <input type="text" name="address" placeholder="Your Address" value={formData.address} onChange={handleChange} />
            {errors.address && <p className="error-message">{errors.address}</p>}

            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
