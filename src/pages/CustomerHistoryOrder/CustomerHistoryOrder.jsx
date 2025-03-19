import React, { useState, useEffect } from 'react';
import { List, Card, Button, Typography, Space, message } from 'antd';
import Header from '../../components/Header/Header';
import { GetAllHistoryOrderByIdAPI } from '../../services/customerOrderService';
import { getProductByIdAPI } from '../../services/manageProductService';
import "../CustomerHistoryOrder/CustomerHistoryOrder.css"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CustomerCancelOrderAPI } from '../../services/manageOrderService';

const { Title, Text } = Typography;

const CustomerHistoryOrder = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState([]);
  const [orderProductDetails, setOrderProductDetails] = useState({});
  const customerId = sessionStorage.getItem("customerId");
  const [refundRequestedOrders, setRefundRequestedOrders] = useState([]);

  const getStatusColor = (status) => {
    return status === 'Delivered' ? 'success' : 'warning';
  };

  useEffect(() => {
    fetchCustomerHistoryOrder();
  }, []);

  const fetchCustomerHistoryOrder = async () => {
    try {
      const historyOrder = await GetAllHistoryOrderByIdAPI(customerId);
      console.log(historyOrder)
      if (historyOrder) {
        // Sắp xếp theo ngày giảm dần (mới nhất trước)
        const sortedOrders = historyOrder.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        setOrders(sortedOrders);
      } else {
        toast.error("Failed to load orders!");
      }
    } catch (error) {
      toast.error("Error fetching orders!");
    }
  };


  // Hàm này sẽ gọi API lấy thông tin chi tiết của từng sản phẩm trong order (dùng order.orderDetails)
  const fetchProductDetailsForOrder = async (order) => {
    try {
      // order.orderDetails chứa các object có thuộc tính productId
      const promises = order.orderDetails.map(item => getProductByIdAPI(item.productId));
      const products = await Promise.all(promises);
      // Gộp thông tin sản phẩm với số lượng từ order.orderDetails
      const details = products.map((product, index) => ({
        ...product,
        quantity: order.orderDetails[index].quantity,
      }));
      setOrderProductDetails(prev => ({ ...prev, [order.orderId]: details }));
    } catch (error) {
      toast.error("Failed to load product details for order " + order.orderId);
    }
  };

  // Khi nhấn "View Details", gọi API cho từng product id và mở rộng Card hiển thị chi tiết đơn hàng
  const handleToggleDetails = async (order) => {
    if (expandedOrders.includes(order.orderId)) {
      setExpandedOrders(expandedOrders.filter(id => id !== order.orderId));
    } else {
      await fetchProductDetailsForOrder(order);
      setExpandedOrders([...expandedOrders, order.orderId]);
    }
  };
  const handleRefundRequest = async (orderId) => {
    console.log(orderId)
    try {
      const data = await CustomerCancelOrderAPI(orderId);
      console.log("Check return order", data)
      toast.success("Refund request submitted successfully!");
      setRefundRequestedOrders((prev) => [...prev, orderId]);
      fetchCustomerHistoryOrder(); // Cập nhật danh sách đơn hàng sau khi yêu cầu refund
    } catch (error) {
      toast.error(error || "Failed to process refund request.");
    }
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <ToastContainer />
      <Header />
      <div style={{ padding: 24, margin: '0 auto' }}>
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
                <Card title={`Order Date : ${new Date(order.orderDate).toLocaleDateString()}`} style={{ width: '100%' }}>
                  <div className='card-order-history'>
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
                    <div className='div-total-price'>
                      <p className="totalprice-history" style={{ fontWeight: 'bold' }}>Original Total: ${order.totalAmount}</p>
                    </div>
                  </div>

                  <Space style={{ marginTop: 10, width: "100%" }}>
                    <div className='group-button-order'>
                      <div>
                        <Button type="default" onClick={() => handleToggleDetails(order)}>
                          {expandedOrders.includes(order.orderId) ? 'Hide Details' : 'View Details'}
                        </Button>
                      </div>
                      {order.status === "PENDING" && (
                        <Button
                          className='order-continue-payment'
                          type="primary"
                          onClick={() => window.location.href = order.paymentUrl}
                        >
                          Continue Payment
                        </Button>
                      )}
                      {order.status === "DELIVERED" && (
                        <Button
                          className='order-continue-payment'
                          type={refundRequestedOrders.includes(order.orderId) ? "default" : "primary"}
                          disabled={refundRequestedOrders.includes(order.orderId)}
                          onClick={() => handleRefundRequest(order.orderId)}
                        >
                          {refundRequestedOrders.includes(order.orderId) ? "Request Sent" : "Return Product"}
                        </Button>
                      )}

                      {order.status === "REFUNDED" && (
                        <Button
                          className='order-continue-payment'
                          type="primary"
                        // onClick={() => handleRefundRequest(order.orderId)}
                        >
                          View Refund Image
                        </Button>
                      )}
                    </div>
                  </Space>

                  {/* Nếu đơn hàng được mở rộng, hiển thị danh sách sản phẩm */}
                  {expandedOrders.includes(order.orderId) && (
                    <div style={{ marginTop: 20 }}>
                      <List
                        dataSource={orderProductDetails[order.orderId] || []}
                        renderItem={(item) => (
                          <List.Item key={item.id || item.productId}>
                            <Card size="small" style={{ width: '100%' }}>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <img
                                  src={item.imageURL || "https://via.placeholder.com/150"}
                                  alt={item.productName}
                                  style={{ width: 80, height: 80, objectFit: 'cover', marginRight: 16 }}
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
                  )}
                </Card>
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default CustomerHistoryOrder;
