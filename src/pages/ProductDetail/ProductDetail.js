import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductByIdAPI, getAllProductAPI } from "../../services/manageProductService";
import { InputNumber, Modal, Card, Row, Col, Button, Rate } from "antd";
import { AddProductToCartAPI, GetAllProductCartAPI } from "../../services/cartService";
import "./ProductDetail.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GetReviewProductByProductIdAPI } from "../../services/ManageReview";
import { GetCustomerProfileAPI } from "../../services/userService";

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

  // State cho reviews và average rating
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  // State để lưu mapping customerId -> customer name (cho review)
  const [customerProfiles, setCustomerProfiles] = useState({});

  // State cho profile của customer đang đăng nhập (dùng trong form gửi review)
  const [customerProfile, setCustomerProfile] = useState(null);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productData, allProducts] = await Promise.all([
          getProductByIdAPI(id),
          getAllProductAPI(),
        ]);

        setProduct(productData);

        // Chuyển id sang số để đảm bảo so sánh đúng
        const currentProductId = Number(id);

        // Lọc sản phẩm liên quan theo skinTypeCompatibility và loại bỏ sản phẩm hiện tại
        const filteredProducts = allProducts
          .filter((p) => p.productID !== currentProductId && p.skinTypeCompatibility === productData.skinTypeCompatibility)
          .slice(0, 4); // Giới hạn 4 sản phẩm liên quan

        setRelatedProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);



  // Fetch reviews cho sản phẩm và tính điểm trung bình
  useEffect(() => {
    const fetchReviews = async () => {
      if (product) {
        const data = await GetReviewProductByProductIdAPI(product.productID);
        if (data) {
          setReviews(data);
          const total = data.reduce((sum, review) => sum + review.rating, 0);
          setAverageRating(data.length ? total / data.length : 0);

          // Với mỗi review, lấy thông tin customer name nếu chưa có
          data.forEach(async (review) => {
            if (!customerProfiles[review.customerId]) {
              try {
                const profile = await GetCustomerProfileAPI(review.customerId);
                setCustomerProfiles((prev) => ({ ...prev, [review.customerId]: profile.fullName || profile.name || "Unknown" }));
              } catch (error) {
                console.error("Error fetching customer profile for review", review.reviewId, error);
              }
            }
          });
        }
      }
    };

    fetchReviews();
  }, [product, customerProfiles]);

  // Fetch profile của customer đang đăng nhập (sử dụng trong form gửi review)
  useEffect(() => {
    const fetchCustomerProfile = async () => {
      const customerId = sessionStorage.getItem("customerId");
      if (customerId) {
        try {
          const profile = await GetCustomerProfileAPI(customerId);
          setCustomerProfile(profile);
        } catch (error) {
          console.error("Error fetching logged in customer profile:", error);
        }
      }
    };

    fetchCustomerProfile();
  }, []);

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
      let cartItems = await GetAllProductCartAPI();
      cartItems = Array.isArray(cartItems) ? cartItems : [];

      // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng
      const existingItem = cartItems.find(
        (item) => item.product.productID === selectedProduct.productID
      );
      const currentCartQuantity = existingItem ? existingItem.quantity : 0;

      if (currentCartQuantity + quantity > selectedProduct.stockQuantity) {
        toast.error("You cannot add more of this product. Stock limit reached!");
        return;
      }

      const response = await AddProductToCartAPI({
        product: selectedProduct,
        quantity,
      });

      if (response) {
        toast.success(`Added "${selectedProduct.productName}" x${quantity} to cart!`);
      } else {
        toast.error("Failed to add product to cart!");
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

      {/* Product Detail Section */}
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
          <div className="average-rating" style={{ marginBottom: "8px" }}>
            <p style={{ marginRight: "8px", fontSize: "16px" }}>
              Rating: <Rate disabled allowHalf value={averageRating} />
            </p>
          </div>
          <p className="description">✅Available Product: {product.stockQuantity}</p>
          {role === "CUSTOMER" && (
            <button className="add-to-cart" onClick={() => openQuantityModal(product)}>
              Add to Cart
            </button>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="customer-review-section">
        <h2>Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews available for this product.</p>
        ) : (
          reviews.map((review) => (
            <Card key={review.reviewId} style={{ marginBottom: "10px" }}>
              <div >
                <div className="name-and-date" style={{ fontSize: "16px" }}>
                  <p>
                    {customerProfiles[review.customerId] || "Loading..."}{" "}
                    {review.orderDate ? `on ${new Date(review.orderDate).toLocaleDateString()}` : ""}
                  </p>
                </div>
                <div className="rate-and-comment">
                  <Rate disabled defaultValue={review.rating} style={{ marginRight: "8px" }} />
                  <div>
                    <p style={{ margin: 0 }}>{review.comment}</p>

                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Related Products Section */}
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
                    disabled={role !== "CUSTOMER"}
                  >
                    Add to Cart
                  </Button>,
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
                      <p className="available-product">
                        ✅Available Product: {product.stockQuantity}
                      </p>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Modal for selecting quantity */}
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
