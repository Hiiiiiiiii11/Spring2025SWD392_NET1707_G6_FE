import React, { useState } from "react";
import "./Home.css";
import heroImage from "../assets/hero.jpg"; // Ảnh nền hero
import product1 from "../assets/product1.jpg"; // Ảnh sản phẩm 1
import product2 from "../assets/product2.jpg"; // Ảnh sản phẩm 2
import product3 from "../assets/product3.jpg"; // Ảnh sản phẩm 3
import product4 from "../assets/product4.jpg"; // Ảnh sản phẩm 4
import product5 from "../assets/product5.jpg"; // Ảnh sản phẩm 5
import product6 from "../assets/product6.jpg"; // Ảnh sản phẩm 6
import contactBg from "../assets/contact-bg.jpg"; // Ảnh nền form liên hệ
import Header from "../components/Header";
import Footer from "../components/Footer";

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
      <Header />
      {/* Hero Section */}
      <div className="hero" style={{ backgroundImage: `url(${heroImage})` }}>
      </div>

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
          <div className="product-card">
            <img src={product4} alt="Product 4" />
            <h3>Hydrating Toner</h3>
            <p>$22.99</p>
          </div>
          <div className="product-card">
            <img src={product5} alt="Product 5" />
            <h3>Anti-Aging Cream</h3>
            <p>$35.99</p>
          </div>
          <div className="product-card">
            <img src={product6} alt="Product 6" />
            <h3>Exfoliating Scrub</h3>
            <p>$18.99</p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="contact-section" >
        <h2>Contact Us</h2>
        <div className="contact-overlay">
          <div>
            <form onSubmit={handleSubmit} className="contact-form">
              <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
              <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
              <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} required></textarea>
              <button type="submit">Send Message</button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Home;
