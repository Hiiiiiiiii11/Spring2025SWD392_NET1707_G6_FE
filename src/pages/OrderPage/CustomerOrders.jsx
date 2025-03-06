import React, { useState, useEffect } from 'react';
import { List, Card, Button, Typography, Radio, Modal, Space } from 'antd';
const { Title, Text } = Typography;

const OrderPage = () => {
  // Dữ liệu mẫu (mock data) thay cho API
  const [orders, setOrders] = useState([
    {
      orderId: 'ORD001',
      orderDate: '2025-02-20',
      status: 'Delivered',
      paymentMethod: 'Credit Card',
      items: [
        { productId: 'P001', productName: 'Moisturizer Cream', quantity: 2, price: 25 },
        { productId: 'P002', productName: 'Sunscreen SPF 50', quantity: 1, price: 15 },
      ],
      total: 65,
    },
    {
      orderId: 'ORD002',
      orderDate: '2025-02-15',
      status: 'Pending',
      paymentMethod: 'Cash on Delivery',
      items: [
        { productId: 'P003', productName: 'Facial Cleanser', quantity: 1, price: 20 },
      ],
      total: 20,
    },
  ]);

  // Dữ liệu mẫu cho các chương trình khuyến mãi
  const [promotions, setPromotions] = useState([
    { id: 'PROMO001', title: 'Summer Skincare Sale 30% Off', discount: 30 },
    { id: 'PROMO002', title: 'Buy 2 Get 1 Free on Cleansers', discount: 'Buy 2 Get 1 Free' },
  ]);

  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const getStatusColor = (status) => {
    return status === 'Delivered' ? 'success' : 'warning';
  };

  // Tính toán tổng tiền sau khi áp dụng khuyến mãi
  const calculateDiscountedTotal = (order) => {
    let total = order.total;
    if (selectedPromotion && selectedPromotion.discount === 30) {
      total = total * (1 - selectedPromotion.discount / 100); // Giảm 30%
    } else if (selectedPromotion && selectedPromotion.discount === 'Buy 2 Get 1 Free' && order.items.length > 2) {
      // Logic đơn giản: giảm giá 1 sản phẩm rẻ nhất nếu mua 2 hoặc hơn
      const cheapestItem = order.items.reduce((min, item) => (min.price < item.price ? min : item), order.items[0]);
      total -= cheapestItem.price;
    }
    return total.toFixed(2);
  };

  // Mở modal chọn khuyến mãi
  const showPromotionModal = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  // Lưu khuyến mãi đã chọn
  const handlePromotionSelect = (e) => {
    const promoId = e.target.value;
    const promo = promotions.find(p => p.id === promoId);
    setSelectedPromotion(promo);
    setIsModalVisible(false);
  };

  // Xem chi tiết đơn hàng
  const handleViewDetails = (order) => {
    // Logic để chuyển đến trang ViewOrderDetail (có thể dùng Link hoặc Navigate)
    console.log("View Details for Order:", order.orderId);
    // Bạn có thể thêm <Link to={`/view-order-detail?orderId=${order.orderId}`}> trong giao diện nếu cần
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <Title level={2}>My Orders</Title>
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
                {selectedPromotion && (
                  <p style={{ fontWeight: 'bold', color: 'green' }}>
                    Discounted Total (with {selectedPromotion.title}): ${calculateDiscountedTotal(order)}
                  </p>
                )}
                <Space style={{ marginTop: 10 }}>
                  <Button type="primary" onClick={() => showPromotionModal(order)}>
                    Apply Promotion
                  </Button>
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
        <Radio.Group onChange={handlePromotionSelect} value={selectedPromotion?.id}>
          {promotions.map((promo) => (
            <Radio value={promo.id} key={promo.id} style={{ display: 'block', marginBottom: 10 }}>
              {promo.title} - {promo.discount}
            </Radio>
          ))}
        </Radio.Group>
        <Button type="primary" onClick={() => setIsModalVisible(false)} style={{ marginTop: 16 }}>
          Close
        </Button>
      </Modal>
    </div>
  );
};

export default OrderPage;