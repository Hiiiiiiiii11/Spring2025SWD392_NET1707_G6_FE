import React, { useState } from "react";
import { Card, Radio, Input, Button, Select, Divider } from "antd";
import { CreditCardOutlined, WalletOutlined, BankOutlined } from "@ant-design/icons";

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("creditCard");

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Checkout & Thanh toán</h2>

      {/* Thông tin liên hệ */}
      <Card title="Thông tin liên hệ" className="mb-4">
        <Input placeholder="Email Address" className="mb-3" size="large" />
        <Input placeholder="Số điện thoại" size="large" />
      </Card>

      {/* Thông tin giao hàng */}
      <Card title="Thông tin giao hàng" className="mb-4">
        <Input placeholder="Họ và tên" className="mb-3" size="large" />
        <Input placeholder="Địa chỉ" className="mb-3" size="large" />
        <Input placeholder="Địa chỉ 2 (Tùy chọn)" className="mb-3" size="large" />
        <div className="flex gap-2">
          <Select placeholder="Quốc gia" className="w-1/3" size="large">
            <Select.Option value="vn">Việt Nam</Select.Option>
          </Select>
          <Select placeholder="Tỉnh / Thành phố" className="w-1/3" size="large">
            <Select.Option value="hcm">Hồ Chí Minh</Select.Option>
          </Select>
          <Input placeholder="Mã bưu điện" className="w-1/3" size="large" />
        </div>
      </Card>

      {/* Phương thức thanh toán */}
      <Card title="Phương thức thanh toán" className="mb-4">
        <Radio.Group onChange={(e) => setPaymentMethod(e.target.value)} value={paymentMethod} className="w-full">
          <div className="grid grid-cols-3 gap-3">
            <Radio.Button value="creditCard" className="w-full text-center">
              <CreditCardOutlined /> Thẻ tín dụng
            </Radio.Button>
            <Radio.Button value="eWallet" className="w-full text-center">
              <WalletOutlined /> Ví điện tử
            </Radio.Button>
            <Radio.Button value="bankTransfer" className="w-full text-center">
              <BankOutlined /> Chuyển khoản
            </Radio.Button>
          </div>
        </Radio.Group>

        {paymentMethod === "creditCard" && (
          <div className="flex flex-col gap-3 mt-4">
            <Input placeholder="Số thẻ" size="large" />
            <Input placeholder="Tên chủ thẻ" size="large" />
            <div className="flex gap-2">
              <Input placeholder="MM/YY" className="w-1/2" size="large" />
              <Input placeholder="CVV" className="w-1/2" size="large" />
            </div>
          </div>
        )}
      </Card>

      {/* Giỏ hàng */}
      <Card title="Giỏ hàng của bạn" className="mb-4">
        <ul className="space-y-3">
          <li className="flex justify-between font-medium"><span>Sản phẩm 1</span> <span>150.000đ</span></li>
          <li className="flex justify-between font-medium"><span>Sản phẩm 2</span> <span>200.000đ</span></li>
          <Divider />
          <li className="flex justify-between font-semibold text-red-500"><span>Giảm giá</span> <span>-50.000đ</span></li>
          <li className="flex justify-between font-bold text-lg"><span>Tổng cộng</span> <span>300.000đ</span></li>
        </ul>
      </Card>

      <div className="flex justify-between items-center mt-6">
        <span className="text-lg font-semibold">Tổng: 300.000đ</span>
        <Button type="primary" size="large" className="px-8">Thanh toán</Button>
      </div>
    </div>
  );
};

export default PaymentPage;
