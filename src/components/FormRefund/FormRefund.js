import React, { useState } from 'react';
import { Card, Button, Typography, message, Collapse } from 'antd';
import { CheckCircleOutlined, MoneyCollectOutlined } from '@ant-design/icons';
import "../FormRefund/FormRefund.css"

const { Title, Text } = Typography;
const { Panel } = Collapse;

const refundOrder = {
    orderId: 'RF123456',
    customer: 'Nguyễn Văn A',
    totalAmount: 500000,
    products: [
        { id: 1, name: 'Serum Dưỡng Ẩm', price: 200000, quantity: 1, description: 'Serum giúp dưỡng ẩm và làm sáng da.' },
        { id: 2, name: 'Kem Chống Nắng', price: 300000, quantity: 1, description: 'Kem chống nắng bảo vệ da khỏi tia UV.' },
    ]
};

const RefundForm = () => {
    const [success, setSuccess] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const handleRefund = () => {
        setSuccess(true);
        message.success('Refund successful!');
    };

    return (
        <div className='refund-page'>
            <div className='refund-container'>
                <Card style={{ width: 700, textAlign: 'center', padding: 20 }}>
                    {success ? (
                        <>
                            <CheckCircleOutlined style={{ fontSize: 60, color: '#52c41a' }} />
                            <Title level={3}>Refund Successful</Title>
                            <Text strong>{refundOrder.totalAmount.toLocaleString()}đ</Text>
                            <p>Refund has been processed for order <strong>{refundOrder.orderId}</strong>.</p>
                            <Button type="default" style={{ color: "blue" }} onClick={() => setShowDetails(!showDetails)}>
                                {showDetails ? 'Hide Details' : 'View Details'}
                            </Button>
                            {showDetails && (
                                <Card title="Refund Order Details" style={{ marginTop: 20 }}>
                                    <Collapse>
                                        {refundOrder.products.map(product => (
                                            <Panel header={product.name} key={product.id}>
                                                <p><strong>Giá:</strong> {product.price.toLocaleString()}đ</p>
                                                <p><strong>Số lượng:</strong> {product.quantity}</p>
                                                <p><strong>Mô tả:</strong> {product.description}</p>
                                            </Panel>
                                        ))}
                                    </Collapse>
                                </Card>
                            )}
                        </>
                    ) : (
                        <>
                            <MoneyCollectOutlined style={{ fontSize: 60, color: '#1890ff' }} />
                            <Title level={3}>Refund Order</Title>
                            <p>Customer: <strong>{refundOrder.customer}</strong></p>
                            <p>Total Refund Amount: <strong>{refundOrder.totalAmount.toLocaleString()}đ</strong></p>
                            <Button type="primary" onClick={handleRefund}>Process Refund</Button>
                        </>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default RefundForm;