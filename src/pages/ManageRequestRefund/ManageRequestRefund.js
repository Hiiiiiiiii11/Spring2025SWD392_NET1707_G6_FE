import React, { useState, useEffect } from "react";
import { Table, Typography, Button, Tag, Card, Upload, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { GetAllRefundOrderRequestAPI, SendCompleteRefundAPI, VertifyRefundOrderRequestAPI } from "../../services/manageOrderService";
import Header from "../../components/Header/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../ManageRequestRefund/ManageRequestRefund.css";
import { uploadToCloudinary } from "../../services/manageProductService";
import { UploadOutlined } from "@ant-design/icons";

const { Title } = Typography;

const statusColors = {
    REQUESTED: "orange",
    APPROVED: "green",
    REJECTED: "red",
    VERIFIED: "blue",
    RETURNED_TO_WAREHOUSE: "purple",
    REFUNDED: "gray",
    COMPLETED: "gray",
};

const ManageRequestRefund = () => {
    const [refundRequests, setRefundRequests] = useState([]);
    const [selectedRefundId, setSelectedRefundId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [file, setFile] = useState(null);
    const [fileList, setFileList] = useState([]);
    const staffId = sessionStorage.getItem("staffId");
    const navigate = useNavigate();

    useEffect(() => {
        fetchRefundRequests();
    }, []);

    const fetchRefundRequests = async () => {
        try {
            const data = await GetAllRefundOrderRequestAPI();
            // Update refund status from localStorage if available
            const updatedData = data.map((request) => ({
                ...request,
                status: localStorage.getItem(`refund_${request.id}`) || request.status,
            }));
            setRefundRequests(updatedData);
        } catch (error) {
            toast.error("Failed to fetch refund requests");
        }
    };

    const handleSendComplete = (refundId) => {
        setSelectedRefundId(refundId);
        setModalVisible(true);
    };

    const handleVerifyRefund = async (refundId) => {
        try {
            await VertifyRefundOrderRequestAPI(refundId, staffId);
            setRefundRequests((prev) =>
                prev.map((request) =>
                    request.id === refundId
                        ? { ...request, status: "VERIFIED", verifiedByEmployeeId: staffId }
                        : request
                )
            );
            toast.success("Refund request verified successfully");
        } catch (error) {
            toast.error("Failed to verify refund request");
        }
    };

    const handleRefund = (refundId) => {
        navigate(`/refund/${refundId}`);
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error("Please upload an image first!");
            return;
        }

        setUploading(true);
        try {
            // Upload image to Cloudinary
            const imageUrl = await uploadToCloudinary(file);
            if (!imageUrl) {
                toast.error("Failed to upload image");
                return;
            }

            // Call API to complete refund using the image URL
            await SendCompleteRefundAPI(selectedRefundId, staffId, imageUrl);
            toast.success("Refund completed successfully");

            // Update refund status locally and in localStorage
            setRefundRequests((prev) =>
                prev.map((request) =>
                    request.id === selectedRefundId ? { ...request, status: "COMPLETED" } : request
                )
            );
            localStorage.setItem(`refund_${selectedRefundId}`, "COMPLETED");

            // Close modal and update refund list
            setModalVisible(false);
            fetchRefundRequests();
        } catch (error) {
            toast.warning("Product has deliveried must be returned to warehouse before send complete!");
        } finally {
            setUploading(false);
            setFile(null);
            setFileList([]);
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
                    {(record.status === "RETURNED_TO_WAREHOUSE" || record.status === "VERIFIED") && (
                        <div>
                            <Button
                                type="default"
                                disabled={record.status === "REFUNDED"}
                                style={{ backgroundColor: "blue", color: "white" }}
                                onClick={() => handleRefund(record.id)}
                            >
                                Refund
                            </Button>
                        </div>
                    )}
                    {(record.status === "REFUNDED" || record.status === "COMPLETED") && (
                        <Button
                            type="default"
                            style={{ backgroundColor: "blue", color: "white" }}
                            onClick={() => handleSendComplete(record.id)}
                            disabled={record.status === "COMPLETED"}
                        >
                            {record.status === "COMPLETED" ? "Completed Refuned" : "Send Complete"}
                        </Button>
                    )}
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
            {/* Modal Upload */}
            <Modal
                title="Upload Proof of Refund Completion"
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={handleUpload}
                confirmLoading={uploading}
                okText="Submit"
            >
                <Upload
                    listType="picture-card"
                    fileList={fileList}
                    beforeUpload={(file) => {
                        setFile(file);
                        setFileList([{ uid: "-1", url: URL.createObjectURL(file), name: file.name }]);
                        return false; // Do not auto-upload
                    }}
                    onRemove={() => {
                        setFile(null);
                        setFileList([]);
                    }}
                    accept="image/*"
                >
                    {fileList.length >= 1 ? null : <Button icon={<UploadOutlined />}>Click to Upload</Button>}
                </Upload>
            </Modal>
        </div>
    );
};

export default ManageRequestRefund;
