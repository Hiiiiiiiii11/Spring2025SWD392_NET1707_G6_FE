import React, { useState, useEffect } from "react";
import { Table, Card, Statistic, Typography, Button, message, List } from "antd";
import Header from "../../components/Header/Header";
import { GetAllCustomerOrderAPI } from "../../services/manageOrderService";
import { getProductByIdAPI } from "../../services/manageProductService";
import "../ManageOrder/ManageOrders.css"



const { Title, Text } = Typography;

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState([]);
  const [orderProductDetails, setOrderProductDetails] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await GetAllCustomerOrderAPI();
      setOrders(data);
    } catch (error) {
      message.error("Failed to fetch orders");
    }
  };

  // const handleUpdateStatus = async (orderId) => {
  //   try {
  //     await UpdateOrderStatusAPI(orderId, "Processed");
  //     setOrders(orders.map(order => order.orderId === orderId ? { ...order, status: "Processed" } : order));
  //     message.success("Order status updated successfully");
  //   } catch (error) {
  //     message.error("Failed to update status");
  //   }
  // };

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
      message.error("Failed to load product details");
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

  return (
    <div>
      <Header />
      <div style={{ padding: 24, margin: "0 auto" }}>
        <Title level={2}>Order Management Dashboard</Title>
        <Table
          columns={[
            { title: "Order ID", dataIndex: "orderId", key: "orderId" },
            { title: "Order Date", dataIndex: "orderDate", key: "orderDate" },
            { title: "Order Address", dataIndex: "address", key: "address" },
            {
              title: "Status",
              dataIndex: "status",
              key: "status",
              render: (text) => (
                <Text style={{ color: text === "Delivered" ? "#27ae60" : "#e67e22", fontWeight: "bold" }}>{text}</Text>
              ),
            },
            { title: "Total", dataIndex: "totalAmount", key: "totalAmount", render: (text) => `₫${text.toLocaleString()}` },
            {
              title: "Actions",
              key: "actions",
              render: (_, order) => (
                <>
                  {/* <Button type="primary" onClick={() => handleUpdateStatus(order.orderId)} style={{ marginRight: 8 }}>
                    Update Status
                  </Button> */}
                  <Button type="default" onClick={() => handleToggleDetails(order)}>
                    {expandedOrders.includes(order.orderId) ? "Hide Details" : "View Details"}
                  </Button>
                </>
              ),
            },
          ]}

          dataSource={orders}
          rowKey="orderId"
          expandable={{

            expandedRowRender: (order) => (
              <div>
                <List
                  dataSource={orderProductDetails[order.orderId] || []}
                  renderItem={(item) => (

                    <List.Item key={item.productId}  >
                      <div className="item-order-detail">
                        <Card style={{ display: "flex" }} >
                          <div className="detail-item-product">
                            <img
                              src={item.imageURL || "https://via.placeholder.com/150"}
                              alt={item.productName}
                              style={{ width: 80, height: 80, objectFit: "cover", }}
                            />
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
