import React, { useState, useEffect } from "react";
import { List, Card, Button, Typography, Space, Modal, Input, Radio, Rate } from "antd";
import Header from "../../components/Header/Header";
import { GetAllHistoryOrderByIdAPI, UpdateOrderByIdAPI } from "../../services/customerOrderService";
import { getProductByIdAPI } from "../../services/manageProductService";
import { getPromotionByIdAPI } from "../../services/managePromotionService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CustomerCancelOrderAPI, GetOrderByIdAPI } from "../../services/manageOrderService";
import { SendReviewproductAPI } from "../../services/ManageReview";
import "../CustomerHistoryOrder/CustomerHistoryOrder.css";
import { getBatchByIdAPI } from "../../services/manageBatchService";

const { Title, Text } = Typography;

const predefinedReasons = [
  "Change purchase decision",
  "Product not as described",
  "Detect defective products",
  "Other (please specify)"
];

const CustomerHistoryOrder = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState([]);
  const [orderProductDetails, setOrderProductDetails] = useState({});
  const [orderPromotions, setOrderPromotions] = useState({}); // Lưu thông tin promotion theo orderId
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

  // New states cho modal hủy đơn (Cancel Order/Return Order)
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  // state để lưu lý do đã chọn (radioValue) và lý do tùy chỉnh nếu chọn "Khác (vui lòng ghi rõ)"
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const customerId = sessionStorage.getItem("customerId");

  const getStatusColor = (status) => {
    return status === "Delivered" ? "success" : "warning";
  };

  // On mount, load orders
  useEffect(() => {
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

        // Với mỗi đơn hàng có promotionId, gọi API lấy thông tin promotion
        sortedOrders.forEach(async (order) => {
          if (order.promotionId) {
            try {
              const promotion = await getPromotionByIdAPI(order.promotionId);
              setOrderPromotions(prev => ({ ...prev, [order.orderId]: promotion }));
            } catch (error) {
              console.error("Error fetching promotion for order " + order.orderId, error);
            }
          }
        });
      } else {
        toast.error("Failed to load orders!");
      }
    } catch (error) {
      toast.error("Error fetching orders!");
    }
  };

  // Fetch product details for each order
  const fetchProductDetailsForOrder = async (order) => {
    try {
      const details = await Promise.all(
        order.orderDetails.map(async (item) => {
          const product = await getProductByIdAPI(item.productId);
          const batchData = await getBatchByIdAPI(item.batchId);
          const expireDate = batchData && batchData.expireDate
            ? batchData.expireDate.split("T")[0]
            : "N/A";
          return {
            ...product,
            quantity: item.quantity,
            orderDetailId: item.orderDetailId,
            expireDate,
          };
        })
      );
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

  // Mở modal hủy đơn (Cancel Order/Return Order)
  const openCancelModal = (orderId) => {
    setCancelOrderId(orderId);
    // Reset lại giá trị của radio và input nếu có
    setSelectedReason("");
    setCustomReason("");
    setCancelModalVisible(true);
  };

  // Xử lý submit hủy đơn: update reason rồi mới gọi API hủy đơn
  const handleCancelSubmit = async () => {
    try {
      const finalReason = selectedReason === "Other (please specify)" ? customReason : selectedReason;
      if (!finalReason) {
        toast.error("Please select or enter a reason for cancellation!");
        return;
      }
      // Lấy dữ liệu đơn hàng hiện tại (giả sử có API GetOrderByIdAPI)
      const currentOrder = await GetOrderByIdAPI(cancelOrderId);
      if (!currentOrder) {
        toast.error("Can't found order!");
        return;
      }
      // Kiểm tra trạng thái đơn hàng: nếu Delivered thì update thành REFUNDED, còn lại thì cập nhật thành CANCELLED
      const updatedStatus = currentOrder.status === "DELIVERED" ? "RETURNED" : "CANCELLED";
      // Merge dữ liệu: cập nhật status và reason, giữ nguyên các trường khác
      const updatedOrderData = { ...currentOrder, status: updatedStatus, reason: finalReason };
      // Gọi API update order với dữ liệu đã merge
      await UpdateOrderByIdAPI(cancelOrderId, updatedOrderData);
      // Sau đó gọi API hủy đơn hoặc refund đơn
      const data = await CustomerCancelOrderAPI(cancelOrderId);
      if (data) {
        toast.success("Refund request submitted successfully!");
      } else {
        toast.error("Refund request submission failed!");
      }
      setCancelModalVisible(false);
      setSelectedReason("");
      setCustomReason("");
      fetchCustomerHistoryOrder(); // Refresh orders list
    } catch (error) {
      toast.error("Failed to process refund request.");
    }
  };



  // Open modal xem refund image
  const handleViewRefundImage = (order) => {
    if (order.refund && order.refund.proofDocumentUrl) {
      setRefundImageUrl(order.refund.proofDocumentUrl);
      setViewRefundModalVisible(true);
    } else {
      toast.warning("No refund image available.");
    }
  };

  // Mở modal gửi đánh giá
  const openReviewModal = async (order) => {
    setSelectedReviewOrder(order);
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

  // Gửi đánh giá
  const handleSendReview = async () => {
    try {
      const response = await SendReviewproductAPI(reviewForm);
      if (response) {
        toast.success("Review sent successfully!");
      } else {
        toast.warning("You already sent review for this order!");
      }
      setIsReviewModalVisible(false);
    } catch (error) {
      toast.error("Error sending review!");
    }
  };

  // Tính giá ban đầu nếu có promotion
  const calculateOriginalPrice = (order) => {
    if (order.promotionId && orderPromotions[order.orderId]) {
      const promotion = orderPromotions[order.orderId];
      const discountValue = order.totalAmount * promotion.discountPercentage / 100;
      return order.totalAmount + discountValue;
    }
    return null;
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
            renderItem={(order) => {
              const originalPrice = calculateOriginalPrice(order);
              const promotion = order.promotionId && orderPromotions[order.orderId];
              return (
                <List.Item key={order.orderId}>
                  <Card
                    title={`Order Date: ${new Date(order.orderDate).toLocaleDateString()}`}
                    style={{ width: "100%" }}
                  >
                    <div className="card-order-history">
                      <div>
                        <p>
                          Status:{" "}
                          <Text type={getStatusColor(order.status)} strong>
                            {order.status}
                          </Text>
                        </p>
                        {order.reason && (
                          <p>Reason: {order.reason}</p>
                        )}
                        <p>Payment Method: VN Pay</p>
                        <p>Order Address: {order.address}</p>
                        <p>
                          <strong>Promotion:</strong>{" "}
                          {promotion
                            ? `${promotion.promotionName} (Discount: ${promotion.discountPercentage}%)`
                            : "None"}
                        </p>
                        {order.status === "DELIVERED" && (
                          <p>* You have 3 day to request return if goods be errored *  </p>
                        )}
                      </div>
                      <div className="div-total-price">
                        <p className="totalprice-history" style={{ fontWeight: "bold" }}>
                          {originalPrice != null ? (
                            <>
                              <p className="original-price">
                                <strong>Original Price: </strong> ${originalPrice.toFixed(2)}
                              </p>
                              <p className="discount">
                                <strong>Discount: </strong>${(originalPrice - order.totalAmount).toFixed(2)}
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="original-price">
                                <strong>Original Price: </strong> ${order.totalAmount}
                              </p>
                              <p className="discount">
                                <strong>Discount: </strong> 0.0
                              </p>
                            </>
                          )}
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
                        {order.status === "COMPLETED" && (
                          <Button type="primary" onClick={() => openReviewModal(order)}>
                            Send Review
                          </Button>
                        )}
                        {order.status === "PAID" && (
                          <Button
                            className="order-continue-payment"
                            type={
                              refundRequestedOrders.includes(order.orderId) || (order.refund && order.refund.id)
                                ? "default"
                                : "primary"
                            }
                            disabled={refundRequestedOrders.includes(order.orderId) || (order.refund && order.refund.id)}
                            onClick={() => openCancelModal(order.orderId)}
                          >
                            {refundRequestedOrders.includes(order.orderId) || (order.refund && order.refund.id)
                              ? "Request Cancel Sent"
                              : "Cancel Order"}
                          </Button>
                        )}
                        {order.status === "DELIVERED" && (
                          <div className="review-or-refund">
                            <Button
                              className="order-continue-payment"
                              type={
                                refundRequestedOrders.includes(order.orderId) || (order.refund && order.refund.id)
                                  ? "default"
                                  : "primary"
                              }
                              disabled={refundRequestedOrders.includes(order.orderId) || (order.refund && order.refund.id)}
                              onClick={() => openCancelModal(order.orderId)}
                            >
                              {refundRequestedOrders.includes(order.orderId) || (order.refund && order.refund.id)
                                ? "Request Sent"
                                : "Return Order"}
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
                                    <p style={{ margin: 0, fontWeight: "bold" }}>{item.productName}</p>
                                    <p style={{ margin: 0 }}>Quantity: {item.quantity}</p>
                                    <p style={{ margin: 0 }}>Expire Date: {item.expireDate}</p>
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
              );
            }}
          />
        )}
      </div>

      {/* Modal hiển thị refund image */}
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

      {/* Modal gửi đánh giá */}
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
            <Radio.Group
              onChange={(e) =>
                setReviewForm({ ...reviewForm, orderDetailId: e.target.value })
              }
              value={reviewForm.orderDetailId}
              style={{ marginBottom: 16 }}
            >
              {orderProductDetails[selectedReviewOrder.orderId].map((detail) => (
                <Radio key={detail.orderDetailId} value={detail.orderDetailId}>
                  {detail.productName}
                </Radio>
              ))}
            </Radio.Group>
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

      {/* Modal nhập lý do hủy đơn (Cancel/Return Order) */}
      <Modal
        title="Enter Reason for Cancellation"
        visible={cancelModalVisible}
        onCancel={() => setCancelModalVisible(false)}
        onOk={handleCancelSubmit}
        okText="Submit"
      >
        <p>
          <strong>Select Reason:</strong>
        </p>
        <Radio.Group
          onChange={(e) => setSelectedReason(e.target.value)}
          value={selectedReason}
        >
          {predefinedReasons.map((reason, index) => (
            <Radio key={index} value={reason} style={{ display: "block", marginBottom: 8 }}>
              {reason}
            </Radio>
          ))}
        </Radio.Group>
        {selectedReason === "Other (please specify)" && (
          <>
            <p>
              <strong>Custom Reason:</strong>
            </p>
            <Input.TextArea
              rows={3}
              placeholder="Enter detailed reason..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
            />
          </>
        )}
      </Modal>
    </div>
  );
};

export default CustomerHistoryOrder;
