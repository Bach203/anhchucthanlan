import React from "react";
import ChartThongKe from "./ChartThongKe";

const ThongKeTheoThang: React.FC = () => {
  const dataTheoThang = null;

  return (
    <ChartThongKe title="Biểu đồ thống kê theo tháng" data={dataTheoThang} />
  );
};

export default ThongKeTheoThang;
