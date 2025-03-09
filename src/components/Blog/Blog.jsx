import React from "react";
<<<<<<< HEAD
import { List, Typography, Card, Button } from "antd";
<<<<<<< HEAD
=======
import "./Blog.css";
>>>>>>> parent of d0bc59a (css new blog)
=======
import { Typography, Card, Button } from "antd";
import "./Blog.css";
>>>>>>> 971e8fca551bd2097b5175e8930e80d68cc8512d

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
<<<<<<< HEAD
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
=======
      <div className="blog-grid">
        {blogPosts.map((post) => (
          <Card key={post.id} hoverable className="blog-card">
            <img alt={post.title} src={post.image} className="blog-image" />
            <Title level={4} className="blog-card-title">
              {post.title}
            </Title>
            <Text className="blog-card-content">{post.content}</Text>
            <div className="blog-card-button">
              <Button type="primary">Read More</Button>
            </div>
          </Card>
        ))}
      </div>
>>>>>>> 971e8fca551bd2097b5175e8930e80d68cc8512d
    </div>
  );
};

export default Blog;