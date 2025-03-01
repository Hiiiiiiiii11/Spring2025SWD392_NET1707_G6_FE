import React, { useState, useEffect } from "react";
import { Card, Button, Spin, message, Modal, InputNumber } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import Footer from "../../components/Footer/Footer";
import { GetAllProductCartAPI, UpdateQuantityProductAPI } from "../../services/cartService";
import "../Cart/CartPage.css";

const CartPage = () => {
    const [cartProducts, setCartProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [newQuantity, setNewQuantity] = useState(1);
    const navigate = useNavigate();

    // Fetch cart data from API
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const data = await GetAllProductCartAPI();
                console.log("check data", data);

                // Chuyển đổi dữ liệu: lấy ra `product` và thêm `quantity`
                const formattedCart = data.map((item) => ({
                    ...item.product, // Lấy tất cả thông tin trong `product`
                    quantity: item.quantity, // Thêm `quantity` từ bên ngoài vào
                }));

                setCartProducts(formattedCart);
                console.log("cartProducts after set:", formattedCart);
            } catch (error) {
                message.error("❌ Failed to fetch cart items!");
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    // Mở modal chỉnh sửa số lượng
    const showUpdateModal = (product) => {
        setSelectedProduct(product);
        setNewQuantity(product.quantity); // Set số lượng hiện tại
        setIsModalOpen(true);
    };

    // Đóng modal
    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    // Gửi API cập nhật số lượng
    const handleUpdateQuantity = async () => {
        if (!selectedProduct) return;

        try {
            await UpdateQuantityProductAPI(selectedProduct.productID, newQuantity);
            alert("✅ Quantity updated successfully!");

            // Cập nhật lại giỏ hàng sau khi chỉnh sửa
            setCartProducts((prevCart) =>
                prevCart.map((item) =>
                    item.productID === selectedProduct.productID ? { ...item, quantity: newQuantity } : item
                )
            );

            handleCancel(); // Đóng modal
            GetAllProductCartAPI();
        } catch (error) {
            alert("❌ Failed to update quantity!");
        }
    };

    return (
        <div>
            <div className="cart-page">
                <div className="cartpage-info">
                    <button className="back-to-product" onClick={() => navigate("/products")}>
                        <ArrowLeftOutlined /> &nbsp;Products Page
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
                        <Card key={product.productID} className="cart-card" hoverable>
                            <div className="cart-card-content">
                                {/* Hình ảnh sản phẩm */}
                                <img
                                    src={product.imageURL || "https://via.placeholder.com/150"}
                                    alt={product.productName}
                                    className="cart-card-image"
                                />

                                {/* Thông tin sản phẩm */}
                                <div className="cart-card-info">
                                    <h2>{product.productName}</h2>
                                    <p>
                                        <strong>Category:</strong> {product.category}
                                    </p>
                                    <p>
                                        <strong>For Skin Type:</strong> {product.skinTypeCompatibility}
                                    </p>
                                    <p className="price">
                                        <strong>Price:</strong> {product.price ? product.price.toLocaleString() + "$" : "N/A"}
                                    </p>
                                    <p>
                                        <strong>Description:</strong> {product.description}
                                    </p>
                                    <p>
                                        <strong>Quantity:</strong> {product.quantity}
                                    </p>

                                    <div className="cart-actions">
                                        <Button type="primary" onClick={() => showUpdateModal(product)}>
                                            Update Quantity
                                        </Button>
                                        <Button type="default" danger>
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
                <p>
                    <strong>Product:</strong> {selectedProduct?.productName}
                </p>
                Quantity: &nbsp;
                <InputNumber
                    min={1}
                    max={selectedProduct?.stockQuantity || 100} // Giới hạn số lượng theo tồn kho
                    value={newQuantity}
                    onChange={(value) => setNewQuantity(value)}
                />
            </Modal>
        </div>
    );
};

export default CartPage;
