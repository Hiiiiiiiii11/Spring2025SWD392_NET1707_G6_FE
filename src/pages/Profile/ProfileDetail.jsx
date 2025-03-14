import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Button, Typography, Input, Form, Spin } from 'antd';
import Header from '../../components/Header/Header';
import "../Profile/ProfileDetail.css";
import { GetCustomerProfileAPI, GetStaffProfileAPI, UpdateCustomerProfileAPI, UpdateStaffProfileAPI } from '../../services/userService';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title } = Typography;

const UserProfile = () => {
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const customerId = sessionStorage.getItem('customerId');
  const staffId = sessionStorage.getItem('staffId');
  const role = sessionStorage.getItem("role")
  const staffEmail = sessionStorage.getItem("staffEmail");

  // Lấy dữ liệu profile khi component được mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      if (role === "CUSTOMER") {
        const data = await GetCustomerProfileAPI(customerId);
        console.log(data)
        setProfile(data);
        setFormData(data);
      } else if (role === "CUSTOMER_STAFF" || role === "MANAGER") {
        const data = await GetStaffProfileAPI(staffId);
        setProfile(data);
        setFormData(data);
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
  // Lưu thay đổi và cập nhật profile qua API
  const handleSave = async () => {
    try {
      let updatedProfile = null;

      if (role === "CUSTOMER") {
        updatedProfile = await UpdateCustomerProfileAPI(formData);
        fetchProfile();
      } else if (role === "CUSTOMER_STAFF" || role === "MANAGER") {
        updatedProfile = await UpdateStaffProfileAPI(staffEmail, {
          fullName: formData.fullname,
          phone: formData.phone,
          address: formData.address
        });
        fetchProfile();
      }

      if (updatedProfile) {
        setProfile(updatedProfile);
        setFormData(updatedProfile);
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update profile");
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
    <div style={{ minHeight: "100vh" }}>
      <ToastContainer />
      <Header />
      <div style={{ padding: 24 }}>
        <Title level={2}>User's Profile</Title>
        <Card>
          {isEditing ? (
            <Form layout="vertical">
              {role === "CUSTOMER" && (<Form.Item label="Full Name">
                <Input
                  name="fullName"
                  value={formData.fullName || ''}
                  onChange={handleChange}
                  placeholder="Enter full name"
                />
              </Form.Item>)}
              {(role === "CUSTOMER_STAFF" || role === "MANAGER") && (<Form.Item label="Full Name">
                <Input
                  name="fullname"
                  value={formData.fullname || ''}
                  onChange={handleChange}
                  placeholder="Enter full name"
                />
              </Form.Item>)}

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
              {role === "CUSTOMER" && (
                <Descriptions.Item label="Full Name">
                  <div className='colum-item-content'>{profile.fullName}</div>
                </Descriptions.Item>
              )}
              {(role === "CUSTOMER_STAFF" || role === "MANAGER") && (
                <Descriptions.Item label="Full Name">
                  <div className='colum-item-content'>{profile.fullname}</div>
                </Descriptions.Item>
              )}
              {(role === "CUSTOMER_STAFF" || role === "MANAGER") && (
                <Descriptions.Item label="Role">
                  <div className='colum-item-content'>{profile.role}</div>
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Email">
                <div className='colum-item-content'>{profile.email}</div>
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                <div className='colum-item-content'>{profile.phone}</div>
              </Descriptions.Item>
              {role === "CUSTOMER" && (
                <Descriptions.Item label="Adress">
                  <div className='colum-item-content'>{profile.address}</div>
                </Descriptions.Item>
              )}
              <Descriptions.Item label="">
                {(role === "CUSTOMER_STAFF" || role === "CUSTOMER") && (
                  <Button type="primary" className='colum-item-content' onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
