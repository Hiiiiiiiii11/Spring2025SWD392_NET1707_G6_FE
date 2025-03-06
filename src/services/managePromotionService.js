import axios from "axios";
const API_URL = "http://localhost:8080";

// Hàm lấy danh sách sản phẩm
export const getAllPromotionAPI = async () => {
    try {
        const token = sessionStorage.getItem("token");
        console.log("Token:", token);
        const response = await axios.get(`${API_URL}/promotions`, {
            headers: {
                Accept: "*/*",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};
export const getPromotionByIdAPI = async (id) => {
    try {
        const token = sessionStorage.getItem("token");
        console.log("Token:", token);
        const response = await axios.get(`${API_URL}/promotions/${id}`, {
            headers: {
                Accept: "*/*",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};



// Hàm tạo sản phẩm mới: nhận dữ liệu JSON có trường imageURL (đã là URL ảnh từ Imgur)
export const createNewPromotionAPI = async (promotion) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.post(`${API_URL}/promotions`, promotion, {
            headers: {
                Accept: "*/*",
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
};

export const deletePromotionAPI = async (id) => {
    try {
        console.log(id)
        const token = sessionStorage.getItem("token");
        console.log("Token:", token);
        const response = await axios.delete(`${API_URL}/promotions/${id}`, {
            headers: {
                Accept: "*/*",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};

export const editPromotionAPI = async (id, promotion) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.put(`${API_URL}/promotions/${id}`, promotion, {
            headers: {
                Accept: "*/*",
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error editing product:", error);
        throw error;
    }
};