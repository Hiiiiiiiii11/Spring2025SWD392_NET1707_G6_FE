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

export const CustomerCancelOrderAPI = async (orderId) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.post(`${API_URL}/refunds/request/${orderId}`,
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
export const GetAllRefundOrderRequestAPI = async () => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(`${API_URL}/refunds`,
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

export const VertifyRefundOrderRequestAPI = async (refundId, staffId) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.put(`${API_URL}/refunds/${refundId}/verify?staffId=${staffId}&isAccepted=true`,
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
