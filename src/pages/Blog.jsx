import React from 'react';
import { List, Typography } from 'antd';
const { Title, Text } = Typography;

const Blog = () => {
  const blogPosts = [
    { id: 'B001', title: 'Top 10 Skincare Tips for Oily Skin', content: 'Learn how to care for oily skin effectively...' },
    { id: 'B002', title: 'Hydrating Masks for Dry Skin', content: 'Discover the best hydrating masks for dry skin...' },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <Title level={2}>Blog</Title>
      <List
        dataSource={blogPosts}
        renderItem={(post) => (
          <List.Item>
            <Title level={4}>{post.title}</Title>
            <Text>{post.content}</Text>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Blog;