import React, { useState, useEffect } from "react";
import { Table, Typography, Button, Tag, Card, Upload, Modal } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
    GetAllRefundOrderRequestAPI,
    GetOrderByIdAPI,
    SendCompleteRefundAPI,
    VertifyRefundOrderRequestAPI,
} from "../../services/manageOrderService";
import Header from "../../components/Header/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../ManageRequestRefund/ManageRequestRefund.css";
import { uploadToCloudinary } from "../../services/manageProductService";
import { UploadOutlined } from "@ant-design/icons";
import { GetCustomerProfileAPI } from "../../services/userService";

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
    const [orderCustomerNames, setOrderCustomerNames] = useState({});
    const [customerPhone, setCustomerPhone] = useState({});
    const [selectedRefundId, setSelectedRefundId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [viewRefundModalVisible, setViewRefundModalVisible] = useState(false);
    const [refundImageUrl, setRefundImageUrl] = useState("");
    const [file, setFile] = useState(null);
    const [fileList, setFileList] = useState([]);
    const staffId = sessionStorage.getItem("staffId");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetchRefundRequests();
        // Kiểm tra state truyền qua từ RefundForm
        if (location.state?.openUploadModal && location.state?.refundId) {
            setSelectedRefundId(location.state.refundId);
            setModalVisible(true);
            // Nếu cần, reset lại state của location sau khi dùng xong
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    // Sau khi fetch refund requests, lấy thông tin customer dựa trên orderId
    const fetchCustomerNames = async (refunds) => {
        const uniqueOrderIds = [...new Set(refunds.map((r) => r.orderId))];
        const namesMap = {};
        const phoneMap = {};
        await Promise.all(
            uniqueOrderIds.map(async (orderId) => {
                try {
                    const order = await GetOrderByIdAPI(orderId);
                    const customer = await GetCustomerProfileAPI(order.customerId);
                    namesMap[orderId] = customer.name || customer.fullName || "Unknown";
                    phoneMap[orderId] = customer.phone || "Unknown";
                } catch (error) {
                    namesMap[orderId] = "Unknown";
                }
            })
        );
        setOrderCustomerNames(namesMap);
        setCustomerPhone(phoneMap);
    };

    const fetchRefundRequests = async () => {
        try {
            const data = await GetAllRefundOrderRequestAPI();
            // Lấy dữ liệu trực tiếp từ API, không ghi đè status từ localStorage
            setRefundRequests(data);
            // Sau khi có refund requests, fetch customer names
            fetchCustomerNames(data);
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
            // Gọi API SendCompleteRefundAPI với imageUrl vừa nhận được
            const data = await SendCompleteRefundAPI(selectedRefundId, staffId, imageUrl);
            if (data) {
                toast.success("Send refund image successfully!");
            }
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


    // Hàm mở modal xem hình ảnh refund
    const handleViewRefundImage = (record) => {
        if (record.proofDocumentUrl) {
            setRefundImageUrl(record.proofDocumentUrl);
            setViewRefundModalVisible(true);
        } else {
            toast.warning("No refund image available.");
        }
    };

    const columns = [
        { title: "Refund ID", dataIndex: "id", key: "id" },
        { title: "Order ID", dataIndex: "orderId", key: "orderId" },
        {
            title: "Customer Name",
            dataIndex: "orderId",
            key: "customerName",
            render: (orderId) => orderCustomerNames[orderId] || "Loading...",
        },
        {
            title: "Customer Phone",
            dataIndex: "orderId",
            key: "customerPhone",
            render: (orderId) => customerPhone[orderId] || "Loading...",
        },
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
                        {(record.status === "RETURNED_TO_WAREHOUSE" || record.status === "VERIFIED") && (
                            <Button
                                type="default"
                                style={{ backgroundColor: "blue", color: "white" }}
                                onClick={() => handleRefund(record.id)}
                            >
                                Refund
                            </Button>
                        )}
                        {record.status === "REFUNDED" && (
                            <Button
                                type="default"
                                disabled
                                style={{ backgroundColor: "gray", color: "white" }}
                            >
                                Already Refund
                            </Button>
                        )}
                    </div>
                    {record.status === "REFUNDED" && (
                        <div style={{ display: "flex", gap: "8px" }}>
                            <Button
                                type="default"
                                style={{ backgroundColor: "green", color: "white" }}
                                onClick={() => handleViewRefundImage(record)}
                            >
                                View Image
                            </Button>
                        </div>
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
            {/* Modal Upload for Send/Update Complete */}
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
                        return false; // Không tự động upload
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

            {/* Modal View Refund Image */}
            <Modal
                title="View Refund Image"
                visible={viewRefundModalVisible}
                onCancel={() => setViewRefundModalVisible(false)}
                footer={null}
            >
                {refundImageUrl ? (
                    <img src={refundImageUrl} alt="Refund Proof" style={{ width: "100%" }} />
                ) : (
                    <p>No refund image available.</p>
                )}
            </Modal>
        </div>
    );
};

export default ManageRequestRefund;
