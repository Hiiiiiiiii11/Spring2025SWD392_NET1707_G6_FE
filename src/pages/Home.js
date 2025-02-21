import React, { useState } from "react";
import { Carousel, Card, Row, Col, Form, Input, Button, message } from "antd";
import { MailOutlined, UserOutlined } from "@ant-design/icons";
import "./Home.css";
import heroImage from "../assets/hero.jpg"; // Ảnh nền hero
import product1 from "../assets/product1.jpg"; // Ảnh sản phẩm 1
import product2 from "../assets/product2.jpg"; // Ảnh sản phẩm 2
import product3 from "../assets/product3.jpg"; // Ảnh sản phẩm 3
import product4 from "../assets/product4.jpg"; // Ảnh sản phẩm 4
import product5 from "../assets/product5.jpg"; // Ảnh sản phẩm 5
import product6 from "../assets/product6.jpg"; // Ảnh sản phẩm 6
import Header from "../components/Header";
import Footer from "../components/Footer";

const { Meta } = Card;
const { TextArea } = Input;

function Home() {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    // Xử lý gửi form (có thể call API, v.v.)
    message.success("Your message has been sent!");
    form.resetFields();
  };

  // Dữ liệu sản phẩm
  const products = [
    { id: 1, name: "Moisturizing Cream", price: "$25.99", image: product1 },
    { id: 2, name: "Vitamin C Serum", price: "$30.99", image: product2 },
    { id: 3, name: "Sunscreen SPF 50", price: "$19.99", image: product3 },
    { id: 4, name: "Hydrating Toner", price: "$22.99", image: product4 },
    { id: 5, name: "Anti-Aging Cream", price: "$35.99", image: product5 },
    { id: 6, name: "Exfoliating Scrub", price: "$18.99", image: product6 },
  ];

  return (
    <div>
      <Header />
      <div className="home-container">
        {/* Hero Section */}
        <div
          className="hero"
          style={{
            backgroundImage: `url(${heroImage})`,
            height: "400px",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Product Section */}
        <section className="product-section">
          <h2>Featured Products</h2>
          <Row gutter={[16, 16]}>
            {products.map((product) => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={product.name}
                      src={product.image}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  }
                >
                  <Meta title={product.name} description={product.price} />
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Contact Form Section */}
        <section className="contact-section" style={{ background: "rgb(240 251 254)", padding: "40px 0" }}>
          <h2 style={{ textAlign: "center", marginBottom: "24px" }}>Contact Us</h2>
          <div className="contact-form-container" style={{ maxWidth: "600px", margin: "0 auto" }}>
            <Form form={form} layout="vertical" onFinish={handleFinish}>
              <Form.Item
                name="name"
                label="Your Name"
                rules={[{ required: true, message: "Please enter your name!" }]}
              >
                <Input placeholder="Enter your name" prefix={<UserOutlined />} />
              </Form.Item>
              <Form.Item
                name="email"
                label="Your Email"
                rules={[
                  { required: true, message: "Please enter your email!" },
                  { type: "email", message: "Invalid email format!" },
                ]}
              >
                <Input placeholder="Enter your email" prefix={<MailOutlined />} />
              </Form.Item>
              <Form.Item
                name="message"
                label="Your Message"
                rules={[{ required: true, message: "Please enter your message!" }]}
              >
                <TextArea rows={4} placeholder="Enter your message" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Send Message
                </Button>
              </Form.Item>
            </Form>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
