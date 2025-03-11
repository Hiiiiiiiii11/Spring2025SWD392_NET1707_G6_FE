import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeleteOrderByIdAPI } from "../services/customerOrderService";
import { RemoveProductFromCartAPI } from "../services/cartService";
import { sendPaymentResultToBackend } from "../services/customerOrderService"; // API gửi về backend

const PaymentReturnPage = () => {
    const navigate = useNavigate();
    const isProcessing = useRef(false); // Tránh gọi API 2 lần
    const [paymentHandled, setPaymentHandled] = useState(false); // Tránh xử lý lại kết quả thanh toán

    useEffect(() => {
        if (isProcessing.current || paymentHandled) return; // Chặn lần gọi thứ hai
        isProcessing.current = true;

        const params = new URLSearchParams(window.location.search);
        const paymentData = Object.fromEntries(params.entries());

        console.log("Payment Data:", paymentData);

        // Gửi dữ liệu về backend
        sendPaymentResultToBackend(paymentData)
            .then(() => {
                console.log("Payment result sent successfully.");
                setPaymentHandled(true); // Đánh dấu đã xử lý xong
            })
            .catch((error) => {
                console.error("Failed to send payment result to backend:", error);
            });

        const responseCode = paymentData.vnp_ResponseCode;
        const orderId = paymentData.vnp_OrderInfo;

        // Clear query parameters khỏi URL
        const newUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);

        if (responseCode === "00") {
            // Thành công: xóa sản phẩm khỏi giỏ hàng
            const selectedItemsStr = sessionStorage.getItem("selectedItems");
            if (selectedItemsStr) {
                const selectedItems = JSON.parse(selectedItemsStr);
                Promise.all(
                    selectedItems.map((item) => RemoveProductFromCartAPI(item.productID))
                )
                    .then(() => {
                        alert("Order placed successfully!");
                        sessionStorage.removeItem("selectedItems");
                        navigate("/historyorders", { replace: true });
                    })
                    .catch(() => {
                        alert("Order placed successfully, but failed to clear cart!");
                        sessionStorage.removeItem("selectedItems");
                        navigate("/historyorders", { replace: true });
                    });
            } else {
                alert("Order placed successfully!");
                navigate("/historyorders", { replace: true });
            }
        } else {
            // Thất bại: Xóa đơn hàng
            DeleteOrderByIdAPI(orderId)
                .finally(() => {
                    alert("Payment failed. Order has been cancelled!");
                    navigate("/cart", { replace: true });
                });
        }
    }, [navigate, paymentHandled]);

    return <div>Processing Payment Result...</div>;
};

export default PaymentReturnPage;
