import React from "react";
import ChartThongKe from "./ChartThongKe";

const ThongKeTheoTuan: React.FC = () => {
  const dataTheoTuan = null;

  return (
    <ChartThongKe title="Biểu đồ thống kê theo tuần" data={dataTheoTuan} />
  );
};

export default ThongKeTheoTuan;
