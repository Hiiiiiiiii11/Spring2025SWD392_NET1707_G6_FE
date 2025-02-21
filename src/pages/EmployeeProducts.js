import React, { useState, useEffect } from 'react';
import ProductForm from './ProductForm';
import './EmployeeProducts.css';

const EmployeeProducts = () => {
  // Dữ liệu mock ban đầu
  const [products, setProducts] = useState([
    { id: 1, name: 'Moisturizer Cream', price: 25, stock: 50, image: '/assets/moisturizer.jpg', description: 'Hydrating cream for dry skin' },
    { id: 2, name: 'Vitamin C Serum', price: 35, stock: 30, image: '/assets/serum.jpg', description: 'Brightening serum for glowing skin' },
  ]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

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

  return (
    <div className="employee-products">
      <h2>Quản lý Sản phẩm Skincare</h2>
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

      <table className="products-table">
        <thead>
          <tr>
            <th>Tên Sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>{product.stock}</td>
              <td>
                <button onClick={() => handleEdit(product)}>Sửa</button>
                <button onClick={() => handleDelete(product.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeProducts;