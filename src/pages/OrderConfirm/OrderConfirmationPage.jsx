import { useNavigate, useLocation, Link } from 'react-router-dom';
import React, { useState } from 'react';
import { Form, Button, message, Card, Modal } from 'antd';
import dayjs from "dayjs";
import { createOrderAPI } from '../../services/customerOrder';
import "../OrderConfirm/OrderConfirmation.css";
import { ArrowLeftOutlined } from '@ant-design/icons';
import Footer from '../../components/Footer/Footer';

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedItems } = location.state || { selectedItems: [] };

  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const onFinish = async () => {
    if (!selectedItems.length) {
      message.error("❌ No products selected!");
      return;
    }

    const orderData = {
      orderDate: dayjs().format("YYYY-MM-DD"),
      status: "Pending",
      customerId: 1, // Cần thay bằng ID khách hàng thực tế
      promotionId: 0, // Nếu có mã khuyến mãi, cần cập nhật
      staffId: 1, // Nếu cần ghi nhận nhân viên
      orderDetails: selectedItems.map(item => ({
        productId: item.productID,
        quantity: item.quantity,
      })),
    };

    try {
      await createOrderAPI(orderData);
      message.success("✅ Order placed successfully!");
      navigate("/customer/history");
    } catch (error) {
      message.error(`❌ Failed to place order: ${error}`);
    }
  };

  return (
    <div>
      <div className='order-create-page'>

        <div className='header-content-order'>
          <button className="back-to-cart" onClick={() => navigate("/cart")}>
            <ArrowLeftOutlined /> &nbsp;Cart Page
          </button>
          <div className='h2-content-order'>
            <h2 className='order-confirm-h2'>Order Confirmation</h2>
          </div>
        </div>

        {/* Hiển thị các sản phẩm theo dạng danh sách (mỗi sản phẩm 1 dòng) */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {selectedItems.map((item) => (
            <Card
              key={item.productID}
              className="cart-card"
              hoverable
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <div className='card-order-content'>
                <div>
                  <Link to={`/view-cart-product-detail?productId=${item.productID}`}>
                    <img
                      src={item.imageURL || "https://via.placeholder.com/150"}
                      alt={item.name}
                      style={{ width: 160, height: 160, objectFit: 'cover' }}
                    />
                  </Link>
                </div>
                <div style={{ marginLeft: '16px', flex: 1 }}>
                  <Link to={`/view-cart-product-detail?productId=${item.productID}`}>
                    <h2 className='product-name-confirm'>{item.productName}</h2>
                  </Link>
                  <p className="price">
                    <strong>Price:</strong> {item.price ? item.price.toLocaleString() + "$" : "N/A"}
                  </p>
                  <p><strong>Quantity:</strong> {item.quantity}</p>
                  <div>
                    <Button onClick={() => { setSelectedProduct(item); setModalVisible(true); }}>
                      Detail
                    </Button>
                  </div>
                </div>
              </div>

            </Card>
          ))}
        </div>
        <div className='place-order-submit'>
          <Form form={form} onFinish={onFinish} style={{ marginTop: 20 }}>
            <button type="primary" htmlType="submit">
              Place Order
            </button>
          </Form>
        </div>

        <Modal
          title="Product Details"
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
          {selectedProduct && (
            <div>
              <img
                src={selectedProduct.imageURL || "https://via.placeholder.com/150"}
                alt={selectedProduct.name}
                style={{ width: '100%', height: "300px", objectFit: 'cover', marginTop: "10px" }}
              />
              <h2 className='product-name-confirm'>{selectedProduct.productName}</h2>
              <p><strong>Category:</strong> {selectedProduct.category}</p>
              {selectedProduct.skinTypeCompatibility && (
                <p><strong>For Skin Type:</strong> {selectedProduct.skinTypeCompatibility}</p>
              )}
              <p>
                <strong>Price:</strong> {selectedProduct.price ? selectedProduct.price.toLocaleString() + "$" : "N/A"}
              </p>
              <p><strong>Quantity:</strong> {selectedProduct.quantity}</p>
              <p><strong>Description:</strong> {selectedProduct.description}</p>
              <p>
                <strong>Total:</strong> {(selectedProduct.price * selectedProduct.quantity).toLocaleString()}$
              </p>
            </div>
          )}
        </Modal>

      </div>
      <Footer />
    </div>
  );
};

export default OrderConfirmationPage;
