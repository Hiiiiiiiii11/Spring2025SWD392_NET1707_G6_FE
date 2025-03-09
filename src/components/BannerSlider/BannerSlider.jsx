import React from "react";
import { Carousel } from "antd";
import slider1 from "../../assets/banner1.jpg";
import slider2 from "../../assets/banner2.jpg";
import slider3 from "../../assets/banner3.jpg";
import slider4 from "../../assets/banner4.jpg";
import "./bannerSlider.css";

const bannerImages = [slider1, slider2, slider3, slider4];
const BannerSlider = () => {
  return (
    <Carousel autoplay infinite dots className="banner_container">
      {bannerImages.map((image, index) => (
        <div key={index} className="w-full h-[400px]">
          <img src={image} alt={`Banner ${index + 1}`} className="banner_img" />
        </div>
      ))}
    </Carousel>
  );
};

export default BannerSlider;
