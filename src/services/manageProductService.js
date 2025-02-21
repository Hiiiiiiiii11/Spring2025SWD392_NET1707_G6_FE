import axios from "axios";
const API_URL = "http://localhost:8080";


export const getAllProductAPI = async () => {
    try {
        const token = sessionStorage.getItem("token");
        console.log(token);
        const response = await axios.get(`${API_URL}/products`, {
            headers: {
                Accept: `*/*`,
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};

export const createNewProductAPI = async (productData, imageFile) => {
    try {
        const token = sessionStorage.getItem("token");
        // Tạo đối tượng FormData để gửi dữ liệu JSON và file ảnh
        const formData = new FormData();
        // Chuyển đổi productData thành JSON string và gắn vào trường "data"
        formData.append("data", JSON.stringify(productData));
        // Nếu có file image, gắn vào trường "image"

        const response = await axios.post(`${API_URL}/products/add`, { formData, imageFile }, {
            headers: {
                Accept: "*/*",
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
};