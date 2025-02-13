import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const clientId = "YOUR_GOOGLE_CLIENT_ID"; // Thay bằng Google Client ID
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/login", formData);
      console.log("Login success:", response.data);
      localStorage.setItem("token", response.data.token); // Lưu token vào localStorage
      navigate("/"); // Chuyển hướng về trang chủ sau khi login
    } catch (error) {
      console.error("Login failed:", error.response.data);
      alert("Sai tài khoản hoặc mật khẩu!");
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="login-container">
        <h2>Login</h2>

        {/* Form đăng nhập bằng Username/Password */}
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
          <button type="submit">Login</button>
        </form>

        <p>Or</p>

        {/* Nút đăng nhập bằng Google */}
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            console.log("Google Login Success:", credentialResponse);
            localStorage.setItem("google_token", credentialResponse.credential);
            navigate("/");
          }}
          onError={() => {
            console.log("Google Login Failed");
          }}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
