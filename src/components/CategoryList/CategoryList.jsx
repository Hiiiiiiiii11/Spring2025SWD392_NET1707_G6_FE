import React from "react";
import { Carousel } from "antd";
import "./CategoryList.css"; // Import file CSS

import category1 from "../../assets/images/categories/category1.jpg";
import category2 from "../../assets/images/categories/category2.jpg";
import category3 from "../../assets/images/categories/category3.jpg";
import category4 from "../../assets/images/categories/category4.jpg";
import category5 from "../../assets/images/categories/category5.jpg";
import category6 from "../../assets/images/categories/category6.jpg";
import category7 from "../../assets/images/categories/category7.jpg";

const categoriesData = [
  { title: "Sữa rửa mặt", img: category1 },
  { title: "Trang điểm mặt", img: category2 },
  { title: "Tẩy trang mặt", img: category3 },
  { title: "Dưỡng ẩm da", img: category4 },
  { title: "Chăm sóc răng miệng", img: category5 },
  { title: "Sữa rửa mặt", img: category6 },
  { title: "Sữa rửa mặt", img: category7 },
];

const CategoryList = () => {
  return (
    <div className="category-slider">
      <p className="category_title">Danh mục sản phẩm</p>
      <Carousel autoplay infinite dots slidesToShow={6} slidesToScroll={6}>
        {categoriesData.map((category, index) => (
          <div key={index} className="category-item">
            <img
              src={category.img}
              alt={category.title}
              className="category-img"
            />
            <p className="category-title">{category.title}</p>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default CategoryList;
