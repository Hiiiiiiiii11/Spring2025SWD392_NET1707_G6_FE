import axios from "axios";
const API_URL = "http://localhost:8080";

const token = sessionStorage.getItem("token");
export const getAllProductAPI = async () => {
    try {
        const response = await axios.get(`${API_URL}/products`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};