import axios from "axios";

const API_URL = "http://localhost:8080/auth";


export const loginAPI = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/login`, formData);
        return response.data;
    } catch (error) {
        throw error.response?.data || "Login failed";
    }
};


export const registerAPI = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, formData);
        return response.data;
    } catch (error) {
        throw error.response?.data || "Registration failed";
    }
};





