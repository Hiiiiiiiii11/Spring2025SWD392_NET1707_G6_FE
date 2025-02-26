import { Card } from "antd";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  return (
    <Card
      onClick={() => navigate(`/product/${product.id}`)}
      hoverable
      cover={
        <img
          alt={product.name}
          src={product.image}
          style={{ height: "200px", objectFit: "cover" }}
        />
      }
    >
      <p style={{ fontWeight: "bold", fontSize: "16px" }}>{product.name}</p>
      <p>Thương hiệu: {product.brand}</p>
      <p style={{ color: "red", fontSize: "18px", fontWeight: "bold" }}>
        {product.price}đ
      </p>
      <p style={{ textDecoration: "line-through", color: "gray" }}>
        {product.originalPrice}đ
      </p>
      <p>Giảm: {product.discount}%</p>
      <p>
        ⭐ {product.rating} ({product.reviews} đánh giá) - Đã bán {product.sold}
      </p>
      <p style={{ fontSize: "14px", color: "#ff4500" }}>{product.gift}</p>
    </Card>
  );
};
export default ProductCard;
