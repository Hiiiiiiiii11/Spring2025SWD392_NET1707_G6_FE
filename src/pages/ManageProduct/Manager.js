import React, { useState, useEffect } from "react";
import { Table, Input, Button, Form, Modal, Upload, message, Select } from "antd";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import "../ManageProduct/Manager.css";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [categories, setCategories] = useState(["Cleanser", "Toner", "Serum", "Moisturizer", "Sunscreen", "Night Cream", "Scrub"]);
  const [fileList, setFileList] = useState([]);


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
    setEditingProductID(record.productID);

    form.setFieldsValue({
      ...record,
      imageURL: record.imageURL || "", // Giữ nguyên đường link ảnh
    });

    // Nếu có ảnh, đặt vào fileList để hiển thị trên Upload
    setFileList(record.imageURL ? [{ uid: "-1", url: record.imageURL, name: "Current Image" }] : []);

    setIsModalVisible(true);
  };




  const handleDeleteProduct = async (id) => {
    const product = products.find((p) => p.productID === id);

    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    if (product && product.stockQuantity > 0) {
      alert("Cannot delete product with stock remaining!");
      return;
    }

    try {
      await deleteProductAPI(id);
      alert("Product deleted successfully!");
      const data = await getAllProductAPI();
      if (data) setProducts(data);
    } catch (error) {
      alert("Failed to delete product. Please try again.");
    }
  };


  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      let imageURL = values.imageURL; // Giữ nguyên ảnh cũ nếu không có ảnh mới

      // Nếu có file mới được upload, tải ảnh lên Cloudinary
      if (file) {
        imageURL = await uploadToCloudinary(file);
      }

      // Gán lại URL ảnh mới (nếu có)
      values.imageURL = imageURL;

      if (editMode) {
        // Chế độ chỉnh sửa
        await editProductAPI(editingProductID, values);
        alert("Product updated successfully!");
      } else {
        // Chế độ thêm mới
        await createNewProductAPI(values);
        alert("Product added successfully!");
      }

      // Cập nhật lại danh sách sản phẩm sau khi chỉnh sửa/thêm mới
      const data = await getAllProductAPI();
      if (data) setProducts(data);

      setIsModalVisible(false);
      form.resetFields();
      setFile(null);
      setFileList([]); // Reset fileList sau khi thành công

    } catch (error) {
      message.error("Error processing product. Please try again.");
    }
  };

  const handleGoToBatch = (productID) => {
    navigate(`/manage-batch/${productID}`); // Điều hướng đến trang ManageBatch
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

          <Button type="link" onClick={() => handleGoToBatch(record.productID)}>Batch</Button>
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
              <Form.Item name="category" label="Category" rules={[{ required: true, message: "Please select a category" }]}>
                <Select placeholder="Select category">
                  {categories.map((cat) => (
                    <Select.Option key={cat} value={cat}>{cat}</Select.Option>  // ✅ Đúng cách
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="skinTypeCompatibility" label="Skin Type">
                <Input placeholder="Skin Type" />
              </Form.Item>
              <Form.Item name="description" label="Description">
                <Input.TextArea placeholder="Description" />
              </Form.Item>
              <Form.Item name="imageURL" label="Image">
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  beforeUpload={(file) => {
                    setFile(file);
                    setFileList([{ uid: "-1", url: URL.createObjectURL(file), name: file.name }]);
                    return false; // Không upload ngay, chỉ lưu vào state
                  }}
                  onRemove={() => {
                    setFile(null);
                    setFileList([]);
                  }}
                >
                  {fileList.length >= 1 ? null : <Button icon={<UploadOutlined />}>Upload Image</Button>}
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
