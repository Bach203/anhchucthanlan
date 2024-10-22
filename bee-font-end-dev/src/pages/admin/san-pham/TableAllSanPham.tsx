import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Divider,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Slider,
  Space,
  Table,
  Tooltip,
  message,
} from "antd";
import { formatGiaTienVND, formatSoLuong } from "~/utils/formatResponse";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  PictureOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import request, { request4s } from "~/utils/request";
import ModalKichCo from "./ModalKichCo";
import { ColumnsType } from "antd/es/table";
import HinhAnhModal from "./HinhAnhModal";
import { DataTypeCTSP } from "~/interfaces/ctsp.type";
import ModalAddMauSac from "./ModalAddMauSac";

function TableAllSanpham({ idSanPham, loadData }) {
  const [openModal, setOpenModal] = useState(false);
  const [openModalMauSac, setOpenModalMauSac] = useState(false);
  const [dataChiTietSanPham, setDataChiTietSanPham] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [dataFake, setDataFake] = useState<DataTypeCTSP[]>([]);
  const [dataKichCo, setDataKichCo] = useState([]);
  const [dataMauSacFull, setDataMauSacFull] = useState([]);
  const [dataLoaiDe, setDataLoaiDe] = useState([]);
  const [dataDiaHinhSan, setDataDiaHinhSan] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [idMauSac, setIdMauSac] = useState();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState();
  const [giaTienRange, setGiaTienRange] = useState([0, 9999999]);
  const [selectedLoaiDe, setSelectedLoaiDe] = useState(null);
  const [selectedMauSac, setSelectedMauSac] = useState(null);
  const [selectedKichCo, setSelectedKichCo] = useState(null);
  const [selectedDiaHinhSan, setSelectedDiaHinhSan] = useState(null);
  const { confirm } = Modal;
  useEffect(() => {
    getDataMauSacFull();
    getDataChiTietSanPham();
    getDataKichCo();
    getDataLoaiDe();
    getDataDiaHinhSan();
  }, []);
  useEffect(() => {
    getDataChiTietSanPham();
  }, [
    page,
    pageSize,
    selectedMauSac,
    selectedKichCo,
    selectedLoaiDe,
    selectedDiaHinhSan,
    giaTienRange,
  ]);

  useEffect(() => {}, [idMauSac]);
  const getDataMauSacFull = async () => {
    try {
      const res = await request.get(`mau-sac/detail/${idSanPham}`);
      setDataMauSacFull(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getDataChiTietSanPham = async () => {
    try {
      const res = await request.get("chi-tiet-san-pham/list-page", {
        params: {
          page: page,
          pageSize: pageSize,
          idSanPham: idSanPham,
          idMauSac: selectedMauSac,
          idKichCo: selectedKichCo,
          idLoaiDe: selectedLoaiDe,
          idDiaHinhSan: selectedDiaHinhSan,
          minGiaTien: giaTienRange[0],
          maxGiaTien: giaTienRange[1],
        },
      });
      console.log(selectedKichCo);

      console.log(res.data);
      setTotalElements(res.data.totalElements);
      setDataChiTietSanPham(res.data.content);
    } catch (error) {
      console.log(error);
    }
  };

  const getDataKichCo = async () => {
    try {
      const res = await request4s.get(`kich-co/detail/${idSanPham}`);
      setDataKichCo(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getDataLoaiDe = async () => {
    try {
      const res = await request4s.get(`loai-de/detail/${idSanPham}`);
      setDataLoaiDe(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getDataDiaHinhSan = async () => {
    try {
      const res = await request4s.get(`dia-hinh-san/detail/${idSanPham}`);
      setDataDiaHinhSan(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteItem = async (id: number) => {
    confirm({
      title: "Xác Nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn xóa sản phẩm này không?",
      okText: "OK",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await request.put(`chi-tiet-san-pham/update-status/${id}`);
          getDataChiTietSanPham();
          loadData();
          message.success("Xóa thành công");
        } catch (error) {
          message.error("Xóa thất bại");
          console.log(error);
        }
      },
    });
  };
  const colums: ColumnsType<any> = [
    {
      title: "STT",
      rowScope: "row",
      width: "10%",
      render: (text, record, index) => index + 1 + pageSize * (page - 1),
    },
    {
      title: "Màu sắc",
      align: "center",
      dataIndex: "mauSac",
      render: (mauSac) => mauSac.ten,
    },

    {
      title: "Kích Cỡ",
      align: "center",
      dataIndex: "kichCo",
      render: (kichCo) => kichCo.kichCo,
      sorter: (a, b) => {
        const kichCoA = parseFloat(a.kichCo.kichCo);
        const kichCoB = parseFloat(b.kichCo.kichCo);
        return kichCoA - kichCoB;
      },
    },
    {
      title: "Số lượng",
      dataIndex: "soLuong",
      width: "250px",
      render: (soLuong, record) => {
        if (selectedRowKeys.includes(record.key)) {
          return (
            <InputNumber
              value={soLuong} // Make sure this is the correct value from your data
              min={1}
              style={{ width: "100%" }}
              formatter={(value) => formatSoLuong(value)}
              parser={(value: any) => value.replace(/,/g, "")}
              onChange={(newSoLuong) => editSoLuong(record.key, newSoLuong)}
            />
          );
        } else {
          return (
            <span style={{ marginLeft: 12 }}>{formatSoLuong(soLuong)}</span>
          );
        }
      },
    },
    {
      title: "Giá tiền",
      dataIndex: "giaTien",
      width: "250px",
      render: (giaTien, record) => {
        if (selectedRowKeys.includes(record.key)) {
          return (
            <InputNumber
              value={giaTien}
              style={{ width: "100%" }}
              min={1000}
              step={10000}
              formatter={(value) => `${formatGiaTienVND(value)}`}
              parser={(value: any) => value.replace(/\D/g, "")}
              onChange={(newSoLuong) => editGiaTien(record.key, newSoLuong)}
            />
          );
        } else {
          return (
            <span style={{ marginLeft: 12 }}>{formatGiaTienVND(giaTien)}</span>
          );
        }
      },
    },
    {
      dataIndex: "id",
      align: "center",
      width: "1px",
      render: (id, record) => (
        <Button type="link" style={{ padding: 0 }}>
          <Tooltip title="Xóa">
            <DeleteOutlined
              style={{ color: "red" }}
              onClick={() => deleteItem(id)}
            />
          </Tooltip>
        </Button>
      ),
    },
  ];

  return (
    <>
      <br />
      <br />
      <Space>
        <Select
          style={{ width: 200 }}
          placeholder="Chọn màu sắc"
          allowClear
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input)
          }
          options={dataMauSacFull.map((values: DataTypeTH) => ({
            label: values.ten,
            value: values.id,
          }))}
          onChange={(value) => setSelectedMauSac(value)}
        />
        <Select
          style={{ width: 200 }}
          placeholder="Chọn kích cỡ"
          allowClear
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input)
          }
          options={dataKichCo.map((values: DataTypeTH) => ({
            label: values.kichCo,
            value: values.id,
          }))}
          onChange={(value) => setSelectedKichCo(value)}
        />
        <Select
          style={{ width: 200 }}
          placeholder="Chọn loại đế"
          allowClear
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input)
          }
          options={dataLoaiDe.map((values: DataTypeTH) => ({
            label: values.ten,
            value: values.id,
          }))}
          onChange={(value) => setSelectedLoaiDe(value)}
        />
        <Select
          style={{ width: 200 }}
          placeholder="Chọn Địa Hình Sân"
          allowClear
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input)
          }
          options={dataDiaHinhSan.map((values: DataTypeTH) => ({
            label: values.ten,
            value: values.id,
          }))}
          onChange={(value) => setSelectedDiaHinhSan(value)}
        />
        <span>Giá tiền: </span>
        <Slider
          style={{ width: "300px" }}
          range
          min={0}
          max={9999999}
          step={1000}
          value={giaTienRange} // Sử dụng giá trị từ state
          onChange={(value) => setGiaTienRange(value)} // Cập nhật giá trị vào state
          tooltip={{
            formatter: (value) => `${value.toLocaleString("vi-VN")} đ`,
          }}
        />
      </Space>
      <Divider />
      <Table
        showSorterTooltip={false}
        pagination={{
          total: totalElements,
          showSizeChanger: true,
          current: page,
          pageSize: pageSize,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
        }}
        dataSource={dataChiTietSanPham}
        columns={colums}
      />
    </>
  );
}

export default TableAllSanpham;
