import React, { useState, useEffect } from "react";
import { Table, Typography, Button, Tag, Card } from "antd";
import { GetAllRefundOrderRequestAPI, VertifyRefundOrderRequestAPI } from "../../services/manageOrderService";
import Header from "../../components/Header/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../ManageRequestRefund/ManageRequestRefund.css";

const { Title } = Typography;

const statusColors = {
    REQUESTED: "orange",
    APPROVED: "green",
    REJECTED: "red",
    VERIFIED: "blue",
};

const ManageRequestRefund = () => {
    const [refundRequests, setRefundRequests] = useState([]);
    const staffId = sessionStorage.getItem("staffId");

    useEffect(() => {
        fetchRefundRequests();
    }, []);

    const fetchRefundRequests = async () => {
        try {
            const data = await GetAllRefundOrderRequestAPI();
            setRefundRequests(data);
        } catch (error) {
            toast.error("Failed to fetch refund requests");
        }
    };

    const handleVerifyRefund = async (refundId) => {
        try {
            await VertifyRefundOrderRequestAPI(refundId, staffId);
            setRefundRequests((prev) =>
                prev.map((request) =>
                    request.id === refundId ? { ...request, status: "VERIFIED", verifiedByEmployeeId: staffId } : request
                )
            );
            toast.success("Refund request verified successfully");
        } catch (error) {
            toast.error("Failed to verify refund request");
        }
    };

    const columns = [
        { title: "Refund ID", dataIndex: "id", key: "id" },
        { title: "Order ID", dataIndex: "orderId", key: "orderId" },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => <Tag color={statusColors[status] || "default"}>{status}</Tag>,
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
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <div className="action-request-order">
                    <div>
                        <Button
                            type="primary"
                            disabled={record.status !== "REQUESTED"}
                            onClick={() => handleVerifyRefund(record.id)}
                        >
                            Accept
                        </Button>
                    </div>
                    <div>
                        <Button
                            type="primary"
                            disabled={record.status !== "REQUESTED"}
                            style={{ backgroundColor: "red" }}
                        // onClick={() => handleVerifyRefund(record.id)}
                        >
                            Reject
                        </Button>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div style={{ minHeight: "100vh" }}>
            <ToastContainer />
            <Header />
            <div style={{ padding: 24, margin: "0 auto" }}>
                <Title level={2}>Manage Refund Requests</Title>
                <Card>
                    <Table columns={columns} dataSource={refundRequests} rowKey="id" />
                </Card>
            </div>
        </div>
    );
};

export default ManageRequestRefund;
