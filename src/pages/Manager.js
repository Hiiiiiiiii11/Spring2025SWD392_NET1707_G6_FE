import React, { useState } from "react";
import "./Manager.css";

function Manager() {
  const [products, setProducts] = useState([
    { id: 1, name: "Moisturizing Cream", price: "$25.99" },
    { id: 2, name: "Vitamin C Serum", price: "$30.99" },
  ]);

  return (
    <div className="manager-container">
      <h2>Manager Dashboard</h2>

      {/* Quản lý sản phẩm */}
      <section>
        <h3>Product Management</h3>
        <button className="add-btn">Add Product</button>
        <table className="manager-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default Manager;
