import axios from "axios";

const API_URL = "http://localhost:8080";

export const SendReviewproductAPI = async (reviewData) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.post(`${API_URL}/reviews`, reviewData, {
            headers: {
                Accept: "*/*",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        return null;
    }
};

export const GetReviewByIdAPI = async (reviewId) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(`${API_URL}/reviews/${reviewId}`, {
            headers: {
                Accept: "*/*",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        return null;
    }
};
export const GetReviewProductByProductIdAPI = async (productId) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(`${API_URL}/reviews/product/${productId}`, {
            headers: {
                Accept: "*/*",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        return null;
    }
};
export const UpdateReviewProductByIdAPI = async (reviewId, reviewData) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.put(`${API_URL}/reviews/${reviewId}`, reviewData, {
            headers: {
                Accept: "*/*",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        return null;
    }
};