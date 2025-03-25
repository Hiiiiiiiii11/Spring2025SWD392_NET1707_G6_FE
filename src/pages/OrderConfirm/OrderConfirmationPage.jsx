import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Form, Button, message, Card, Modal, Input, Select } from "antd";
import dayjs from "dayjs";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "../OrderConfirm/OrderConfirmation.css";
import Footer from "../../components/Footer/Footer";
import { createOrderAPI } from "../../services/customerOrderService";
import { GetCustomerProfileAPI } from "../../services/userService";
import { getAllPromotionAPI } from "../../services/managePromotionService";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RemoveProductFromCartAPI } from "../../services/cartService";

const { Option } = Select;

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedItems } = location.state || { selectedItems: [] };

  const [form] = Form.useForm();
  const [shippingForm] = Form.useForm();
  const [shippingInfo, setShippingInfo] = useState({ name: "", address: "" });
  const [shippingModalVisible, setShippingModalVisible] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const customerId = sessionStorage.getItem("customerId");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [discountedTotal, setDiscountedTotal] = useState(0);

  useEffect(() => {
    fetchProfile();
    fetchPromotions();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await GetCustomerProfileAPI(customerId);
      setShippingInfo({
        name: data.fullName,
        address: data.address,
      });
    } catch (error) {
      toast.error("Failed to load profile!");
    }
  };

  const fetchPromotions = async () => {
    try {
      const data = await getAllPromotionAPI();
      const sortedPromotions = data.sort((a, b) => Number(a.minimumAmount) - Number(b.minimumAmount));
      setPromotions(sortedPromotions);
    } catch (error) {
      console.error("Failed to fetch promotions", error);
    }
  };
  const handleShippingModalOk = async () => {
    try {
      const values = await shippingForm.validateFields();
      setShippingInfo({
        ...shippingInfo, // giữ nguyên name
        address: values.shippingAddress,
      });
      setShippingModalVisible(false);
      toast.success("Shipping info updated successfully!");
    } catch (error) {
      toast.warning("Please check the shipping information!");
    }
  };
  const totalAmount = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const handleApplyPromotion = (promotionId) => {
    const promo = promotions.find((p) => p.promotionId === promotionId);
    console.log("Selected Promotion:", promo); // Kiểm tra giá trị minimumAmount
    console.log("Total Amount:", totalAmount);

    if (promo) {
      if (totalAmount < Number(promo.minimumAmount)) { // Đổi từ minimumOrderAmount -> minimumAmount
        toast.warning(`This promotion requires a minimum order amount of $${promo.minimumAmount}`);
        return;
      }

      const discount = (totalAmount * promo.discountPercentage) / 100;
      setDiscountedTotal(totalAmount - discount);
      setSelectedPromotion(promo);
      toast.success(`Applied Promotion: ${promo.promotionName}`);
    }
  };
  const onFinish = async () => {
    if (!selectedItems.length) {
      toast.warning("No products selected!");
      return;
    }

    setIsPlacingOrder(true);

    // Sort the selected items in ascending order by productID
    const sortedItems = [...selectedItems].sort((a, b) => a.productID - b.productID);

    // Sequentially remove each selected item from the cart.
    try {
      for (const item of sortedItems) {
        await RemoveProductFromCartAPI(item.productID);
      }
    } catch (error) {
      toast.error("Failed to remove some products from cart. Please try again.");
      setIsPlacingOrder(false);
      return;
    }

    // Clear the selected items from sessionStorage after successful removal.
    sessionStorage.removeItem("selectedItems");

    // Now, create the order.
    const orderData = {
      orderDate: dayjs().format("YYYY-MM-DD"),
      promotionId: selectedPromotion ? selectedPromotion.promotionId : "",
      address: shippingInfo.address,
      orderDetails: sortedItems.map((item) => ({
        productId: item.productID,
        quantity: item.quantity,
      })),
    };

    try {
      const orderResult = await createOrderAPI(orderData);
      console.log(orderResult)
      // Navigate to the order detail page after a short delay.
      if (!orderResult || orderResult === "") {
        toast.warning("Process failed. Please try again later.");
        setIsPlacingOrder(false);
        return;
      }
      if (orderResult) {
        setTimeout(() => {
          window.location.href = `${orderResult}`;
        }, 2000);
      }
    } catch (error) {
      toast.error(`Failed to place order: ${error}`);
      setIsPlacingOrder(false);
    }
  };













  return (
    <div>
      <div className="order-create-page">
        <ToastContainer />
        <div className="header-content-order">
          <button className="back-to-cart" onClick={() => navigate("/cart")}>
            <ArrowLeftOutlined /> &nbsp;Cart Page
          </button>
          <div className="h2-content-order">
            <h2 className="order-confirm-h2">Order Confirmation</h2>
          </div>
        </div>

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
                      style={{ width: 160, height: 160, objectFit: "cover" }}
                    />
                  </Link>
                </div>
                <div className="order-bettween-date">
                  <div style={{ marginLeft: "16px", flex: 1 }}>
                    <Link to={`/view-cart-product-detail?productId=${item.productID}`}>
                      <h2 className="product-name-confirm">{item.productName}</h2>
                    </Link>
                    <p className="price">
                      <strong>Price:</strong> {item.price ? item.price.toLocaleString() + "$" : "N/A"}
                    </p>
                    <p>
                      <strong>Quantity:</strong> {item.quantity}
                    </p>

                  </div>
                </div>
              </div>
            </Card>

          ))}
          <Card title="Select Promotions" style={{ marginBottom: "16px" }}>
            {promotions.length > 0 && (
              <div>
                {showAll
                  ? promotions.map((promo) => (
                    <Card key={promo.promotionId} style={{ marginBottom: "8px" }}>
                      <div className="promotion-select">
                        <div className="promotion-info">
                          <div >
                            <p><strong>{promo.promotionName}</strong></p>
                            <p>{promo.description}</p>
                          </div>
                          <div className="valid-date-pro">
                            <p>Valid: {new Date(promo.startDate).toLocaleDateString()} - {new Date(promo.endDate).toLocaleDateString()}</p>
                            <div className="apply-promotion" >
                              <Button
                                type="primary"
                                onClick={() => handleApplyPromotion(promo.promotionId)}
                                disabled={totalAmount < Number(promo.minimumAmount)}
                              >
                                Apply
                              </Button>
                            </div>

                          </div >
                          {/* <div className="apply-promotion"> */}
                        </div>


                      </div>
                    </Card>
                  ))
                  : (
                    <Card key={promotions[0].promotionId} style={{ marginBottom: "8px" }}>
                      <div className="promotion-select">
                        <div className="promotion-info">
                          <div>
                            <p><strong>{promotions[0].promotionName}</strong></p>
                            <p>{promotions[0].description}</p>
                          </div>
                          <div className="valid-date-pro">
                            <p>Valid: {new Date(promotions[0].startDate).toLocaleDateString()} - {new Date(promotions[0].endDate).toLocaleDateString()}</p>

                          </div>
                        </div>
                        <div className="apply-promotion">
                          <Button
                            type="primary"
                            onClick={() => handleApplyPromotion(promotions[0].promotionId)}
                            disabled={totalAmount < Number(promotions[0].minimumAmount)}
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )
                }
                {promotions.length > 1 && (
                  <Button type="link" onClick={() => setShowAll(!showAll)}>
                    {showAll ? "Hide Promotions" : "View More Promotions"}
                  </Button>
                )}
              </div>
            )}
          </Card>

          <Card title="Order Summary" style={{ marginBottom: "16px" }}>
            <div className="total-price-order">
              <div>
                <p><strong style={{ color: "red" }}>Total Amount:</strong> ${totalAmount.toLocaleString()}</p>
                {selectedPromotion && <p><strong style={{ color: "green" }}>Total payment:</strong> ${discountedTotal.toLocaleString()}</p>}
              </div>
            </div>
          </Card>
          <div className="place-order-submit">
            <Form form={form} onFinish={onFinish} style={{ marginTop: 20 }}>
              <button type="submit" className="place-order-button" disabled={isPlacingOrder}>
                {isPlacingOrder ? "Processing..." : "Place Order"}
              </button>
            </Form>
          </div>
        </div>
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

        <Footer />
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
