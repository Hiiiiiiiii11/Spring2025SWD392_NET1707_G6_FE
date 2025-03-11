import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Form, Button, message, Card, Modal, Input } from "antd";
import dayjs from "dayjs";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "../OrderConfirm/OrderConfirmation.css";
import Footer from "../../components/Footer/Footer";
import { createOrderAPI } from "../../services/customerOrderService";
import { GetCustomerProfileAPI } from "../../services/userService";

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedItems } = location.state || { selectedItems: [] };

  const [form] = Form.useForm();
  const [shippingForm] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [shippingModalVisible, setShippingModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [shippingInfo, setShippingInfo] = useState({ name: "", address: "" });
  const customerId = sessionStorage.getItem("customerId");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await GetCustomerProfileAPI(customerId);
      // Giả sử API trả về các trường fullName và address
      setShippingInfo({
        name: data.fullName,
        address: data.address,
      });
    } catch (error) {
      alert("Failed to load profile!");
    }
  };

  const onFinish = async () => {
    if (!selectedItems.length) {
      alert("❌ No products selected!");
      return;
    }

    // Tính tổng tiền của đơn hàng
    const totalAmount = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Tạo dữ liệu đơn hàng theo đúng format API yêu cầu
    const orderData = {
      orderDate: dayjs().format("YYYY-MM-DD"),
      promotionId: "",
      address: shippingInfo.address,
      orderDetails: selectedItems.map((item) => ({
        productId: item.productID,
        quantity: item.quantity,
      })),
    };
    console.log(orderData);
    try {
      const orderResult = await createOrderAPI(orderData);
      console.log("Order Result:", orderResult);

      // Lưu selectedItems vào sessionStorage để xóa khỏi giỏ hàng sau khi thanh toán
      sessionStorage.setItem("selectedItems", JSON.stringify(selectedItems));

      // Điều hướng đến trang thanh toán VNPay (orderResult chứa URL)
      window.location.href = `${orderResult}`;

    } catch (error) {
      alert(`❌ Failed to place order: ${error}`);
    }
  };


  // Modal chỉnh sửa thông tin người nhận chỉ cập nhật địa chỉ, giữ nguyên tên
  const handleShippingModalOk = async () => {
    try {
      const values = await shippingForm.validateFields();
      setShippingInfo({
        ...shippingInfo, // giữ nguyên name
        address: values.shippingAddress,
      });
      setShippingModalVisible(false);
      alert("Shipping info updated successfully!");
    } catch (error) {
      alert("Please check the shipping information!");
    }
  };

  return (
    <div>
      <div className="order-create-page">
        <div className="header-content-order">
          <button
            className="back-to-cart"
            onClick={() => navigate("/cart")}
          >
            <ArrowLeftOutlined /> &nbsp;Cart Page
          </button>
          <div className="h2-content-order">
            <h2 className="order-confirm-h2">Order Confirmation</h2>
          </div>
        </div>

        {/* Card hiển thị thông tin người nhận */}
        <Card title="Delivery Information" style={{ marginBottom: "16px" }}>
          <div className="body-delivery-info">
            <div className="delivery-info">
              <p>
                <strong>Name: </strong>&nbsp;{shippingInfo.name}
              </p>
              <p>
                <strong>Address: </strong>&nbsp;{shippingInfo.address}
              </p>
            </div>
            <div className="edit-delivery-address">
              <Button
                type="link"
                onClick={() => {
                  shippingForm.setFieldsValue({
                    shippingAddress: shippingInfo.address,
                  });
                  setShippingModalVisible(true);
                }}
              >
                Change Address
              </Button>
            </div>
          </div>
        </Card>

        {/* Hiển thị danh sách sản phẩm đã chọn */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {selectedItems.map((item) => (
            <Card
              key={item.productID}
              className="cart-card"
              hoverable
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div className="card-order-content">
                <div>
                  <Link to={`/view-cart-product-detail?productId=${item.productID}`}>
                    <img
                      src={item.imageURL || "https://via.placeholder.com/150"}
                      alt={item.productName}
                      style={{
                        width: 160,
                        height: 160,
                        objectFit: "cover",
                      }}
                    />
                  </Link>
                </div>
                <div style={{ marginLeft: "16px", flex: 1 }}>
                  <Link to={`/view-cart-product-detail?productId=${item.productID}`}>
                    <h2 className="product-name-confirm">{item.productName}</h2>
                  </Link>
                  <p className="price">
                    <strong>Price:</strong>{" "}
                    {item.price ? item.price.toLocaleString() + "$" : "N/A"}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {item.quantity}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="place-order-submit">
          <Form form={form} onFinish={onFinish} style={{ marginTop: 20 }}>
            <button type="submit" className="place-order-button">
              Place Order
            </button>
          </Form>
        </div>
      </div>
      <Footer />

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
              style={{
                width: "100%",
                height: "300px",
                objectFit: "cover",
                marginTop: "10px",
              }}
            />
            <h2 className="product-name-confirm">{selectedProduct.productName}</h2>
            <p>
              <strong>Category:</strong> {selectedProduct.category}
            </p>
            {selectedProduct.skinTypeCompatibility && (
              <p>
                <strong>For Skin Type:</strong>{" "}
                {selectedProduct.skinTypeCompatibility}
              </p>
            )}
            <p>
              <strong>Price:</strong>{" "}
              {selectedProduct.price
                ? selectedProduct.price.toLocaleString() + "$"
                : "N/A"}
            </p>
            <p>
              <strong>Quantity:</strong> {selectedProduct.quantity}
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {selectedProduct.description}
            </p>
            <p>
              <strong>Total:</strong>{" "}
              {(selectedProduct.price * selectedProduct.quantity).toLocaleString()}$
            </p>
          </div>
        )}
      </Modal>

      {/* Modal chỉnh sửa thông tin người nhận - chỉ edit address */}
      <Modal
        title="Edit Delivery Information"
        visible={shippingModalVisible}
        onOk={handleShippingModalOk}
        onCancel={() => setShippingModalVisible(false)}
        okText="Save"
      >
        <Form form={shippingForm} layout="vertical">
          <Form.Item
            name="shippingAddress"
            label="Address"
            rules={[{ required: true, message: "Address is required!" }]}
          >
            <Input.TextArea
              placeholder="Enter your delivery address"
              rows={4}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OrderConfirmationPage;
