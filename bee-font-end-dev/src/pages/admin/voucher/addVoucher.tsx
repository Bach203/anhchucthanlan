import React from "react";
import { Card, Tabs } from "antd";
import AddVoucherHoaDon from "./AddVoucherHoaDon";
import AddVoucherKhachHang from "./AddVoucherKhachHang";

const AddVoucher: React.FC = () => {
  return (
    <Card title="THÊM VOUCHER">
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "Voucher Hóa Đơn",

            children: <AddVoucherHoaDon />,
          },
          {
            key: "2",
            label: "Voucher Khách Hàng",
            children: <AddVoucherKhachHang />,
          },
        ]}
      />
    </Card>
  );
};

export default AddVoucher;
