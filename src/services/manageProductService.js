import axios from "axios";
const API_URL = "http://localhost:8080";

// Hàm lấy danh sách sản phẩm
export const getAllProductAPI = async () => {
    try {
        // const token = sessionStorage.getItem("token");
        // console.log("Token:", token);
        const response = await axios.get(`${API_URL}/products`, {
            headers: {
                Accept: "*/*",
                // Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};
export const getProductByIdAPI = async (id) => {
    try {
        // const token = sessionStorage.getItem("token");
        // console.log("Token:", token);
        const response = await axios.get(`${API_URL}/products/${id}`, {
            headers: {
                Accept: "*/*",
                // Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};

// Hàm upload ảnh lên Imgur và trả về URL ảnh
export const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "SWD392");

    try {
        const response = await fetch("https://api.cloudinary.com/v1_1/ds0gy4onm/image/upload", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        return data.secure_url; // Trả về link ảnh
    } catch (error) {
        console.error("Upload failed:", error);
        return null;
    }
};


// Hàm tạo sản phẩm mới: nhận dữ liệu JSON có trường imageURL (đã là URL ảnh từ Imgur)
export const createNewProductAPI = async (productData) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.post(`${API_URL}/products`, productData, {
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

export const deleteProductAPI = async (id) => {
    try {
        const token = sessionStorage.getItem("token");
        console.log("Token:", token);
        const response = await axios.delete(`${API_URL}/products/${id}`, {
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

export const editProductAPI = async (id, productData) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.put(`${API_URL}/products/${id}`, productData, {
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