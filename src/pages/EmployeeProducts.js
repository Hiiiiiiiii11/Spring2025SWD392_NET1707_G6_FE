import React, { useState, useEffect } from 'react';
import ProductForm from './ProductForm';
import { ToastContainer, toast } from 'react-toastify';
import { CSVLink } from 'react-csv';
import 'react-toastify/dist/ReactToastify.css';
import './EmployeeProducts.css';

const EmployeeProducts = () => {
  // Dữ liệu mock ban đầu
  const [products, setProducts] = useState([
    { id: 1, name: 'Moisturizing Cream', price: 25, stock: 50, image: '/assets/moisturizer.jpg', description: 'Hydrating cream for dry skin', category: 'moisturizer' },
    { id: 2, name: 'Vitamin C Serum', price: 35, stock: 8, image: '/assets/serum.jpg', description: 'Brightening serum for glowing skin', category: 'serum' },
    { id: 3, name: 'Hydrating Toner', price: 22, stock: 30, image: '/assets/toner.jpg', description: 'Balancing toner for all skin types', category: 'toner' },
  ]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Tạo ID mới cho sản phẩm
  const generateId = () => Math.max(...products.map(p => p.id), 0) + 1;

  // Xử lý tạo sản phẩm mới
  const handleCreate = (productData) => {
    const newProduct = { ...productData, id: generateId() };
    setProducts([...products, newProduct]);
    setIsFormOpen(false);
  };

  // Xử lý cập nhật sản phẩm
  const handleUpdate = (productData) => {
    setProducts(products.map(p => p.id === productData.id ? productData : p));
    setSelectedProduct(null);
    setIsFormOpen(false);
  };

  // Xử lý xóa sản phẩm
  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  // Mở form để tạo hoặc cập nhật
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  // Xem chi tiết sản phẩm
  const handleViewDetail = (product) => {
    setDetailProduct(product);
    setIsDetailOpen(true);
  };

  // Lọc sản phẩm
  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCategory === 'all' || product.category === filterCategory)
    );

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

  return (
    <div className="employee-products">
      <h2>Quản lý Sản phẩm Skincare</h2>
      <div className="stats">
        <div className="stat-card">Tổng sản phẩm: {totalProducts}</div>
        <div className="stat-card">Sản phẩm sắp hết: {lowStockProducts}</div>
        <div className="stat-card">Doanh thu ước tính: ${estimatedRevenue}</div>
      </div>
      <div className="filters">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="all">Tất cả</option>
          <option value="moisturizer">Kem dưỡng ẩm</option>
          <option value="serum">Serum</option>
          <option value="toner">Nước cân bằng</option>
        </select>
        <CSVLink data={products} filename={"products.csv"} className="export-button">
          Xuất danh sách
        </CSVLink>
      </div>
      <button onClick={() => { setSelectedProduct(null); setIsFormOpen(true); }}>
        Thêm Sản phẩm Mới
      </button>

      {isFormOpen && (
        <ProductForm
          product={selectedProduct}
          onSubmit={selectedProduct ? handleUpdate : handleCreate}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {isDetailOpen && detailProduct && (
        <ProductDetail
          product={detailProduct}
          onClose={() => setIsDetailOpen(false)}
        />
      )}

      <table className="products-table">
        <thead>
          <tr>
            <th>Hình ảnh</th>
            <th>Tên Sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(product => (
            <tr key={product.id}>
              <td><img src={product.image} alt={product.name} className="product-image" /></td>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>{product.stock}</td>
              <td>
                <button onClick={() => handleEdit(product)}>Sửa</button>
                <button onClick={() => handleDelete(product.id)}>Xóa</button>
                <button onClick={() => handleViewDetail(product)}>Xem chi tiết</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

// Component chi tiết sản phẩm (nằm trong cùng file để đơn giản)
const ProductDetail = ({ product, onClose }) => {
  return (
    <div className="product-detail-overlay">
      <div className="product-detail">
        <h3>{product.name}</h3>
        <img src={product.image} alt={product.name} className="product-image" />
        <p>Giá: ${product.price}</p>
        <p>Số lượng: {product.stock}</p>
        <p>Mô tả: {product.description}</p>
        <button onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
};

export default EmployeeProducts;