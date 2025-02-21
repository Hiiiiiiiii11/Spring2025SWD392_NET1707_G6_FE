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