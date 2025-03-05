import axios from "axios";
const API_URL = "http://localhost:8080";

// Hàm lấy danh sách sản phẩm
export const getAllBatchAPI = async () => {
    try {
        const token = sessionStorage.getItem("token");
        console.log("Token:", token);
        const response = await axios.get(`${API_URL}/productBatch`, {
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
export const getBatchByIdAPI = async (batchId) => {
    try {
        const token = sessionStorage.getItem("token");
        console.log("Token:", token);
        const response = await axios.get(`${API_URL}/productBatch/${batchId}`, {
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
export const createNewBatchAPI = async (BatchData) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.post(`${API_URL}/productBatch`, BatchData, {
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

export const deleteBatchAPI = async (batchId) => {
    try {
        const token = sessionStorage.getItem("token");
        console.log("Token:", token);
        const response = await axios.delete(`${API_URL}/productBatch/${batchId}`, {
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

export const editBatchAPI = async (batchId, BatchData) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.put(`${API_URL}/productBatch/${batchId}`, BatchData, {
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