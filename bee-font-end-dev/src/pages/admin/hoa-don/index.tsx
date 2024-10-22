import React from "react";
import { useState, useEffect } from "react";
import { EditOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Table,
  TablePaginationConfig,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";
import { DataParams, DataType } from "~/interfaces/hoaDon.type";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import request from "~/utils/request";
import { formatGiaTienVND } from "~/utils/formatResponse";
const { Text, Title } = Typography;
const index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataType[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [params, setParams] = useState<DataParams>({
    trangThaiHoaDon: "PENDING",
    page: 1,
    pageSize: 10,
  });

  const columns: ColumnsType<DataType> = [
    {
      title: "STT",
      align: "center",
      rowScope: "row",
      width: "5%",
      render: (_, __, index) => (params.page - 1) * params.pageSize + index + 1,
    },
    {
      title: "Mã",
      dataIndex: "ma",
      key: "ma",
      align: "center",
      sorter: true,
      width: "5%",
    },

    {
      title: "Khách hàng",
      dataIndex: "taiKhoan",
      key: "taiKhoan",
      align: "center",
      sorter: true,
      render: (taiKhoan, record) => {
        return taiKhoan != null ? taiKhoan.hoVaTen : "Khách hàng lẻ";
      },
    },
    {
      title: "Tổng tiền đơn hàng",
      dataIndex: "tongTienKhiGiam",
      key: "tongTien",
      align: "center",
      sorter: true,
      width: "20%",
      render: (tongTien) => <span>{formatGiaTienVND(tongTien)}</span>,
    },

    {
      title: "Loại Hóa Đơn",
      dataIndex: "loaiHoaDon",
      key: "loaiHoaDon",
      align: "center",
      sorter: true,
      width: "20%",
      render: (loaiHoaDon) => (
        <Tag color={loaiHoaDon.mauSac}>{loaiHoaDon.moTa}</Tag>
      ),
    },
    {
      title: "Trạng Thái",
      dataIndex: "trangThaiHoaDon",
      key: "trangThaiHoaDon",
      align: "center",
      sorter: true,
      width: "20%",
      render: (trangThaiHoaDon) => (
        <Tag color={trangThaiHoaDon?.mauSac}>{trangThaiHoaDon?.moTa}</Tag>
      ),
    },
    {
      title: "Thao Tác",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: "10%",
      render: (id) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Link to={`/admin/hoa-don/${id}`}>
              <Button type="primary">Chọn</Button>
            </Link>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const getParams = (params: DataParams) => ({
    page: data.length !== 0 ? params.page : 1,
    pageSize: params.pageSize,
    searchText: params.searchText,
    loaiHoaDon: params.loaiHoaDon,
    trangThaiHoaDon: params.trangThaiHoaDon,
    sortField: params.sortField,
    sortOrder: params.sortOrder,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await request.get("hoa-don", {
          params: {
            ...getParams(params),
            trangThaiHoaDon: params.trangThaiHoaDon,
          },
        });
        setData(res.data.content);
        setTotalElements(res.data.totalElements);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        message.error("Lấy dữ liệu hóa đơn thất bại");
      }
    };
    fetchData();
  }, [params]);
  const handleSearch = (value: string) => {
    setParams({
      ...params,
      searchText: value,
    });
    console.log(value);
  };
  // lọc theo trạng thái
  // lọc trạng thái là PENDING mặc hịnh hiển thị
  const onChangeStatus = (value: string) => {
    setParams({
      ...params,
      trangThaiHoaDon: value,
    });
    console.log(value);
  };

  // lọc theo loại
  const onChangeTypes = (value: string) => {
    setParams({
      ...params,
      loaiHoaDon: value,
    });
    console.log(value);
  };
  const onChangeTable = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<DataType> | any
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
  return (
    <>
      <Card title="DANH SÁCH ĐƠN HÀNG">
        <Row>
          <Col span={8}>
            <Input
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Tìm kiếm theo Tên..."
              allowClear
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            />
          </Col>
          <Col span={8}></Col>
          <Col span={4}>
            <Form.Item label="Loại hóa đơn" style={{ fontWeight: "bold" }}>
              <Select
                defaultValue=""
                style={{ width: 150 }}
                onChange={onChangeTypes}
                options={[
                  { value: "", label: "Tất cả" },
                  { value: "ONLINE", label: "Trên website" },
                  { value: "COUNTER", label: "Tại quầy" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="Trạng Thái" style={{ fontWeight: "bold" }}>
              <Select
                defaultValue={params.trangThaiHoaDon}
                style={{ width: 150 }}
                onChange={onChangeStatus}
                options={[
                  { value: "", label: "Tất cả" },
                  { value: "PENDING", label: "Chờ xác nhận" },
                  { value: "CONFIRMED", label: "Đã xác nhận" },
                  { value: "SHIPPING", label: "Đang vận chuyển" },
                  { value: "PICKUP", label: "Đang lấy hàng" },
                  { value: "CANCELLED", label: "Đã hủy" },
                  { value: "APPROVED", label: "Thành công" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
        <Table
          columns={columns}
          pagination={{
            pageSizeOptions: ["1", "5", "10"],
            showSizeChanger: true,
            total: totalElements,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          dataSource={data.map((item, index) => ({
            ...item,
            key: index.toString(),
          }))}
          onChange={onChangeTable}
          loading={loading}
          showSorterTooltip={false}
        />
      </Card>
    </>
  );
};

export default index;
