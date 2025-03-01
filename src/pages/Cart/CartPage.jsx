import React, { useState, useEffect } from "react";
import { Card, Button, Spin, message } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import Footer from "../../components/Footer/Footer";
import { GetAllProductCartAPI } from "../../services/cartService";
import "../Cart/CartPage.css";

const CartPage = () => {
    const [cartProducts, setCartProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch cart data from API
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const data = await GetAllProductCartAPI();
                console.log(data)
                setCartProducts(data || []);
            } catch (error) {
                message.error("❌ Failed to fetch cart items!");
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    const handleBackToProductPage = () => {
        navigate("/products");
    };

    return (
        <div>
            <div className="cart-page">
                <div className="cartpage-info">
                    <button className="back-to-product" onClick={handleBackToProductPage}>
                        <ArrowLeftOutlined /> Products Page
                    </button>
                    <div className="h1-content">
                        <h1>
                            <ShoppingCartOutlined />&nbsp;Your Cart{" "}
                        </h1>
                    </div>
                </div>

                {loading ? (
                    <Spin size="large" />
                ) : cartProducts.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    cartProducts.map((product) => (
                        <Card key={product.productId} className="cart-card" hoverable>
                            <div className="cart-card-content">
                                <img
                                    src={product.imageURL || "https://via.placeholder.com/150"}
                                    alt={product.productName}
                                    className="cart-card-image"
                                />
                                <div className="cart-card-info">
                                    <h2>{product.productName}</h2>
                                    <p>Thương hiệu: {product.brand || "N/A"}</p>
                                    <p className="price">{product.price.toLocaleString()}đ</p>
                                    <p>Số lượng: {product.quantity}</p>
                                    <Button type="primary">Cập nhật</Button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
            <Footer />
        </div>
    );
};

export default CartPage;
