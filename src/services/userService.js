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



export const GetStaffProfileAPI = async (id) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(`${API_URL}/staff/${id}`, {
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

export const UpdateStaffProfileAPI = async (email, updateData) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.put(`${API_URL}/staff/update?email=${email}`, updateData, {
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