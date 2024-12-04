import React from "react";
import ChartThongKe from "./ChartThongKe";

const ThongKeTheoKhoangNgay: React.FC = () => {
  const dataTheoKhoangNgay = null;

  return (
    <ChartThongKe
      title="Biểu đồ thống kê theo khoảng ngày"
      data={dataTheoKhoangNgay}
    />
  );
};

export default ThongKeTheoKhoangNgay;
