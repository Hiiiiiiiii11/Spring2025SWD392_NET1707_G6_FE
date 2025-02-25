import React from 'react';
import { Card, Row, Col, Button } from 'antd';
import Footer from '../../components/Footer/Footer';
import product1 from "../../assets/product1.jpg";
import product2 from "../../assets/product2.jpg";
import product3 from "../../assets/product3.jpg";
import product4 from "../../assets/product4.jpg";
import product5 from "../../assets/product5.jpg";
import product6 from "../../assets/product6.jpg";
import '../Cart/CartPage.css';
import { useNavigate } from 'react-router-dom';

const productsInCart = [
    { id: 1, name: 'Sữa Rửa Mặt Trắng Da', price: 120000, rating: 4.6, image: product1, brand: "L'Oreal", quantity: 1 },
    { id: 2, name: 'Son Môi Đỏ Quyến Rũ', price: 99000, rating: 4.8, image: product2, brand: "Maybelline", quantity: 2 },
    { id: 3, name: 'Kem Chống Nắng SPF 50+', price: 195000, rating: 4.7, image: product3, brand: "La Roche-Posay", quantity: 1 },
];



const CartPage = () => {
    const navigate = useNavigate();



    const handleBackToProductPage = () => {
        navigate('/products')
    }
    return (
        <div>
            <div className="cart-page">
                <div className="cartpage-info">
                    <button className="back-to-product" onClick={() => handleBackToProductPage()}>Back to Products Page</button>
                    <div className='h1-content'>
                        <h1>Giỏ hàng của bạn</h1>
                    </div>
                </div>
                {productsInCart.map(product => (
                    <Card key={product.id} className="cart-card" hoverable>
                        <div className="cart-card-content">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="cart-card-image"
                            />
                            <div className="cart-card-info">
                                <h2>{product.name}</h2>
                                <p>Thương hiệu: {product.brand}</p>
                                <p className="price">
                                    {product.price.toLocaleString()}đ
                                </p>
                                <p>Số lượng: {product.quantity}</p>
                                <Button type="primary">Cập nhật</Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
            <Footer />
        </div>
    );
};

export default CartPage;
