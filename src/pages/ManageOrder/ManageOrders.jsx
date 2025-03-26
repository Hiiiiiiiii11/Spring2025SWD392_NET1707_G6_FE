import React, { useState, useEffect, useMemo } from "react";
import moment from "moment";
import { Table, Card, Typography, Button, List, Select, Row, Col, Modal, DatePicker } from "antd";
import Header from "../../components/Header/Header";
import { AssignDeliveyForOrderAPI, GetAllCustomerOrderAPI, GetAllOrderAssignByDeliverIdAPI, UpdateCustomerOrderStatusAPI } from "../../services/manageOrderService";
import { getProductByIdAPI } from "../../services/manageProductService";
import { getPromotionByIdAPI } from "../../services/managePromotionService";
import { GetCustomerProfileAPI } from "../../services/userService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import "../ManageOrder/ManageOrders.css";
import { GetAllEmployeeAPI } from "../../services/manageEmployeeService";

const { Title, Text } = Typography;
const { Option } = Select;

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState([]);
  const [orderProductDetails, setOrderProductDetails] = useState({});
  const [customerNames, setCustomerNames] = useState({});
  const [customerPhone, setCustomerPhone] = useState({});
  const [orderPromotions, setOrderPromotions] = useState({});
  const role = sessionStorage.getItem("role");

  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [staffNames, setStaffNames] = useState({});
  const staffId = sessionStorage.getItem("staffId");

  // Sử dụng picker="month" để chọn tháng và năm, mặc định là tháng hiện tại
  const [selectedMonth, setSelectedMonth] = useState(moment());

  useEffect(() => {
    fetchOrders();
    fetchDeliveryStaff();
  }, []);

  useEffect(() => {
    orders.forEach((order) => {
      if (order.promotionId) {
        getPromotionByIdAPI(order.promotionId)
          .then((promotion) => {
            setOrderPromotions((prev) => ({
              ...prev,
              [order.orderId]: promotion,
            }));
          })
          .catch((error) => {
            console.error(`Error fetching promotion for order ${order.orderId}`, error);
          });
      }
    });
  }, [orders]);

  const fetchOrders = async () => {
    try {
      let data;
      if (role === "DELIVERY_STAFF") {
        data = await GetAllOrderAssignByDeliverIdAPI(staffId);
      } else {
        data = await GetAllCustomerOrderAPI();
      }
      setOrders(data);

      const uniqueCustomerIds = [...new Set(data.map((order) => order.customerId))];
      const namesMap = {};
      const phoneMap = {};

      await Promise.all(
        uniqueCustomerIds.map(async (customerId) => {
          try {
            const customer = await GetCustomerProfileAPI(customerId);
            namesMap[customerId] = customer.name || customer.fullName || "Unknown";
            phoneMap[customerId] = customer.phone || "Unknown";
          } catch (error) {
            namesMap[customerId] = "Unknown";
          }
        })
      );
      setCustomerNames(namesMap);
      setCustomerPhone(phoneMap);
    } catch (error) {
      toast.error("Failed to fetch orders");
    }
  };

  const handleUpdateStatus = async (orderId, newStatus, currentStatus) => {
    const validTransitions = {
      PAID: ["SHIPPED"],
      SHIPPED: ["DELIVERED"],
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      toast.error(`Invalid status transition from ${currentStatus} to ${newStatus}`);
      return;
    }

    try {
      await UpdateCustomerOrderStatusAPI(orderId, newStatus);
      setOrders(orders.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o)));
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const fetchProductDetailsForOrder = async (order) => {
    try {
      const promises = order.orderDetails.map((item) => getProductByIdAPI(item.productId));
      const products = await Promise.all(promises);
      const details = products.map((product, index) => ({
        ...product,
        quantity: order.orderDetails[index].quantity,
      }));
      setOrderProductDetails((prev) => ({ ...prev, [order.orderId]: details }));
    } catch (error) {
      toast.error("Failed to load product details");
    }
  };

  const fetchDeliveryStaff = async () => {
    try {
      const employees = await GetAllEmployeeAPI();
      const namesMap = {};
      employees.forEach((emp) => {
        namesMap[emp.staffId] = emp.fullname;
      });
      setStaffNames(namesMap);

      const deliveryStaff = employees.filter((emp) => emp.role === "DELIVERY_STAFF");
      setEmployeeList(deliveryStaff);
    } catch (error) {
      toast.error("Failed to fetch delivery staff");
    }
  };

  const openAssignModal = (orderId) => {
    setSelectedOrderId(orderId);
    setAssignModalVisible(true);
    fetchDeliveryStaff();
  };

  const handleToggleDetails = async (order) => {
    if (expandedOrders.includes(order.orderId)) {
      setExpandedOrders(expandedOrders.filter((id) => id !== order.orderId));
    } else {
      await fetchProductDetailsForOrder(order);
      setExpandedOrders([...expandedOrders, order.orderId]);
    }
  };

  // Sắp xếp đơn hàng theo status và ngày (có thể dùng nếu cần sắp xếp lại danh sách)
  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      if (a.status === "PAID" && b.status !== "PAID") return -1;
      if (a.status !== "PAID" && b.status === "PAID") return 1;
      return new Date(b.orderDate) - new Date(a.orderDate);
    });
  }, [orders]);

  // Lọc đơn hàng theo tháng và năm được chọn
  const filteredOrders = useMemo(() => {
    if (!selectedMonth) return orders;
    return orders.filter((order) => {
      const orderDate = new Date(order.orderDate);
      return (
        orderDate.getMonth() + 1 === parseInt(selectedMonth.format("M"), 10) &&
        orderDate.getFullYear() === parseInt(selectedMonth.format("YYYY"), 10)
      );
    });
  }, [orders, selectedMonth]);

  // Các tính toán doanh thu dựa trên filteredOrders
  const { paymentHistory, refundHistory, totalMoneyReceived, totalMoneyRefunded, totalRefundOrders } = useMemo(() => {
    const payments = filteredOrders
      .filter((o) => ["PAID", "DELIVERED", "COMPLETED"].includes(o.status))
      .map((o) => ({
        orderId: o.orderId,
        date: o.orderDate,
        amount: o.totalAmount,
        customerId: o.customerId,
      }));
    const refunds = filteredOrders
      .filter((o) => o.refund && o.refund.status === "REFUNDED")
      .map((o) => ({
        orderId: o.orderId,
        date: o.refund.refundCompletionTime.split("T")[0],
        amount: o.refund.amount,
        customerId: o.customerId,
      }));
    const totalReceived = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalRefunded = refunds.reduce((sum, r) => sum + r.amount, 0);
    return {
      paymentHistory: payments,
      refundHistory: refunds,
      totalMoneyReceived: totalReceived,
      totalMoneyRefunded: totalRefunded,
      totalRefundOrders: refunds.length,
    };
  }, [filteredOrders]);

  const netRevenue = totalMoneyReceived - totalMoneyRefunded;

  const revenueChartData = useMemo(() => {
    const grouped = {};
    paymentHistory.forEach((item) => {
      const date = new Date(item.date).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = { date, Addition: 0, Deduction: 0 };
      }
      grouped[date].Addition += item.amount;
    });
    refundHistory.forEach((item) => {
      const date = new Date(item.date).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = { date, Addition: 0, Deduction: 0 };
      }
      grouped[date].Deduction += item.amount;
    });
    return Object.values(grouped);
  }, [paymentHistory, refundHistory]);

  const handleAssignDelivery = async () => {
    if (!selectedOrderId || !selectedEmployeeId) {
      toast.error("Please select a staff member");
      return;
    }
    try {
      await AssignDeliveyForOrderAPI(selectedOrderId, selectedEmployeeId);
      toast.success("Delivery assigned successfully");
      setAssignModalVisible(false);
      fetchOrders();
    } catch (error) {
      toast.error("Failed to assign delivery");
    }
  };

  const columns = [
    { title: "Order Date", dataIndex: "orderDate", key: "orderDate" },
    { title: "Order Address", dataIndex: "address", key: "address" },
    {
      title: "Customer Name",
      dataIndex: "customerId",
      key: "customerName",
      render: (customerId) => customerNames[customerId] || "Loading...",
    },
    {
      title: "Customer Phone",
      dataIndex: "customerId",
      key: "customerPhone",
      render: (customerId) => customerPhone[customerId] || "Loading...",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, order) => {
        const allowedStatuses = {
          PAID: ["SHIPPED"],
          SHIPPED: ["DELIVERED"],
        };
        return (
          <Select
            value={text}
            style={{ width: 150 }}
            onChange={(value) => handleUpdateStatus(order.orderId, value, text)}
            disabled={!allowedStatuses[text]}
          >
            {role === "DELIVERY_STAFF" &&
              allowedStatuses[text]?.map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
          </Select>
        );
      },
    },
    {
      title: "Promotion",
      key: "promotion",
      render: (_, order) => {
        if (order.promotionId) {
          const promotion = orderPromotions[order.orderId];
          return promotion ? promotion.promotionName : "Loading...";
        }
        return "None";
      },
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (text) => `$${text}`,
    },
    {
      title: "Delivery BY",
      dataIndex: "staffId",
      key: "StaffName",
      render: (staffId) => staffNames[staffId] || "None",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, order) => (
        <div className="detail-and-aligndelivery">
          <Button type="default" onClick={() => handleToggleDetails(order)}>
            {expandedOrders.includes(order.orderId) ? "Hide Details" : "View Details"}
          </Button>
          {role === "CUSTOMER_STAFF" && order.status === "PAID" && (
            <Button
              type="default"
              style={{ color: "blue" }}
              disabled={order.staffId}
              onClick={() => openAssignModal(order.orderId)}
            >
              Assign Delivery
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f0f2f5", paddingBottom: "24px" }}>
      <ToastContainer />
      <Header />
      <div style={{ padding: "24px", margin: "0 auto" }}>
        <Title level={2}>Order Management Dashboard</Title>

        {/* Filter theo tháng và năm: mặc định là tháng hiện tại */}
        {role === "MANAGER" && (
          <Card style={{ marginBottom: "24px", backgroundColor: "#fafafa" }}>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={8}>
                <Text strong>Select Month:</Text>
              </Col>
              <Col xs={24} md={16}>
                <DatePicker
                  picker="month"
                  style={{ width: "100%" }}
                  onChange={(value) => setSelectedMonth(value)}
                  value={selectedMonth}
                  placeholder="Select Month"
                />
              </Col>
            </Row>
          </Card>
        )}

        {/* Dashboard doanh thu */}
        {role === "MANAGER" && (
          <>
            <Card title="Revenue Dashboard" style={{ marginBottom: "24px", backgroundColor: "#fafafa" }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Card type="inner" style={{ backgroundColor: "#e6f7ff" }}>
                    <Title level={4}>Total Revenue</Title>
                    <p style={{ fontSize: "20px", fontWeight: "bold", color: "#52c41a" }}>
                      ${totalMoneyReceived.toLocaleString()}
                    </p>
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card type="inner" style={{ backgroundColor: "#fff7e6" }}>
                    <Title level={4}>Total Refunds</Title>
                    <p style={{ fontSize: "20px", fontWeight: "bold", color: "#fa8c16" }}>
                      ${totalMoneyRefunded.toLocaleString()}
                    </p>
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card type="inner" style={{ backgroundColor: "#f6ffed" }}>
                    <Title level={4}>Net Revenue</Title>
                    <p style={{ fontSize: "20px", fontWeight: "bold", color: "#52c41a" }}>
                      ${netRevenue.toLocaleString()}
                    </p>
                  </Card>
                </Col>
              </Row>
              <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
                <Col xs={24} md={12}>
                  <Card type="inner" title="Payment History" style={{ backgroundColor: "#e6f7ff" }}>
                    <List
                      dataSource={paymentHistory}
                      renderItem={(item) => (
                        <List.Item key={item.orderId}>
                          <span>
                            Payment Date: {new Date(item.date).toLocaleDateString()} | Receive: ${item.amount} from{" "}
                            {customerNames[item.customerId] || "Loading..."}
                          </span>
                        </List.Item>
                      )}
                    />
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card type="inner" title="Refund History" style={{ backgroundColor: "#fff7e6" }}>
                    <List
                      dataSource={refundHistory}
                      renderItem={(item) => (
                        <List.Item key={item.orderId}>
                          <span>
                            Refund Date: {item.date} | Refund Amount: ${item.amount} to{" "}
                            {customerNames[item.customerId] || "Loading..."}
                          </span>
                        </List.Item>
                      )}
                    />
                  </Card>
                </Col>
              </Row>
            </Card>

            <Card title="Revenue Chart" style={{ marginBottom: "24px", backgroundColor: "#ffffff" }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueChartData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Addition" fill="#52c41a" name="Addition" />
                  <Bar dataKey="Deduction" fill="#fa8c16" name="Deduction" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </>
        )}

        {/* Bảng hiển thị đơn hàng từ filteredOrders */}
        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="orderId"
          expandable={{
            expandedRowRender: (order) => (
              <div>
                <List
                  dataSource={orderProductDetails[order.orderId] || []}
                  renderItem={(item) => (
                    <List.Item key={item.productId}>
                      <Card style={{ display: "flex", width: "100%", marginBottom: "8px" }}>
                        <div className="detail-item-product" style={{ display: "flex", alignItems: "center" }}>
                          <img
                            src={item.imageURL || "https://via.placeholder.com/150"}
                            alt={item.productName}
                            style={{ width: 80, height: 80, objectFit: "cover", margin: 0 }}
                          />
                          <div>
                            <p style={{ margin: 0, fontWeight: "bold" }}>{item.productName}</p>
                            <p style={{ margin: 0 }}>Quantity: {item.quantity}</p>
                          </div>
                        </div>
                      </Card>
                    </List.Item>
                  )}
                />
              </div>
            ),
            expandedRowKeys: expandedOrders,
          }}
        />
      </div>

      {/* Modal gán giao hàng */}
      <Modal
        title="Assign Delivery Staff"
        visible={assignModalVisible}
        onCancel={() => setAssignModalVisible(false)}
        onOk={handleAssignDelivery}
        okText="Assign"
      >
        <Select
          placeholder="Select Delivery Staff"
          style={{ width: "100%" }}
          onChange={(value) => setSelectedEmployeeId(value)}
        >
          {employeeList.map((employee) => (
            <Option key={employee.staffId} value={employee.staffId}>
              {employee.fullname}
            </Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default ManageOrders;
