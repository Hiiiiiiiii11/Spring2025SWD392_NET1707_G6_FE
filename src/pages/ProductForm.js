import React, { useState } from 'react';
import './EmployeeProducts.css'; // Sử dụng chung CSS với EmployeeProducts

const ProductForm = ({ product, onSubmit, onClose }) => {
  const [formData, setFormData] = useState(product || {
    name: '',
    price: 0,
    stock: 0,
    image: '',
    description: '',
    category: 'moisturizer', // Thêm category làm mặc định
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, id: product?.id });
  };

  return (
    <div className="product-form-overlay">
      <div className="product-form">
        <h3>{product ? 'Cập nhật Sản phẩm' : 'Thêm Sản phẩm Mới'}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Tên sản phẩm"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Giá (USD)"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="stock"
            placeholder="Số lượng"
            value={formData.stock}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="image"
            placeholder="URL hình ảnh"
            value={formData.image}
            onChange={handleChange}
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="moisturizer">Kem dưỡng ẩm</option>
            <option value="serum">Serum</option>
            <option value="toner">Nước cân bằng</option>
          </select>
          <textarea
            name="description"
            placeholder="Mô tả sản phẩm"
            value={formData.description}
            onChange={handleChange}
          />
          <div className="form-actions">
            <button type="submit">{product ? 'Cập nhật' : 'Thêm'}</button>
            <button type="button" onClick={onClose}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;