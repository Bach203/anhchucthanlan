import {
  Button,
  Col,
  Input,
  InputNumber,
  Modal,
  Row,
  Space,
  Table,
  Tooltip,
  Typography,
  message,
} from "antd";
import { ColumnsType } from "antd/es/table";
import React, { useState, useEffect } from "react";
import request, { request4s } from "~/utils/request";
import ModalSanPham from "./ModalSanPham";
import { DeleteOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { formatGiaTienVND } from "~/utils/formatResponse";
const { confirm } = Modal;
import { MdAddShoppingCart } from "react-icons/md";
import HinhAnhSanPham from "~/pages/shop/gio-hang/HinhAnhSanPham";

interface DataGioHang {
  key: React.Key;
  soLuong: number;
  nguoiTao: string;
  maHoaDon: string;
  chiTietSanPham: {
    sanPham: {
      ten: string;
    };
    kichCo: {
      kichCo: number;
    };
    mauSac: {
      ten: string;
    };
    diaHinhSan: {
      ten: string;
    };
    loaiDe: {
      ten: string;
    };
  };
}

interface TableSanPhamProps {
  id: number;
  passTotalPriceToParent: (price: number) => void;
}
const TableSanPham: React.FC<TableSanPhamProps> = ({
  id,
  passTotalPriceToParent,
}) => {
  const [dataGioHang, setDataGioHang] = useState<DataGioHang[]>([]); // Specify the data type
  const { confirm } = Modal;
  const [inputSoLuongList, setInputSoLuongList] = useState<Array<number>>([]);
  const { Text } = Typography;
  const [maxValueSL, setMaxValueSL] = useState(0);

  useEffect(() => {
    // Khởi tạo mảng inputSoLuongList với giá trị mặc định là 0 theo độ dài của dataGioHang
    setInputSoLuongList(new Array(dataGioHang.length).fill(0));
  }, [dataGioHang]);

  const tableGioHang: ColumnsType<DataGioHang> = [
    {
      title: "#",
      dataIndex: "rowIndex",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Thông tin sản phẩm",
      dataIndex: "chiTietSanPham",
      key: "ten",
      align: "left",
      render: (chiTietSanPham, record) => (
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
      title: "Số Lượng",
      dataIndex: "soLuong",
      width: 60,
      render: (text, record, index) => (
        <InputNumber
          min={1}
          max={record.soLuong + record.chiTietSanPham.soLuong}
          style={{ width: 60 }}
          value={inputSoLuongList[index] || record.soLuong}
          inputMode="numeric"
          onChange={(newSoLuong) => handleSoLuongChange(index, newSoLuong)}
        />
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "donGia",
      render: (text, record) => formatGiaTienVND(record.chiTietSanPham.giaTien),
    },
    {
      title: "Tổng tiền",
      dataIndex: "tongTien",
      render: (text, record) => formatGiaTienVND(record.tongTien),
    },
    {
      title: "Xóa",
      dataIndex: "",
      key: "",
      render: (item, record) => (
        <Button danger type="link" onClick={() => deleteHoaDonChiTiet(item.id)}>
          <Tooltip title="Xóa">
            <DeleteOutlined />
          </Tooltip>
        </Button>
      ),
    },
  ];

  const handleCapNhatGioHang = async (id, soLuong) => {
    console.log(soLuong);

    try {
      const response = await request.get(`/hoa-don-chi-tiet/so-luong/${id}`, {
        params: { soLuong: soLuong },
      });
      getDataGioHang();
      console.log(response.data);
    } catch (error: any) {
      // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi
      if (error.response.status == 400) {
        const inputString = error.response.data;
        const match = inputString.match(/\b\d+\b/);

        // Check if a match is found
        const maxValue = match ? match[0] : null;
        setMaxValueSL(maxValue);
      } else {
        console.error("Error updating cart:", error);
      }
      getDataGioHang();
    }
  };

  const handleSoLuongChange = (index, newSoLuong) => {
    const newSoLuongValue = typeof newSoLuong === "number" ? newSoLuong : 1;
    const productToUpdate = dataGioHang[index];

    if (productToUpdate) {
      const updatedData = [...dataGioHang];
      const updatedInputSoLuongList = [...inputSoLuongList];
      const updatedSoLuongTon = updatedData[index].chiTietSanPham.soLuong;

      updatedData[index] = {
        ...productToUpdate,
        soLuong: newSoLuongValue,
        tongTien: newSoLuongValue * productToUpdate.donGia,
      };
      updatedInputSoLuongList[index] = newSoLuongValue;
      handleCapNhatGioHang(productToUpdate.id, newSoLuongValue);

      setDataGioHang(updatedData);
      setInputSoLuongList(updatedInputSoLuongList);
    }
  };

  const passTotalPriceToParentCallback = (price) => {
    // Gọi hàm callback để truyền tổng tiền lên component cha
    passTotalPriceToParent(price);
  };

  // Thêm một useEffect để theo dõi sự thay đổi của dataGioHang và tính toán tổng tiền
  useEffect(() => {
    const total = dataGioHang.reduce((acc, item) => acc + item.tongTien, 0);
    passTotalPriceToParentCallback(total);
  }, [dataGioHang]);

  const deleteHoaDonChiTiet = async (idHoaDonChiTiet) => {
    confirm({
      title: "Xác Nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn xóa sản phẩm không?",
      okText: "OK",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await request.delete(`/hoa-don/${idHoaDonChiTiet}`);
          message.success("Đã xóa sản phẩm khỏi giỏ hàng");
          getDataGioHang();
        } catch (error) {
          console.error("Error deleting item:", error);
          // Handle errors, e.g., display an error message
        }
      },
    });
  };

  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const getImage = async (idSanPham, idMauSac) => {
    try {
      const response = await request.get("hinh-anh-san-pham", {
        params: { idSanPham: idSanPham, idMauSac: idMauSac },
      });
      const image = response.data[0];
      if (image && image.duongDan) {
        return image.duongDan;
      } else {
        console.error("Invalid image data:", image);
        return ""; // Or handle this case as needed
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const getDataGioHang = async () => {
    try {
      const response = await request.get(`hoa-don/${id}`);
      const gioHangData = await Promise.all(
        response.data.hoaDonChiTietList.map(async (item) => {
          const donGia = item.chiTietSanPham.giaTien;
          const tongTien = donGia * item.soLuong;
          const idMauSac = item.chiTietSanPham.mauSac.id;
          const idSanPham = item.chiTietSanPham.sanPham.id;
          const duongDan = await getImage(idSanPham, idMauSac);

          return { ...item, donGia, tongTien, idSanPham, idMauSac, duongDan };
        })
      );

      setDataGioHang(gioHangData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getDataGioHang();
  }, [id]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  return (
    <>
      <Table
        title={() => (
          <>
            <div style={{ fontWeight: "bold", fontSize: "18px" }}>Giỏ hàng</div>
            <Row>
              <Col span={10}></Col>
              <Col span={7}></Col>
              <Col span={7}>
                <Button
                  type="primary"
                  style={{ float: "right", marginBottom: 15 }}
                  onClick={showModal}
                >
                  <Space>Thêm Sản phẩm</Space>
                </Button>
              </Col>
            </Row>
            <ModalSanPham
              loadData={getDataGioHang}
              idHoaDon={id}
              isModalVisible={isModalVisible}
              setIsModalVisible={setIsModalVisible}
            />
          </>
        )}
        columns={tableGioHang}
        dataSource={dataGioHang}
      />
    </>
  );
};

export default TableSanPham;
