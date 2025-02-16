import React, { useState } from "react";
import axios from "axios";
import { notification } from "antd";
import "./ForgotPassword.css"; // Thêm CSS nếu cần

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/auth/forgot-password", { email });
      notification.success({ message: "Check your email for reset instructions!" });
      console.log(response.data);
    } catch (error) {
      notification.error({ message: "Failed to reset password. Try again!" });
      console.error("Forgot password error:", error.response?.data);
    }
    setLoading(false);
  };

  return (
    <div className="forgot-password-container">
      <h2>Reset Your Password</h2>
      <p>Enter your email to receive password reset instructions.</p>
      <form onSubmit={handleSubmit} className="forgot-password-form">
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
