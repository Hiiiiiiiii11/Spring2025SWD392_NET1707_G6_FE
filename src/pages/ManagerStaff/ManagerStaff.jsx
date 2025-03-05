import React, { useState, useEffect } from "react";
import { Table, Input, Button, Form, Modal, Select, } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "./ManagerStaff.css";
import { CreateEmployeeAPI, GetAllEmployeeAPI } from "../../services/manageEmployeeService";
import Header from "../../components/Header/Header";

function ManagerStaff() {
  const [staffs, setStaffs] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [form] = Form.useForm();
  const [roles] = useState(["CUSTOMER_STAFF", "MANAGER"]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const employees = await GetAllEmployeeAPI();
      if (employees) {
        setStaffs(employees);
      } else {
        alert("Failed to load employees!");
      }
    } catch (error) {
      alert("Error fetching employees!");
    }
  };

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
        alert("Staff deleted successfully!");
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (editMode) {
        // 🔹 Gọi API cập nhật nhân viên nếu có
        // const updatedEmployee = await UpdateEmployeeAPI(editingStaffId, values);
        // if (updatedEmployee) {
        //   setStaffs((prev) =>
        //     prev.map((s) => (s.id === editingStaffId ? updatedEmployee : s))
        //   );
        //   alert("Staff updated successfully!");
        // } else {
        //   alert("Failed to update staff!");
        // }
      } else {
        // Thêm nhân viên mới
        const newEmployeeData = {
          fullname: values.fullname,
          email: values.email,
          phone: values.phone,
          role: values.role.toUpperCase(),
          password: values.password,
        };

        const newEmployee = await CreateEmployeeAPI(newEmployeeData);
        if (newEmployee) {
          setStaffs((prev) => [...prev, { id: newEmployee.id, ...newEmployeeData }]);
          alert("Staff added successfully!");
        } else {
          alert("Failed to add staff!");
        }
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch {
      alert("Error saving staff!");
    }
  };

  const filteredStaffs = staffs
    ? staffs.filter((s) => s.fullname.toLowerCase().includes(search.toLowerCase()))
    : [];

  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullname",
      key: "fullname",
      sorter: (a, b) => a.fullname.localeCompare(b.fullname),
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Role", dataIndex: "role", key: "role" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEditStaff(record)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDeleteStaff(record.id)}>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Header />
      <div className="manager-staff-page">
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
            open={isModalVisible}
            onOk={handleModalOk}
            onCancel={() => setIsModalVisible(false)}
            okText={editMode ? "Save Changes" : "Add Staff"}
          >
            <Form form={form} layout="vertical">
              <Form.Item
                name="fullname"
                label="Full Name"
                rules={[{ required: true, message: "Name is required!" }]}
              >
                <Input placeholder="Staff Name" />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, type: "email", message: "Email is required!" },
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
                name="role"
                label="Role"
                rules={[{ required: true, message: "Please select a role" }]}
              >
                <Select placeholder="Select role">
                  {roles.map((rol) => (
                    <Select.Option key={rol} value={rol}>{rol}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              {!editMode && (
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{ required: true, message: "Password is required!" }]}
                >
                  <Input placeholder="Password" />
                </Form.Item>
              )}
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default ManagerStaff;
