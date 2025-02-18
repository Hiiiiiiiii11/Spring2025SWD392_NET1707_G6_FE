import React, { useState, useEffect } from "react";
import "./Manager.css";

function Manager() {
  // Load dữ liệu từ localStorage
  const [products, setProducts] = useState(() => {
    return JSON.parse(localStorage.getItem("products")) || [];
  });

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "Moisturizer",
    description: "",
    stock: 10,
    discount: 0,
    image: ""
  });

  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  // Thêm sản phẩm
  const addProduct = () => {
    let formErrors = {};
    if (!newProduct.name) formErrors.name = "Product name is required!";
    if (!newProduct.price) formErrors.price = "Price is required!";
    if (isNaN(newProduct.price) || newProduct.price <= 0) formErrors.price = "Invalid price!";
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const priceAfterDiscount = newProduct.price - (newProduct.price * newProduct.discount) / 100;
    setProducts([...products, { ...newProduct, id: Date.now(), priceAfterDiscount }]);
    setNewProduct({ name: "", price: "", category: "Moisturizer", description: "", stock: 10, discount: 0, image: "" });
    setErrors({});
  };

  // Cập nhật sản phẩm
  const updateProduct = () => {
    let formErrors = {};
    if (!newProduct.name) formErrors.name = "Product name is required!";
    if (!newProduct.price) formErrors.price = "Price is required!";
    if (isNaN(newProduct.price) || newProduct.price <= 0) formErrors.price = "Invalid price!";
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const updatedProducts = products.map((p) =>
      p.id === editingProductId
        ? { ...p, ...newProduct, priceAfterDiscount: newProduct.price - (newProduct.price * newProduct.discount) / 100 }
        : p
    );
    setProducts(updatedProducts);
    setEditMode(false);
    setEditingProductId(null);
    setNewProduct({ name: "", price: "", category: "Moisturizer", description: "", stock: 10, discount: 0, image: "" });
    setErrors({});
  };

  // Bắt đầu chỉnh sửa sản phẩm
  const startEditProduct = (product) => {
    setEditMode(true);
    setEditingProductId(product.id);
    setNewProduct({ ...product });
  };

  // Xóa sản phẩm
  const deleteProduct = (id) => {
    if (window.confirm("Are you sure?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="manager-container">
      <h2>Manager Dashboard</h2>
      <input type="text" placeholder="Search product..." onChange={(e) => setSearch(e.target.value)} />
      
      <h3>{editMode ? "Edit Product" : "Add Product"}</h3>
      <div className="add-product-form">
        <div className="input-container">
          <input
            type="text"
            placeholder="Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className={errors.name ? "error" : ""}
          />
          {errors.name && <div className="error">{errors.name}</div>}
        </div>

        <div className="input-container">
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            className={errors.price ? "error" : ""}
          />
          {errors.price && <div className="error">{errors.price}</div>}
        </div>

        <div className="input-container">
          <input
            type="text"
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
        </div>

        <div className="input-container">
          <input
            type="number"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
          />
        </div>

        <div className="input-container">
          <input
            type="number"
            placeholder="Discount (%)"
            value={newProduct.discount}
            onChange={(e) => setNewProduct({ ...newProduct, discount: e.target.value })}
          />
        </div>

        <div className="input-container">
          <select
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          >
            <option>Moisturizer</option>
            <option>Anti-aging</option>
            <option>Brightening</option>
            <option>Sunscreen</option>
          </select>
        </div>
        
        <button onClick={editMode ? updateProduct : addProduct}>
          {editMode ? "Save Changes" : "Add Product"}
        </button>
      </div>

      <h3>Product List</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Discount</th>
            <th>Final Price</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products
            .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
            .map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>${p.price}</td>
                <td>{p.discount}%</td>
                <td>${p.priceAfterDiscount.toFixed(2)}</td>
                <td>{p.category}</td>
                <td>{p.stock > 0 ? p.stock : <span style={{ color: "red" }}>Out of stock</span>}</td>
                <td>
                  <button onClick={() => startEditProduct(p)}>Edit</button>
                  <button onClick={() => deleteProduct(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default Manager;
