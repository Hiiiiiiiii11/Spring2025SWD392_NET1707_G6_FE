import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeleteOrderByIdAPI } from "../services/customerOrderService";
import { sendPaymentResultToBackend } from "../services/customerOrderService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PaymentReturnPage = () => {
    const navigate = useNavigate();
    const isProcessing = useRef(false);
    const [paymentHandled, setPaymentHandled] = useState(false);

    useEffect(() => {
        if (isProcessing.current || paymentHandled) return;
        isProcessing.current = true;

        const params = new URLSearchParams(window.location.search);
        const paymentData = Object.fromEntries(params.entries());

        console.log("Payment Data:", paymentData);

        // Gửi dữ liệu về backend
        sendPaymentResultToBackend(paymentData)
            .then(() => {
                console.log("Payment result sent successfully.");
                setPaymentHandled(true);
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
            // Thanh toán thành công
            toast.success("Order placed successfully!");
            navigate("/historyorders", { replace: true });
        } else {
            // Thanh toán thất bại
            DeleteOrderByIdAPI(orderId).finally(() => {
                toast.warning("Payment failed. Order has been cancelled!");
                navigate("/cart", { replace: true });
            });
        }

    }, [navigate, paymentHandled]);

    return (
        <div>
            <ToastContainer />
            <div style={{ fontSize: "20px" }}>
                Processing Payment Result...
            </div>
        </div>
    );
};

export default PaymentReturnPage;
