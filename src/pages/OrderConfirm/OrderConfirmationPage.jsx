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
import { getAllBatchByProductIdAPI } from "../../services/manageBatchService";

const { Option } = Select;

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedItems } = location.state || { selectedItems: [] };

  const [form] = Form.useForm();
  const [shippingForm] = Form.useForm();
  const [shippingInfo, setShippingInfo] = useState({ name: "", address: "" });
  const [promotions, setPromotions] = useState([]);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [batchData, setBatchData] = useState({});
  const customerId = sessionStorage.getItem("customerId");

  useEffect(() => {
    fetchProfile();
    fetchPromotions();
    fetchBatchData();
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
      setPromotions(data);
    } catch (error) {
      console.error("Failed to fetch promotions", error);
    }
  };

  const fetchBatchData = async () => {
    const batchInfo = {};
    for (const item of selectedItems) {
      const batches = await getAllBatchByProductIdAPI(item.productID);

      // Sắp xếp batch theo hạn sử dụng từ sớm nhất đến muộn nhất
      batches.sort((a, b) => new Date(a.expireDate) - new Date(b.expireDate));

      let remainingQuantity = item.quantity;
      const selectedBatches = [];

      for (const batch of batches) {
        if (remainingQuantity <= 0) break;
        const usedQuantity = Math.min(remainingQuantity, batch.quantity);
        selectedBatches.push({
          batchId: batch.batchId,
          importDate: batch.importDate,
          expireDate: batch.expireDate,
          usedQuantity,
        });
        remainingQuantity -= usedQuantity;
      }

      batchInfo[item.productID] = selectedBatches;
    }
    setBatchData(batchInfo);
  };

  const totalAmount = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
                  <div className="product-date">
                    {batchData[item.productID] && batchData[item.productID].length > 1 && (
                      <p style={{ color: "Blue", fontWeight: "bold" }}>This product has multiple expiration dates.</p>
                    )}

                    {batchData[item.productID]?.map((batch, index) => (
                      <div key={index}>
                        <p><strong>Manufacturing Date:</strong> {dayjs(batch.importDate).format("YYYY-MM-DD")}</p>
                        <p><strong>Expiration Date:</strong> {dayjs(batch.expireDate).format("YYYY-MM-DD")}</p>
                      </div>
                    ))}

                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
