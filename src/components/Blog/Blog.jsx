import React from "react";
import { List, Typography, Card, Button } from "antd";

const { Title, Text } = Typography;

const Blog = () => {
  const blogPosts = [
    {
      id: "B001",
      title: "Top 10 Skincare Tips for Oily Skin",
      content: "Learn how to care for oily skin effectively...",
      image: "https://i.imgur.com/OIWOaxV.jpeg",
    },
    {
      id: "B002",
      title: "Hydrating Masks for Dry Skin",
      content: "Discover the best hydrating masks for dry skin...",
      image: "https://i.imgur.com/OIWOaxV.jpeg",
    },
    {
      id: "B003",
      title: "The Benefits of Vitamin C for Your Skin",
      content: "Find out why Vitamin C is essential for healthy skin...",
      image: "https://i.imgur.com/OIWOaxV.jpeg",
    },
    {
      id: "B004",
      title: "Nighttime Routine for Glowing Skin",
      content: "Follow these steps for a glowing complexion...",
      image: "https://i.imgur.com/OIWOaxV.jpeg",
    },
  ];

  return (
    <div style={{ padding: 24, margin: "0 auto" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 30 }}>
        Skincare Blog
      </Title>
      <List
        grid={{ gutter: 16, column: 2 }}
        dataSource={blogPosts}
        renderItem={(post) => (
          <List.Item>
            <Card
              hoverable
              cover={
                <img
                  alt={post.title}
                  src={post.image}
                  style={{ height: 200, objectFit: "cover" }}
                />
              }
              style={{
                borderRadius: 10,
                overflow: "hidden",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Title level={4}>{post.title}</Title>
              <Text>{post.content}</Text>
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

export default Blog;
