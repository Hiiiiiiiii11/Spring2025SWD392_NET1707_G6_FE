import React, { useState, useEffect } from "react";
import { Table, Input, Button, Form, Modal, Upload, message } from "antd";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import "./Manager.css";
import { createNewProductAPI, getAllProductAPI } from "../services/manageProductService";

function Manager() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  // State cho modal thêm/chỉnh sửa sản phẩm
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [form] = Form.useForm();
  // State lưu file image được chọn
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getAllProductAPI();
      if (data) setProducts(data);
    };
    fetchProducts();
  }, []);

  // Mở modal để thêm sản phẩm mới
  const handleAddNewProduct = () => {
    setEditMode(false);
    form.resetFields();
    setFile(null);
    setIsModalVisible(true);
  };

  // Mở modal chỉnh sửa sản phẩm (ví dụ nếu cần hỗ trợ chỉnh sửa)
  const handleEditProduct = (record) => {
    setEditMode(true);
    setEditingProductId(record.id);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  // Xóa sản phẩm
  const handleDeleteProduct = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this product?",
      onOk: () => {
        setProducts(products.filter((p) => p.id !== id));
        message.success("Product deleted successfully!");
      }
    });
  };

  // Xử lý submit modal để thêm sản phẩm
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      // Gọi API tạo sản phẩm mới, truyền cả values (dữ liệu JSON) và file (file ảnh)
      await createNewProductAPI(values, file);
      message.success("Product added successfully!");
      setIsModalVisible(false);
      form.resetFields();
      setFile(null);
      // Bạn có thể refresh lại danh sách sản phẩm từ API nếu cần
    } catch (error) {
      message.error("Error creating product!");
    }
  };

  // Các cột hiển thị trong Table
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
      dataIndex: "image",
      key: "image",
      render: (text, record) =>
        record.image ? (
          <img src={record.image} alt="Product" style={{ maxWidth: "100px" }} />
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

  // Lọc dữ liệu theo search
  const filteredData = products.filter((p) =>
    p.productName?.toLowerCase().includes(search.toLowerCase())
  );

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
        <Table dataSource={filteredData} columns={columns} rowKey="id" />

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
              rules={[
                { required: true, message: "Price is required!" },
                { type: "number", transform: (value) => Number(value), message: "Price must be a number!" },
                { validator: (_, value) => (value > 0 ? Promise.resolve() : Promise.reject("Invalid price!")) }
              ]}
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
            <Form.Item name="image" label="Image">
              <Upload
                beforeUpload={(file) => {
                  // Lưu file vào state
                  setFile(file);
                  // Đọc file để hiển thị preview nếu cần
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    form.setFieldsValue({ image: e.target.result });
                  };
                  reader.readAsDataURL(file);
                  return false; // Ngăn upload tự động
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
