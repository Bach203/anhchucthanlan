import {
  FilterFilled,
  ManOutlined,
  SearchOutlined,
  UnorderedListOutlined,
  UserOutlined,
  WomanOutlined,
} from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  DatePicker,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { DataType } from "~/interfaces/khachHang.type";
import { DataParams, TableParams } from "~/interfaces/nhanVien.type";
import { formatNgaySinh, formatPhoneNumber } from "~/utils/formatResponse";
import request from "~/utils/request";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
const { Text, Link } = Typography;

export function ModalKhachHang({ openModal, closeModal, listKhachHang, list }) {
  const [data, setData] = useState<DataType[]>([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [listGioiTinh, setListGioiTinh] = useState();
  const [params, setParams] = useState<DataParams>({
    page: 1,
    pageSize: 5,
  });

  const getParams = (params: TableParams) => ({
    currentPage: data.length !== 0 ? params.pagination?.current : 1,
    pageSize: params.pagination?.pageSize,
    searchText: params.searchText,
    trangThai: params.trangThai,
    gioiTinh: params.gioiTinh,
    sortField: params.sortField,
    sortOrder: params.sortOrder,
    gioiTinhList: params.filters?.gioiTinh,
    ngaySinhStart: params.ngaySinhStart,
    ngaySinhEnd: params.ngaySinhEnd,
  });

  const handleChange = (value: string) => {
    setParams({
      ...params,
      gioiTinh: value,
    });
  };
  const handleSearch = (value: string) => {
    setParams({
      ...params,
      searchText: value,
    });
    console.log(value);
  };
  const dateRange = (values: [string]) => {
    if (values && values.length > 0) {
      setParams({
        ...params,
        ngaySinhStart: values[0]?.format("YYYY-MM-DD"),
        ngaySinhEnd: values[1]?.format("YYYY-MM-DD"),
      });
    } else {
      setParams({
        ...params,
        ngaySinhStart: null,
        ngaySinhEnd: null,
      });
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "STT",
      key: "id",

      dataIndex: "id",
      align: "center",
      rowScope: "row",
      width: 60,
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Ảnh",
      key: "stt",
      fixed: "left",
      align: "center",
      width: 80,
      render: () => (
        <Avatar src="" shape="square" size="large" icon={<UserOutlined />} />
      ),
    },
    {
      title: "Họ và Tên",
      dataIndex: "hoVaTen",
      key: "hoVaTen",
      sorter: true,
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Ngày Sinh",
      align: "center",
      dataIndex: "ngaySinh",
      key: "ngaySinh",
      sorter: true,
      render: (ngaySinh) => formatNgaySinh(ngaySinh),
    },
    {
      title: "Giới Tính",
      dataIndex: "gioiTinh",
      align: "center",
      sorter: true,
      key: "gioiTinh",
      render: (gioiTinh) => {
        if (gioiTinh) {
          const genderInfo: Record<
            string,
            { icon: JSX.Element; color: string }
          > = {
            MALE: { icon: <ManOutlined />, color: gioiTinh.mauSac },
            FEMALE: { icon: <WomanOutlined />, color: gioiTinh.mauSac },
            OTHER: { icon: <UserOutlined />, color: gioiTinh.mauSac },
          };
          const { icon, color } = genderInfo[gioiTinh.ten];
          return (
            <Tag bordered={false} icon={icon} color={color}>
              {gioiTinh.moTa}
            </Tag>
          );
        } else {
          return null;
        }
      },
    },
    {
      title: "Số Điện Thoại",
      align: "center",
      dataIndex: "soDienThoai",
      key: "soDienThoai",
      sorter: true,
      render: (soDienThoai) => formatPhoneNumber(soDienThoai),
    },
    {
      title: "E-mail",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
      sorter: true,

      render: (email) => <a href={`mailto:${email}`}>{email}</a>,
    },
  ];
  useEffect(() => {
    fetchData(getParams(params));
    console.log(params);
  }, [listGioiTinh, params, list]);
  const fetchData = async (params: TableParams) => {
    try {
      const res = await request.get("khach-hang", { params });
      const responseData = res.data.content.map((item: any) => ({
        ...item,
        key: item.id,
      }));
      const newData = responseData.filter(
        (item) => !list.some((listItem) => listItem.idKH === item.id)
      );
      setData(newData);
    } catch (error) {
      console.log(error);
    }
  };
  const rowSelection = {
    ...selectedRows,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRows(selectedRows);
    },
  };
  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    // Can not select days before today and today
    return current && current > dayjs().endOf("day");
  };
  const onXong = () => {
    console.log(selectedRows);

    if (selectedRows.length === 0) {
      message.warning("Bạn chưa chọn khách hàng muốn thêm");
      return;
    }
    listKhachHang(selectedRows);
    setSelectedRows([]);
    closeModal();
  };
  return (
    <Modal
      style={{ top: 20 }}
      width={1500}
      open={openModal}
      onCancel={closeModal}
      title={
        <>
          <FilterFilled />
          <Text strong> Bộ lọc</Text>
        </>
      }
      footer
    >
      <Space>
        <Input
          style={{ width: "330px" }}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Tìm kiếm theo Tên, Email, Số điện thoại,..."
          allowClear
          prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
        />
        <Text strong>Ngày sinh:</Text>
        <RangePicker
          disabledDate={disabledDate}
          format="DD-MM-YYYY"
          onChange={dateRange}
        />
        <Text strong>Giới tính:</Text>
        <Select
          allowClear
          style={{ width: "150px" }}
          placeholder="Chọn giới tính"
          onChange={handleChange}
          options={[
            { label: "Nam", value: "MALE" },
            { label: "Nữ", value: "FEMALE" },
            { label: "Khác", value: "OTHER" },
          ]}
        />
      </Space>
      <br />
      <br />
      <Table
        title={() => (
          <>
            <UnorderedListOutlined />
            <Text strong> Danh sách khách hàng</Text>
          </>
        )}
        rowSelection={rowSelection}
        pagination={{
          defaultPageSize: 5,
          onChange(page, pageSize) {
            setParams({
              ...params,
              currentPage: page,
              pageSize: pageSize,
            });
          },
        }}
        columns={columns}
        dataSource={data}
        // loading={loading}
        // onChange={handleTableChange}
        showSorterTooltip={false}
        footer={() => (
          <Space>
            <Button type="primary" onClick={onXong}>
              Xong
            </Button>
          </Space>
        )}
      />
    </Modal>
  );
}

export default ModalKhachHang;
