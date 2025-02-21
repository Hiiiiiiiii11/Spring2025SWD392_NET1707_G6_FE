import React, { useState } from 'react';
import './ProductForm.css';

const ProductForm = ({ product, onSubmit, onClose }) => {
  const [formData, setFormData] = useState(product || {
    name: '',
    price: 0,
    stock: 0,
    image: '',
    description: ''
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