import axios from "axios";

const API_URL = "http://localhost:8080";

export const GetCustomerProfileAPI = async (customerId) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/customers/${customerId}`, {
            headers: {
                Accept: "*/*",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data;
    }
};

export const UpdateCustomerProfileAPI = async (updateData) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.post(`${API_URL}/api/customers/update`, updateData, {
            headers: {
                Accept: "*/*",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data;
    }
};

export const GetStaffProfileAPI = async (staffId) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/customers/${staffId}`, {
            headers: {
                Accept: "*/*",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data;
    }
};