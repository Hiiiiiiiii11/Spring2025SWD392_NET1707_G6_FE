import React, { useState, useEffect } from "react";
import "./Manager.css";

function Manager() {
  // Load products from localStorage
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

  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState(null); // Track which product is being edited

  // Validation state
  const [errors, setErrors] = useState({
    name: "",
    price: "",
    discount: "",
    stock: ""
  });

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  // Validate form fields
  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!newProduct.name) {
      formErrors.name = "Name is required";
      isValid = false;
    }

    if (!newProduct.price || newProduct.price <= 0) {
      formErrors.price = "Price must be a positive number";
      isValid = false;
    }

    if (newProduct.discount < 0 || newProduct.discount > 100) {
      formErrors.discount = "Discount must be between 0% and 100%";
      isValid = false;
    }

    if (newProduct.stock <= 0) {
      formErrors.stock = "Stock must be a positive number";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  // Add new product
  const addProduct = () => {
    if (!validateForm()) return;

    const priceAfterDiscount = newProduct.price - (newProduct.price * newProduct.discount) / 100;
    setProducts([...products, { ...newProduct, id: Date.now(), priceAfterDiscount }]);
    setNewProduct({ name: "", price: "", category: "Moisturizer", description: "", stock: 10, discount: 0, image: "" });
  };

  // Edit product
  const editProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      stock: product.stock,
      discount: product.discount,
      image: product.image,
    });
  };

  // Save edited product
  const saveProduct = () => {
    if (!validateForm()) return;

    const priceAfterDiscount = newProduct.price - (newProduct.price * newProduct.discount) / 100;
    const updatedProducts = products.map((product) =>
      product.id === editingProduct.id
        ? { ...newProduct, id: product.id, priceAfterDiscount }
        : product
    );
    setProducts(updatedProducts);
    setNewProduct({ name: "", price: "", category: "Moisturizer", description: "", stock: 10, discount: 0, image: "" });
    setEditingProduct(null); // Reset editing state
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

      <h3>{editingProduct ? "Edit Product" : "Add Product"}</h3>

      {/* Title for Add Product */}
      <h4>Please fill in the details of the product you want to add:</h4>
      
      <input 
        type="text" 
        placeholder="Name" 
        value={newProduct.name} 
        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} 
      />
      {errors.name && <span className="error">{errors.name}</span>}
      
      <input 
        type="number" 
        placeholder="Price" 
        value={newProduct.price} 
        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} 
      />
      {errors.price && <span className="error">{errors.price}</span>}
      
      <input 
        type="text" 
        placeholder="Description" 
        value={newProduct.description} 
        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} 
      />
      
      <input 
        type="number" 
        placeholder="Stock" 
        value={newProduct.stock} 
        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} 
      />
      {errors.stock && <span className="error">{errors.stock}</span>}
      
      <input 
        type="number" 
        placeholder="Discount (%)" 
        value={newProduct.discount} 
        onChange={(e) => setNewProduct({ ...newProduct, discount: e.target.value })} 
      />
      {errors.discount && <span className="error">{errors.discount}</span>}
      
      <select 
        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
        value={newProduct.category}
      >
        <option>Moisturizer</option>
        <option>Anti-aging</option>
        <option>Brightening</option>
        <option>Sunscreen</option>
      </select>

      <button onClick={editingProduct ? saveProduct : addProduct}>
        {editingProduct ? "Save Changes" : "Add Product"}
      </button>

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
                  <button onClick={() => editProduct(p)}>Edit</button>
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
