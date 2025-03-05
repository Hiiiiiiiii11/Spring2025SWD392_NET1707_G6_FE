import React from 'react';
import { List, Card, Button, Typography } from 'antd';
const { Title, Text } = Typography;

const Promotion = () => {
  // Dữ liệu mẫu (mock data) cho các chương trình khuyến mãi
  const promotions = [
    {
      id: 'PROMO001',
      title: 'Summer Skincare Sale 30% Off',
      description: 'Get 30% off on all moisturizers and sunscreens until March 31, 2025!',
      discount: '30%',
      validUntil: '2025-03-31',
    },
    {
      id: 'PROMO002',
      title: 'Buy 2 Get 1 Free on Cleansers',
      description: 'Purchase any 2 cleansers and get the third one free!',
      discount: 'Buy 2 Get 1 Free',
      validUntil: '2025-04-15',
    },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <Title level={2}>Promotions & Offers</Title>
      <List
        dataSource={promotions}
        renderItem={(promotion) => (
          <List.Item>
            <Card title={promotion.title} style={{ width: '100%' }}>
              <Text>{promotion.description}</Text>
              <p style={{ marginTop: 8, fontWeight: 'bold' }}>Discount: {promotion.discount}</p>
              <p>Valid until: {new Date(promotion.validUntil).toLocaleDateString()}</p>
              <Button type="primary" style={{ marginTop: 16 }}>
                Shop Now
              </Button>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Promotion;