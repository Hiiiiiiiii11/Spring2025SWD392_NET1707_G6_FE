import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductByIdAPI, getAllProductAPI } from "../../services/manageProductService";
import { InputNumber, Modal, Card, Row, Col, Button } from "antd";
import { AddProductToCartAPI, GetAllProductCartAPI } from "../../services/cartService";
import "./ProductDetail.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const { Meta } = Card;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const role = sessionStorage.getItem("role");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productData, allProducts] = await Promise.all([
          getProductByIdAPI(id),
          getAllProductAPI(),
        ]);

        setProduct(productData);

        // Lọc sản phẩm liên quan (không bao gồm sản phẩm hiện tại)
        const filteredProducts = allProducts.filter((p) => p.productID !== id);
        setRelatedProducts(filteredProducts.slice(0, 4)); // Giới hạn 4 sản phẩm liên quan
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found!</div>;

  const handleBacktoProduct = () => {
    navigate("/products");
  };

  const openQuantityModal = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setIsModalVisible(true);
  };

  const handleAddProductToCart = async () => {
    if (!selectedProduct) return;
    if (quantity > selectedProduct.stockQuantity) {
      toast.warning("You cannot add more than the available stock!");
      return;
    }

    try {
      // Lấy danh sách sản phẩm trong giỏ hàng
      let cartItems = await GetAllProductCartAPI();

      // Kiểm tra nếu cartItems không phải là mảng, đặt giá trị mặc định []
      cartItems = Array.isArray(cartItems) ? cartItems : [];

      // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
      const existingItem = cartItems.find(item => item.product.productID === selectedProduct.productID);
      const currentCartQuantity = existingItem ? existingItem.quantity : 0;

      // Kiểm tra tổng số lượng đã có trong giỏ hàng
      if (currentCartQuantity + quantity > selectedProduct.stockQuantity) {
        toast.error(" You cannot add more of this product. Stock limit reached!");
        return;
      }

      // Gọi API thêm sản phẩm vào giỏ hàng
      const response = await AddProductToCartAPI({
        product: selectedProduct,
        quantity,
      });

      if (response) {
        toast.success(` Added "${selectedProduct.productName}" x${quantity} to cart!`);
      } else {
        toast.error(" Failed to add product to cart!");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("❌ Error adding product to cart! Session Time Out!!!");
    }

    setIsModalVisible(false);
  };



  return (
    <div className="product-detail-container">
      <ToastContainer />
      <button className="back-to-products" onClick={handleBacktoProduct}>
        Back to Products
      </button>

      {/* Chi tiết sản phẩm */}
      <div className="product-detail">
        <div className="product-image">
          <img
            src={product.imageURL || "https://via.placeholder.com/300"}
            alt={product.productName}
          />
        </div>
        <div className="product-info">
          <h1>{product.productName}</h1>
          <p className="price">
            {product.price > 1000
              ? `${product.price.toLocaleString()}đ`
              : `$${product.price.toFixed(2)}`}
          </p>
          <p className="description">{product.description}</p>
          <p className="description">Category: {product.category}</p>
          <p className="description">Skin Type: {product.skinTypeCompatibility}</p>
          <p className="description">✅Available Product: {product.stockQuantity}</p>
          {role === "CUSTOMER" && (
            <button className="add-to-cart" onClick={() => openQuantityModal(product)}>
              Add to Cart
            </button>
          )}
        </div>
      </div>

      {/* Sản phẩm liên quan (hiển thị trong Card giống ProductPage) */}
      <div className="related-products">
        <h2>Related Products</h2>
        <Row gutter={[16, 16]}>
          {relatedProducts.map((item) => (
            <Col key={item.productID} xs={24} sm={12} md={6} lg={6} xl={6}>
              <Card
                hoverable
                cover={
                  <img
                    alt={item.productName}
                    src={item.imageURL || "https://via.placeholder.com/200"}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                }
                actions={[
                  <Button
                    type="primary"
                    onClick={() => openQuantityModal(product)}
                    disabled={role !== "CUSTOMER"} // Chỉ CUSTOMER mới có thể nhấn
                  >
                    Add to Cart
                  </Button>
                  ,
                  <Link to={`/products/${item.productID}`}>View Details</Link>,
                ]}
              >
                <Meta
                  title={item.productName}
                  description={
                    <>
                      <p className="price">
                        {item.price > 1000
                          ? item.price.toLocaleString() + "đ"
                          : "$" + item.price.toFixed(2)}
                      </p>
                      {item.category && <p className="brand">Category: {item.category}</p>}
                      <p className="available-product">✅Available Product: {product.stockQuantity}</p>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Modal chọn số lượng sản phẩm */}
      <Modal
        title="Select Quantity"
        open={isModalVisible}
        onOk={handleAddProductToCart}
        onCancel={() => setIsModalVisible(false)}
        okText="Add to Cart"
      >
        {selectedProduct && (
          <>
            <p>
              Adding: <strong>{selectedProduct.productName}</strong>
            </p>
            <InputNumber
              min={1}
              max={1000}
              value={quantity}
              onChange={setQuantity}
              style={{ width: "200px", height: "40px", fontSize: "15px" }}
            />
          </>
        )}
      </Modal>
    </div>
  );
};

export default ProductDetail;
