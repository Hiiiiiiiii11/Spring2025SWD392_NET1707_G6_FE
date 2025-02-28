import React, { useState } from "react";
import { Card, Radio, Input, Button } from "antd";

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("creditCard");

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold mb-4">Chọn phương thức thanh toán</h2>
      <Radio.Group onChange={(e) => setPaymentMethod(e.target.value)} value={paymentMethod}>
        <div className="flex flex-col gap-3">
          <Radio value="creditCard">Thẻ tín dụng</Radio>
          <Radio value="eWallet">Ví điện tử</Radio>
          <Radio value="bankTransfer">Chuyển khoản ngân hàng</Radio>
        </div>
      </Radio.Group>

      <Card className="mt-4">
        {paymentMethod === "creditCard" && (
          <div className="flex flex-col gap-3">
            <Input placeholder="Số thẻ" />
            <Input placeholder="Tên chủ thẻ" />
            <div className="flex gap-2">
              <Input placeholder="MM/YY" className="w-1/2" />
              <Input placeholder="CVV" className="w-1/2" />
            </div>
          </div>
        )}
        {paymentMethod === "eWallet" && <p>Chọn ví điện tử để tiếp tục thanh toán.</p>}
        {paymentMethod === "bankTransfer" && <p>Chọn ngân hàng để tiếp tục thanh toán.</p>}
      </Card>

      <div className="mt-4 flex justify-between items-center">
        <span className="text-lg font-semibold">Tổng: 1.200.000đ</span>
        <Button type="primary">Thanh toán</Button>
      </div>
    </div>
  );
};

export default PaymentPage;
