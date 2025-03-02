import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import './ProductDetail.css';
import { getProductByIdAPI } from '../../services/manageProductService';
import { InputNumber, Modal } from 'antd';
import { AddProductToCartAPI } from '../../services/cartService';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductByIdAPI(id);
        console.log(data)// Gọi API
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

  const openQuantityModal = (product) => {
    setSelectedProduct(product);
    setQuantity(1); // Reset số lượng về 1
    setIsModalVisible(true);
  };

  const handleAddProductToCart = async () => {
    if (!selectedProduct) return;
    console.log(selectedProduct);

    try {
      const response = await AddProductToCartAPI({
        productId: selectedProduct.productID,
        quantity,
      });

      if (response) {
        alert(`✅ Added "${selectedProduct.productName}" x${quantity} to cart!`);
      } else {
        alert("❌ Failed to add product to cart!");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("❌ Error adding product to cart!");
    }

    setIsModalVisible(false);
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
            <button className="add-to-cart" onClick={() => openQuantityModal(product)}>
              Add to Cart
            </button>
          </div>
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
                  max={99}
                  value={quantity}
                  onChange={setQuantity}
                  style={{ width: "200px", height: "40px", fontSize: "15px", display: "flex", alignItems: "center" }}
                />
              </>
            )}
          </Modal>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
