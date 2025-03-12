import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, InputNumber, DatePicker, Space } from "antd";
import { useParams } from "react-router-dom";
import { createNewBatchAPI, deleteBatchAPI, editBatchAPI, getAllBatchByProductIdAPI } from "../../services/manageBatchService";
import moment from "moment";

import Header from "../../components/Header/Header";
import "../ManageBatch/BatchManagement.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      toast.success("Batch deleted successfully");
      fetchBatchById();
    } catch (error) {
      toast.error("Failed to delete batch");
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
      const values = await form.validateFields();
      const batchData = {
        productId: productID,
        quantity: values.quantity,
        importDate: values.importDate.toISOString(),
        expireDate: values.expireDate.toISOString(),
      };

      if (isEditMode) {
        batchData.batchId = editingBatch.batchId;
        await editBatchAPI(editingBatch.batchId, batchData);
        toast.success("✅ Batch updated successfully!");
      } else {
        await createNewBatchAPI(batchData);
        toast.success("✅ Batch created successfully!");
      }

      setIsModalVisible(false);
      setIsEditMode(false);
      fetchBatchById();
    } catch (error) {
      console.error("Error saving batch:", error);
      toast.error("❌ Failed to save batch!");
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
      <ToastContainer />
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
