import React from "react";
import { List, Card, Button, Typography } from "antd";
import "./Promotion.css"; // Import file CSS

const { Title, Text } = Typography;

const Promotion = () => {
  // Mock data
  const promotions = [
    {
      id: "PROMO001",
      title: "Summer Skincare Sale 30% Off",
      description:
        "Get 30% off on all moisturizers and sunscreens until March 31, 2025!",
      discount: "30%",
      validUntil: "2025-03-31",
    },
    {
      id: "PROMO002",
      title: "Buy 2 Get 1 Free on Cleansers",
      description: "Purchase any 2 cleansers and get the third one free!",
      discount: "Buy 2 Get 1 Free",
      validUntil: "2025-04-15",
    },
  ];

  return (
    <div className="promotion-container">
      <Title level={2}>Promotions & Offers</Title>
      <List
        dataSource={promotions}
        renderItem={(promotion) => (
          <List.Item>
            <Card title={promotion.title} className="promotion-card">
              <Text className="promotion-description">{promotion.description}</Text>
              <p className="promotion-discount">Discount: {promotion.discount}</p>
              <p className="promotion-valid">
                Valid until: {new Date(promotion.validUntil).toLocaleDateString()}
              </p>
              <Button type="primary" className="promotion-button">Shop Now</Button>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Promotion;
