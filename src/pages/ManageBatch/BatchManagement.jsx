import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, InputNumber, DatePicker, message, Space } from "antd";
import { useParams } from "react-router-dom";
import { createNewBatchAPI, deleteBatchAPI, editBatchAPI, getAllBatchByProductIdAPI } from "../../services/manageBatchService";
import moment from "moment";

import Header from "../../components/Header/Header";
import "../ManageBatch/BatchManagement.css";

const BatchManagement = () => {
  const { productID } = useParams();
  const [batches, setBatches] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [form] = Form.useForm();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchBatchById();
  }, [productID]);


  const fetchBatchById = async () => {
    try {
      const getAllProductIdBatches = await getAllBatchByProductIdAPI(productID);

      setBatches(getAllProductIdBatches);
    } catch (error) {
      console.error("Failed to fetch batches");
    }
  };


  const handleDelete = async (batchId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;
    try {
      await deleteBatchAPI(batchId);
      alert("Batch deleted successfully");
      fetchBatchById();
    } catch (error) {
      alert("Failed to delete batch");
    }
  }


  const handleEdit = (batch) => {
    setIsEditMode(true);
    setEditingBatch(batch);
    form.setFieldsValue({
      quantity: batch.quantity,
      importDate: moment(batch.importDate),
      expireDate: moment(batch.expireDate),
    });
    setIsModalVisible(true);
  };

  const handleSaveEditBatch = async () => {
    try {
      const values = await form.validateFields(); // Lấy dữ liệu từ form

      const updatedBatch = {
        batchId: editingBatch.batchId,  // Sử dụng batchId thay vì batchID
        productId: editingBatch.productId,  // API yêu cầu có productId
        quantity: values.quantity,
        importDate: values.importDate.toISOString(), // Chuyển đổi sang ISO-8601
        expireDate: values.expireDate.toISOString(),
      };

      await editBatchAPI(editingBatch.batchId, updatedBatch);
      alert("✅ Batch updated successfully!");

      setIsModalVisible(false);
      setIsEditMode(false);
      fetchBatchById(); // Gọi lại danh sách để cập nhật UI
    } catch (error) {
      console.error("Error updating batch:", error);
      alert("❌ Failed to update batch!");
    }
  };


  const columns = [
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    {
      title: "Import Date",
      dataIndex: "importDate",
      key: "importDate",
      render: (text) => moment(text).format("DD/MM/YYYY"),
    },
    {
      title: "Expire Date",
      dataIndex: "expireDate",
      key: "expireDate",
      render: (text) => moment(text).format("DD/MM/YYYY"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(record.batchId)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Header />
      <div className="batch-page">
        <h2 className="batch-header-conte">Manage Batch for {product?.productName || "Product"}</h2>
        <Button type="primary" onClick={() => { setIsModalVisible(true); setIsEditMode(false); form.resetFields(); }}>
          Add New Batch
        </Button>
        <Table columns={columns} dataSource={batches} rowKey="batchId" />

        <Modal
          title={isEditMode ? "Edit Batch" : "Add Batch"}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onOk={handleSaveEditBatch}
          okText="Save"
        >
          <Form form={form} layout="vertical">
            <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: "Please enter quantity" }]}>
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="importDate" label="Import Date" rules={[{ required: true, message: "Please select import date" }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="expireDate" label="Expire Date" rules={[{ required: true, message: "Please select expire date" }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

export default BatchManagement;
