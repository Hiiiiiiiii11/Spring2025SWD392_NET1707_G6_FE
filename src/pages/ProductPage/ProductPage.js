import React, { useState, useEffect } from "react";
import { Card, Row, Col, Input, Button, Modal, InputNumber, Checkbox, Rate } from "antd";
import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./ProductPage.css";
import { getAllProductAPI } from "../../services/manageProductService";
import { AddProductToCartAPI, GetAllProductCartAPI } from "../../services/cartService";
import { GetReviewProductByProductIdAPI } from "../../services/ManageReview";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SkinQuiz from "../ManageQuiz/SkinQuiz"; // adjust path as needed

const { Meta } = Card;

const ProductPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // recommendedSkinConcerns chứa các key từ quiz (ví dụ: ['oily', 'combination'])
  const [recommendedSkinConcerns, setRecommendedSkinConcerns] = useState([]);
  const [productData, setProductData] = useState([]);
  // State chứa danh sách sản phẩm đã lọc
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isQuantityModalVisible, setIsQuantityModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const role = sessionStorage.getItem("role");

  // State cho chế độ so sánh
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [isCompareModalVisible, setIsCompareModalVisible] = useState(false);
  const [compareRatings, setCompareRatings] = useState({});

  // State cho modal quiz
  const [isQuizModalVisible, setIsQuizModalVisible] = useState(false);
  // State theo dõi filter đã được áp dụng (dựa trên quiz) hay chưa
  const [filterActive, setFilterActive] = useState(false);

  // Load tất cả sản phẩm từ API
  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getAllProductAPI();
      if (data) {
        setProductData(data);
        // Ban đầu, nếu chưa có filter và search rỗng, hiển thị toàn bộ sản phẩm
        setFilteredProducts(data);
      }
    };
    fetchProducts();
  }, []);

  // useEffect tự động lọc theo searchTerm nếu nó không rỗng.
  // Nếu searchTerm có giá trị, ta bỏ qua filter dựa trên quiz.
  useEffect(() => {
    if (searchTerm.trim() !== "") {
      const filtered = productData.filter((product) =>
        product?.productName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
      setFilterActive(false);
    } else if (!filterActive) {
      // Nếu ô tìm kiếm trống và chưa áp dụng filter thì hiển thị toàn bộ sản phẩm
      setFilteredProducts(productData);
    }
  }, [searchTerm, productData, filterActive]);

  // Hàm áp dụng filter dựa trên recommendedSkinConcerns (chỉ khi ô search trống)
  const applyFilter = () => {
    if (searchTerm.trim() !== "") return; // Nếu có tìm kiếm, không áp dụng filter từ quiz

    if (recommendedSkinConcerns.length > 0) {
      const filtered = productData.filter((product) => {
        const productSkinTypes = product.skinTypeCompatibility
          ? product.skinTypeCompatibility.split(",").map((s) => s.trim().toLowerCase())
          : [];
        console.log("Product skin types:", productSkinTypes);
        return recommendedSkinConcerns.some(
          (concern) => productSkinTypes.includes(concern.toLowerCase())
        );
      });
      if (filtered.length === 0) {
        setFilteredProducts(
          productData.filter(
            (product) => product.skinTypeCompatibility.toLowerCase() === "all skin types"
          )
        );
      } else {
        setFilteredProducts(filtered);
      }
      setFilterActive(true);
    }
  };

  // Hàm hủy filter, reset lại danh sách sản phẩm ban đầu
  const resetFilter = () => {
    setFilteredProducts(productData);
    setFilterActive(false);
  };

  // Các hàm xử lý modal, add to cart, compare... giữ nguyên
  const openQuantityModal = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setIsQuantityModalVisible(true);
  };

  const handleAddToCart = async () => {
    if (!selectedProduct) return;
    if (quantity > selectedProduct.stockQuantity) {
      toast.warning("You cannot add more than the available stock!");
      return;
    }
    try {
      let cartItems = await GetAllProductCartAPI();
      cartItems = Array.isArray(cartItems) ? cartItems : [];
      const existingItem = cartItems.find(
        (item) => item.product.productID === selectedProduct.productID
      );
      const currentCartQuantity = existingItem ? existingItem.quantity : 0;
      if (currentCartQuantity + quantity > selectedProduct.stockQuantity) {
        toast.error("You cannot add more of this product. Stock limit reached!");
        return;
      }
      const response = await AddProductToCartAPI({ product: selectedProduct, quantity });
      if (response) {
        toast.success(`Added "${selectedProduct.productName}" x${quantity} to cart!`);
      } else {
        toast.error("Failed to add product to cart!");
      }
    } catch (error) {
      toast.error("Error adding product to cart! Session Time Out!!!");
    }
    setIsQuantityModalVisible(false);
  };

  // Compare mode handlers
  const toggleCompareMode = () => {
    setIsCompareMode((prev) => {
      if (prev) setSelectedForCompare([]); // Clear selections khi thoát compare mode
      return !prev;
    });
  };

  const handleSelectForCompare = (product, checked) => {
    if (checked) {
      setSelectedForCompare((prev) => [...prev, product]);
    } else {
      setSelectedForCompare((prev) =>
        prev.filter((item) => item.productID !== product.productID)
      );
    }
  };

  const startCompare = async () => {
    if (selectedForCompare.length < 2) {
      toast.warning("Please select at least 2 products to compare.");
      return;
    }
    const ratings = {};
    await Promise.all(
      selectedForCompare.map(async (product) => {
        const reviews = await GetReviewProductByProductIdAPI(product.productID);
        if (reviews && reviews.length > 0) {
          const total = reviews.reduce((sum, review) => sum + review.rating, 0);
          ratings[product.productID] = total / reviews.length;
        } else {
          ratings[product.productID] = 0;
        }
      })
    );
    setCompareRatings(ratings);
    setIsCompareModalVisible(true);
  };

  const renderCompareModalContent = () => {
    return (
      <Row gutter={16}>
        {selectedForCompare.map((product) => (
          <Col key={product.productID} span={12}>
            <Card
              title={product.productName}
              cover={
                <img
                  alt={product.productName}
                  src={product.imageURL || "https://via.placeholder.com/200x200?text=No+Image"}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              }
            >
              <p>
                <strong>Price:</strong>{" "}
                {product.price > 1000
                  ? product.price.toLocaleString() + "đ"
                  : "$" + product.price.toFixed(2)}
              </p>
              <p>
                <strong>Category:</strong> {product.category}
              </p>
              <p>
                <strong>Skin Type:</strong> {product.skinTypeCompatibility}
              </p>
              <p>
                <strong>Stock:</strong> {product.stockQuantity}
              </p>
              <p>
                <strong>Description:</strong> {product.description}
              </p>
              <p>
                <strong>Rating:</strong>{" "}
                <Rate disabled allowHalf value={compareRatings[product.productID] || 0} />
              </p>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  // Quiz modal handlers
  const openQuizModal = () => {
    setIsQuizModalVisible(true);
  };

  // Giả sử dữ liệu trả về từ SkinQuiz là object có thuộc tính quizResult là mảng (ví dụ: ['oily', 'combination'])
  const handleQuizComplete = (quizData) => {
    console.log("Received quiz data:", quizData.quizResult);
    if (quizData.quizResult) {
      setRecommendedSkinConcerns(quizData.quizResult);
    }
    setIsQuizModalVisible(false);
  };

  return (
    <div>
      <ToastContainer />
      <Header />
      <div className="product-page">
        <h1>Skincare Products</h1>
        {/* Nút hiển thị:
            - Nếu filterActive true thì hiển thị "Exit Filter" và gọi resetFilter.
            - Nếu không, mà ô search trống và có recommendedSkinConcerns thì hiển thị "Filter" và gọi applyFilter.
            - Ngược lại, hiển thị "Take Quiz". */}
        <div className="take-quiz">
          {role === "CUSTOMER" && (
            <Button
              type="dashed"
              onClick={
                filterActive
                  ? resetFilter
                  : recommendedSkinConcerns.length > 0 && searchTerm.trim() === ""
                    ? applyFilter
                    : openQuizModal
              }
            >
              {filterActive
                ? "Exit Filter"
                : recommendedSkinConcerns.length > 0 && searchTerm.trim() === ""
                  ? "Filter Product"
                  : "Take Quiz"}
            </Button>
          )}
        </div>
        {/* Ô search luôn hiển thị: nếu người dùng nhập giá trị thì tự động lọc theo tên sản phẩm */}
        <div className="search-product-page" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="compare-product-btn">
            {role === "CUSTOMER" && (
              <Button type="primary" onClick={toggleCompareMode}>
                {isCompareMode ? "Exit Compare Mode" : "Compare Product"}
              </Button>
            )}
          </div>
          <div className="searcch-and-filter">

            <div className="search-input-product">
              <Input
                placeholder="Search products..."
                className="search-bar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: "10px", maxWidth: "600px" }}
              />
            </div>
          </div>
        </div>
        {isCompareMode && (
          <div className="start-compare-product" style={{ marginBottom: "20px" }}>
            <div className="product-select-compare">
              <span>{selectedForCompare.length} product(s) selected for comparison.</span>
            </div>
            <div>
              {selectedForCompare.length >= 2 && (
                <Button type="primary" onClick={startCompare} style={{ marginRight: "10px" }}>
                  Start Compare
                </Button>
              )}
            </div>
          </div>
        )}
        <Row gutter={[16, 16]} style={{ width: "100%" }}>
          {filteredProducts.map((product) => (
            <Col key={product.productID} xs={24} sm={12} md={6} lg={6} xl={6}>
              <Card
                hoverable
                cover={
                  <div style={{ position: "relative" }}>
                    <img
                      alt={product.productName}
                      src={product.imageURL || "https://via.placeholder.com/200x200?text=No+Image"}
                      style={{ height: "200px", objectFit: "cover", width: "100%" }}
                    />
                    {isCompareMode && (
                      <div
                        style={{
                          position: "absolute",
                          top: 8,
                          left: 8,
                          background: "rgba(255,255,255,0.8)",
                          padding: "2px 4px",
                          borderRadius: "4px",
                        }}
                      >
                        <Checkbox
                          checked={selectedForCompare.some(
                            (item) => item.productID === product.productID
                          )}
                          onChange={(e) => handleSelectForCompare(product, e.target.checked)}
                        />
                      </div>
                    )}
                  </div>
                }
                actions={[
                  <Button
                    type="primary"
                    onClick={() => openQuantityModal(product)}
                    disabled={role !== "CUSTOMER" || product.stockQuantity === 0}
                  >
                    {product.stockQuantity === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>,
                  <Link to={`/products/${product.productID}`}>View Details</Link>,
                ]}
              >
                <Meta
                  title={product.productName}
                  description={
                    <>
                      <p className="price">
                        {product.price > 1000
                          ? product.price.toLocaleString() + "đ"
                          : "$" + product.price.toFixed(2)}
                      </p>
                      {product.category && <p className="brand">Category: {product.category}</p>}
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
      <Footer />

      {/* Quantity Modal */}
      <Modal
        title="Select Quantity"
        open={isQuantityModalVisible}
        onOk={handleAddToCart}
        onCancel={() => setIsQuantityModalVisible(false)}
        okText="Add to Cart"
      >
        {selectedProduct && (
          <>
            <p>
              Adding: <strong>{selectedProduct.productName}</strong>
            </p>
            <InputNumber
              min={1}
              max={selectedProduct.stockQuantity}
              value={quantity}
              onChange={setQuantity}
              style={{ width: "200px", height: "40px", fontSize: "15px" }}
            />
          </>
        )}
      </Modal>

      {/* Compare Modal */}
      <Modal
        title="Compare Products"
        open={isCompareModalVisible}
        onCancel={() => setIsCompareModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsCompareModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {renderCompareModalContent()}
      </Modal>

      {/* Quiz Modal */}
      <Modal
        title="Skin Type Quiz"
        open={isQuizModalVisible}
        onCancel={() => setIsQuizModalVisible(false)}
        footer={null}
        width={800}
      >
        <SkinQuiz onComplete={handleQuizComplete} />
      </Modal>
    </div>
  );
};

export default ProductPage;
