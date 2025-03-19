import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Card, Button, Typography, message, Collapse, Spin, Image } from "antd";
import { CheckCircleOutlined, MoneyCollectOutlined } from "@ant-design/icons";
import html2canvas from "html2canvas"; // Import thư viện chụp màn hình
import "../FormRefund/FormRefund.css";
import { GetOrderByIdAPI, GetRefundOrderByIdAPI } from "../../services/manageOrderService";
import { GetCustomerProfileAPI } from "../../services/userService";
import { getProductByIdAPI } from "../../services/manageProductService";
import Header from "../Header/Header";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

const { Title, Text } = Typography;
const { Panel } = Collapse;

const RefundForm = () => {
    const { refundId } = useParams();
    const [refundData, setRefundData] = useState(null);
    const [orderData, setOrderData] = useState(null);
    const [customerData, setCustomerData] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const refundRef = useRef(null); // Tham chiếu đến phần cần chụp ảnh

    useEffect(() => {
        const fetchRefundDetails = async () => {
            try {
                const refund = await GetRefundOrderByIdAPI(refundId);
                if (!refund) throw new Error("Refund data not found");
                setRefundData(refund);

                const order = await GetOrderByIdAPI(refund.orderId);
                if (!order) throw new Error("Order data not found");
                setOrderData(order);

                const customer = await GetCustomerProfileAPI(order.customerId);
                setCustomerData(customer);

                const productPromises = order.orderDetails.map(async (item) => {
                    const product = await getProductByIdAPI(item.productId);
                    return { ...product, quantity: item.quantity, unitPrice: item.unitPrice };
                });

                const productList = await Promise.all(productPromises);
                setProducts(productList);
            } catch (error) {
                message.error("Failed to fetch refund details");
            } finally {
                setLoading(false);
            }
        };

        fetchRefundDetails();
    }, [refundId]);

    const handleRefund = () => {
        setSuccess(true);
        toast.success("Refund successful!");
        setRefundData((prev) => ({ ...prev, status: "REFUNDED" }));

        // Cập nhật localStorage để thông báo ManageRequestRefund
        localStorage.setItem(`refund_${refundId}`, "REFUNDED");

        // Chờ 1 giây rồi chụp ảnh màn hình
        setTimeout(() => {
            if (refundRef.current) {
                html2canvas(refundRef.current).then((canvas) => {
                    const link = document.createElement("a");
                    link.href = canvas.toDataURL("image/png");
                    link.download = `refund_${refundId}.png`;
                    link.click();
                });
            }
        }, 2000);
    };

    if (loading) {
        return <Spin size="large" style={{ display: "block", margin: "50px auto" }} />;
    }

    return (
        <div className="refund-page">
            <Header />
            <ToastContainer />
            <div className="refund-container">
                <Card ref={refundRef} style={{ width: 700, textAlign: "center", padding: 20 }}>
                    {success ? (
                        <>
                            <CheckCircleOutlined style={{ fontSize: 60, color: "#52c41a" }} />
                            <Title level={3}>Refund Successful</Title>
                            <Text strong>${refundData?.amount?.toLocaleString() || "0"}</Text>
                            <p>Refund has been processed for order <strong>{customerData?.fullName || "Unknown"}</strong>.</p>
                            <Button type="default" style={{ color: "blue" }} onClick={() => setShowDetails(!showDetails)}>
                                {showDetails ? "Hide Details" : "View Details"}
                            </Button>
                            {showDetails && (
                                <Card title="Refund Order Details" style={{ marginTop: 20 }}>
                                    <Collapse>
                                        {products.map((product) => (
                                            <Panel header={product.productName} key={product.id}>
                                                <Image width={100} src={product.imageUrl} />
                                                <p><strong>Price:</strong> ${product.unitPrice.toLocaleString()}</p>
                                                <p><strong>Quantity:</strong> {product.quantity}</p>
                                            </Panel>
                                        ))}
                                    </Collapse>
                                </Card>
                            )}
                        </>
                    ) : (
                        <>
                            <MoneyCollectOutlined style={{ fontSize: 60, color: "#1890ff" }} />
                            <Title level={3}>Refund Order</Title>
                            <p>Customer: <strong>{customerData?.fullName || "Unknown"}</strong></p>
                            {refundData && (
                                <p>Total Refund Amount: <strong>${refundData.amount.toLocaleString()}</strong></p>
                            )}
                            <Button type="primary" onClick={handleRefund}>Process Refund</Button>
                        </>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default RefundForm;
