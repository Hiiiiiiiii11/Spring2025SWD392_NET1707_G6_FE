import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { DeleteOrderByIdAPI } from "../services/customerOrderService";
import { RemoveProductFromCartAPI } from "../services/cartService";

const PaymentReturnPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        // VNPay trả về mã phản hồi: "00" là thành công
        const responseCode = params.get("vnp_ResponseCode");
        // Nếu theo yêu cầu orderId của bạn nằm trong vnp_OrderInfo
        const orderId = params.get("vnp_OrderInfo");
        console.log("Order ID from vnp_OrderInfo:", orderId);

        // Clear query parameters khỏi URL
        const newUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        console.log("New URL:", window.location.href);

        if (responseCode === "00") {
            // Thanh toán thành công: xóa các sản phẩm được chọn khỏi cart
            const selectedItemsStr = sessionStorage.getItem("selectedItems");
            if (selectedItemsStr) {
                const selectedItems = JSON.parse(selectedItemsStr);
                Promise.all(
                    selectedItems.map((item) => RemoveProductFromCartAPI(item.productID))
                )
                    .then(() => {
                        alert("Order product successfully!");
                        sessionStorage.removeItem("selectedItems");
                        navigate("/historyorders", { replace: true });
                    })
                    .catch((err) => {
                        alert("Order product successfully, but failed to clear cart!");
                        sessionStorage.removeItem("selectedItems");
                        navigate("/historyorders", { replace: true });
                    });
            } else {
                alert("Order product successfully!");
                navigate("/historyorders", { replace: true });
            }
        } else {
            // Thanh toán không thành công: gọi API xóa đơn hàng, sau đó chuyển hướng về /order-confirmation
            DeleteOrderByIdAPI(orderId)
                .finally(() => {
                    alert("Payment failed. Order has been cancelled!");
                    navigate("/order-confirmation", { replace: true });
                });
        }
    }, [navigate]);

    return <div>Processing Payment Result...</div>;
};

export default PaymentReturnPage;
