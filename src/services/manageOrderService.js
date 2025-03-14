import axios from "axios";

const API_URL = "http://localhost:8080";


export const GetAllCustomerOrderAPI = async () => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(`${API_URL}/orders`, {

            headers: {
                Authorization: token,
                Accept: "*/*",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        throw error.response?.data;
    }
};

export const UpdateCustomerOrderStatusAPI = async (orderId, status) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.put(`${API_URL}/orders/${orderId}/status?status=${status}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "*/*",
                },
            }
        );

        return response.data;
    } catch (error) {
        throw error.response?.data || "Error updating order status";
    }
};
