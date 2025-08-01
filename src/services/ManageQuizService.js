import axios from "axios";
const API_URL = "http://localhost:8080";



export const GetAllQuizAPI = async () => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/questions`
            //     , {
            //     headers: {
            //         Accept: "*/*",
            //         "Content-Type": "application/json",
            //         Authorization: `Bearer ${token}`,
            //     },
            // }
        );
        return response.data;
    } catch (error) {
        return null;
    }
};

export const CreateNewQuizAPI = async (quiz) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.post(`${API_URL}/api/questions`, quiz, {
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
export const UpdateNewQuizAPI = async (id, quizData) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.put(`${API_URL}/api/questions/${id}`, quizData, {
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

export const DeleteQuizAPI = async (id) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.delete(`${API_URL}/api/questions/${id}`, {
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



export const submitQuizAPI = async (customerId, finalResponses) => {
    try {
        const token = sessionStorage.getItem("token");
        const response = await axios.post(`${API_URL}/api/quiz/submit/${customerId}`, finalResponses, {
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



