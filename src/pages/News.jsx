import React from "react";
import { List, Typography, Card, Button } from "antd";

const { Title, Text } = Typography;

const News = () => {
  const newsItems = [
    {
      id: "N001",
      title: "New Skincare Trends in 2025",
      content: "Discover the latest skincare trends for this year...",
      image: "https://source.unsplash.com/400x250/?skincare,beauty",
    },
    {
      id: "N002",
      title: "Launch of New Moisturizer Line",
      content: "Our new moisturizer line is now available...",
      image: "https://source.unsplash.com/400x250/?cosmetics,cream",
    },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
        Latest Skincare News
      </Title>
      <List
        grid={{ gutter: 16, column: 2 }}
        dataSource={newsItems}
        renderItem={(item) => (
          <List.Item>
            <Card
              hoverable
              cover={
                <img
                  alt={item.title}
                  src={item.image}
                  style={{ height: 180, objectFit: "cover" }}
                />
              }
              style={{ borderRadius: 10, overflow: "hidden" }}
            >
              <Title level={4}>{item.title}</Title>
              <Text>{item.content}</Text>
              <div style={{ marginTop: 10, textAlign: "right" }}>
                <Button type="primary">Read More</Button>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default News;
