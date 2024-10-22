import { Card, Tabs, TabsProps } from "antd";
import React from "react";
import TaiQuay from "~/components/admin/tai-quay/TaiQuay";

const BanHangTaiQuay: React.FC = () => {
  return (
    <Card title="BÁN HÀNG TẠI QUẦY">
      <TaiQuay />
    </Card>
  );
};

export default BanHangTaiQuay;
