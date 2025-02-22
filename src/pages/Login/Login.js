import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import skincareImage from "../../assets/skincare.jpg";
import { loginAPI } from "../../services/authService"; // Import service
import "./Login.css";

const Login = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "", rememberMe: false });
  const [errors, setErrors] = useState({}); // State lưu lỗi

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Hàm kiểm tra email hợp lệ
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!formData.email) newErrors.email = "Email is required!";
    else if (!validateEmail(formData.email)) newErrors.email = "Invalid email format!";
    if (!formData.password) newErrors.password = "Password is required!";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const data = await loginAPI(formData);
      sessionStorage.setItem("token", data.token);
      console.log(data.token)
      alert("Login successful!");
      navigate("/");
    } catch (error) {

      alert("Sai tài khoản hoặc mật khẩu!");
    }
  };
  const handleForgotPassword = () => {
    navigate("/forgot-password");
  }
  const handleSignup = () => {
    navigate("/register");
  }
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
          {errors.email && <p className="error-message">{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className="error-message">{errors.password}</p>}

          <div className="login-options">
            <a className="forgot-password"
              onClick={() => { handleForgotPassword() }}>Forgot password?</a>
          </div>
          <button type="submit">Login</button>
        </form>
        <p className="register-link">
          Don't have an account? <a className="signup" onClick={() => { handleSignup() }} >Sign up now</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
