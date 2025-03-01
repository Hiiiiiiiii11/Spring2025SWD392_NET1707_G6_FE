import React, { useState, useEffect } from "react";
import { Table, Input, Button, Form, Modal, Upload, message } from "antd";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import "../ManageProduct/Manager.css";
import {
  createNewProductAPI,
  deleteProductAPI,
  editProductAPI,
  getAllProductAPI,
  uploadToCloudinary,
} from "../../services/manageProductService";
import Header from "../../components/Header/Header";

function Manager() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingProductID, setEditingProductID] = useState(null);
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
    // Lấy productID từ record thay vì record.id
    setEditingProductID(record.productID);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmDelete) {
      try {
        await deleteProductAPI(id);
        message.success("Product deleted successfully!");
        const data = await getAllProductAPI();
        if (data) { setProducts(data) }
        else {
          window.location.reload();
        }
      } catch (error) {
        console.error("Delete error:", error);
        message.error("Failed to delete product. Please try again.");
      }
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      // Nếu có file được upload, lấy URL từ Cloudinary
      if (file) {
        const imageURL = await uploadToCloudinary(file);
        values.imageURL = imageURL;
      }
      console.log(values)

      if (editMode) {
        // Chế độ chỉnh sửa: Gọi API cập nhật sản phẩm
        await editProductAPI(editingProductID, values);
        message.success("Product updated successfully!");
        const data = await getAllProductAPI();
        if (data) setProducts(data);
      } else {
        // Chế độ thêm mới: Gọi API tạo sản phẩm mới
        await createNewProductAPI(values);
        message.success("Product added successfully!");
        const data = await getAllProductAPI();
        if (data) setProducts(data);
      }

      setIsModalVisible(false);
      form.resetFields();
      setFile(null);

      // Cập nhật lại danh sách sản phẩm sau khi thêm/chỉnh sửa
      const data = await getAllProductAPI();
      if (data) setProducts(data);
    } catch (error) {
      console.error("Modal OK error:", error);
      message.error("Error processing product. Please try again.");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "productName",
      key: "productName",
      sorter: (a, b) => a.productName.localeCompare(b.productName),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Skin Type",
      dataIndex: "skinTypeCompatibility",
      key: "skinTypeCompatibility",
    },
    {
      title: "Stock Quantity",
      dataIndex: "stockQuantity",
      key: "stockQuantity",
    },
    {
      title: "Image",
      dataIndex: "imageURL",
      key: "imageURL",
      render: (text, record) =>
        record.imageURL ? (
          <img src={record.imageURL} alt="Product" style={{ maxWidth: "100px" }} />
        ) : null,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEditProduct(record)}>
            Edit
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDeleteProduct(record.productID)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Header />
      <div className="manager-page">
        <div className="manager-container">
          <h2>Manager Products</h2>
          <div
            style={{
              marginBottom: "16px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
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
          {/* Dùng productID làm rowKey */}
          <Table dataSource={products} columns={columns} rowKey="productID" />

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
    </div>
  );
}

export default Manager;
