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
const statusOptions = ["PENDING", "SHIPPED", "PAID", "CANCELLED", "RETURNED", "REFUNDED"];

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
      console.log(data);
      setOrders(data);
    } catch (error) {
      toast.error("Failed to fetch orders");
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
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
      render: (text, order) => (
        <Select
          defaultValue={text}
          style={{ width: 150 }}
          onChange={(value) => handleUpdateStatus(order.orderId, value)}
          options={statusOptions.map(status => ({ value: status, label: status }))}
        /*            If you wish to disable dropdown when order is already delivered, you can add: \n disabled={text === 'DELIVERED'} */
        />
      ),
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (text) => `$${text / 25000}`,
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
