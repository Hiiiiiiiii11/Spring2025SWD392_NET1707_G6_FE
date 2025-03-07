import React from "react";
import { List, Typography, Card, Button } from "antd";
import "./Blog.css";

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
    <div className="blog-section">
      <Title level={2} className="blog-title">
        Skincare Blog
      </Title>
      <List
        grid={{ gutter: 16, column: 2 }}
        dataSource={blogPosts}
        renderItem={(post) => (
          <List.Item>
            <Card hoverable className="blog-card">
              <img alt={post.title} src={post.image} className="blog-image" />
              <Title level={4} className="blog-card-title">
                {post.title}
              </Title>
              <Text className="blog-card-content">{post.content}</Text>
              <div className="blog-card-button">
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