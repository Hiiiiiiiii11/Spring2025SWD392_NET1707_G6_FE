import React, { useState, useEffect } from "react";
import { Card, Button, Spin, Modal, InputNumber, Checkbox, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import { GetAllProductCartAPI, UpdateQuantityProductAPI, RemoveProductFromCartAPI } from "../../services/cartService";
import "../Cart/CartPage.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const CartPage = () => {
    const [cartProducts, setCartProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [newQuantity, setNewQuantity] = useState(1);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [productToRemove, setProductToRemove] = useState(null);
    const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
    const [selectedProductBatches, setSelectedProductBatches] = useState([]);
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
                batches: item.batches || [] // Thêm thông tin batch vào sản phẩm
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

    // Xử lý đặt hàng (chuyển đến OrderConfirmationPage với các sản phẩm được chọn)
    const handleOrderProduct = () => {
        if (selectedProducts.length === 0) {
            toast.warning(" Please select at least one product to order!");
            return;
        }

        // Lọc các sản phẩm được chọn từ cartProducts
        const selectedItems = cartProducts.filter((product) =>
            selectedProducts.includes(product.productID)
        );

        // Điều hướng đến OrderConfirmationPage và truyền danh sách sản phẩm được chọn qua state
        navigate('/order-confirmation', { state: { selectedItems } });
        console.log("check select product", selectedItems)
    };

    const handleUpdateQuantity = async () => {
        if (!selectedProduct) return;

        if (newQuantity > selectedProduct.stockQuantity) {
            toast.warning("You cannot add more than the available stock!");
            return;
        }


        try {
            await UpdateQuantityProductAPI(selectedProduct.productID, newQuantity);

            toast.success(" Quantity updated successfully!");
            setCartProducts((prevCart) =>
                prevCart.map((item) =>
                    item.productID === selectedProduct.productID ? { ...item, quantity: newQuantity } : item
                )
            );
            handleCancel();
        } catch (error) {
            toast.error(" Failed to update quantity!");
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
            toast.success(" Product removed from cart!");
            setCartProducts((prevCart) => prevCart.filter((item) => item.productID !== productToRemove.productID));
            setSelectedProducts((prevSelected) => prevSelected.filter((id) => id !== productToRemove.productID));
            fetchCart();
        } catch (error) {
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
            toast.warning("Please select at least one product!");
            return;
        }

        try {
            // Process removals sequentially
            for (const productID of selectedProducts) {
                await RemoveProductFromCartAPI(productID);
            }

            toast.success("Selected products removed!");
            setCartProducts((prevCart) =>
                prevCart.filter((item) => !selectedProducts.includes(item.productID))
            );
            setSelectedProducts([]);
            fetchCart();
        } catch (error) {
            toast.error("Failed to remove selected products!");
        }
    };


    const batchColumns = [
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Manufactured Date",
            dataIndex: "importDate",
            key: "importDate",
            render: (text) => new Date(text).toLocaleDateString(),
        },
        {
            title: "Expiration Date",
            dataIndex: "expireDate",
            key: "expireDate",
            render: (text) => new Date(text).toLocaleDateString(),
        },

    ];
    const showBatchModal = (batches) => {
        setSelectedProductBatches(batches);
        setIsBatchModalOpen(true);
    };

    return (
        <div style={{ minHeight: "100vh" }}>
            <ToastContainer />
            <div className="cart-page">
                <div className="cartpage-info">
                    <button className="back-to-product" onClick={() => navigate("/products")}>
                        <ArrowLeftOutlined /> &nbsp;Products Page
                    </button>
                    <div className="h1-content">
                        <h1>
                            <ShoppingCartOutlined />&nbsp; Your Cart
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
                                    <Link to={`/view-cart-product-detail?productId=${product.productID}`}>
                                        <img
                                            src={product.imageURL || "https://via.placeholder.com/150"}
                                            alt={product.productName}
                                            className="cart-card-image"
                                        />
                                    </Link>
                                    <div className="cart-card-info">
                                        <div className="cart-card-info-and-batches">
                                            <div>
                                                <Link to={`/view-cart-product-detail?productId=${product.productID}`}>
                                                    <h2>{product.productName}</h2>
                                                </Link>

                                                <p><strong>Category : </strong> {product.category}</p>
                                                <p><strong>For Skin Type : </strong> {product.skinTypeCompatibility}</p>
                                                <p><strong>Price : </strong> {product.price ? product.price.toLocaleString() + "$" : "N/A"}</p>
                                                <p><strong>Quantity : </strong> {product.quantity}</p>
                                            </div>
                                            <div className="cart-batch-detail">
                                                <Button onClick={() => showBatchModal(product.batches)} type="link">
                                                    View Batch Details
                                                </Button>
                                            </div>
                                        </div>


                                        <p className="price" style={{ fontSize: "20px", color: "red" }}>
                                            <strong>Total:</strong> ${(product.price * product.quantity).toFixed(0, 3)}
                                        </p>


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

                        {cartProducts.length > 0 && (
                            <div className="order-btn">
                                <button className="order-products" onClick={() => handleOrderProduct()}>Order Products

                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>




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
                    max={1000} // Giới hạn tối đa là số lượng sản phẩm trong kho
                    value={newQuantity}
                    onChange={(quantity) => {
                        setNewQuantity(quantity);
                    }}
                    style={{ width: "200px", height: "40px", fontSize: "15px" }}
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

            <Modal
                title="Batch Details"
                open={isBatchModalOpen}
                onCancel={() => setIsBatchModalOpen(false)}
                footer={null}
                width={600}
            >
                <Table columns={batchColumns} dataSource={selectedProductBatches} rowKey="batchNumber" />
            </Modal>
            <Footer />

        </div>
    );
};

export default CartPage;