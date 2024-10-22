import {
  Affix,
  Button,
  Divider,
  Empty,
  Input,
  Space,
  Table,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { formatGiaTienVND } from "~/utils/formatResponse";
import HinhAnhSanPham from "../gio-hang/HinhAnhSanPham";
import { ColumnsType } from "antd/es/table";
import requestClient from "~/utils/requestClient";

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

const ThongTinDonHang: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [showPaymentButton, setShowPaymentButton] = useState<boolean[]>([]);
  const [maHoaDon, setMaHoaDon] = useState<string>(""); // State để lưu giá trị từ ô Input

  const getDonHang = async () => {
    setLoading(true);
    try {
      const response = await requestClient.get("/don-hang/" + maHoaDon);
      setData(response.data);
      console.log(data);

      const showButton = response.data.giaoDichList.some(
        (giaoDich: any) =>
          giaoDich.phuongThucThanhToan.id === 2 &&
          response.data.trangThaiHoaDon.ten === "PENDING" &&
          giaoDich.trangThaiGiaoDich.ten !== "SUCCESS"
      );
      setShowPaymentButton(showButton);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setData(null);
      setShowPaymentButton(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    getDonHang();
  }, [maHoaDon]);

  const handleSearch = (value: string) => {
    setMaHoaDon(value);
  };
  return (
    <>
      <Text strong style={{ marginLeft: 60 }}>
        Hãy nhập Mã hóa đơn muốn kiểm tra:{" "}
      </Text>
      <br />
      <Input
        allowClear
        style={{ width: 400, marginLeft: 60 }}
        value={maHoaDon}
        onChange={(e) => handleSearch(e.target.value)} // Sử dụng prop onChange để lấy giá trị từ ô Input khi nó thay đổi
        placeholder="Mã hóa đơn của bạn ..."
      />

      {data !== null ? (
        <>
          <Divider />
          <Table
            bordered
            title={() => (
              <>
                <Text strong>#{data?.ma}</Text>
                <Text
                  strong
                  style={{
                    float: "right",
                    color:
                      data.trangThaiHoaDon?.ten === "CANCELLED"
                        ? "red"
                        : data.trangThaiHoaDon?.ten === "APPROVED"
                        ? "green"
                        : "blue",
                  }}
                >
                  {data.trangThaiHoaDon?.moTa.toUpperCase()}
                </Text>
              </>
            )}
            columns={columns}
            dataSource={data.hoaDonChiTietList}
            pagination={false}
          />
          <p style={{ float: "left", marginTop: 30, marginLeft: 50 }}>
            {showPaymentButton && (
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
                  data.tongTien + data.phiShip - data.tongTienKhiGiam
                )}
              </Text>
            </Text>
            <br />
            <Text>
              <Text strong>Phí ship: </Text>
              <Text italic strong style={{ color: "green" }}>
                {formatGiaTienVND(data.phiShip)}
              </Text>
            </Text>
            <br />
            <Text>
              <Text strong>Thành tiền: </Text>
              <Text strong style={{ color: "red", fontSize: 18 }}>
                {formatGiaTienVND(data.tongTienKhiGiam)}
              </Text>
            </Text>
          </p>
          <Divider style={{ marginBottom: 50 }} />
        </>
      ) : (
        <Empty
          style={{ margin: "99px 0px" }}
          //   description={"Không tìm thấy đơn hàng có mã " + "#" + maHoaDon}
          description={`Không tìm thấy đơn hàng `}
        />
      )}
    </>
  );
};

export default ThongTinDonHang;
