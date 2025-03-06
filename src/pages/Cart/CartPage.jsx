import React, { useState, useEffect } from "react";
import { Card, Button, Spin, message, Modal, InputNumber, Checkbox } from "antd";
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
    const [selectedProducts, setSelectedProducts] = useState([]); // Danh sách sản phẩm được chọn
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [productToRemove, setProductToRemove] = useState(null);
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
        } finally {
            setLoading(false);
        }
    };

    const showUpdateModal = (product) => {
        setSelectedProduct(product);
        setNewQuantity(product.quantity);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };
    const handleOrderProduct = () => {
        navigate('customer/orders');
    }

    const handleUpdateQuantity = async () => {
        if (!selectedProduct) return;

        try {
            await UpdateQuantityProductAPI(selectedProduct.productID, newQuantity);
            alert("✅ Quantity updated successfully!");
            setCartProducts((prevCart) =>
                prevCart.map((item) =>
                    item.productID === selectedProduct.productID ? { ...item, quantity: newQuantity } : item
                )
            );
            handleCancel();
        } catch (error) {
            alert("❌ Failed to update quantity!");
        }
    };

    const showConfirmRemove = (product) => {
        setProductToRemove(product);
        setIsConfirmOpen(true);
    };

    const handleRemoveProduct = async () => {
        if (!productToRemove) return;

        try {
            await RemoveProductFromCartAPI(productToRemove.productID);
            alert("✅ Product removed from cart!");
            setCartProducts((prevCart) => prevCart.filter((item) => item.productID !== productToRemove.productID));
        } catch (error) {
            alert("❌ Failed to remove product!");
        } finally {
            setIsConfirmOpen(false);
            setProductToRemove(null);
        }
    };

    // Xử lý chọn/bỏ chọn sản phẩm
    const handleSelectProduct = (productID, checked) => {
        setSelectedProducts((prevSelected) =>
            checked ? [...prevSelected, productID] : prevSelected.filter((id) => id !== productID)
        );
    };

    // Xóa nhiều sản phẩm đã chọn
    const handleRemoveSelectedProducts = async () => {
        if (selectedProducts.length === 0) {
            alert("⚠️ Please select at least one product!");
            return;
        }

        try {
            await Promise.all(selectedProducts.map((productID) => RemoveProductFromCartAPI(productID)));
            alert("✅ Selected products removed!");
            setCartProducts((prevCart) => prevCart.filter((item) => !selectedProducts.includes(item.productID)));
            setSelectedProducts([]);
        } catch (error) {
            alert("❌ Failed to remove selected products!");
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
                    <>
                        <Button
                            type="primary"
                            danger
                            onClick={handleRemoveSelectedProducts}
                            disabled={selectedProducts.length === 0}
                            style={{ marginBottom: "10px" }}
                        >
                            Remove Selected
                        </Button>

                        {cartProducts.map((product) => (
                            <Card key={product.productID} className="cart-card" hoverable>
                                <div className="cart-card-content">
                                    <Checkbox
                                        checked={selectedProducts.includes(product.productID)}
                                        onChange={(e) => handleSelectProduct(product.productID, e.target.checked)}
                                        style={{ marginRight: "10px" }}
                                    />
                                    <img
                                        src={product.imageURL || "https://via.placeholder.com/150"}
                                        alt={product.productName}
                                        className="cart-card-image"
                                    />
                                    <div className="cart-card-info">
                                        <h2>{product.productName}</h2>
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
                        ))}
                    </>
                )}
                <div className="order-btn">
                    <button className="order-products" onClick={() => handleOrderProduct()}>Order Products

                    </button>
                </div>
            </div>
            <Footer />

            <Modal
                title="Update Quantity"
                open={isModalOpen}
                onOk={handleUpdateQuantity}
                onCancel={handleCancel}
                okText="Save"
                cancelText="Cancel"
            >
                <p><strong>Product:</strong> {selectedProduct?.productName}</p>
                Quantity: &nbsp;
                <InputNumber
                    min={1}
                    max={selectedProduct?.stockQuantity || 100}
                    value={newQuantity}
                    onChange={(value) => setNewQuantity(value)}
                />
            </Modal>

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