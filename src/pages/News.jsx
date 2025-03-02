import React from 'react';
import { List, Typography } from 'antd';
const { Title, Text } = Typography;

const News = () => {
  const newsItems = [
    { id: 'N001', title: 'New Skincare Trends in 2025', content: 'Discover the latest skincare trends for this year...' },
    { id: 'N002', title: 'Launch of New Moisturizer Line', content: 'Our new moisturizer line is now available...' },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <Title level={2}>News</Title>
      <List
        dataSource={newsItems}
        renderItem={(item) => (
          <List.Item>
            <Title level={4}>{item.title}</Title>
            <Text>{item.content}</Text>
          </List.Item>
        )}
      />
    </div>
  );
};

export default News;