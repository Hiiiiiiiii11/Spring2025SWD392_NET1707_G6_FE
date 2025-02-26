import { Button, Card } from "antd";
import React, { useEffect, useState } from "react";
import { PlusOutlined, MinusOutlined, DeleteOutlined } from "@ant-design/icons";
import "../Cart/CartPage.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";

const CartPage = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const increaseQuantity = (id) => {
    const newCart = cart.map((product) =>
      product.id === id
        ? { ...product, quantity: product.quantity + 1 }
        : product
    );
    updateCart(newCart);
  };

  const decreaseQuantity = (id) => {
    const newCart = cart.map((product) =>
      product.id === id && product.quantity > 1
        ? { ...product, quantity: product.quantity - 1 }
        : product
    );
    updateCart(newCart);
  };

  const removeItem = (id) => {
    const newCart = cart.filter((product) => product.id !== id);
    updateCart(newCart);
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  console.log("cart", cart);
  return (
    <layout className="layout">
      <Header />
      <div className="cart-container">
        {cart.length > 0 ? (
          <>
            <h1 className="cart-title">Giỏ Hàng</h1>
            {cart.map((product) => (
              <div key={product.id} className="cart-item">
                <img
                  src={product.image}
                  alt={product.name}
                  className="cart-item-image"
                />
                <div className="cart-item-info">
                  <h2 className="cart-item-name">{product.name}</h2>
                  <p className="cart-item-price">Giá: {product.price}</p>
                </div>
                <div className="cart-item-quantity">
                  <Button
                    icon={<MinusOutlined />}
                    onClick={() => decreaseQuantity(product.id)}
                    disabled={product.quantity <= 1}
                  />
                  <span className="cart-item-qty">{product.quantity}</span>
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => increaseQuantity(product.id)}
                  />
                </div>
                <p className="cart-item-price">
                  {product.price.toLocaleString()} đ
                </p>
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeItem(product.id)}
                />
              </div>
            ))}

            <div className="cart-summary">
              <div className="cart-total">
                <span>Tổng tiền:</span>
                <strong>{totalPrice.toLocaleString()} đ</strong>
              </div>
              <Button type="default" className="order-btn">
                Đặt Hàng
              </Button>
            </div>
          </>
        ) : (
          <div className="empty-cart-container">
            <p className="empty-cart-text">
              Giỏ hàng của bạn đang trống. Hãy thêm sản phẩm vào giỏ ngay!
            </p>
            <Link to="/">
              <Button type="primary" className="continue-shopping-btn">
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </layout>
  );
};

export default CartPage;
