import React from "react";
import { List, Typography, Card, Button } from "antd";
import "./News.css";

const { Title, Text } = Typography;

const News = () => {
  const newsItems = [
    {
      id: "N001",
      title: "New Skincare Trends in 2025",
      content: "Discover the latest skincare trends for this year...",
      image: "https://i.imgur.com/OIWOaxV.jpeg",
    },
    {
      id: "N002",
      title: "Launch of New Moisturizer Line",
      content: "Our new moisturizer line is now available...",
      image: "https://i.imgur.com/OIWOaxV.jpeg",
    },
  ];

  return (
    <div className="news-section">
      <Title level={2} className="news-title">
        Latest Skincare News
      </Title>
      <List
        grid={{ gutter: 16, column: 2 }}
        dataSource={newsItems}
        renderItem={(item) => (
          <List.Item>
            <Card hoverable className="news-card">
              <img alt={item.title} src={item.image} className="news-image" />
              <Title level={4} className="news-card-title">
                {item.title}
              </Title>
              <Text className="news-card-content">{item.content}</Text>
              <div className="news-card-button">
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