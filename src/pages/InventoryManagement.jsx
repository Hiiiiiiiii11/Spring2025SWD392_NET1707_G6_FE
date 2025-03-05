import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, DatePicker, Typography, Space } from 'antd';
const { Title } = Typography;

const InventoryManagement = () => {
  // Dữ liệu mẫu (mock data) cho lô hàng sản phẩm
  const [inventory, setInventory] = useState([
    {
      id: 'INV001',
      productName: 'Moisturizer Cream',
      quantity: 100,
      batchNumber: 'BATCH001',
      dateReceived: '2025-01-15',
      expiryDate: '2026-01-15',
      supplier: 'SkinCare Co.',
    },
    {
      id: 'INV002',
      productName: 'Sunscreen SPF 50',
      quantity: 50,
      batchNumber: 'BATCH002',
      dateReceived: '2025-02-01',
      expiryDate: '2026-02-01',
      supplier: 'SunProtect Inc.',
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  // Columns cho bảng
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Product Name', dataIndex: 'productName', key: 'productName' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Batch Number', dataIndex: 'batchNumber', key: 'batchNumber' },
    { title: 'Date Received', dataIndex: 'dateReceived', key: 'dateReceived', render: (text) => new Date(text).toLocaleDateString() },
    { title: 'Expiry Date', dataIndex: 'expiryDate', key: 'expiryDate', render: (text) => new Date(text).toLocaleDateString() },
    { title: 'Supplier', dataIndex: 'supplier', key: 'supplier' },
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
    setEditingItem(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  // Xử lý xóa
  const handleDelete = (id) => {
    setInventory(inventory.filter(item => item.id !== id));
    alert(`Inventory item with ID ${id} deleted successfully!`);
  };

  // Xử lý lưu thay đổi
  const handleSave = (values) => {
    if (editingItem) {
      setInventory(inventory.map(item => 
        item.id === editingItem.id ? { ...item, ...values } : item
      ));
    } else {
      setInventory([...inventory, { id: `INV${inventory.length + 1}`, ...values }]);
    }
    setIsModalVisible(false);
    form.resetFields();
    setEditingItem(null);
    alert("Inventory updated successfully!");
  };

  // Hiển thị modal thêm/sửa
  const showModal = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingItem(null);
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Title level={2}>Inventory Management</Title>
      <Button type="primary" onClick={showModal} style={{ marginBottom: 16 }}>
        Add New Inventory
      </Button>
      <Table
        columns={columns}
        dataSource={inventory}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
      <Modal
        title={editingItem ? "Edit Inventory" : "Add New Inventory"}
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
            name="productName"
            label="Product Name"
            rules={[{ required: true, message: 'Please enter the product name!' }]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: 'Please enter the quantity!' }]}
          >
            <InputNumber min={0} placeholder="Enter quantity" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="batchNumber"
            label="Batch Number"
            rules={[{ required: true, message: 'Please enter the batch number!' }]}
          >
            <Input placeholder="Enter batch number" />
          </Form.Item>
          <Form.Item
            name="dateReceived"
            label="Date Received"
            rules={[{ required: true, message: 'Please select the date received!' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="expiryDate"
            label="Expiry Date"
            rules={[{ required: true, message: 'Please select the expiry date!' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="supplier"
            label="Supplier"
            rules={[{ required: true, message: 'Please enter the supplier!' }]}
          >
            <Input placeholder="Enter supplier name" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InventoryManagement;