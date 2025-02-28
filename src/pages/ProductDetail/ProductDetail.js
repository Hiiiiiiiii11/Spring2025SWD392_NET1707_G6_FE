import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import './ProductDetail.css';
import { getProductByIdAPI } from '../../services/manageProductService';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductByIdAPI(id); // Gọi API
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);


  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found!</div>;

  const handleBacktoProduct = () => {
    navigate('/products')
  }

  return (
    <div className="product-detail-container">
      <button className="back-to-products" onClick={() => handleBacktoProduct()}>Back to Product</button>
      <div className="product-detail">
        <div className="product-image">
          <img src={product.imageURL || "https://via.placeholder.com/300"} alt={product.productName} />
        </div>
        <div className="product-info">
          <h1>{product.productName}</h1>
          <p className="price">
            {product.price > 1000 ? `${product.price.toLocaleString()}đ` : `$${product.price.toFixed(2)}`}
          </p>
          <p className="description">{product.description}</p>
          <p className="description">Category: {product.category}</p>
          <p className="description">Skin Type: {product.skinTypeCompatibility}</p>
          <div className='btn-add-to-cart'>
            <button className="add-to-cart" onClick={() => alert(`✅ Add "${product.productName}" to Cart!`)}>
              Add to Cart
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
