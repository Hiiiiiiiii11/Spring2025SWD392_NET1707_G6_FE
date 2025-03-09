import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Button, Typography, Input, Form, Spin } from 'antd';
import Header from '../../components/Header/Header';
import "../Profile/ProfileDetail.css";
import { GetCustomerProfileAPI, UpdateCustomerProfileAPI } from '../../services/userService';

const { Title } = Typography;

const UserProfile = () => {
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const customerId = sessionStorage.getItem('customerId');
  const role = sessionStorage.getItem('role');

  // Lấy dữ liệu profile khi component được mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      if (customerId) {
        const data = await GetCustomerProfileAPI(customerId);
        setProfile(data);
        setFormData(data);
      } else if (!customerId) {
        // const data = await GetCustomerProfileAPI(customerId);
        // setProfile(data);
        // setFormData(data);
      }


    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  // Xử lý thay đổi input trong form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  console.log(formData)
  // Lưu thay đổi và cập nhật profile qua API
  const handleSave = async () => {
    try {
      // Gọi API cập nhật profile với dữ liệu từ formData
      const updatedProfile = await UpdateCustomerProfileAPI(formData);
      setProfile(updatedProfile);
      setFormData(updatedProfile);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile");
    }
  };

  // Hủy chỉnh sửa và đặt lại formData theo profile gốc
  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  if (loading) {
    return <Spin tip="Loading profile..." />;
  }

  return (
    <div>
      <Header />
      <div style={{ padding: 24 }}>
        <Title level={2}>User's Profile</Title>
        <Card>
          {isEditing ? (
            <Form layout="vertical">
              <Form.Item label="Full Name">
                <Input
                  name="fullName"
                  value={formData.fullName || ''}
                  onChange={handleChange}
                  placeholder="Enter full name"
                />
              </Form.Item>
              <Form.Item label="Email">
                <Input
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  disabled
                />
              </Form.Item>
              <Form.Item label="Phone">
                <Input
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </Form.Item>
              <Form.Item label="Address">
                <Input.TextArea
                  name="address"
                  value={formData.address || ''}
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
              <Descriptions.Item label="Name">
                <div className='colum-item-content'>{profile.fullName}</div>
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                <div className='colum-item-content'>{profile.email}</div>
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                <div className='colum-item-content'>{profile.phone}</div>
              </Descriptions.Item>
              <Descriptions.Item label="Address">
                <div className='colum-item-content'>{profile.address}</div>
              </Descriptions.Item>
              <Descriptions.Item label="">
                <Button type="primary" className='colum-item-content' onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              </Descriptions.Item>
            </Descriptions>
          )}
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
