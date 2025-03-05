import React, { useState } from 'react';
import { Table, Checkbox, Button, Typography } from 'antd';
const { Title } = Typography;

const CompareProducts = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const products = [
    { productId: 'P001', productName: 'Moisturizer Cream', price: 25, skinType: 'Normal', benefits: 'Hydrating', image: 'path/to/image1.jpg' },
    { productId: 'P002', productName: 'Sunscreen SPF 50', price: 15, skinType: 'All', benefits: 'UV Protection', image: 'path/to/image2.jpg' },
    { productId: 'P003', productName: 'Facial Cleanser', price: 20, skinType: 'Oily', benefits: 'Oil Control', image: 'path/to/image3.jpg' },
  ];

  const handleSelect = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId].slice(0, 3) // Giới hạn 3 sản phẩm
    );
  };

  const compareColumns = [
    { title: 'Product Name', dataIndex: 'productName', key: 'productName' },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (text) => `$${text}` },
    { title: 'Skin Type', dataIndex: 'skinType', key: 'skinType' },
    { title: 'Benefits', dataIndex: 'benefits', key: 'benefits' },
    { title: 'Image', dataIndex: 'image', key: 'image', render: (text) => <img src={text} alt="Product" width={50} /> },
  ];

  const compareData = selectedProducts.map(productId => 
    products.find(p => p.productId === productId)
  ).filter(Boolean);

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
      <Title level={2}>Compare Products</Title>
      <Table
        dataSource={products}
        columns={[
          { title: 'Select', key: 'select', render: (_, record) => (
            <Checkbox 
              checked={selectedProducts.includes(record.productId)} 
              onChange={() => handleSelect(record.productId)}
            />
          )},
          { title: 'Product Name', dataIndex: 'productName', key: 'productName' },
          { title: 'Price', dataIndex: 'price', key: 'price', render: (text) => `$${text}` },
        ]}
        rowKey="productId"
      />
      {selectedProducts.length > 1 && (
        <>
          <Title level={3} style={{ marginTop: 16 }}>Comparison</Title>
          <Table columns={compareColumns} dataSource={compareData} rowKey="productId" />
        </>
      )}
      <Button 
        type="primary" 
        onClick={() => setSelectedProducts([])} 
        style={{ marginTop: 16 }}
        disabled={selectedProducts.length === 0}
      >
        Clear Selection
      </Button>
    </div>
  );
};

export default CompareProducts;