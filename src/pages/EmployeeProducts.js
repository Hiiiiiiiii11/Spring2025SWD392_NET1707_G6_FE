import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Select, Modal, Form, Upload, Image, message } from 'antd';
import { CSVLink } from 'react-csv';
import { SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EmployeeProducts.css';

const { Option } = Select;

const EmployeeProducts = () => {
  // Dữ liệu mock ban đầu
  const [products, setProducts] = useState([
    { id: 1, name: 'Moisturizing Cream', price: 25, stock: 50, image: '/assets/moisturizer.jpg', description: 'Hydrating cream for dry skin', category: 'moisturizer' },
    { id: 2, name: 'Vitamin C Serum', price: 35, stock: 8, image: '/assets/serum.jpg', description: 'Brightening serum for glowing skin', category: 'serum' },
    { id: 3, name: 'Hydrating Toner', price: 22, stock: 30, image: '/assets/toner.jpg', description: 'Balancing toner for all skin types', category: 'toner' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form] = Form.useForm();

  // Thông báo khi sản phẩm sắp hết hàng
  useEffect(() => {
    products.forEach(product => {
      if (product.stock < 10) {
        toast.warn(`${product.name} sắp hết hàng! Số lượng: ${product.stock}`);
      }
    });
  }, [products]);

  // Thống kê nhanh
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock < 10).length;
  const estimatedRevenue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  // Tạo ID mới cho sản phẩm
  const generateId = () => Math.max(...products.map(p => p.id), 0) + 1;

  // Lọc dữ liệu
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterCategory === 'all' || product.category === filterCategory)
  );

  // Xử lý thêm/sửa sản phẩm khi submit form
  const handleFormSubmit = (values) => {
    if (selectedProduct) {
      // Cập nhật sản phẩm
      const updatedProducts = products.map(p =>
        p.id === selectedProduct.id ? { ...p, ...values } : p
      );
      setProducts(updatedProducts);
      message.success("Sản phẩm được cập nhật thành công!");
    } else {
      // Thêm sản phẩm mới
      const newProduct = { ...values, id: generateId() };
      setProducts([...products, newProduct]);
      message.success("Thêm sản phẩm thành công!");
    }
    setIsFormModalVisible(false);
    form.resetFields();
    setSelectedProduct(null);
  };

  // Mở modal để thêm sản phẩm
  const handleAddNewProduct = () => {
    setSelectedProduct(null);
    form.resetFields();
    setIsFormModalVisible(true);
  };

  // Mở modal để chỉnh sửa sản phẩm
  const handleEditProduct = (record) => {
    setSelectedProduct(record);
    form.setFieldsValue(record);
    setIsFormModalVisible(true);
  };

  // Xóa sản phẩm
  const handleDeleteProduct = (id) => {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa sản phẩm này?",
      onOk: () => {
        setProducts(products.filter(p => p.id !== id));
        message.success("Sản phẩm đã được xóa!");
      }
    });
  };

  // Mở modal chi tiết sản phẩm
  const handleViewDetail = (record) => {
    setSelectedProduct(record);
    setIsDetailModalVisible(true);
  };

  // Các cột cho Table
  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (text, record) => <Image width={80} src={record.image} alt={record.name} />,
    },
    {
      title: 'Tên Sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price}`,
    },
    {
      title: 'Số lượng',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEditProduct(record)}>Sửa</Button>
          <Button type="link" danger onClick={() => handleDeleteProduct(record.id)}>Xóa</Button>
          <Button type="link" onClick={() => handleViewDetail(record)}>Chi tiết</Button>
        </>
      )
    }
  ];

  return (
    <div className="employee-products">
      <h2>Quản lý Sản phẩm Skincare</h2>
      <div className="stats">
        <div className="stat-card">Tổng sản phẩm: {totalProducts}</div>
        <div className="stat-card">Sản phẩm sắp hết: {lowStockProducts}</div>
        <div className="stat-card">Doanh thu ước tính: ${estimatedRevenue}</div>
      </div>
      <div className="filters" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Input
          style={{ width: 300 }}
          placeholder="Tìm kiếm sản phẩm..."
          onChange={(e) => setSearchTerm(e.target.value)}
          suffix={<SearchOutlined />}
        />
        <Select
          style={{ width: 200 }}
          value={filterCategory}
          onChange={(value) => setFilterCategory(value)}
        >
          <Option value="all">Tất cả</Option>
          <Option value="moisturizer">Kem dưỡng ẩm</Option>
          <Option value="serum">Serum</Option>
          <Option value="toner">Nước cân bằng</Option>
        </Select>
        <CSVLink data={products} filename={"products.csv"}>
          <Button type="primary">Xuất danh sách</Button>
        </CSVLink>
        <Button type="primary" onClick={handleAddNewProduct}>
          Thêm Sản phẩm Mới
        </Button>
      </div>

      <Table dataSource={filteredProducts} columns={columns} rowKey="id" />

      {/* Modal Form Thêm/Sửa sản phẩm */}
      <Modal
        title={selectedProduct ? "Chỉnh sửa Sản phẩm" : "Thêm Sản phẩm"}
        visible={isFormModalVisible}
        onCancel={() => { setIsFormModalVisible(false); form.resetFields(); setSelectedProduct(null); }}
        onOk={() => form.submit()}
        okText={selectedProduct ? "Lưu thay đổi" : "Thêm sản phẩm"}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item name="name" label="Tên Sản phẩm" rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}>
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>
          <Form.Item name="price" label="Giá" rules={[
            { required: true, message: "Vui lòng nhập giá sản phẩm!" },
            { type: 'number', transform: (value) => Number(value), message: "Giá phải là số!" },
            { validator: (_, value) => (value > 0 ? Promise.resolve() : Promise.reject("Giá không hợp lệ!")) }
          ]}>
            <Input placeholder="Nhập giá sản phẩm" />
          </Form.Item>
          <Form.Item name="stock" label="Số lượng" rules={[
            { required: true, message: "Vui lòng nhập số lượng!" },
            { type: 'number', transform: (value) => Number(value), message: "Số lượng phải là số!" },
          ]}>
            <Input placeholder="Nhập số lượng sản phẩm" />
          </Form.Item>
          <Form.Item name="category" label="Danh mục">
            <Select placeholder="Chọn danh mục">
              <Option value="moisturizer">Kem dưỡng ẩm</Option>
              <Option value="serum">Serum</Option>
              <Option value="toner">Nước cân bằng</Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea placeholder="Nhập mô tả sản phẩm" />
          </Form.Item>
          <Form.Item name="image" label="Hình ảnh">
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={(file) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                  form.setFieldsValue({ image: e.target.result });
                };
                reader.readAsDataURL(file);
                return false; // Ngăn upload tự động
              }}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Hiển thị chi tiết sản phẩm */}
      <Modal
        title="Chi tiết Sản phẩm"
        visible={isDetailModalVisible}
        footer={null}
        onCancel={() => setIsDetailModalVisible(false)}
      >
        {selectedProduct && (
          <div className="product-detail">
            <Image width={200} src={selectedProduct.image} alt={selectedProduct.name} />
            <h3>{selectedProduct.name}</h3>
            <p>Giá: ${selectedProduct.price}</p>
            <p>Số lượng: {selectedProduct.stock}</p>
            <p>Mô tả: {selectedProduct.description}</p>
          </div>
        )}
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default EmployeeProducts;
