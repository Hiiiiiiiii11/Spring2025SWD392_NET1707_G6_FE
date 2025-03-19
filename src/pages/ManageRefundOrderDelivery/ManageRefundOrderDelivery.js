import React, { useState, useEffect } from "react";
import { Table, Card, Typography, Button, List, Select } from "antd";
import Header from "../../components/Header/Header";
import { GetAllRefundOrderRequestAPI, ManageRefundOrderStatusByDeliveryAPI } from "../../services/manageOrderService";
import { getProductByIdAPI } from "../../services/manageProductService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title } = Typography;
const { Option } = Select;
const statusTransitions = {
    VERIFIED: ["PICKED_UP"],
    PICKED_UP: ["RETURNED_TO_WAREHOUSE"],
};

const ManageRefundOrderDelivery = () => {
    const [refundOrders, setRefundOrders] = useState([]);
    const [expandedOrders, setExpandedOrders] = useState([]);
    const [orderProductDetails, setOrderProductDetails] = useState({});
    const role = sessionStorage.getItem("role");
    const staffId = sessionStorage.getItem("staffId");
    console.log(staffId)

    useEffect(() => {
        if (role === "DELIVERY_STAFF") {
            fetchRefundOrders();
        }
    }, []);

    const fetchRefundOrders = async () => {
        try {
            const data = await GetAllRefundOrderRequestAPI();
            const verifiedOrders = data.filter(order => order.status !== "REQUESTED");
            setRefundOrders(verifiedOrders);
        } catch (error) {
            toast.error("Failed to fetch refund orders");
        }
    };

    const handleUpdateStatus = async (refundId, newStatus, currentStatus) => {
        if (!statusTransitions[currentStatus]?.includes(newStatus)) {
            toast.error(`Invalid transition from ${currentStatus} to ${newStatus}`);
            return;
        }

        try {
            await ManageRefundOrderStatusByDeliveryAPI(refundId, newStatus, staffId);
            setRefundOrders(prev =>
                prev.map(order =>
                    order.id === refundId ? { ...order, status: newStatus } : order
                )
            );
            toast.success(`Updated refund status to ${newStatus}`);
        } catch (error) {
            toast.error("Failed to update refund status");
        }
    };


    const fetchProductDetailsForOrder = async (order) => {
        try {
            const promises = order.orderDetails.map(item => getProductByIdAPI(item.productId));
            const products = await Promise.all(promises);
            const details = products.map((product, index) => ({
                ...product,
                quantity: order.orderDetails[index].quantity,
            }));
            setOrderProductDetails(prev => ({ ...prev, [order.id]: details }));
        } catch (error) {
            toast.error("Failed to load product details");
        }
    };

    const handleToggleDetails = async (order) => {
        if (expandedOrders.includes(order.id)) {
            setExpandedOrders(expandedOrders.filter(id => id !== order.id));
        } else {
            await fetchProductDetailsForOrder(order);
            setExpandedOrders([...expandedOrders, order.id]);
        }
    };

    const columns = [
        { title: "Refund ID", dataIndex: "id", key: "id" },
        { title: "Order ID", dataIndex: "orderId", key: "orderId" },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status, order) => (
                <Select
                    value={status}
                    style={{ width: 180 }}
                    onChange={(value) => handleUpdateStatus(order.id, value, status)}
                    disabled={!statusTransitions[status]}
                >
                    {statusTransitions[status]?.map(nextStatus => (
                        <Option key={nextStatus} value={nextStatus}>
                            {nextStatus}
                        </Option>
                    ))}
                </Select>
            ),
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (amount) => `$${amount.toFixed(2)}`,
        },
        {
            title: "Request Time",
            dataIndex: "refundRequestTime",
            key: "refundRequestTime",
            render: (time) => new Date(time).toLocaleString(),
        },
        // {
        //     title: "Actions",
        //     key: "actions",
        //     render: (_, order) => (
        //         <Button type="default" onClick={() => handleToggleDetails(order)}>
        //             {expandedOrders.includes(order.id) ? "Hide Details" : "View Details"}
        //         </Button>
        //     ),
        // },
    ];

    return (
        <div style={{ minHeight: "100vh" }}>
            <ToastContainer />
            <Header />
            <div style={{ padding: 24, margin: "0 auto" }}>
                <Title level={2}>Manage Refund Orders (Delivery)</Title>
                <Table
                    columns={columns}
                    dataSource={refundOrders}
                    rowKey="id"
                    expandable={{
                        expandedRowRender: (order) => (
                            <div>
                                <List
                                    dataSource={orderProductDetails[order.id] || []}
                                    renderItem={(item) => (
                                        <List.Item key={item.productId}>
                                            <Card style={{ display: "flex" }}>
                                                <div className="detail-item-product">
                                                    <img
                                                        src={item.imageURL || "https://via.placeholder.com/150"}
                                                        alt={item.productName}
                                                        style={{ width: 80, height: 80, objectFit: "cover" }}
                                                    />
                                                    <div>
                                                        <p style={{ margin: 0 }}><strong>{item.productName}</strong></p>
                                                        <p style={{ margin: 0 }}>Quantity: {item.quantity}</p>
                                                    </div>
                                                </div>
                                            </Card>
                                        </List.Item>
                                    )}
                                />
                            </div>
                        ),
                        expandedRowKeys: expandedOrders,
                    }}
                />
            </div>
        </div>
    );
};

export default ManageRefundOrderDelivery;
