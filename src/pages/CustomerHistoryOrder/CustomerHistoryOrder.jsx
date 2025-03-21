import React, { useState, useEffect } from "react";
import { List, Card, Button, Typography, Space, Modal, Input, Select, Rate } from "antd";
import Header from "../../components/Header/Header";
import { GetAllHistoryOrderByIdAPI } from "../../services/customerOrderService";
import { getProductByIdAPI } from "../../services/manageProductService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CustomerCancelOrderAPI } from "../../services/manageOrderService"; // adjust the import path if needed
import "../CustomerHistoryOrder/CustomerHistoryOrder.css";
import { SendReviewproductAPI } from "../../services/ManageReview";

const { Title, Text } = Typography;
const { Option } = Select;

const CustomerHistoryOrder = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState([]);
  const [orderProductDetails, setOrderProductDetails] = useState({});
  const [refundRequestedOrders, setRefundRequestedOrders] = useState([]);
  const [viewRefundModalVisible, setViewRefundModalVisible] = useState(false);
  const [refundImageUrl, setRefundImageUrl] = useState("");

  // New state for review modal
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [selectedReviewOrder, setSelectedReviewOrder] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    orderDetailId: null,
    rating: 5,
    comment: "",
  });

  const customerId = sessionStorage.getItem("customerId");

  const getStatusColor = (status) => {
    return status === "Delivered" ? "success" : "warning";
  };

  // On mount, load any previously saved refund requested order IDs from localStorage
  useEffect(() => {
    const storedRefundRequests = localStorage.getItem("refundRequestedOrders");
    if (storedRefundRequests) {
      setRefundRequestedOrders(JSON.parse(storedRefundRequests));
    }
    fetchCustomerHistoryOrder();
  }, []);

  const fetchCustomerHistoryOrder = async () => {
    try {
      const historyOrder = await GetAllHistoryOrderByIdAPI(customerId);
      console.log(historyOrder);
      if (historyOrder) {
        // Sort by order date descending (newest first)
        const sortedOrders = historyOrder.sort(
          (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
        );
        setOrders(sortedOrders);
      } else {
        toast.error("Failed to load orders!");
      }
    } catch (error) {
      toast.error("Error fetching orders!");
    }
  };

  // Fetch product details for each order, include orderDetailId from order.orderDetails
  const fetchProductDetailsForOrder = async (order) => {
    try {
      // order.orderDetails contains objects with productId and orderDetailId
      const promises = order.orderDetails.map((item) => getProductByIdAPI(item.productId));
      const products = await Promise.all(promises);
      const details = products.map((product, index) => ({
        ...product,
        quantity: order.orderDetails[index].quantity,
        orderDetailId: order.orderDetails[index].orderDetailId,
      }));
      setOrderProductDetails((prev) => ({ ...prev, [order.orderId]: details }));
    } catch (error) {
      toast.error("Failed to load product details for order " + order.orderId);
    }
  };

  // Toggle order details view
  const handleToggleDetails = async (order) => {
    if (expandedOrders.includes(order.orderId)) {
      setExpandedOrders(expandedOrders.filter((id) => id !== order.orderId));
    } else {
      await fetchProductDetailsForOrder(order);
      setExpandedOrders([...expandedOrders, order.orderId]);
    }
  };

  // Handle refund request (cancel order)
  const handleRefundRequest = async (orderId) => {
    const confirmDelete = window.confirm("Are you sure you want to sent cancel order request?");
    if (!confirmDelete) return;
    try {
      const data = await CustomerCancelOrderAPI(orderId);
      toast.success("Refund request submitted successfully!");
      // Update state and localStorage so that the cancel button remains disabled permanently.
      setRefundRequestedOrders((prev) => {
        const updated = [...prev, orderId];
        localStorage.setItem("refundRequestedOrders", JSON.stringify(updated));
        return updated;
      });
      fetchCustomerHistoryOrder(); // Refresh orders list
    } catch (error) {
      toast.error("Failed to process refund request.");
    }
  };

  // Open modal to view refund image
  const handleViewRefundImage = (order) => {
    if (order.refund && order.refund.proofDocumentUrl) {
      setRefundImageUrl(order.refund.proofDocumentUrl);
      setViewRefundModalVisible(true);
    } else {
      toast.warning("No refund image available.");
    }
  };

  // Open review modal and set initial values
  const openReviewModal = async (order) => {
    setSelectedReviewOrder(order);
    // Ensure product details are fetched
    if (!orderProductDetails[order.orderId]) {
      await fetchProductDetailsForOrder(order);
    }
    const details = orderProductDetails[order.orderId] || [];
    if (details.length > 0) {
      setReviewForm({
        orderDetailId: details[0].orderDetailId,
        rating: 5,
        comment: "",
      });
    }
    setIsReviewModalVisible(true);
  };

  // Handle sending review to API
  const handleSendReview = async () => {
    try {
      const response = await SendReviewproductAPI(reviewForm);
      if (response) {
        toast.success("Review sent successfully!");
      } else {
        toast.warning("You already send review for this order!");
      }
      setIsReviewModalVisible(false);
    } catch (error) {
      toast.error("Error sending review!");
    }
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <ToastContainer />
      <Header />
      <div style={{ padding: 24, margin: "0 auto" }}>
        <Title level={2}>History Order</Title>
        {orders.length === 0 ? (
          <div className="no-order">
            <Text type="secondary">No orders found.</Text>
          </div>
        ) : (
          <List
            dataSource={orders}
            renderItem={(order) => (
              <List.Item key={order.orderId}>
                <Card
                  title={`Order Date : ${new Date(order.orderDate).toLocaleDateString()}`}
                  style={{ width: "100%" }}
                >
                  <div className="card-order-history">
                    <div>
                      <p>
                        Status :{" "}
                        <Text type={getStatusColor(order.status)} strong>
                          {order.status}
                        </Text>
                      </p>
                      <p>Payment Method : VN Pay</p>
                      <p>Order Address : {order.address}</p>
                    </div>
                    <div className="div-total-price">
                      <p className="totalprice-history" style={{ fontWeight: "bold" }}>
                        Original Total: ${order.totalAmount}
                      </p>
                    </div>
                  </div>

                  <Space style={{ marginTop: 10, width: "100%" }}>
                    <div className="group-button-order">
                      <Button type="default" onClick={() => handleToggleDetails(order)}>
                        {expandedOrders.includes(order.orderId) ? "Hide Details" : "View Details"}
                      </Button>
                      {order.status === "PENDING" && (
                        <Button
                          className="order-continue-payment"
                          type="primary"
                          onClick={() => (window.location.href = order.paymentUrl)}
                        >
                          Continue Payment
                        </Button>
                      )}
                      {order.status === "PAID" && (
                        <Button
                          className="order-continue-payment"
                          type={refundRequestedOrders.includes(order.orderId) ? "default" : "primary"}
                          disabled={refundRequestedOrders.includes(order.orderId)}
                          onClick={() => handleRefundRequest(order.orderId)}
                        >
                          {refundRequestedOrders.includes(order.orderId) ? "Request Cancel Sent" : "Cancel Order"}
                        </Button>
                      )}
                      {order.status === "COMPLETED" && (
                        <Button type="primary" onClick={() => openReviewModal(order)}>
                          Send Review
                        </Button>
                      )}
                      {order.status === "DELIVERED" && (
                        <div className="review-or-refund">
                          <Button
                            className="order-continue-payment"
                            type={refundRequestedOrders.includes(order.orderId) ? "default" : "primary"}
                            disabled={refundRequestedOrders.includes(order.orderId)}
                            onClick={() => handleRefundRequest(order.orderId)}
                          >
                            {refundRequestedOrders.includes(order.orderId) ? "Request Sent" : "Return Product"}
                          </Button>
                        </div>
                      )}
                      {(order.status === "REFUNDED" || order.status === "CANCELLED") && (
                        <Button
                          className="order-continue-payment"
                          type="primary"
                          onClick={() => handleViewRefundImage(order)}
                        >
                          View Refund Image
                        </Button>
                      )}
                    </div>
                  </Space>

                  {/* Show order details if expanded */}
                  {expandedOrders.includes(order.orderId) && (
                    <div style={{ marginTop: 20 }}>
                      <List
                        dataSource={orderProductDetails[order.orderId] || []}
                        renderItem={(item) => (
                          <List.Item key={item.orderDetailId}>
                            <Card size="small" style={{ width: "100%" }}>
                              <div style={{ display: "flex", alignItems: "center" }}>
                                <img
                                  src={item.imageURL || "https://via.placeholder.com/150"}
                                  alt={item.productName}
                                  style={{ width: 80, height: 80, objectFit: "cover", marginRight: 16 }}
                                />
                                <div>
                                  <p style={{ margin: 0 }}>
                                    <strong>{item.productName}</strong>
                                  </p>
                                  <p style={{ margin: 0 }}>Quantity: {item.quantity}</p>
                                </div>
                              </div>
                            </Card>
                          </List.Item>
                        )}
                      />
                    </div>
                  )}
                </Card>
              </List.Item>
            )}
          />
        )}
      </div>

      {/* Modal for viewing refund image */}
      <Modal
        title="Refund Image"
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

      {/* Modal for sending review */}
      <Modal
        title="Send Review"
        visible={isReviewModalVisible}
        onCancel={() => setIsReviewModalVisible(false)}
        onOk={handleSendReview}
        okText="Submit Review"
      >
        {selectedReviewOrder && orderProductDetails[selectedReviewOrder.orderId] && (
          <>
            <p>
              <strong>Select Product:</strong>
            </p>
            <Select
              style={{ width: "100%", marginBottom: 16 }}
              value={reviewForm.orderDetailId}
              onChange={(value) => setReviewForm({ ...reviewForm, orderDetailId: value })}
            >
              {orderProductDetails[selectedReviewOrder.orderId].map((detail) => (
                <Option key={detail.orderDetailId} value={detail.orderDetailId}>
                  {detail.productName}
                </Option>
              ))}
            </Select>
            <p>
              <strong>Rating:</strong>
            </p>
            <Rate
              value={reviewForm.rating}
              onChange={(value) => setReviewForm({ ...reviewForm, rating: value })}
            />
            <p style={{ marginTop: 16 }}>
              <strong>Comment:</strong>
            </p>
            <Input.TextArea
              rows={4}
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              placeholder="Enter your review..."
            />
          </>
        )}
      </Modal>
    </div>
  );
};

export default CustomerHistoryOrder;
