import { ExclamationCircleFilled, ReloadOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  ColorPicker,
  Input,
  Modal,
  Row,
  Select,
  Slider,
  Table,
  Typography,
  message,
} from "antd";
import { Option } from "antd/es/mentions";
import React, { useState, useEffect } from "react";
import { FaCartPlus } from "react-icons/fa";
import request, { request4s } from "~/utils/request";

const { confirm } = Modal;
const { Text } = Typography;

interface ModalSanPhamProps {
  isModalVisible: boolean;
  setIsModalVisible: (value: boolean) => void;
  idHoaDon: number;
  loadData: () => void;
  objectSanPham: (values: any) => void;
}

const ModalSanPham: React.FC<ModalSanPhamProps> = ({
  isModalVisible,
  setIsModalVisible,
  idHoaDon,
  loadData,
  objectSanPham,
}) => {
  const [dataSanPham, setDataSanPham] = useState([]);
  const [loaiDeOptions, setLoaiDeOptions] = useState([]);
  const [mauSacOptions, setMauSacOptions] = useState([]);
  const [kichCoOptions, setKichCoOptions] = useState([]);
  const [diaHinhSanOptions, setDiaHinhSanOptions] = useState([]);
  const [thuongHieuOptions, setThuongHieuOptions] = useState([]);
  const [totalElements, setTotalElements] = useState(0);

  // Thêm state để lưu trạng thái của các phần tử
  const [productNameFilter, setProductNameFilter] = useState("");
  const [giaTienRange, setGiaTienRange] = useState([0, 100000000000]);
  const [selectedLoaiDe, setSelectedLoaiDe] = useState(undefined);
  const [selectedMauSac, setSelectedMauSac] = useState(undefined);
  const [selectedKichCo, setSelectedKichCo] = useState(undefined);
  const [selectedDiaHinhSan, setSelectedDiaHinhSan] = useState(undefined);
  const [selectedThuongHieu, setSelectedThuongHieu] = useState(undefined);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const columns = [
    {
      title: "#",
      dataIndex: "rowIndex",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Hình ảnh",
      dataIndex: "hinhAnh",
      key: "moTa",
      render: (item, record) => {
        const images = record.images;

        if (!images || images.length === 0) {
          return "Chưa có ảnh";
        }

        const firstImage = images[0];

        return (
          <img
            src={`http://localhost:8081/admin/api/file/view/${firstImage.duongDan}`}
            alt="Hình ảnh"
            style={{ maxWidth: "100px" }}
          />
        );
      },
    },
    {
      title: "Sản phẩm",
      dataIndex: "sanPham",
      key: "ten",
      render: (item, record) => {
        return (
          item.ten +
          " / " +
          " [" +
          record.mauSac.ten +
          " - " +
          record.kichCo.kichCo +
          "]"
        );
      },
    },
    {
      title: "Số lượng",
      dataIndex: "soLuong",
      key: "moTa",
      render: (item, record) => {
        return record.soLuong;
      },
    },
    {
      title: "Giá tiền",
      dataIndex: "giaTien",
      key: "moTa",
      render: (item, record) => {
        // Định dạng giá tiền theo định dạng tiền tệ của Việt Nam
        const formattedPrice = new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(record.giaTien);

        return formattedPrice;
      },
    },
    {
      title: "Loại đế",
      dataIndex: "loaiDe",
      key: "loaiDe",
      render: (item, record) => {
        return record.loaiDe.ten;
      },
    },
    {
      title: "Địa hình sân",
      dataIndex: "diaHinhSan",
      key: "diaHinhSan",
      render: (item, record) => {
        return record.diaHinhSan.ten;
      },
    },
    {
      title: "Hành động",
      dataIndex: "",
      key: "",
      render: (item, record) =>
        record.soLuong === 0 ? (
          <Text strong type="danger">
            Hết hàng
          </Text>
        ) : (
          <Button
            type="primary"
            style={{ background: "green" }}
            onClick={() => handleChonSanPham(record)}
          >
            <FaCartPlus />
          </Button>
        ),
    },
  ];

  const handleChonSanPham = async (record) => {
    // console.log(record);
    objectSanPham(record);
    setIsModalVisible(false);
    // confirm({
    //   title: "Xác Nhận",
    //   icon: <ExclamationCircleFilled />,
    //   content: "Bạn có chắc muốn thêm sản phẩm không?",
    //   okText: "OK",
    //   cancelText: "Hủy",
    //   onOk: async () => {
    //     try {
    //       // Make an API call to add the product to the invoice
    //       const response = await request4s.post(
    //         `hoa-don/add-san-pham/${idHoaDon}`,
    //         {
    //           chiTietSanPham: {
    //             id: idHoaDonChiTiet,
    //           },
    //           soLuong: 1,
    //           trangThaiHoaDonChiTiet: "APPROVED",
    //           donGia: donGia,
    //         }
    //       );
    //       loadData();
    //       message.success("Thêm sản phẩm vào giỏ hàng thành công !");
    //       setIsModalVisible(false);
    //     } catch (error) {
    //       console.error("Error adding product to invoice:", error);
    //       // Handle errors, e.g., display an error message
    //     }
    //   },
    // });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const fetchImages = async (idSanPham, idMauSac) => {
    try {
      const response = await request.get("hinh-anh-san-pham", {
        params: { idSanPham: idSanPham, idMauSac: idMauSac },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching images:", error);
      return [];
    }
  };

  const resetFilter = () => {
    // Đặt lại giá trị của các state về mặc định
    setProductNameFilter("");
    setGiaTienRange([0, 1000000000000]);
    setSelectedLoaiDe(undefined);
    setSelectedMauSac(undefined);
    setSelectedKichCo(undefined);
    setSelectedDiaHinhSan(undefined);
    setSelectedThuongHieu(undefined);
  };

  useEffect(() => {
    if (isModalVisible) {
      // Call API LoaiDe
      request.get("loai-de/list").then((response) => {
        setLoaiDeOptions(response.data);
      });
      // Call API MauSac
      request.get("mau-sac/list").then((response) => {
        setMauSacOptions(response.data);
      });
      // Call API KichCo
      request.get("kich-co/list").then((response) => {
        setKichCoOptions(response.data);
      });
      // Call API DiaHinhSan
      request.get("dia-hinh-san/list").then((response) => {
        setDiaHinhSanOptions(response.data);
      });
      // Call API ThuongHieu
      request.get("thuong-hieu/list").then((response) => {
        setThuongHieuOptions(response.data);
      });

      handleFilterChange();
    }
  }, [
    isModalVisible,
    page,
    pageSize,
    productNameFilter,
    giaTienRange,
    selectedLoaiDe,
    selectedMauSac,
    selectedKichCo,
    selectedDiaHinhSan,
    selectedThuongHieu,
  ]);

  const handleFilterChange = () => {
    // Thực hiện gọi lại API và cập nhật dữ liệu dựa trên các giá trị filter hiện tại
    request
      .get("/chi-tiet-san-pham/filter-page", {
        params: {
          page,
          pageSize,
          searchText: productNameFilter,
          min: giaTienRange[0],
          max: giaTienRange[1],
          idLoaiDe: selectedLoaiDe,
          idMauSac: selectedMauSac,
          idKichCo: selectedKichCo,
          idDiaHinhSan: selectedDiaHinhSan,
          idThuongHieu: selectedThuongHieu,
        },
      })
      .then(async (response) => {
        const sanPhamData = response.data.content;

        // Fetch images for all sanPham in parallel
        const imagePromises = sanPhamData.map((item) =>
          fetchImages(item.sanPham.id, item.mauSac.id)
        );

        const images = await Promise.all(imagePromises);

        const updatedSanPhamData = sanPhamData.map((sanPham, index) => ({
          ...sanPham,
          images: images[index],
        }));
        setDataSanPham(updatedSanPhamData);
        setTotalElements(response.data.totalElements);
      });
  };

  return (
    <>
      <Modal
        style={{ top: 0 }}
        width={1050}
        title="Danh sách Sản phẩm"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Row style={{ marginBottom: 10, marginLeft: 50 }}>
          <Col span={10} style={{ marginRight: 70 }}>
            <span>Sản phẩm: </span>
            <Input
              allowClear
              placeholder="Mã, Tên sản phẩm"
              value={productNameFilter}
              onChange={(e) => setProductNameFilter(e.target.value)} // Cập nhật giá trị vào state
            />
          </Col>
          <Col span={8}>
            <span>Giá tiền: </span>
            <Slider
              range
              min={0}
              max={10000000}
              step={100000}
              value={giaTienRange} // Sử dụng giá trị từ state
              onChange={(value) => setGiaTienRange(value)} // Cập nhật giá trị vào state
              tipFormatter={(value) => `${value.toLocaleString("vi-VN")} VND`}
            />
          </Col>
        </Row>
        <Row style={{ marginBottom: 50, marginLeft: 50 }}>
          <Col span={4} style={{ marginRight: 15 }}>
            <span>Loại đế: </span>
            <Select
              allowClear
              placeholder="Chọn Loại đế"
              style={{ width: "100%" }}
              value={selectedLoaiDe}
              onChange={(value) => setSelectedLoaiDe(value)}
            >
              {loaiDeOptions.map((option) => (
                <Option key={option.id} value={option.id}>
                  {option.ten}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={4} style={{ marginRight: 15 }}>
            <span>Màu sắc: </span>
            <Select
              allowClear
              placeholder="Chọn Màu sắc"
              style={{ width: "100%" }}
              value={selectedMauSac}
              onChange={(value) => setSelectedMauSac(value)}
            >
              {mauSacOptions.map((option) => (
                <Option key={option.id} value={option.id}>
                  <ColorPicker
                    value={option.ma}
                    size="small"
                    disabled
                    style={{ margin: 5 }}
                  />
                  {option.ten}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={4} style={{ marginRight: 15 }}>
            <span>Kích cỡ: </span>
            <Select
              allowClear
              placeholder="Chọn Kích cỡ"
              style={{ width: "100%" }}
              value={selectedKichCo}
              onChange={(value) => setSelectedKichCo(value)}
            >
              {kichCoOptions.map((option) => (
                <Option key={option.id} value={option.id}>
                  {option.kichCo}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={4} style={{ marginRight: 15 }}>
            <span>Địa hình sân: </span>
            <Select
              allowClear
              placeholder="Chọn Địa hình sân"
              style={{ width: "100%", marginRight: 10 }}
              value={selectedDiaHinhSan}
              onChange={(value) => setSelectedDiaHinhSan(value)}
            >
              {diaHinhSanOptions.map((option) => (
                <Option key={option.id} value={option.id}>
                  {option.ten}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <span>Thương hiệu: </span>
            <Select
              allowClear
              placeholder="Chọn Thương hiệu"
              style={{ width: "100%", marginRight: 10 }}
              value={selectedThuongHieu}
              onChange={(value) => setSelectedThuongHieu(value)}
            >
              {thuongHieuOptions.map((option) => (
                <Option key={option.id} value={option.id}>
                  {option.ten}
                </Option>
              ))}
            </Select>
          </Col>
          <Row style={{ marginTop: 30, marginLeft: 700 }}>
            <Col>
              <Button
                type="primary"
                style={{ backgroundColor: "red" }}
                icon={<ReloadOutlined />}
                onClick={resetFilter}
              >
                Làm mới bộ lọc
              </Button>
            </Col>
          </Row>
        </Row>
        <Table
          dataSource={dataSanPham}
          columns={columns}
          pagination={{
            total: totalElements,
            showSizeChanger: true,
            onChange(page, pageSize) {
              setPage(page), setPageSize(pageSize);
            },
          }}
        />
      </Modal>
    </>
  );
};

export default ModalSanPham;
