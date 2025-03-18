import React, { useState, useEffect } from "react";
import { Table, Card, Typography, Button, List, Select } from "antd";
import Header from "../../components/Header/Header";
import { GetAllCustomerOrderAPI, UpdateCustomerOrderStatusAPI } from "../../services/manageOrderService";
import { getProductByIdAPI } from "../../services/manageProductService";
import "../ManageOrder/ManageOrders.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title, Text } = Typography;
const { Option } = Select;
const statusOptions = ["PENDING", "SHIPPED", "DELIVERED", "PAID", "CANCELLED", "RETURNED", "REFUNDED"];

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState([]);
  const [orderProductDetails, setOrderProductDetails] = useState({});
  const role = sessionStorage.getItem("role");
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await GetAllCustomerOrderAPI();
      console.log(data);
      setOrders(data);
    } catch (error) {
      toast.error("Failed to fetch orders");
    }
  };

  const handleUpdateStatus = async (orderId, newStatus, currentStatus) => {
    const validTransitions = {
      PENDING: ["SHIPPED"],
      SHIPPED: ["DELIVERED"],
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      toast.error(`Invalid status transition from ${currentStatus} to ${newStatus}`);
      return;
    }

    try {
      await UpdateCustomerOrderStatusAPI(orderId, newStatus);
      setOrders(orders.map(o =>
        o.orderId === orderId ? { ...o, status: newStatus } : o
      ));
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };


  const fetchProductDetailsForOrder = async (order) => {
    try {
      const promises = order.orderDetails.map(item => getProductByIdAPI(item.productId));
      const products = await Promise.all(promises);
      const details = products.map((product, index) => ({
        ...product,
        quantity: order.orderDetails[index].quantity,
      }));
      setOrderProductDetails(prev => ({ ...prev, [order.orderId]: details }));
    } catch (error) {
      toast.error("Failed to load product details");
    }
  };

  const handleToggleDetails = async (order) => {
    if (expandedOrders.includes(order.orderId)) {
      setExpandedOrders(expandedOrders.filter(id => id !== order.orderId));
    } else {
      await fetchProductDetailsForOrder(order);
      setExpandedOrders([...expandedOrders, order.orderId]);
    }
  };

  const columns = [
    { title: "Order ID", dataIndex: "orderId", key: "orderId" },
    { title: "Order Date", dataIndex: "orderDate", key: "orderDate" },
    { title: "Order Address", dataIndex: "address", key: "address" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, order) => {
        const allowedStatuses = {
          PAID: ["SHIPPED"],
          SHIPPED: ["DELIVERED"],
        };

        return (<>

          <Select
            value={text}
            style={{ width: 150 }}
            onChange={(value) => handleUpdateStatus(order.orderId, value, text)}
            disabled={!allowedStatuses[text]}
          >
            {role === "DELIVERY_STAFF" && (
              <>
                {(allowedStatuses[text] || []).map(status => (
                  <Option key={status} value={status}>
                    {status}
                  </Option>
                ))}
              </>
            )}
          </Select>

        </>
        );
      },
    },


    {
      title: "Total",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (text) => `$${text}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, order) => (
        <Button type="default" onClick={() => handleToggleDetails(order)}>
          {expandedOrders.includes(order.orderId) ? "Hide Details" : "View Details"}
        </Button>
      ),
    },
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      <ToastContainer />
      <Header />
      <div style={{ padding: 24, margin: "0 auto" }}>
        <Title level={2}>Order Management Dashboard</Title>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="orderId"
          expandable={{
            expandedRowRender: (order) => (
              <div>
                <List
                  dataSource={orderProductDetails[order.orderId] || []}
                  renderItem={(item) => (
                    <List.Item key={item.productId}>
                      <div className="item-order-detail">
                        <Card style={{ display: "flex" }}>
                          <div className="detail-item-product">
                            <div>
                              <img
                                src={item.imageURL || "https://via.placeholder.com/150"}
                                alt={item.productName}
                                style={{ width: 80, height: 80, objectFit: "cover" }}
                              />
                            </div>
                            <div>
                              <p style={{ margin: 0 }}><strong>{item.productName}</strong></p>
                              <p style={{ margin: 0 }}>Quantity: {item.quantity}</p>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            ),
            expandedRowKeys: expandedOrders,
          }}
        />
      </div>
    </div>
  );
};

export default ManageOrders;
