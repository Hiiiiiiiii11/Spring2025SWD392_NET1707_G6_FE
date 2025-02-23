import React, { useState } from "react";
import heroImage from "../../assets/hero.jpg"; // Ảnh nền hero
import product1 from "../../assets/product1.jpg"; // Ảnh sản phẩm 1
import product2 from "../../assets/product2.jpg"; // Ảnh sản phẩm 2
import product3 from "../../assets/product3.jpg"; // Ảnh sản phẩm 3
import product4 from "../../assets/product4.jpg"; // Ảnh sản phẩm 4
import product5 from "../../assets/product5.jpg"; // Ảnh sản phẩm 5
import product6 from "../../assets/product6.jpg"; // Ảnh sản phẩm 6
import "./Home.css";
import BannerSlider from "../../components/BannerSlider/BannerSlider";
import CategoryList from "../../components/CategoryList/CategoryList";
import ProductCard from "../../components/ProductCard/ProductCard";
import { PlusOutlined } from "@ant-design/icons";
import Footer from "../../components/Footer/Footer";
const productList = [
  {
    id: 1,
    image: product1,
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
    image: product2,
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
    image: product3,
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
    image: product4,
    name: "Dầu Gội Dưỡng Tóc Mềm Mượt",
    brand: "TRESemmé",
    price: "150.000",
    originalPrice: "210.000",
    discount: 28,
    rating: 4.5,
    reviews: 180,
    sold: 2780,
    gift: "Tặng: Dầu Xả 50ml",
  },
  {
    id: 5,
    image: product5,
    name: "Nước Hoa Hồng Cân Bằng Da",
    brand: "Innisfree",
    price: "175.000",
    originalPrice: "230.000",
    discount: 24,
    rating: 4.9,
    reviews: 410,
    sold: 6290,
    gift: "Tặng: Bông Tẩy Trang",
  },
  {
    id: 6,
    image: product6,
    name: "Tẩy Trang Dịu Nhẹ Cho Da Nhạy Cảm",
    brand: "Bioderma",
    price: "135.000",
    originalPrice: "189.000",
    discount: 29,
    rating: 4.8,
    reviews: 327,
    sold: 4750,
    gift: "Tặng: Khăn Lau Mặt",
  },
];
const productRecomment = [
  {
    id: 1,
    image: product1,
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
    image: product2,
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
    image: product3,
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
    image: product4,
    name: "Dầu Gội Dưỡng Tóc Mềm Mượt",
    brand: "TRESemmé",
    price: "150.000",
    originalPrice: "210.000",
    discount: 28,
    rating: 4.5,
    reviews: 180,
    sold: 2780,
    gift: "Tặng: Dầu Xả 50ml",
  },
  {
    id: 5,
    image: product5,
    name: "Nước Hoa Hồng Cân Bằng Da",
    brand: "Innisfree",
    price: "175.000",
    originalPrice: "230.000",
    discount: 24,
    rating: 4.9,
    reviews: 410,
    sold: 6290,
    gift: "Tặng: Bông Tẩy Trang",
  },
  {
    id: 6,
    image: product6,
    name: "Tẩy Trang Dịu Nhẹ Cho Da Nhạy Cảm",
    brand: "Bioderma",
    price: "135.000",
    originalPrice: "189.000",
    discount: 29,
    rating: 4.8,
    reviews: 327,
    sold: 4750,
    gift: "Tặng: Khăn Lau Mặt",
  },
  {
    id: 7,
    image: product2,
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
    id: 8,
    image: product3,
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
    id: 9,
    image: product4,
    name: "Dầu Gội Dưỡng Tóc Mềm Mượt",
    brand: "TRESemmé",
    price: "150.000",
    originalPrice: "210.000",
    discount: 28,
    rating: 4.5,
    reviews: 180,
    sold: 2780,
    gift: "Tặng: Dầu Xả 50ml",
  },
  {
    id: 10,
    image: product5,
    name: "Nước Hoa Hồng Cân Bằng Da",
    brand: "Innisfree",
    price: "175.000",
    originalPrice: "230.000",
    discount: 24,
    rating: 4.9,
    reviews: 410,
    sold: 6290,
    gift: "Tặng: Bông Tẩy Trang",
  },
  {
    id: 11,
    image: product6,
    name: "Tẩy Trang Dịu Nhẹ Cho Da Nhạy Cảm",
    brand: "Bioderma",
    price: "135.000",
    originalPrice: "189.000",
    discount: 29,
    rating: 4.8,
    reviews: 327,
    sold: 4750,
    gift: "Tặng: Khăn Lau Mặt",
  },
  {
    id: 12,
    image: product1,
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
function Home() {
  const [role, setRole] = useState("Guest");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Your message has been sent!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="home-container">
      <BannerSlider />
      <CategoryList />
      <div className="product__topsale">
        <p className="product__title">Top sản phẩm bán chạy</p>
        <div className="product-grid">
          {productList?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <div className="product__topsale">
        <p className="product__title">Gợi ý dành cho bạn</p>
        <div className="product-grid">
          {productRecomment?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <div className="product__topsale">
        <p className="product__title">Danh sách sản phẩm</p>
        <div className="product-grid">
          {productRecomment?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <button className="btn_Loadmore">
          <PlusOutlined style={{ marginRight: "6px" }} />
          Xem thêm
        </button>
      </div>
    </div>
  );
}

export default Home;
