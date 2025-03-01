import axios from "axios";

const API_URL = "http://localhost:8080";


export const GetAllProductCartAPI = async () => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(`${API_URL}/cart/view`, {
            headers: {
                token,
                Accept: "*/*",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        throw error.response?.data;
    }
};

export const AddProductToCartAPI = async ({ product }) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.post(`${API_URL}/cart/add`, token, { product },
            {
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
