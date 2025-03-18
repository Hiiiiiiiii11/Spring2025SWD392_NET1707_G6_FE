import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, DatePicker, Typography, Space } from 'antd';
import Header from '../../components/Header/Header';
import { createNewPromotionAPI, deletePromotionAPI, editPromotionAPI, getAllPromotionAPI } from '../../services/managePromotionService';
import { useEffect } from 'react';
import moment from 'moment';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const { Title } = Typography;

const ManagePromotion = () => {
  // Dữ liệu mẫu (mock data) cho các chương trình khuyến mãi
  const [promotions, setPromotions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [form] = Form.useForm();


  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const promotions = await getAllPromotionAPI();
      console.log(promotions)
      if (promotions) {
        setPromotions(promotions);
      } else {
        toast.success("Failed to load promotions!");
      }
    } catch (error) {
      toast.error("Error fetching promotions!");
    }
  };

  // Columns cho bảng
  const columns = [
    { title: 'Name', dataIndex: 'promotionName', key: 'promotionName' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Active Price', dataIndex: 'minimumAmount', key: 'minimumAmount' },
    { title: 'Discount', dataIndex: 'discountPercentage', key: 'discountPercentage' },
    { title: 'Start Date', dataIndex: 'startDate', key: 'startDate', render: (text) => new Date(text).toLocaleDateString() },
    { title: 'End Date', dataIndex: 'endDate', key: 'endDate', render: (text) => new Date(text).toLocaleDateString() },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record.promotionId)}>Delete</Button>
        </Space>
      ),
    },
  ];

  // Xử lý chỉnh sửa
  const handleEdit = (record) => {
    setEditingPromotion(record);
    form.setFieldsValue({
      ...record,
      startDate: moment(record.startDate),
      endDate: moment(record.endDate),
    });
    setIsModalVisible(true);
  };


  // Xử lý xóa
  const handleDelete = async (promotionId) => {
    console.log(promotionId)
    const confirmDelete = window.confirm("Are you sure you want to delete this promotion?");
    if (!confirmDelete) return;
    try {
      await deletePromotionAPI(promotionId);
      toast.success('Delete promotion successfully!');
      fetchPromotions();
    } catch (e) {
      toast.error('Fail to delete promotion!')
    }
  };

  // Xử lý lưu thay đổi
  const handleSave = async (values) => {
    try {
      if (editingPromotion) {
        await editPromotionAPI(editingPromotion.promotionId, values);
        toast.success('Update promotion successfully!')
      } else {
        await createNewPromotionAPI(values);
        toast.success('Create promotion successfully!')
      }
      fetchPromotions();
      setIsModalVisible(false);
      form.resetFields();
      setEditingPromotion(null);
    } catch (error) {
      toast.error("Failed to save promotion!");
    }
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
    <div style={{ minHeight: "100vh" }}>
      <ToastContainer />
      <Header />
      <div style={{ padding: 24, margin: '0 auto' }}>
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
            {/* {!editingPromotion && (
              <Form.Item
                name="promotionId"
                label="Promotion Id"
                rules={[{ required: true, message: 'Please enter the promotion Id!' }]}
              >
                <Input placeholder="Enter promotion Id" />
              </Form.Item>
            )} */}

            <Form.Item
              name="promotionName"
              label="Promotion Name"
              rules={[{ required: true, message: 'Please enter the promotion name!' }]}
            >
              <Input placeholder="Enter promotion Name" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please enter the description!' }]}
            >
              <Input.TextArea placeholder="Enter promotion description" rows={4} />
            </Form.Item>
            <Form.Item
              name="minimumAmount"
              label="Active Price"
              rules={[{ required: true, message: 'Please enter the description!' }]}
            >
              <Input placeholder="Enter promotion minimumAmount" rows={4} />
            </Form.Item>
            <Form.Item
              name="discountPercentage"
              label="DiscountPercentage"
              rules={[{ required: true, message: 'Please enter the discount!' }]}
            >
              <Input placeholder="Enter discount percent!" />
            </Form.Item>
            <Form.Item
              name="startDate"
              label="StartDate"
              rules={[{ required: true, message: 'Please select the valid date!' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="endDate"
              label="EndDate"
              rules={[{ required: true, message: 'Please select the valid date!' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ManagePromotion;