import axios from "axios";

const API_URL = "http://localhost:8080";


export const GetAllHistoryOrderAPI = async (customerId) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(`${API_URL}/orders/customer/${customerId}`, {

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