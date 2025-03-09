import React from "react";
import { List, Typography, Card, Button } from "antd";
<<<<<<< HEAD
=======
import "./Blog.css";
>>>>>>> parent of d0bc59a (css new blog)

const { Title, Text } = Typography;

const Blog = () => {
  const blogPosts = [
    {
      id: "B001",
      title: "Top 10 Skincare Tips for Oily Skin",
      content: "Learn how to care for oily skin effectively...",
      image: "https://source.unsplash.com/400x250/?skincare,beauty",
    },
    {
      id: "B002",
      title: "Hydrating Masks for Dry Skin",
      content: "Discover the best hydrating masks for dry skin...",
      image: "https://source.unsplash.com/400x250/?cosmetics,mask",
    },
    {
      id: "B003",
      title: "The Benefits of Vitamin C for Your Skin",
      content: "Find out why Vitamin C is essential for healthy skin...",
      image: "https://source.unsplash.com/400x250/?vitamin,skincare",
    },
    {
      id: "B004",
      title: "Nighttime Routine for Glowing Skin",
      content: "Follow these steps for a glowing complexion...",
      image: "https://source.unsplash.com/400x250/?night,beauty",
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
<<<<<<< HEAD
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
=======
            <Card hoverable className="blog-card">
              <img alt={post.title} src={post.image} className="blog-image" />
              <Title level={4} className="blog-card-title">
                {post.title}
              </Title>
              <Text className="blog-card-content">{post.content}</Text>
              <div className="blog-card-button">
>>>>>>> parent of d0bc59a (css new blog)
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
