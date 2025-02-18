import React, { useState, useEffect } from "react";
import "./Manager.css";

function Manager() {
  // Load data from localStorage
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

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  // Add product
  const addProduct = () => {
    const newErrors = {};

    if (!newProduct.name) newErrors.name = "Product name is required.";
    if (!newProduct.price) newErrors.price = "Price is required.";
    if (newProduct.price <= 0) newErrors.price = "Price must be greater than 0.";
    if (!newProduct.stock) newErrors.stock = "Stock quantity is required.";
    if (newProduct.stock < 0) newErrors.stock = "Stock cannot be negative.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const priceAfterDiscount = newProduct.price - (newProduct.price * newProduct.discount) / 100;
    setProducts([
      ...products,
      { ...newProduct, id: Date.now(), priceAfterDiscount }
    ]);
    setNewProduct({
      name: "",
      price: "",
      category: "Moisturizer",
      description: "",
      stock: 10,
      discount: 0,
      image: ""
    });
  };

  // Delete product
  const deleteProduct = (id) => {
    if (window.confirm("Are you sure?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="manager-container">
      <h2>Manager Dashboard</h2>
      <input
        type="text"
        placeholder="Search product..."
        onChange={(e) => setSearch(e.target.value)}
      />

      <h3>Add Product</h3>
      <div className="add-product-form">
        <h4>Please fill in the details of the product you want to add:</h4>

        {/* Name */}
        <div className="input-container">
          <input
            type="text"
            placeholder="Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className={errors.name ? "error" : ""}
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        {/* Price */}
        <div className="input-container">
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            className={errors.price ? "error" : ""}
          />
          {errors.price && <span className="error">{errors.price}</span>}
        </div>

        {/* Description */}
        <div className="input-container">
          <input
            type="text"
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
        </div>

        {/* Stock */}
        <div className="input-container">
          <input
            type="number"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
            className={errors.stock ? "error" : ""}
          />
          {errors.stock && <span className="error">{errors.stock}</span>}
        </div>

        {/* Discount */}
        <div className="input-container">
          <input
            type="number"
            placeholder="Discount (%)"
            value={newProduct.discount}
            onChange={(e) => setNewProduct({ ...newProduct, discount: e.target.value })}
            className={errors.discount ? "error" : ""}
          />
          {errors.discount && <span className="error">{errors.discount}</span>}
        </div>

        {/* Category */}
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

        <button onClick={addProduct}>Add Product</button>
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
