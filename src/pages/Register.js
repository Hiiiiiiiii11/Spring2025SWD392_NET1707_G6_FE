import React, { useState } from "react";
import "./Register.css";
import registerImage from "../assets/skincare.jpg"; // Import ảnh
import axios from "axios";
const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/auth/register", formData);
      console.log("Register success:", response.data);
      alert("Account created successfully!");
      // Optionally, you can redirect to login or home page after successful registration.
      // navigate("/login"); // or navigate("/");

    } catch (error) {
      console.error("Registration failed:", error.response?.data);
      alert("Registration failed. Please try again.");
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
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
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
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Your address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
