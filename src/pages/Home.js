import React, { useState } from "react";
import "./Home.css";

function Home() {
  const [role, setRole] = useState("Guest");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Your message has been sent!");
  };

  return (
    <div className="home-container">
      <h1>Welcome to Skincare Products Sales System</h1>
      <p>Discover the best skincare products tailored for you.</p>

      <div className="role-selector">
        <label>Select Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="Guest">Guest</option>
          <option value="Customer">Customer</option>
          <option value="Staff">Staff</option>
          <option value="Manager">Manager</option>
        </select>
      </div>

      {role === "Guest" && <p>Explore our products and sign up for exclusive deals!</p>}
      {role === "Customer" && <p>Welcome back! Check out our latest skincare collections.</p>}
      {role === "Staff" && <p>Manage product inventory and assist customers efficiently.</p>}
      {role === "Manager" && <p>Oversee sales performance and manage staff operations.</p>}

      <form onSubmit={handleSubmit} className="contact-form">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
}

export default Home;