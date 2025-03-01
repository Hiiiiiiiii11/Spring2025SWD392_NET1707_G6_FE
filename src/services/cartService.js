import axios from "axios";

const API_URL = "http://localhost:8080";


export const GetAllProductCartAPI = async () => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(`${API_URL}/cart/view`, {

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

export const AddProductToCartAPI = async ({ product }) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.post(`${API_URL}/cart/add`, { product },
            {
                headers: {
                    Authorization: token,
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

export const UpdateQuantityProductAPI = async (id, quantity) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.put(
            `${API_URL}/cart/reduce/${id}?quantity=${quantity}`,  // Sửa URL API
            {}, // Body rỗng vì chỉ gửi dữ liệu qua query params
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "*/*",
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data;
    }
};
