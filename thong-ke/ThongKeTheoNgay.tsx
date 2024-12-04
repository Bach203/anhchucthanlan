import React from "react";
import ChartThongKe from "./ChartThongKe";

const ThongKeTheoNgay: React.FC = () => {
  const dataTheoNgay = null;

  return (
    <ChartThongKe title="Biểu đồ thống kê theo ngày" data={dataTheoNgay} />
  );
};
export default ThongKeTheoNgay;
