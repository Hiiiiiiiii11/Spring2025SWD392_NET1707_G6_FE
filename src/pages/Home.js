import React, { useState } from "react";
import "./Home.css";
import heroImage from "../assets/hero.jpg"; // Ảnh nền hero
import product1 from "../assets/product1.jpg"; // Ảnh sản phẩm 1
import product2 from "../assets/product2.jpg"; // Ảnh sản phẩm 2
import product3 from "../assets/product3.jpg"; // Ảnh sản phẩm 3
import contactBg from "../assets/contact-bg.jpg"; // Ảnh nền form liên hệ

function Home() {
  const [role, setRole] = useState("Guest");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Your message has been sent!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <h2>Skincare Products</h2>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Shop</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <header className="hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="hero-overlay">
          <h1>Welcome to Skincare Products Sales System</h1>
          <p>Discover the best skincare products tailored for you.</p>
        </div>
      </header>

      {/* Role Selection */}
      <div className="role-selector">
        <label>Select Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="Guest">Guest</option>
          <option value="Customer">Customer</option>
          <option value="Staff">Staff</option>
          <option value="Manager">Manager</option>
        </select>
      </div>

      <p className="role-message">
        {role === "Guest" && "Explore our products and sign up for exclusive deals!"}
        {role === "Customer" && "Welcome back! Check out our latest skincare collections."}
        {role === "Staff" && "Manage product inventory and assist customers efficiently."}
        {role === "Manager" && "Oversee sales performance and manage staff operations."}
      </p>

      {/* Product Section */}
      <section className="product-section">
        <h2>Featured Products</h2>
        <div className="product-list">
          <div className="product-card">
            <img src={product1} alt="Product 1" />
            <h3>Moisturizing Cream</h3>
            <p>$25.99</p>
          </div>
          <div className="product-card">
            <img src={product2} alt="Product 2" />
            <h3>Vitamin C Serum</h3>
            <p>$30.99</p>
          </div>
          <div className="product-card">
            <img src={product3} alt="Product 3" />
            <h3>Sunscreen SPF 50</h3>
            <p>$19.99</p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="contact-section" style={{ backgroundImage: `url(${contactBg})` }}>
        <div className="contact-overlay">
          <h2>Contact Us</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
            <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} required></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Skincare Products Sales System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
