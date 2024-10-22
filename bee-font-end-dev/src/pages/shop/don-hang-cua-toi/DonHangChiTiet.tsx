import {
  Button,
  Divider,
  Empty,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";
import { ColumnsType } from "antd/es/table";
import React, { useState, useEffect } from "react";
import requestClient from "~/utils/requestClient";
import HinhAnhSanPham from "../gio-hang/HinhAnhSanPham";
import { formatGiaTienVND } from "~/utils/formatResponse";

const { Text } = Typography;

interface DataType {
  key: React.Key;
  hinhAnh: string;
  ten: number;
  soLuong: number;
  donGia: number;
}

const columns: ColumnsType<DataType> = [
  {
    title: "STT",
    align: "center",
    rowScope: "row",
    width: "10%",
    render: (text, record, index) => index + 1,
  },
  {
    title: "Thông tin sản phẩm",
    dataIndex: "chiTietSanPham",
    key: "ten",
    align: "left",
    render: (chiTietSanPham) => (
      <Space>
        <HinhAnhSanPham chiTietSanPham={chiTietSanPham} />
        <Space direction="vertical">
          <Text strong>{chiTietSanPham.sanPham.ten}</Text>
          <Text>{`[${chiTietSanPham.mauSac.ten} - ${chiTietSanPham.kichCo.kichCo} - ${chiTietSanPham.loaiDe.ten} - ${chiTietSanPham.diaHinhSan.ten}]`}</Text>
        </Space>
      </Space>
    ),
  },
  {
    title: "Số lượng",
    dataIndex: "soLuong",
    key: "soLuong",
    align: "center",
  },
  {
    title: "Thành tiền",
    dataIndex: "thanhTien",
    key: "thanhTien",
    align: "center",
    render: (text, record) => (
      <Text type="danger" style={{ fontWeight: "bold" }}>
        {formatGiaTienVND(record.chiTietSanPham.giaTien * record.soLuong)}
      </Text>
    ),
  },
];

interface DonHangChiTietProps {
  currentKey: string;
}

const DonHangChiTiet: React.FC<DonHangChiTietProps> = ({ currentKey }) => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const idTaiKhoan = localStorage.getItem("acountId");
  const [showPaymentButton, setShowPaymentButton] = useState<boolean[]>([]);

  const param = {
    taiKhoanId: idTaiKhoan,
    trangThai: currentKey,
  };

  const getDonHang = async () => {
    setLoading(true);
    try {
      const response = await requestClient.get("/don-hang", {
        params: param,
      });
      setData(response.data);
      console.log(response.data);

      const showButtonArr = response.data.map((item: any) =>
        item.giaoDichList.some(
          (giaoDich: any) =>
            giaoDich.phuongThucThanhToan.id === 2 &&
            item.trangThaiHoaDon.ten === "PENDING" &&
            giaoDich.trangThaiGiaoDich.ten != "SUCCESS"
        )
      );
      setShowPaymentButton(showButtonArr);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDonHang();
  }, []);

  return (
    <Spin size="large" spinning={loading}>
      {data.length > 0 ? (
        data.map((item, index) => (
          <>
            <Divider />
            <Table
              bordered
              title={() => (
                <>
                  <Text strong>#{item.ma}</Text>
                  <Text
                    strong
                    style={{
                      float: "right",
                      color:
                        item.trangThaiHoaDon.ten == "CANCELLED"
                          ? "red"
                          : item.trangThaiHoaDon.ten == "APPROVED"
                          ? "green"
                          : "blue",
                    }}
                  >
                    {item.trangThaiHoaDon.moTa.toUpperCase()}
                  </Text>
                </>
              )}
              key={index}
              columns={columns}
              dataSource={item.hoaDonChiTietList}
              pagination={false}
            />
            <p style={{ float: "left", marginTop: 30, marginLeft: 50 }}>
              {showPaymentButton[index] && (
                <Button type="primary">Thanh toán ngay</Button>
              )}
            </p>
            <p style={{ float: "right" }}>
              <Text>
                <Text italic strong>
                  Giảm giá:{" "}
                </Text>
                <Text italic strong style={{ color: "green" }}>
                  {formatGiaTienVND(
                    item.tongTien + item.phiShip - item.tongTienKhiGiam
                  )}
                </Text>
              </Text>
              <br />
              <Text>
                <Text strong>Phí ship: </Text>
                <Text italic strong style={{ color: "green" }}>
                  {formatGiaTienVND(item.phiShip)}
                </Text>
              </Text>
              <br />
              <Text>
                <Text strong>Thành tiền: </Text>
                <Text strong style={{ color: "red", fontSize: 18 }}>
                  {formatGiaTienVND(item.tongTienKhiGiam)}
                </Text>
              </Text>
            </p>
            <Divider style={{ marginBottom: 50 }} />
          </>
        ))
      ) : (
        <Empty
          style={{ margin: "140px 0px" }}
          description={"Chưa có đơn hàng"}
        />
      )}
    </Spin>
  );
};

export default DonHangChiTiet;
