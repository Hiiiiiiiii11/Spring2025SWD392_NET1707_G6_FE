import React, { useState } from "react";
import { Card, Radio, Input, Button, Checkbox, Select } from "antd";

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("creditCard");

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold mb-4">Checkout & Thanh toán</h2>
      
      {/* Thông tin liên hệ */}
      <Card title="Thông tin liên hệ" className="mb-4">
        <Input placeholder="Email Address" className="mb-2" />
        <Input placeholder="Số điện thoại" />
      </Card>
      
      {/* Thông tin giao hàng */}
      <Card title="Thông tin giao hàng" className="mb-4">
        <Input placeholder="Họ và tên" className="mb-2" />
        <Input placeholder="Địa chỉ" className="mb-2" />
        <Input placeholder="Địa chỉ 2 (Tùy chọn)" className="mb-2" />
        <div className="flex gap-2">
          <Select placeholder="Quốc gia" className="w-1/3">
            <Select.Option value="vn">Việt Nam</Select.Option>
          </Select>
          <Select placeholder="Tỉnh / Thành phố" className="w-1/3">
            <Select.Option value="hcm">Hồ Chí Minh</Select.Option>
          </Select>
          <Input placeholder="Mã bưu điện" className="w-1/3" />
        </div>
      </Card>
      
      {/* Thông tin thanh toán */}
      <Card title="Chọn phương thức thanh toán" className="mb-4">
        <Radio.Group onChange={(e) => setPaymentMethod(e.target.value)} value={paymentMethod}>
          <div className="flex flex-col gap-3">
            <Radio value="creditCard">Thẻ tín dụng</Radio>
            <Radio value="eWallet">Ví điện tử</Radio>
            <Radio value="bankTransfer">Chuyển khoản ngân hàng</Radio>
          </div>
        </Radio.Group>
        
        {paymentMethod === "creditCard" && (
          <div className="flex flex-col gap-3 mt-3">
            <Input placeholder="Số thẻ" />
            <Input placeholder="Tên chủ thẻ" />
            <div className="flex gap-2">
              <Input placeholder="MM/YY" className="w-1/2" />
              <Input placeholder="CVV" className="w-1/2" />
            </div>
          </div>
        )}
        {paymentMethod === "eWallet" && <p className="mt-3">Chọn ví điện tử để tiếp tục thanh toán.</p>}
        {paymentMethod === "bankTransfer" && <p className="mt-3">Chọn ngân hàng để tiếp tục thanh toán.</p>}
      </Card>
      
      {/* Giỏ hàng */}
      <Card title="Giỏ hàng" className="mb-4">
        <ul>
          <li className="flex justify-between"><span>Sản phẩm 1</span> <span>150.000đ</span></li>
          <li className="flex justify-between"><span>Sản phẩm 2</span> <span>200.000đ</span></li>
          <li className="flex justify-between"><span>Giảm giá</span> <span className="text-red-500">-50.000đ</span></li>
          <li className="flex justify-between font-bold"><span>Tổng</span> <span>300.000đ</span></li>
        </ul>
      </Card>
      
      <div className="flex justify-between items-center mt-4">
        <span className="text-lg font-semibold">Tổng: 300.000đ</span>
        <Button type="primary">Thanh toán</Button>
      </div>
    </div>
  );
};

export default PaymentPage;
