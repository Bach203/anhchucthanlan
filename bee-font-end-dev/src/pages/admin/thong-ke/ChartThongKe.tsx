import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Card } from "antd";
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Title, Tooltip, Legend, ChartDataLabels);

interface ChartThongKeProps {
  title: string;
  data: {
    tongDoanhThu: number;
    tongSoDonThanhCong: number;
    tongSoDonHuy: number;
    tongSoSanPhamDaBan: number;
    tongSoDonTaiQuay: number;
    tongSoDonOnline: number;
  } | null;
}

const ChartThongKe: React.FC<ChartThongKeProps> = ({ title, data }) => {
  const fakeData = {
    tongSoDonThanhCong: 0,
    tongSoDonHuy: 0,
    tongSoSanPhamDaBan: 0,
    tongSoDonTaiQuay: 0,
    tongSoDonOnline: 0,
  };

  const isDataValid =
    data &&
    (data.tongSoDonThanhCong > 0 ||
      data.tongSoDonHuy > 0 ||
      data.tongSoSanPhamDaBan > 0 ||
      data.tongSoDonTaiQuay > 0 ||
      data.tongSoDonOnline > 0);

  const finalData = isDataValid ? data : fakeData;
  const chartData = {
    labels: [
      "Tổng số đơn thành công",
      "Tổng số đơn huỷ",
      "Tổng số sản phẩm đã bán",
      "Tổng số đơn tại quầy",
      "Tổng số đơn Online",
    ],
    datasets: [
      {
        label: title,
        data: isDataValid
          ? [
              finalData.tongSoDonThanhCong,
              finalData.tongSoDonHuy,
              finalData.tongSoSanPhamDaBan,
              finalData.tongSoDonTaiQuay,
              finalData.tongSoDonOnline,
            ]
          : [
              fakeData.tongSoDonThanhCong,
              fakeData.tongSoDonHuy,
              fakeData.tongSoSanPhamDaBan,
              fakeData.tongSoDonTaiQuay,
              fakeData.tongSoDonOnline,
            ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: isDataValid
          ? title
          : `${title} (Không Có Đơn Hàng Nào Trong Giai Đoạn Này)`,
      },
      datalabels: {
        color: "#fff",
        formatter: (value: number) => {
          return value;
        },
        font: {
          size: 14,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.raw || 0;
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  return (
    <Card>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "400px",
        }}
      >
        <Doughnut data={chartData} options={options} />
        <p
          style={{
            textAlign: "center",
            fontSize: "18px",
            marginTop: "10px",
            transform: "translateY(-170px)",
          }}
        >
          <strong>{data?.tongDoanhThu?.toLocaleString()} VND</strong>
        </p>
      </div>
    </Card>
  );
};

export default ChartThongKe;
