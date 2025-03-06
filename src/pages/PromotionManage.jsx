import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, DatePicker, Typography, Space } from 'antd';
const { Title } = Typography;

const PromotionManage = () => {
  // Dữ liệu mẫu (mock data) cho các chương trình khuyến mãi
  const [promotions, setPromotions] = useState([
    {
      id: 'PROMO001',
      title: 'Summer Skincare Sale 30% Off',
      description: 'Get 30% off on all moisturizers and sunscreens until March 31, 2025!',
      discount: 30,
      validUntil: '2025-03-31',
    },
    {
      id: 'PROMO002',
      title: 'Buy 2 Get 1 Free on Cleansers',
      description: 'Purchase any 2 cleansers and get the third one free!',
      discount: 'Buy 2 Get 1 Free',
      validUntil: '2025-04-15',
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [form] = Form.useForm();

  // Columns cho bảng
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Discount', dataIndex: 'discount', key: 'discount' },
    { title: 'Valid Until', dataIndex: 'validUntil', key: 'validUntil', render: (text) => new Date(text).toLocaleDateString() },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  // Xử lý chỉnh sửa
  const handleEdit = (record) => {
    setEditingPromotion(record);
    form.setFieldsValue({
      ...record,
      validUntil: record.validUntil ? new Date(record.validUntil) : null,
    });
    setIsModalVisible(true);
  };

  // Xử lý xóa
  const handleDelete = (id) => {
    setPromotions(promotions.filter(item => item.id !== id));
    alert(`Promotion with ID ${id} deleted successfully!`);
  };

  // Xử lý lưu thay đổi
  const handleSave = (values) => {
    if (editingPromotion) {
      setPromotions(promotions.map(item => 
        item.id === editingPromotion.id ? { ...item, ...values, validUntil: values.validUntil.format('YYYY-MM-DD') } : item
      ));
    } else {
      setPromotions([...promotions, { id: `PROMO${promotions.length + 1}`, ...values, validUntil: values.validUntil.format('YYYY-MM-DD') }]);
    }
    setIsModalVisible(false);
    form.resetFields();
    setEditingPromotion(null);
    alert("Promotion updated successfully!");
  };

  // Hiển thị modal thêm/sửa
  const showModal = () => {
    setEditingPromotion(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingPromotion(null);
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Title level={2}>Promotion Management</Title>
      <Button type="primary" onClick={showModal} style={{ marginBottom: 16 }}>
        Add New Promotion
      </Button>
      <Table
        columns={columns}
        dataSource={promotions}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
      <Modal
        title={editingPromotion ? "Edit Promotion" : "Add New Promotion"}
        visible={isModalVisible}
        onOk={() => form.submit()}
        onCancel={handleCancel}
        okText="Save"
        cancelText="Cancel"
      >
        <Form
          form={form}
          onFinish={handleSave}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter the promotion title!' }]}
          >
            <Input placeholder="Enter promotion title" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter the description!' }]}
          >
            <Input.TextArea placeholder="Enter promotion description" rows={4} />
          </Form.Item>
          <Form.Item
            name="discount"
            label="Discount"
            rules={[{ required: true, message: 'Please enter the discount!' }]}
          >
            <Input placeholder="Enter discount (e.g., 30% or Buy 2 Get 1 Free)" />
          </Form.Item>
          <Form.Item
            name="validUntil"
            label="Valid Until"
            rules={[{ required: true, message: 'Please select the valid date!' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PromotionManage;