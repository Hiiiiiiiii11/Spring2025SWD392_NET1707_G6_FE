import React, { useState, useEffect } from "react";
import { Card, Button, Spin, message, Modal, InputNumber } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom"; // Thêm import Link để điều hướng
import Footer from "../../components/Footer/Footer";
import { GetAllProductCartAPI, UpdateQuantityProductAPI, RemoveProductFromCartAPI } from "../../services/cartService";
import "../Cart/CartPage.css";

const CartPage = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newQuantity, setNewQuantity] = useState(1);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // State cho modal xác nhận xóa
  const [productToRemove, setProductToRemove] = useState(null); // Lưu sản phẩm cần xóa
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await GetAllProductCartAPI();
      const formattedCart = data.map((item) => ({
        ...item.product,
        quantity: item.quantity,
      }));
      setCartProducts(formattedCart);
    } catch (error) {
      message.error("❌ Failed to fetch cart items!");
    } finally {
      setLoading(false);
    }
  };

  // Hiển thị modal cập nhật số lượng
  const showUpdateModal = (product) => {
    setSelectedProduct(product);
    setNewQuantity(product.quantity);
    setIsModalOpen(true);
  };

  // Đóng modal cập nhật số lượng
  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Cập nhật số lượng sản phẩm
  const handleUpdateQuantity = async () => {
    if (!selectedProduct) return;

    try {
      await UpdateQuantityProductAPI(selectedProduct.productID, newQuantity);
      message.success("✅ Quantity updated successfully!");
      setCartProducts((prevCart) =>
        prevCart.map((item) =>
          item.productID === selectedProduct.productID ? { ...item, quantity: newQuantity } : item
        )
      );
      handleCancel();
    } catch (error) {
      message.error("❌ Failed to update quantity!");
    }
  };

  // Hiển thị modal xác nhận xóa
  const showConfirmRemove = (product) => {
    setProductToRemove(product);
    setIsConfirmOpen(true);
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const handleRemoveProduct = async () => {
    if (!productToRemove) return;

    try {
      await RemoveProductFromCartAPI(productToRemove.productID);
      message.success("✅ Product removed from cart!");
      setCartProducts((prevCart) => prevCart.filter((item) => item.productID !== productToRemove.productID));
      fetchCart(); // Gọi lại API để đồng bộ giỏ hàng
    } catch (error) {
      message.error("❌ Failed to remove product!");
    } finally {
      setIsConfirmOpen(false); // Đóng modal sau khi thực hiện xong
      setProductToRemove(null);
    }
  };

  return (
    <div>
      <div className="cart-page">
        <div className="cartpage-info">
          <button className="back-to-product" onClick={() => navigate("/products")}>
            <ArrowLeftOutlined /> Products Page
          </button>
          <div className="h1-content">
            <h1>
              <ShoppingCartOutlined /> Your Cart
            </h1>
          </div>
        </div>

        {loading ? (
          <Spin size="large" />
        ) : cartProducts.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartProducts.map((product) => (
            <Card key={product.productID} className="cart-card" hoverable>
              <div className="cart-card-content">
                <Link to={`/view-cart-product-detail?productId=${product.productID}`}>
                  <img
                    src={product.imageURL || "https://via.placeholder.com/150"}
                    alt={product.productName}
                    className="cart-card-image"
                  />
                </Link>

                <div className="cart-card-info">
                  <Link to={`/view-cart-product-detail?productId=${product.productID}`}>
                    <h2>{product.productName}</h2>
                  </Link>
                  <p><strong>Category:</strong> {product.category}</p>
                  <p><strong>For Skin Type:</strong> {product.skinTypeCompatibility}</p>
                  <p className="price"><strong>Price:</strong> {product.price ? product.price.toLocaleString() + "$" : "N/A"}</p>
                  <p><strong>Description:</strong> {product.description}</p>
                  <p><strong>Quantity:</strong> {product.quantity}</p>
                  <p className="price" style={{ fontSize: "20px" }}><strong>Total:</strong> {product.price * product.quantity}$</p>

                  <div className="cart-actions">
                    <Button type="primary" onClick={() => showUpdateModal(product)}>
                      Update Quantity
                    </Button>
                    <Button type="default" danger onClick={() => showConfirmRemove(product)}>
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
      <Footer />

      {/* Modal chỉnh sửa số lượng */}
      <Modal
        title="Update Quantity"
        open={isModalOpen}
        onOk={handleUpdateQuantity}
        onCancel={handleCancel}
        okText="Save"
        cancelText="Cancel"
      >
        <p><strong>Product:</strong> {selectedProduct?.productName}</p>
        Quantity: 
        <InputNumber
          min={1}
          max={selectedProduct?.stockQuantity || 100}
          value={newQuantity}
          onChange={(value) => setNewQuantity(value)}
        />
      </Modal>

      {/* Modal xác nhận xóa sản phẩm */}
      <Modal
        title="Confirm Remove"
        open={isConfirmOpen}
        onOk={handleRemoveProduct}
        onCancel={() => setIsConfirmOpen(false)}
        okText="Yes"
        cancelText="No"
      >
        <p>Do you want to remove <strong>{productToRemove?.productName}</strong> from your cart?</p>
      </Modal>
    </div>
  );
};

export default CartPage;