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

// Thay bằng URL API thực tế

export const AddProductToCartAPI = async ({ product, quantity }) => {
    try {
        const token = sessionStorage.getItem("token");

        const response = await axios.post(`${API_URL}/cart/add`,
            { product, quantity }, // Đúng cú pháp truyền dữ liệu
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
        throw error.response?.data || "An error occurred while adding the product to cart.";
    }
};


export const UpdateQuantityProductAPI = async (id, quantity) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.put(
            `${API_URL}/cart/update/${id}?quantity=${quantity}`,  // Sửa URL API
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


export const RemoveProductFromCartAPI = async (id) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.delete(`${API_URL}/cart/remove/${id}`,  // Sửa URL API// Body rỗng vì chỉ gửi dữ liệu qua query params
            {
                headers: {
                    Authorization: token,
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
