import React, { useState, useEffect } from "react";
import { Table, Input, Button, Form, Modal, Select, } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "./ManagerStaff.css";
import { CreateEmployeeAPI, deleteEmployeeAPI, GetAllEmployeeAPI, UpdateEmployeeAPI } from "../../services/manageEmployeeService";
import Header from "../../components/Header/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ManagerStaff() {
  const [staffs, setStaffs] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [form] = Form.useForm();
  const [roles] = useState(["CUSTOMER_STAFF", "DELIVERY_STAFF"]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const employees = await GetAllEmployeeAPI();
      console.log(employees)
      if (employees) {
        setStaffs(employees);
      } else {
        toast.error("Failed to load employees!");
      }
    } catch (error) {
      toast.error("Error fetching employees!");
    }
  };

  const handleAddNewStaff = () => {
    setEditMode(false);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditStaff = (record) => {

    setEditMode(true);
    setEditingStaffId(record.staffId);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDeleteStaff = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this promotion?");
    if (!confirmDelete) return;
    try {
      await deleteEmployeeAPI(id);
      setStaffs((prev) => prev.filter((s) => s.id !== id));
      toast.success("Staff deleted successfully!");
      fetchEmployees();
    } catch (error) {
      toast.error("Failed to delete staff!");
    }
  }


  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (editMode) {
        const updatedEmployee = await UpdateEmployeeAPI(editingStaffId, {
          staffId: editingStaffId,
          fullname: values.fullname,
          email: values.email,
          phone: values.phone,
          role: values.role.toUpperCase(),
          password: values.password,
        });
        fetchEmployees();

        if (updatedEmployee) {
          setStaffs((prev) =>
            prev.map((s) =>
              s.staffId === editingStaffId ? { ...s, ...values } : s
            )
          );
          toast.success("Staff updated successfully!");

        } else {
          toast.error("Failed to update staff!");
        }
      } else {
        const newEmployeeData = {
          fullname: values.fullname,
          email: values.email,
          phone: values.phone,
          role: values.role.toUpperCase(),
          password: values.password,
        };

        const newEmployee = await CreateEmployeeAPI(newEmployeeData);
        if (newEmployee) {
          setStaffs((prev) => [...prev, { staffId: newEmployee.staffId, ...newEmployeeData }]);
          toast.success("Staff added successfully!");
          fetchEmployees();
        } else {
          toast.warning("Failed to add staff!");
        }
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch {
      toast.warning("Error saving staff!");
    }
  };


  const filteredStaffs = staffs
    ? staffs.filter(
      (s) =>
        s.role === "CUSTOMER_STAFF" || s.role === "DELIVERY_STAFF" &&
        s.fullname &&
        s.fullname.toLowerCase().includes((search || "").toLowerCase())
    )
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
          <Button type="link" danger onClick={() => handleDeleteStaff(record.staffId)}>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <>
      <ToastContainer />
      <Header />
      <div className="manager-staff-page">
        <div className="manager-container" div style={{ minHeight: "100vh" }}>
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
                rules={[
                  { required: true, message: "Phone number is required!" },
                  { pattern: /^\d{10}$/, message: "Phone number must be exactly 10 digits!" },
                ]}
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

              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Password is required!" }]}
                hidden
              >
                <Input.Password placeholder="********" />
              </Form.Item>

            </Form>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default ManagerStaff;
