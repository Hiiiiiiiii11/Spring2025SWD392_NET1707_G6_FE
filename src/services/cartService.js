import axios from "axios";

const API_URL = "http://localhost:8080";


export const GetAllProductCartAPI = async () => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(`${API_URL}/cart/view`, {
            withCredentials: true,
            headers: {
                Accept: "*/*",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        throw error.response?.data;
    }
};

export const AddProductToCartAPI = async ({ productId, quantity }) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.post(`${API_URL}/cart/add`, { productId, quantity },
            {
                withCredentials: true,
                headers: {
                    Accept: "*/*",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data;
    }
};
