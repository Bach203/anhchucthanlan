import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
  SearchOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Skeleton,
  Space,
  Steps,
  Table,
  TablePaginationConfig,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  DataType as DataTypeHoaDon,
  UpdatedRequest,
  UpdateDiaChiHoaDon,
} from "~/interfaces/hoaDon.type";
import {
  DataType as DataTypeHoaDonChiTiet,
  DataParams,
} from "~/interfaces/hoaDonChiTiet.type";
import { DataTypeGiaoDich } from "~/interfaces/giaoDich.type";
import request from "~/utils/request";
const { confirm } = Modal;
const { Text, Title, Paragraph } = Typography;
import generatePDF, { Options } from "react-to-pdf";
import { ColumnsType } from "antd/es/table";
import axios from "axios";
import DiaChiComponent from "./diaChiModal";
// import HoaDonChiTietComponent from "./hoaDonChiTietModal";

import { FilterValue, SorterResult } from "antd/es/table/interface";
import ExportHoaDonPDF from "./exportHoaDonPDF";
import {
  formatGiaTien,
  formatGiaTienVND,
  formatNgayTao,
  formatSoLuong,
} from "~/utils/formatResponse";
import React from "react";
import { FaBoxOpen, FaShippingFast } from "react-icons/fa";
import ConfirmHoaDonComponent from "./ModalConfirm";
import dayjs from "dayjs";
import HinhAnhSanPham from "~/pages/shop/gio-hang/HinhAnhSanPham";
import ModalSanPham from "./ModalSanPham";

const optionPrintPDF: Options = {
  filename: "hoa-don.pdf",
  page: {
    margin: 20,
  },
};

interface Option {
  value?: number | null;
  label: React.ReactNode;
  children?: Option[];
  isLeaf?: boolean;
}

interface Item {
  title: String | null;
  subTitle: String | null;
  description: String | null;
  icon: React.ReactNode;
}

const containerStyle: React.CSSProperties = {
  width: "100%",
  height: 100,
  overflow: "auto",
  border: "1px solid #40a9ff",
};

const style: React.CSSProperties = {
  width: "100%",
  height: 1000,
};

const getTargetElement = () => document.getElementById("pdfReaderHoaDon");
const downloadPdf = () => generatePDF(getTargetElement, optionPrintPDF);

