import axios from "axios";
const API_URL = "http://localhost:8080";



export const GetAllEmployeeAPI = async () => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(`${API_URL}/staff`, {
            headers: {
                Accept: "*/*",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating staff:", error);
        return null;
    }
};

export const CreateEmployeeAPI = async (employeeData) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.post(`${API_URL}/auth/register-staff`, employeeData, {
            headers: {
                Accept: "*/*",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating staff:", error);
        return null;
    }
};

// export const UpdateEmployeeAPI = async (employeeData) => {
//     try {
//         const token = sessionStorage.getItem("token");
//         const response = await axios.post(`${API_URL}/auth/register-staff`, employeeData, {
//             headers: {
//                 Accept: "*/*",
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//         return response.data;
//     } catch (error) {
//         console.error("Error creating staff:", error);
//         return null;
//     }
// };



