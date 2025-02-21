import React, { useState, useEffect } from "react";
import "./Manager.css";
import { getAllProductAPI } from "../services/managerService";

function Manager() {
  // Load dữ liệu từ localStorage
  const [products, setProducts] = useState([]);


  const [newProduct, setNewProduct] = useState({
    productName: "",
    description: "",
    price: "",
    category: "",
    skinTypeCompatibility: "",
    image: ""

  });

  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    getAllProductAPI();
  }, []);


  // Thêm sản phẩm
  const addProduct = async () => {
    let formErrors = {};
    if (!newProduct.name) formErrors.name = "Product name is required!";
    if (!newProduct.price) formErrors.price = "Price is required!";
    if (isNaN(newProduct.price) || newProduct.price <= 0) formErrors.price = "Invalid price!";

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;

    }

    setProducts([...products, { ...newProduct, id: Date.now() }]);
    setNewProduct({ name: "", price: "", category: "", description: "", stock: 10, discount: 0, image: "" });
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

  // Xử lý thay đổi ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      };
      reader.readAsDataURL(file); // Chuyển đổi ảnh thành URL
    }
  };

  return (
    <div className="manager-page">
      <div className="manager-container">
        <h2>Manager Dashboard</h2>
        <input type="text" placeholder="Search product..." onChange={(e) => setSearch(e.target.value)} />

        <h3>{editMode ? "Edit Product" : "Add Product"}</h3>
        <div className="add-product-form">
          <div className="input-container">
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.productName}
              onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
              className={errors.productName ? "error" : ""}
            />
            {errors.productName && <div className="error">{errors.productName}</div>}
          </div>

          <div className="input-container">
            <input
              type="text"
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
              placeholder="Category"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            />
          </div>

          <div className="input-container">
            <input
              type="text"
              placeholder="Skin Type"
              value={newProduct.skinTypeCompatibility}
              onChange={(e) => setNewProduct({ ...newProduct, skinTypeCompatibility: e.target.value })}
            />
          </div>



          <div className="input-container">
            <textarea
              type="text"
              placeholder="Decription"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}

            />

          </div>

          <div className="input-container">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {newProduct.image && <img src={newProduct.image} alt="Product" style={{ maxWidth: "100px", marginTop: "10px" }} />}
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
              <th>Decription</th>
              <th>Price</th>
              <th>Category</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products
              .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
              .map((p) => (
                <tr key={p.id}>
                  <td>{p.productName}</td>
                  <td>{p.description}</td>
                  <td>{p.price}</td>
                  <td>{p.category}</td>
                  <td>{p.skinTypeCompatibility}</td>
                  <td>{p.image}</td>
                  <td>
                    {p.image && <img src={p.image} alt="Product" style={{ maxWidth: "100px" }} />}
                  </td>
                  <td>
                    <button onClick={() => startEditProduct(p)}>Edit</button>
                    <button onClick={() => deleteProduct(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Manager;
