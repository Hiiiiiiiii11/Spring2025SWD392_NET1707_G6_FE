import React, { useState } from "react";
import { Table, Input, Button, Form, Modal, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "./ManagerStaff.css";

function ManagerStaff() {
  const [staffs, setStaffs] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "123456789",
      position: "Manager",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "987654321",
      position: "Staff",
    },
  ]);
  const [search, setSearch] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [form] = Form.useForm();

  const handleAddNewStaff = () => {
    setEditMode(false);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditStaff = (record) => {
    setEditMode(true);
    setEditingStaffId(record.id);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDeleteStaff = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this staff?",
      onOk: () => {
        setStaffs((prev) => prev.filter((s) => s.id !== id));
        message.success("Staff deleted successfully!");
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editMode) {
        setStaffs((prev) =>
          prev.map((s) => (s.id === editingStaffId ? { ...s, ...values } : s))
        );
        message.success("Staff updated successfully!");
      } else {
        setStaffs((prev) => [...prev, { id: Date.now(), ...values }]);
        message.success("Staff added successfully!");
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch {
      message.error("Error saving staff!");
    }
  };

  const filteredStaffs = staffs.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Position", dataIndex: "position", key: "position" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEditStaff(record)}>
            Edit
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDeleteStaff(record.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="manager-page">
      <div className="manager-container">
        <h2>Manager Staff</h2>
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Input
            style={{ width: "400px", height: "40px" }}
            placeholder="Search staff..."
            onChange={(e) => setSearch(e.target.value)}
            suffix={<SearchOutlined />}
          />
          <Button type="primary" onClick={handleAddNewStaff}>
            + Add new staff
          </Button>
        </div>
        <Table dataSource={filteredStaffs} columns={columns} rowKey="id" />

        <Modal
          title={editMode ? "Edit Staff" : "Add Staff"}
          visible={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
          okText={editMode ? "Save Changes" : "Add Staff"}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Name is required!" }]}
            >
              <Input placeholder="Staff Name" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Email is required!",
                },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Phone"
              rules={[{ required: true, message: "Phone number is required!" }]}
            >
              <Input placeholder="Phone" />
            </Form.Item>
            <Form.Item
              name="position"
              label="Position"
              rules={[{ required: true, message: "Position is required!" }]}
            >
              <Input placeholder="Position" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

export default ManagerStaff;