const detailHoaDon: React.FC = () => {
  const [updateRequest, setUpdateRequest] = useState(null);
  const [dataTableSanPham, setDataTableSanPham] = useState([]);
  const [edit, setEdit] = useState(false);
  const [titleStatus, setTitleStatus] = useState("");
  const [statusOrder, setStatusOrder] = useState(null);
  const [open, setOpen] = useState(false);
  const [itemTimeline, setItemTimeline] = useState<Item[]>([]);
  const [diaChiOpen, setDiaChiOpen] = useState(false);
  const [sanPhamOpen, setSanPhamOpen] = useState(false);
  const [hoaDonOpen, setHoaDonOpen] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [form] = Form.useForm();
  let { id } = useParams();
  const [data, setData] = useState<DataTypeHoaDon | null>(null);

  const [listHoaDonChiTiet, setListHoaDonChiTiet] = useState<
    DataTypeHoaDonChiTiet[]
  >([]);
  const [hoaDonChiTietList, setHoaDonChiTietList] = useState<
    DataTypeHoaDonChiTiet[]
  >([]);
  const [listGiaoDich, setListGiaoDich] = useState<DataTypeGiaoDich[]>([]);
  const [orderStatus, setOrderStatus] = useState(data?.trangThaiHoaDon);
  const [tongTien, setTongTien] = useState(0);
  const [tienShip, setTienShip] = useState(0);

  const columns: ColumnsType<DataTypeHoaDonChiTiet> = [
    {
      title: "STT",
      key: "index",
      align: "center",
      rowScope: "row",
      width: "5%",
      render: (_, __, index) => index + 1,
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
      title: "Đơn giá",
      dataIndex: "donGia",
      key: "donGia",
      align: "center",
      render: (donGia) => (
        <Text type="danger" style={{ fontWeight: "bold" }}>
          {formatGiaTien(donGia)}
        </Text>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "hoaDonChiTietItem",
      key: "hoaDonChiTietItem",
      align: "center",
      render: (text, record, index) =>
        edit === true ? (
          <InputNumber
            min={1}
            value={record.soLuong}
            inputMode="numeric"
            max={Number(
              getSoLuongById(record.id) + record.chiTietSanPham.soLuong
            )}
            onChange={(newSoLuong) => {
              handleSoLuongChange(index, newSoLuong, record);
            }}
          />
        ) : (
          <Text>{record.soLuong}</Text>
        ),
    },

    {
      title: "Thành tiền",
      dataIndex: "thanhTien",
      key: "thanhTien",
      align: "center",
      render: (_, record) => (
        <Text type="danger" style={{ fontWeight: "bold" }}>
          {formatGiaTien(record.donGia * record.soLuong)}
        </Text>
      ),
    },
    {
      title: "Xóa",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: "5%",
      render: (id) => (
        <Space>
          <Tooltip title="Xóa">
            <Button
              type="link"
              disabled={edit == false ? true : false}
              style={{ padding: 0 }}
            >
              <DeleteOutlined
                onClick={() => handleClickDelete(id)}
                style={{ color: edit === true ? "red" : "gray" }}
              />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const columnsGiaoDich: ColumnsType<DataTypeGiaoDich> = [
    {
      title: "Mã giao dịch",
      key: "maGiaoDich",
      dataIndex: "maGiaoDich",
      align: "center",
      width: "10%",
      rowScope: "row",
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "phuongThucThanhToan",
      key: "phuongThucThanhToan",
      align: "center",
      width: "20%",
      render: (phuongThucThanhToan, record) => (
        <Tag
          color={
            phuongThucThanhToan?.id == 3
              ? "warning"
              : phuongThucThanhToan?.id == 2
              ? "blue"
              : "default"
          }
        >
          {phuongThucThanhToan?.ten}
        </Tag>
      ),
    },
    {
      title: "Số tiền thanh toán",
      dataIndex: "soTienGiaoDich",
      key: "soTienGiaoDich",
      align: "center",
      width: "15%",
      render: (soTienGiaoDich) => {
        return formatGiaTienVND(soTienGiaoDich);
      },
    },
    {
      title: "Thời gian thanh toán",
      dataIndex: "ngayThanhToan",
      key: "ngayThanhToan",
      align: "center",
      width: "15%",
      render: (ngayThanhToan) =>
        ngayThanhToan
          ? dayjs(ngayThanhToan).format("HH:mm, DD/MM/YYYY")
          : "...",
    },

    {
      title: "Trạng thái ",
      dataIndex: "trangThaiGiaoDich",
      key: "trangThaiGiaoDich",
      align: "center",
      width: "20%",
      render: (trangThaiGiaoDich, record) => (
        <Tag color={trangThaiGiaoDich.mauSac}>{trangThaiGiaoDich.moTa}</Tag>
      ),
    },
  ];
  const [showExportButton, setShowExportButton] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [params, setParams] = useState<DataParams>({
    page: 1,
    pageSize: 10,
  });
  // API hóa đơn theo đối tượng
  const getParams = (params: DataParams) => ({
    page: listHoaDonChiTiet.length !== 0 ? params.page : 1,
    pageSize: params.pageSize,
    searchText: params.searchText,
    sortField: params.sortField,
    sortOrder: params.sortOrder,
  });
  const fetchHoaDonData = async () => {
    setLoadingTable(true);
    try {
      const res = await request.get("hoa-don/" + id, {
        params: {
          ...getParams(params),
        },
      });
      console.log(res.data);
      setData(res.data);
      setListGiaoDich(res.data.giaoDichList);
      setHoaDonChiTietList(res.data.hoaDonChiTietList);
      const dataT = res.data.hoaDonChiTietList.map((item: any) => ({
        ...item,
      }));
      setDataTableSanPham(dataT);
      form.setFieldsValue({
        ghiChu: res.data?.ghiChu,
        phiShip: res.data?.phiShip,
        diaChiNguoiNhan: res.data?.diaChiNguoiNhan,
        emailNguoiNhan: res.data?.emailNguoiNhan,
        nguoiNhan: res.data?.nguoiNhan,
        sdtNguoiNhan: res.data?.sdtNguoiNhan,
      });
      // setTotalElements(res.data?.hoaDonChiTietResponsePage.totalElements);
      // setData(res.data?.hoaDonResponse);
      setOrderStatus(res.data?.trangThaiHoaDon);
      // setDiaChiThongTin(res.data?.hoaDonResponse.diaChiNguoiNhan);
      // setphiShipThongTin(res.data?.hoaDonResponse.phiShip);
      // handleChagneImage(res.data?.hoaDonChiTietResponsePage.content);
      // setLoadingTable(false);
      // setTongTien(
      //   tongTien == 0
      //     ? res.data?.hoaDonResponse.tongTien
      //     : tinhTongTien(Number(tienShip))
      // );
      // setTienShip(res.data?.hoaDonResponse.phiShip);
    } catch (error) {
      console.log(error);
      setLoadingTable(false);
    }
  };

  const handleChagneImage = async (list: DataTypeHoaDonChiTiet[]) => {
    const sanPhamData = list;

    const imagePromises = sanPhamData.map((item) =>
      fetchImages(item.chiTietSanPham.sanPham.id, item.chiTietSanPham.mauSac.id)
    );

    const images = await Promise.all(imagePromises);

    const updatedSanPhamData = sanPhamData.map((item, index) => ({
      ...item,
      maMauSac: item.chiTietSanPham.mauSac.ma,
      soKichCo: item.chiTietSanPham.kichCo.kichCo,
      donGiaFromat: formatGiaTien(item.donGia),
      thanhTienFormat: formatGiaTien(
        Number(item.soLuong) * Number(item.donGia)
      ),
      tongTienSoLuong: Number(item.soLuong) * Number(item.donGia),
      hoaDonChiTietItem: item,
      images: images[index],
    }));
    setListHoaDonChiTiet(updatedSanPhamData);
  };

  const fetchDataTimeline = async () => {
    try {
      const timelineRes = await request.get("/timeline/" + id);
      const timelineItem1: Item[] = timelineRes.data.map((item: any) => ({
        title: item.trangThai.moTa,
        subTitle: formatNgayTao(item.ngayTao),
        description:
          (item.hoaDon.nguoiSua === null ? "" : item.hoaDon.nguoiSua) +
          "    " +
          (item.ghiChu === null ? "" : item.ghiChu),
        icon: handleIconTimeline(item.trangThai.ten),
      }));
      setItemTimeline(timelineItem1);
    } catch (error) {
      console.error(error);
    }
  };

  const handleIconTimeline = (value: string) => {
    switch (value) {
      case "PENDING":
        return <UserOutlined />;
      case "CANCELLED":
        return <SolutionOutlined />;
      case "APPROVED":
        return <CheckOutlined />;
      case "CONFIRMED":
        return <SolutionOutlined />;
      case "SHIPPING":
        return <FaShippingFast />;
      case "PICKUP":
        return <FaBoxOpen />;
      default:
        return null;
    }
  };
  const handleSearch = (value: string) => {
    setParams({
      ...params,
      searchText: value,
    });
    console.log(value);
  };
  const onChangeTable = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<DataTypeHoaDonChiTiet> | any
  ) => {
    filters;
    const page = pagination.current !== undefined ? pagination.current : 1;
    const pageSize =
      pagination.pageSize !== undefined ? pagination.pageSize : 10;
    setParams({
      ...params,
      page: page,
      pageSize: pageSize,
      sortField: sorter.field,
      sortOrder: sorter.order,
    });
  };
  // đóng mở modal địa chỉ hóa đơn
  const showDiaChiModal = () => {
    setDiaChiOpen(true);
  };
  const handleCancel = () => {
    setDiaChiOpen(false);
  };
  // đóng mở modal thêm sản phẩm
  const showSanPhamModal = () => {
    setSanPhamOpen(true);
  };
  const handleCancelSanPham = () => {
    setSanPhamOpen(false);
  };
  // đóng mở modal export hóa đơn
  const showExportHoaDonModal = () => {
    setHoaDonOpen(true);
  };
  const handleCancelExportHoaDon = () => {
    setHoaDonOpen(false);
  };
  // đóng mở confirm
  const showConfirmModal = async (statusOrder: any, titleStatus: string) => {
    setStatusOrder(statusOrder);
    setTitleStatus(titleStatus);
    const values = form.validateFields();
    setUpdateRequest(await values);
    setOpen(true);
  };
  const handleCancelConfirmModal = () => {
    setOpen(false);
  };
  // xử lý theo handle
  const deleteRequest = async (id: number) => {
    confirm({
      title: "Xác Nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc xóa sản phẩm này không?",
      okText: "OK",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const res = await request.delete(`hoa-don-chi-tiet/delete/${id}`);
          fetchHoaDonData();
          if (res.data) {
            message.success("Xóa sản phẩm thành công");
          } else {
            console.error("Phản hồi API không như mong đợi:", res);
          }
        } catch (error: any) {
          if (error.response && error.response.status === 400) {
            message.error(error.response.data.message);
          } else {
            console.error("Lỗi không xác định:", error);
            message.error("Xóa sản phẩm thất bại");
          }
        }
      },
    });
  };

  // lấy ảnh
  const fetchImages = async (idSanPham: number, idMauSac: number) => {
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

  const handleClickDelete = async (id: number) => {
    deleteRequest(id);
  };
  // load dữ liệu useEffect
  useEffect(() => {
    fetchHoaDonData();
    fetchDataTimeline();
    // console.log(tongTien + " | onupdate useEff");
  }, [tongTien]);
  // cập nhật hóa đơn

  const objectSanPham = (values: any) => {
    console.log(values);

    setDataTableSanPham((prevData) => {
      const existingItemIndex = prevData.findIndex(
        (item) => item.chiTietSanPham.id === values.id
      );

      if (existingItemIndex !== -1) {
        const newData = [...prevData];
        newData[existingItemIndex].soLuong += 1;
        return newData;
      }

      // If the item doesn't exist, add a new item with default properties
      const newData = [...prevData];
      newData.push({
        id: null,
        hoaDon: {
          id: id,
        },
        donGia: values.giaTien,
        soLuong: 1,
        chiTietSanPham: values,
        ghiChu: null,
        trangThaiHoaDonChiTiet: "APPROVED",
      });

      // Return the new array to update the state
      return newData;
    });

    console.log(dataTableSanPham);
  };
  const dataList = dataTableSanPham.map((item) => {
    return {
      id: item.id,
      hoaDon: { id: id },
      chiTietSanPham: { id: item.chiTietSanPham.id },
      soLuong: item.soLuong,
      donGia: item.donGia,
      trangThaiHoaDonChiTiet: "APPROVED",
    };
  });

  const onFinish = async (values: UpdatedRequest) => {
    const foundItemCOD = data?.giaoDichList.find(
      (item) => item.phuongThucThanhToan.ten === "COD"
    );
    const foundItemVNPay = data?.giaoDichList.find(
      (item) => item.phuongThucThanhToan.ten === "VNPay"
    );

    const tienUpdate = () => {
      return totalAmount - data?.giamGia + values.phiShip;
    };

    const tienMoi = () => {
      return tienUpdate() - data?.tongTienKhiGiam;
    };

    const tienGiaoDich =
      foundItemVNPay !== undefined
        ? tienUpdate() - foundItemVNPay.soTienGiaoDich
        : tienUpdate();

    confirm({
      title: "Xác Nhận",
      icon: <ExclamationCircleFilled />,
      content: (
        <>
          <Text>Bạn có chắc cập nhật hóa đơn này không?</Text>
          <Divider style={{ margin: 10 }} />
          <Text>
            Tổng tiền ban đầu: {formatGiaTienVND(data?.tongTienKhiGiam)}
          </Text>
          <br />
          <Text>Tổng tiền mới: {formatGiaTienVND(tienUpdate())}</Text>
          <br />
          <Text strong>
            Khách hàng phải thanh toán thêm:{" "}
            {formatGiaTienVND(tienUpdate() - data?.tongTienKhiGiam)}
          </Text>
        </>
      ),
      okText: "OK",
      cancelText: "Hủy",
      onOk: async () => {
        console.log(dataList);
        try {
          const res = await request.put(
            "hoa-don-chi-tiet/update-list",
            dataList
          );
          message.success("Thành côngggg");
          console.log(res.data);
        } catch (error) {
          console.error(error);
        }

        if (tienMoi() !== 0) {
          try {
            const res = await request.post("giao-dich", {
              id: foundItemCOD == undefined ? null : foundItemCOD.id,
              phuongThucThanhToan: { id: 3 },
              soTienGiaoDich: tienGiaoDich,
              hoaDon: {
                id: data?.id,
              },
              taiKhoan:
                data?.taiKhoan !== null
                  ? {
                      id: data?.taiKhoan.id,
                    }
                  : null,
              trangThaiGiaoDich: "PENDING",
            });
          } catch (error) {}
        }

        try {
          const res = await request.put("hoa-don/" + id, {
            diaChiNguoiNhan: values.diaChiNguoiNhan,
            emailNguoiNhan: values.emailNguoiNhan,
            nguoiNhan: values.nguoiNhan,
            sdtNguoiNhan: data?.sdtNguoiNhan,
            phiShip: Number(values.phiShip),
            tongTien: totalAmount,
            tongTienKhiGiam: tienUpdate(),
            ghiChu: values.ghiChu,
          });
          if (res.data) {
            fetchDataTimeline();
            message.success("Cập nhật hóa đơn thành công");
            setEdit(false);
            fetchHoaDonData();
            // navigate("/admin/hoa-don");
          } else {
            console.error("Phản hồi API không như mong đợi:", res);
          }
        } catch (error: any) {
          if (error.response && error.response.status === 400) {
            message.error(error.response.data.message);
          } else {
            console.error("Lỗi không xác định:", error);
            message.error("Cập nhật hóa đơn thất bại");
          }
        }
      },
    });
  };

  const onUpdateDiaChi = async (value: any) => {
    console.log(value);
    form.setFieldsValue({
      phiShip: value.phiShip,
      diaChiNguoiNhan: value.diaChi,
    });
    // fetchHoaDonData();
  };

  const handleUpdateSoLuongSanPham = async () => {
    try {
      await request.put(
        "hoa-don/hoa-don-chi-tiet/" + id,
        listHoaDonChiTiet?.map((item) => ({
          id: item.id,
          soLuong: item.soLuong,
        }))
      );
      fetchHoaDonData();
      message.success("Cập nhật giỏ hàng thành công");
    } catch (error) {
      message.error("Cập nhật giỏ hàng thất bại");
      console.log(error);
    }
  };

  // tính tổng tiền của hóa đơn đó cần trả
  const tinhTongTien = (tienShip: number) => {
    return (
      (listHoaDonChiTiet || [])
        .map((item) => ({
          ...item,
          thanhTien: Number(item.soLuong) * Number(item.donGia),
        }))
        .reduce((sum, item) => sum + item.thanhTien, 0) + tienShip
    );
  };
  // trạng thái của hóa đơn xử lý button
  const confirmedStatus = {
    ten: "CONFIRMED",
    moTa: "Đã xác nhận",
    mauSac: "success",
  };
  const shipingStatus = {
    ten: "SHIPPING",
    moTa: "Đang vận chuyển",
    mauSac: "geekblue",
  };
  const pickupStatus = {
    ten: "PICKUP",
    moTa: "Đang lấy hàng",
    mauSac: "info",
  };
  const cancelledStatus = {
    ten: "CANCELLED",
    moTa: "Đã hủy",
    mauSac: "volcano",
  };
  const approvedStatus = {
    ten: "APPROVED",
    moTa: "Đã hoàn thành",
    mauSac: "magenta",
  };
  // xử lý button xác nhận và vận chuyển
  const handleStatus = async (
    values: UpdatedRequest | null,
    status: any,
    title: string,
    ghiChuTimeLine: string
  ) => {
    setOrderStatus(status);
    console.log(status);

    if (status.ten === "CANCELLED") {
      try {
        const res = await request.get(`hoa-don/cancel/${id}`, {
          params: {
            ghiChu: ghiChuTimeLine,
          },
        });
        console.log(res.data);
        fetchDataTimeline();
        fetchHoaDonData();
        setOpen(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const res = await request.put("hoa-don/" + id, {
          trangThaiHoaDon: status.ten,
          ghiChuTimeLine: ghiChuTimeLine,
        });
        setLoadingForm(false);
        setTongTien(tinhTongTien(Number(tienShip)));
        fetchDataTimeline();
        fetchHoaDonData();
        setOpen(false);
        console.log(values);
        if (status.ten == "PENDING" && data?.loaiHoaDon.ten == "ONLINE") {
        }
        if (res.data) {
          message.success("Đã " + title + " hóa đơn thành công");
          if (status.ten == "PENDING" && data?.loaiHoaDon.ten == "ONLINE") {
            showExportHoaDonModal();
          }
        } else {
          console.error("Phản hồi API không như mong đợi:", res);
        }
      } catch (error: any) {
        if (error.response && error.response.status === 400) {
          message.error(error.response.data.message);
        } else {
          console.error("Lỗi không xác định:", error);
          message.error(title + " hóa đơn thất bại");
        }
      }
    }
  };
  function getSoLuongById(id) {
    const filteredData = hoaDonChiTietList.filter((item) => item.id === id);
    return filteredData.length > 0 ? filteredData[0].soLuong : 0;
  }

  const handleSoLuongChange = (index, newSoLuong, record) => {
    console.log(getSoLuongById(record.id));

    setDataTableSanPham((prevData) => {
      const newData = [...prevData];
      newData[index].soLuong = newSoLuong;
      return newData;
    });
  };
  const totalAmount = dataTableSanPham.reduce((acc, item) => {
    const itemPrice = item.donGia; // Unit price
    const itemQuantity = item.soLuong; // Quantity
    const itemTotalPrice = itemPrice * itemQuantity; // Total price for the item
    return acc + itemTotalPrice;
  }, 0);
  return (
    <>
      <Card title="Hóa đơn chi tiết">
        <Skeleton loading={loadingForm}>
          {/* <Form
            labelCol={{ span: 11 }}
            onFinish={onFinish}
            layout="horizontal"
            form={form}
          > */}

          <Card title="">
            <Row>
              <Col span={7}>
                <Divider>Thông tin đơn hàng</Divider>
                <Space direction="vertical" size="large">
                  <Space>
                    <Text strong>Mã hóa đơn:</Text>
                    <Paragraph copyable style={{ margin: 0 }}>
                      {data?.ma}
                    </Paragraph>
                  </Space>
                  {data?.taiKhoan == null ? (
                    <Space>
                      <Text strong>Khách hàng:</Text>
                      <Text>Khách hàng lẻ</Text>
                    </Space>
                  ) : (
                    <>
                      <Space>
                        <Text strong>Khách hàng:</Text>
                        <Text>{data?.taiKhoan?.hoVaTen}</Text>
                      </Space>
                      <Space>
                        <Text strong>Số điện thoại:</Text>
                        <Text>{data?.taiKhoan?.soDienThoai}</Text>
                      </Space>
                      <Space>
                        <Text strong>E-mail:</Text>
                        <Text>{data?.taiKhoan?.email}</Text>
                      </Space>
                    </>
                  )}

                  <Space>
                    <Text strong>Loại hóa đơn:</Text>
                    <Tag color={data?.loaiHoaDon?.mauSac}>
                      {data?.loaiHoaDon.moTa}
                    </Tag>
                  </Space>
                  <Space>
                    <Text strong>Trạng thái hóa đơn:</Text>
                    <Tag color={data?.trangThaiHoaDon?.mauSac}>
                      {data?.trangThaiHoaDon?.moTa}
                    </Tag>
                  </Space>

                  <Space>
                    <Text strong>Tổng tiền sản phẩm:</Text>
                    <Text>{formatGiaTienVND(data?.tongTien)}</Text>
                  </Space>
                  <Space>
                    <Text strong>Giảm giá:</Text>
                    <Text>{formatGiaTienVND(data?.giamGia)}</Text>
                  </Space>
                  <Space>
                    <Text strong>Tổng tiền đơn hàng:</Text>
                    <Text>{formatGiaTienVND(data?.tongTienKhiGiam)}</Text>
                  </Space>
                  {edit == false && (
                    <Space>
                      {orderStatus?.ten === "PENDING" &&
                        data?.loaiHoaDon?.ten === "ONLINE" && (
                          <Button
                            type="primary"
                            onClick={async () => {
                              showConfirmModal(confirmedStatus, "Xác nhận");
                            }}
                          >
                            Xác nhận
                          </Button>
                        )}

                      {((orderStatus?.ten === "PENDING" &&
                        data?.loaiHoaDon?.ten === "COUNTER") ||
                        (orderStatus?.ten === "CONFIRMED" &&
                          data?.loaiHoaDon?.ten === "COUNTER") ||
                        (orderStatus?.ten === "PENDING" &&
                          data?.loaiHoaDon?.ten === "ONLINE") ||
                        (orderStatus?.ten === "PICKUP" &&
                          data?.loaiHoaDon?.ten === "ONLINE")) && (
                        <Button
                          type="primary"
                          danger
                          onClick={async () => {
                            showConfirmModal(cancelledStatus, "Hủy");
                          }}
                        >
                          Hủy
                        </Button>
                      )}
                      {orderStatus?.ten === "PICKUP" && (
                        <Button
                          type="primary"
                          onClick={async () => {
                            showConfirmModal(shipingStatus, "Giao hàng");
                          }}
                        >
                          Giao hàng
                        </Button>
                      )}
                      {((orderStatus?.ten === "CONFIRMED" &&
                        data?.loaiHoaDon?.ten === "COUNTER") ||
                        (orderStatus?.ten === "SHIPPING" &&
                          data?.loaiHoaDon?.ten === "ONLINE")) && (
                        <Button
                          type="primary"
                          onClick={async () => {
                            showConfirmModal(approvedStatus, "Hoàn thành");
                          }}
                        >
                          Hoàn thành
                        </Button>
                      )}
                    </Space>
                  )}
                </Space>
              </Col>
              <Col span={8}>
                {data?.loaiHoaDon?.ten == "ONLINE" && (
                  <>
                    <Divider>Thông tin nhận hàng</Divider>

                    <Form form={form} onFinish={onFinish} style={{ top: 0 }}>
                      <Form.Item label={<Text strong>Người nhận</Text>}>
                        {edit == true ? (
                          <Form.Item
                            name="nguoiNhan"
                            style={{ margin: 0 }}
                            rules={[
                              {
                                whitespace: true,
                                required: true,
                                message: "Vui lòng nhập người nhận!",
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                        ) : (
                          <Text>{data?.nguoiNhan}</Text>
                        )}
                      </Form.Item>

                      <Form.Item label={<Text strong>Số điện thoại</Text>}>
                        {edit == true ? (
                          <Form.Item
                            name="sdtNguoiNhan"
                            style={{ margin: 0 }}
                            rules={[
                              {
                                whitespace: true,
                                required: true,
                                message: "Vui lòng nhập người nhận!",
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                        ) : (
                          <Text>{data?.sdtNguoiNhan}</Text>
                        )}
                      </Form.Item>

                      <Form.Item label={<Text strong>E-mail</Text>}>
                        {edit == true ? (
                          <Form.Item
                            name="emailNguoiNhan"
                            style={{ margin: 0 }}
                            rules={[
                              {
                                whitespace: true,
                                required: true,
                                message: "Vui lòng nhập người nhận!",
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                        ) : (
                          <Text>{data?.emailNguoiNhan}</Text>
                        )}
                      </Form.Item>

                      <Form.Item label={<Text strong>Ghi chú đơn hàng</Text>}>
                        {edit == true ? (
                          <Form.Item name="ghiChu" style={{ margin: 0 }}>
                            <Input />
                          </Form.Item>
                        ) : (
                          <Text>{data?.ghiChu}</Text>
                        )}
                      </Form.Item>

                      <Form.Item label={<Text strong>Phí ship</Text>}>
                        {edit == true ? (
                          <Form.Item
                            name="phiShip"
                            style={{ margin: 0 }}
                            // rules={[
                            //   {
                            //     required: true,
                            //     message: "Vui lòng nhập người nhận!",
                            //   },
                            // ]}
                          >
                            <InputNumber
                              defaultValue={0}
                              style={{ width: "100%" }}
                              min={0}
                              step={10000}
                              formatter={(value) =>
                                `${formatGiaTienVND(value)}`
                              }
                              parser={(value: any) => value.replace(/\D/g, "")}
                            />
                          </Form.Item>
                        ) : (
                          <Text>{formatGiaTienVND(data?.phiShip)}</Text>
                        )}
                      </Form.Item>
                      <Form.Item
                        name="diaChiNguoiNhan"
                        label={
                          <Space>
                            {edit == true ? (
                              <Tooltip title="Chỉnh sửa">
                                <Button
                                  onClick={() => setDiaChiOpen(true)}
                                  type="link"
                                  style={{ margin: 0, padding: 0 }}
                                >
                                  <EditOutlined />
                                </Button>
                              </Tooltip>
                            ) : null}

                            <Text strong>Địa chỉ</Text>
                          </Space>
                        }
                      >
                        <Text>
                          {edit == true
                            ? form.getFieldValue("diaChiNguoiNhan")
                            : data?.diaChiNguoiNhan}
                        </Text>
                      </Form.Item>

                      {data?.trangThaiHoaDon.ten == "PENDING" && (
                        <Form.Item>
                          <Space>
                            {edit == true ? (
                              <>
                                <Button
                                  danger
                                  htmlType="button"
                                  onClick={() => {
                                    setEdit(false);
                                    fetchHoaDonData();
                                  }}
                                >
                                  Hủy chỉnh sửa
                                </Button>
                                <Button
                                  type="primary"
                                  style={{ background: "green" }}
                                  htmlType="submit"
                                >
                                  Hoàn tất
                                </Button>
                              </>
                            ) : (
                              <Button
                                icon={<EditOutlined />}
                                type="primary"
                                onClick={() => setEdit(true)}
                              >
                                Chỉnh sửa
                              </Button>
                            )}
                          </Space>
                        </Form.Item>
                      )}
                    </Form>
                  </>
                )}
              </Col>
              <Col span={1}></Col>
              <Col span={8}>
                <Divider>Timeline đơn hàng</Divider>
                <Steps
                  direction="vertical"
                  size="default"
                  current={itemTimeline.length}
                  style={{ width: 400 }}
                  items={itemTimeline}
                />
              </Col>
            </Row>
          </Card>
          <Card title={`Giao Dịch Thanh Toán`}>
            <Table<DataTypeGiaoDich>
              pagination={false}
              columns={columnsGiaoDich as ColumnsType<DataTypeGiaoDich>}
              dataSource={listGiaoDich}
              showSorterTooltip={false}
            />
          </Card>
          <Card>
            <Row>
              <Space direction="horizontal">
                <h3 style={{ width: "200px" }}>Danh sách sản phẩm</h3>
                {/* {((orderStatus?.ten === "PENDING" &&
                  data?.loaiHoaDon?.ten === "COUNTER") ||
                  (orderStatus?.ten === "CONFIRMED" &&
                    data?.loaiHoaDon?.ten === "COUNTER") ||
                  (orderStatus?.ten === "PENDING" &&
                    data?.loaiHoaDon?.ten === "ONLINE")) && (
                  <Button onClick={handleUpdateSoLuongSanPham}>
                    Cập nhật lại giỏ hàng
                  </Button>
                )} */}
                {edit == true && (
                  <Button
                    onClick={showSanPhamModal}
                    type="dashed"
                    icon={<PlusOutlined />}
                  >
                    Thêm sản phẩm
                  </Button>
                )}
              </Space>
            </Row>
            <Table
              pagination={{
                showSizeChanger: true,
                total: totalElements,
              }}
              columns={columns}
              dataSource={dataTableSanPham}
              onChange={onChangeTable}
              // loading={loadingTable}
              showSorterTooltip={false}
              footer={() => (
                <Space style={{ marginLeft: 900 }}>
                  <Text strong>Tổng tiền:</Text>
                  <Text style={{ fontWeight: "bold" }} type="danger">
                    {formatGiaTienVND(totalAmount)}
                  </Text>
                </Space>
              )}
            />
          </Card>
          {/* </Form> */}
        </Skeleton>
      </Card>
      {/* Chỗ để modal */}
      <DiaChiComponent
        open={diaChiOpen}
        onUpdate={onUpdateDiaChi}
        onCancel={handleCancel}
      />
      <ModalSanPham
        isModalVisible={sanPhamOpen}
        setIsModalVisible={setSanPhamOpen}
        idHoaDon={Number(id)}
        loadData={fetchHoaDonData}
        objectSanPham={objectSanPham}
      />
      <ExportHoaDonPDF
        open={hoaDonOpen}
        onCancel={handleCancelExportHoaDon}
        id={Number(id)}
      />
      <ConfirmHoaDonComponent
        open={open}
        onCancel={handleCancelConfirmModal}
        onUpdate={handleStatus}
        status={statusOrder}
        titleStatus={titleStatus}
        updateRequest={updateRequest}
      />
    </>
  );
};

export default detailHoaDon;
