import axios from "axios";

const API_URL = "http://localhost:8080";

export const GetAllHistoryOrderByIdAPI = async (customerId) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.get(
      `${API_URL}/orders/customer/${customerId}`,
      {
        headers: {
          Authorization: token,
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};
export const createOrderAPI = async (order) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.post(`${API_URL}/orders`, order, {
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};
export const viewOrderDetailByOrderIdAPI = async (id) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.post(`${API_URL}/orders/${id}`, {
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

export const DeleteOrderByIdAPI = async (id) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.delete(
      `${API_URL}/orders/${id}`, // Sửa URL API// Body rỗng vì chỉ gửi dữ liệu qua query params
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

export const sendPaymentResultToBackend = async (paymentData) => {
  return await axios.post(`${API_URL}/orders/return`, paymentData);
};
