import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import productImage from "../../assets/product1.jpg";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./ProductDetail.css";

// Ảnh tài xế và dịch vụ
const driverData = [
  {
    id: 1,
    image: require("../../assets/images/driver/driver1.webp"),
    text: (
      <>
        Giao Nhanh Miễn Phí 2H. <br />
        <strong>Trễ tặng 100K</strong>
      </>
    ),
  },
  {
    id: 2,
    image: require("../../assets/images/driver/driver2.webp"),
    text: <>Đền bù 100% + hãng đền bù 100% nếu phát hiện hàng giả</>,
  },
  {
    id: 3,
    image: require("../../assets/images/driver/driver3.webp"),
    text: (
      <>
        Giao Hàng Miễn Phí (từ 90K tại 60 Tỉnh Thành trừ huyện, toàn Quốc từ
        249K)
      </>
    ),
  },
  {
    id: 4,
    image: require("../../assets/images/driver/driver4.png"),
    text: <>Đổi trả trong 30 ngày.</>,
  },
];

// Dữ liệu sản phẩm liên quan
const productSame = [
  {
    id: 1,
    image: require("../../assets/product1.jpg"),
    name: "Sữa Rửa Mặt Trắng Da",
    brand: "L'Oreal",
    price: "120.000",
    originalPrice: "180.000",
    discount: 33,
    rating: 4.6,
    reviews: 198,
    sold: 3560,
    gift: "Tặng: Kem Dưỡng Ẩm",
  },
  {
    id: 2,
    image: require("../../assets/product2.jpg"),
    name: "Son Môi Đỏ Quyến Rũ",
    brand: "Maybelline",
    price: "99.000",
    originalPrice: "149.000",
    discount: 34,
    rating: 4.8,
    reviews: 276,
    sold: 4220,
    gift: "Tặng: Son Dưỡng Mini",
  },
  {
    id: 3,
    image: require("../../assets/product3.jpg"),
    name: "Kem Chống Nắng SPF 50+",
    brand: "La Roche-Posay",
    price: "195.000",
    originalPrice: "250.000",
    discount: 22,
    rating: 4.7,
    reviews: 315,
    sold: 5890,
    gift: "Tặng: Mặt Nạ Dưỡng Da",
  },
  {
    id: 4,
    image: require("../../assets/product1.jpg"),
    name: "Sữa Rửa Mặt Trắng Da",
    brand: "L'Oreal",
    price: "120.000",
    originalPrice: "180.000",
    discount: 33,
    rating: 4.6,
    reviews: 198,
    sold: 3560,
    gift: "Tặng: Kem Dưỡng Ẩm",
  },
];

const ProductDetail = () => {
  const [countdown, setCountdown] = useState(600);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const { id } = useParams();
  // Load giỏ hàng từ localStorage khi component mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // Định dạng thời gian đếm ngược
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = () => {
    const productData = {
      id: id,
      name: "Kem Dưỡng Olay Luminous Sáng Da Mờ Thâm Nám Ban Đêm 50g",
      price: 188000,
      image: productImage,
      quantity: quantity,
    };
    const existingProductIndex = cart.findIndex((item) => item.id === id);
    if (existingProductIndex !== -1) {
      // Nếu sản phẩm đã tồn tại, tăng số lượng
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity += quantity;
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      setCart([...cart, productData]);
      localStorage.setItem("cart", JSON.stringify([...cart, productData]));
    }
    alert(`✅ Đã thêm "${productData.name}" vào giỏ hàng!`);
  };
  return (
    <div className="layout">
      <Header />
      <div className="wrapper">
        <div className="detailproduct_container">
          <div className="flash-sale-container">
            <div className="image-section">
              <img
                src={productImage}
                alt="Sản phẩm"
                className="productdetail_img"
              />
            </div>
            <div className="info-section">
              <h2 className="product-title">
                Kem Dưỡng Olay Luminous Sáng Da Mờ Thâm Nám Ban Đêm 50g
              </h2>
              <p className="product-subtitle">Dưỡng sáng, mờ thâm nám - 50g</p>
              <div className="rating">
                ⭐⭐⭐⭐⭐ <span>(362 đánh giá)</span>
              </div>

              <div className="flash-deal">
                <span className="flash-text">🔥 FLASH DEAL</span>
                <span className="countdown">
                  Kết thúc trong: ⏳ {formatTime(countdown)}
                </span>
              </div>

              <div className="price-section">
                <span className="price-sale">188.000 đ</span>
                <span className="price-original">270.000 đ</span>
                <span className="discount">-30%</span>
              </div>

              <div className="quantity">
                <span>Số lượng:</span>
                <button onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}>
                  -
                </button>
                <span className="quantity-num">{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)}>+</button>
              </div>

              <div className="buttons">
                <button className="buy-now">🛒 Mua ngay</button>
                <button className="add-cart" onClick={() => addToCart()}>
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          </div>
          <div className="driver_container">
            {driverData.map((driver) => (
              <div key={driver.id} className="driver__section">
                <img
                  src={driver.image}
                  alt=""
                  className="driver__section-image"
                />
                <p className="driver_des">{driver.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="product__topsale">
          <p className="product__title">Sản phẩm liên quan</p>
          <Row gutter={[16, 16]}>
            {productSame.map((product) => (
              <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default ProductDetail;
