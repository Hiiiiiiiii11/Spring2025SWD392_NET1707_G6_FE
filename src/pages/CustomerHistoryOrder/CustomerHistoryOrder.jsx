import React, { useState, useEffect } from 'react';
import { List, Card, Button, Typography, Modal, Space } from 'antd';
import Header from '../../components/Header/Header';
import { GetAllHistoryOrderAPI } from '../../services/customerOrder';
const { Title, Text } = Typography;

const CustomerHistoryOrder = () => {
  // Dữ liệu mẫu (mock data) thay cho API
  const [orders, setOrders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const customerId = sessionStorage.getItem("customerId");
  console.log("check id", customerId);

  const getStatusColor = (status) => {
    return status === 'Delivered' ? 'success' : 'warning';
  };
  useEffect(() => {
    fetchCustomerHistoryOrder();
  }, [])
  const fetchCustomerHistoryOrder = async () => {
    try {
      const historyOrder = await GetAllHistoryOrderAPI(customerId);
      console.log(historyOrder)
      if (historyOrder) {
        setOrders(historyOrder);
      } else {
        alert("Failed to load order!");
      }
    } catch (error) {
      alert("Error fetching order!");
    }
  };


  // Xem chi tiết đơn hàng
  const handleViewDetails = (order) => {
    console.log("View Details for Order:", order.orderId);
  };

  return (
    <div>
      <Header />
      <div style={{ padding: 24, margin: '0 auto' }}>
        <Title level={2}>History Order</Title>
        {orders.length === 0 ? (
          <Text type="secondary">No orders found.</Text>
        ) : (
          <List
            dataSource={orders}
            renderItem={(order) => (
              <List.Item>
                <Card title={`Order #${order.orderId}`} style={{ width: '100%' }}>
                  <p>Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                  <p>
                    Status:
                    <Text type={getStatusColor(order.status)} strong>
                      {order.status}
                    </Text>
                  </p>
                  <p>Payment Method: {order.paymentMethod}</p>
                  <List
                    dataSource={order.items}
                    renderItem={(item) => (
                      <List.Item>
                        {item.productName} - Quantity: {item.quantity} - Price: ${item.price}
                      </List.Item>
                    )}
                    bordered
                    size="small"
                  />
                  <p style={{ fontWeight: 'bold', marginTop: 10 }}>Original Total: ${order.total}</p>

                  <Space style={{ marginTop: 10 }}>
                    <Button type="default" onClick={() => handleViewDetails(order)}>
                      View Details
                    </Button>
                  </Space>
                </Card>
              </List.Item>
            )}
          />
        )}
        <Modal
          title="Select Promotion"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Button type="primary" onClick={() => setIsModalVisible(false)} style={{ marginTop: 16 }}>
            Close
          </Button>
        </Modal>
      </div>
    </div>
  );
};

export default CustomerHistoryOrder;