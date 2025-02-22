import React, { useState, useEffect } from "react";
import { Table, Input, Button, Form, Modal, Upload, message } from "antd";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import "../ManageProduct/Manager.css";
import { createNewProductAPI, deleteProductAPI, getAllProductAPI, uploadToCloudinary } from "../../services/manageProductService";

function Manager() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getAllProductAPI();
      if (data) setProducts(data);
    };
    fetchProducts();
  }, []);

  const handleAddNewProduct = () => {
    setEditMode(false);
    form.resetFields();
    setFile(null);
    setIsModalVisible(true);
  };

  const handleEditProduct = (record) => {
    setEditMode(true);
    setEditingProductId(record.id);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDeleteProduct = async (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this product?",
      onOk: async () => {
        try {
          await deleteProductAPI(id);
          setProducts(products.filter((p) => p.id !== id));
          message.success("Product deleted successfully!");
        } catch (error) {
          message.error("Failed to delete product. Please try again.");
        }
      }
    });
  };


  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (file) {
        const imageURL = await uploadToCloudinary(file);
        values.imageURL = imageURL;
      }
      await createNewProductAPI(values);
      message.success("Product added successfully!");
      setIsModalVisible(false);
      form.resetFields();
      setFile(null);
    } catch (error) {
      message.error("Error creating product!");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "productName",
      key: "productName",
      sorter: (a, b) => a.productName.localeCompare(b.productName)
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description"
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category"
    },
    {
      title: "Skin Type",
      dataIndex: "skinTypeCompatibility",
      key: "skinTypeCompatibility"
    },
    {
      title: "Image",
      dataIndex: "imageURL",
      key: "imageURL",
      render: (text, record) =>
        record.imageURL ? (
          <img src={record.imageURL} alt="Product" style={{ maxWidth: "100px" }} />
        ) : null
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEditProduct(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDeleteProduct(record.id)}>
            Delete
          </Button>
        </>
      )
    }
  ];

  return (
    <div className="manager-page">
      <div className="manager-container">
        <h2>Manager Products</h2>
        <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between" }}>
          <Input
            style={{ width: "400px", height: "40px" }}
            placeholder="Search product..."
            onChange={(e) => setSearch(e.target.value)}
            suffix={<SearchOutlined />}
          />
          <Button type="primary" onClick={handleAddNewProduct}>
            + Add new product
          </Button>
        </div>
        <Table dataSource={products} columns={columns} rowKey="id" />

        <Modal
          title={editMode ? "Edit Product" : "Add Product"}
          visible={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
          okText={editMode ? "Save Changes" : "Add Product"}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="productName"
              label="Product Name"
              rules={[{ required: true, message: "Product name is required!" }]}
            >
              <Input placeholder="Product Name" />
            </Form.Item>
            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: "Price is required!" }]}
            >
              <Input placeholder="Price" />
            </Form.Item>
            <Form.Item name="category" label="Category">
              <Input placeholder="Category" />
            </Form.Item>
            <Form.Item name="skinTypeCompatibility" label="Skin Type">
              <Input placeholder="Skin Type" />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea placeholder="Description" />
            </Form.Item>
            <Form.Item name="imageURL" label="Image">
              <Upload
                beforeUpload={(file) => {
                  setFile(file);
                  return false;
                }}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Upload Image</Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

export default Manager;