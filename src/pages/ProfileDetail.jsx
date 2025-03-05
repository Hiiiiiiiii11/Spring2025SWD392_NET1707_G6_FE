import React, { useState } from 'react';
import { Card, Descriptions, Button, Typography, Avatar, Input, Form, Modal } from 'antd';
const { Title, Text } = Typography;

const ProfileDetail = () => {
  // Dữ liệu mẫu (mock data) cho thông tin hồ sơ, tùy thuộc vào vai trò
  const [profile, setProfile] = useState({
    role: sessionStorage.getItem("role") || "GUEST", // Lấy vai trò từ sessionStorage
    name: "Nguyen Van A",
    email: "nguyenvana@example.com",
    phone: "0123456789",
    address: "123 Le Loi Street, District 1, Ho Chi Minh City",
    ordersCount: 5, // Số đơn hàng (chỉ cho CUSTOMER)
    lastLogin: "2025-03-03 14:30", // Lần đăng nhập cuối
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  // Xử lý thay đổi trong form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Lưu thay đổi
  const handleSave = () => {
    setProfile(formData);
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  // Hủy chỉnh sửa
  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <Title level={2}>Profile Details</Title>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <Avatar size={64} src="https://via.placeholder.com/150" />
          <div style={{ marginLeft: 16 }}>
            <Title level={4}>{profile.name}</Title>
            <Text type="secondary">Role: {profile.role}</Text>
          </div>
        </div>

        {isEditing ? (
          <Form layout="vertical">
            <Form.Item label="Name">
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </Form.Item>
            <Form.Item label="Email">
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </Form.Item>
            <Form.Item label="Phone">
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </Form.Item>
            <Form.Item label="Address">
              <Input.TextArea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                rows={4}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={handleSave} style={{ marginRight: 8 }}>
                Save
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </Form.Item>
          </Form>
        ) : (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Role">{profile.role}</Descriptions.Item>
            <Descriptions.Item label="Email">{profile.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{profile.phone}</Descriptions.Item>
            <Descriptions.Item label="Address">{profile.address}</Descriptions.Item>
            {profile.role === "CUSTOMER" && (
              <Descriptions.Item label="Total Orders">{profile.ordersCount}</Descriptions.Item>
            )}
            <Descriptions.Item label="Last Login">{profile.lastLogin}</Descriptions.Item>
            <Descriptions.Item label="">
              <Button type="primary" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Card>
    </div>
  );
};

export default ProfileDetail;