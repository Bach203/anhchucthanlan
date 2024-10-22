import * as React from "react";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { GiInfinity } from "react-icons/gi";
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
  message,
  DatePicker,
  Typography,
} from "antd";
const { Text } = Typography;
import { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";
import { DataParams, DataType } from "~/interfaces/voucher.type";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import request from "~/utils/request";
import { formatGiaTienVND } from "~/utils/formatResponse";
const index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataType[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [params, setParams] = useState<DataParams>({
    page: 1,
    pageSize: 10,
  });

  const columns: ColumnsType<DataType> = [
    {
      title: "STT",
      align: "center",
      rowScope: "row",
      width: "60px",
      render: (_, __, index) => (params.page - 1) * params.pageSize + index + 1,
    },
    {
      title: "Mã",
      dataIndex: "ma",
      key: "ma",
      sorter: true,
      ellipsis: true,
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Tên",
      dataIndex: "ten",
      ellipsis: true,
      key: "ten",
      sorter: true,
    },
    {
      title: "Thời gian",
      dataIndex: "ngayBatDau",
      align: "center",
      sorter: true,
      key: "ngayBatDau",
      width: 180,
      render: (_, voucher) => {
        return (
          <Space direction="vertical">
            <Text type="success">
              Từ: {dayjs(voucher.ngayBatDau).format("HH:mm, DD/MM/YYYY")}
            </Text>
            <Text type="warning">
              Đến: {dayjs(voucher.ngayKetThuc).format("HH:mm, DD/MM/YYYY")}
            </Text>
          </Space>
        );
      },
    },

    {
      title: "Giảm giá",
      dataIndex: "giaTriGiam",
      key: "giaTriGiam",
      align: "center",
      sorter: true,
      render: (giaTriGiam, object: any) => {
        if (object.hinhThucGiam.id === 1) {
          return formatGiaTienVND(giaTriGiam);
        } else if (object.hinhThucGiam.id === 2) {
          return giaTriGiam + "%";
        } else {
          return "";
        }
      },
    },
    {
      title: "Loại Voucher",
      dataIndex: "loaiVoucher",
      align: "center",
      render: (loaiVoucher) => (
        <Tag color={loaiVoucher?.mauSac}>{loaiVoucher?.moTa}</Tag>
      ),
    },
    {
      title: "Trạng Thái",
      dataIndex: "trangThai",
      key: "trangThai",
      align: "center",
      sorter: true,

      render: (trangThai) => (
        <Tag color={trangThai?.mauSac}>{trangThai?.moTa}</Tag>
      ),
    },
    {
      title: "Thao Tác",
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (id) => (
        <Tooltip title="Chỉnh sửa">
          <Link to={`/admin/voucher/update/${id}`}>
            <Button type="link" style={{ padding: 0 }}>
              <EditOutlined />
            </Button>
          </Link>
        </Tooltip>
      ),
    },
  ];

  const getParams = (params: DataParams) => ({
    page: data.length !== 0 ? params.page : 1,
    pageSize: params.pageSize,
    searchText: params.searchText,
    trangThai: params.trangThai,
    ngayBatDau: params.ngayBatDau,
    ngayKetThuc: params.ngayKetThuc,
    sortField: params.sortField,
    sortOrder: params.sortOrder,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await request.get("voucher", {
          params: getParams(params),
        });
        console.log(res);
        setData(res.data.content);
        setTotalElements(res.data.totalElements);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        message.error("Lấy dữ liệu voucher thất bại");
      }
    };
    fetchData();
    const intervalId = setInterval(fetchData, 1000);
    return () => clearInterval(intervalId);
  }, [params]);

  const handleSearch = (value: string) => {
    setParams({
      ...params,
      searchText: value,
    });
    console.log(value);
  };

  const onChangeStatus = (value: string) => {
    setParams({
      ...params,
      trangThai: value,
    });
    console.log(value);
  };
  const onChangeNgayBatDau = (value: dayjs.Dayjs | null) => {
    if (value) {
      setParams({
        ...params,
        ngayBatDau: value.format("YYYY-MM-DD HH:mm:ss"),
      });
    } else {
      setParams({
        ...params,
        ngayBatDau: "", // hoặc giá trị mặc định nếu không có ngày được chọn
      });
    }
  };

  const onChangeNgayKetThuc = (value: dayjs.Dayjs | null) => {
    if (value) {
      setParams({
        ...params,
        ngayKetThuc: value.format("YYYY-MM-DD HH:mm:ss"),
      });
    } else {
      setParams({
        ...params,
        ngayKetThuc: "", // hoặc giá trị mặc định nếu không có ngày được chọn
      });
    }
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

  //
  const [defaultTrangThai, setDefaultTrangThai] = useState("");
  const [defaultText, setDefaultText] = useState("");
  const [defaultNgayBatDau, setDefaultNgayBatDau] =
    useState<dayjs.Dayjs | null>(null);
  const [defaultNgayKetThuc, setDefaultNgayKetThuc] =
    useState<dayjs.Dayjs | null>(null);

  // ...

  const getDefaultParams = () => ({
    page: 1,
    pageSize: 10,
    searchText: defaultText,
    trangThai: defaultTrangThai,
    ngayBatDau: defaultNgayBatDau
      ? defaultNgayBatDau.format("YYYY-MM-DD HH:mm:ss")
      : "",
    ngayKetThuc: defaultNgayKetThuc
      ? defaultNgayKetThuc.format("YYYY-MM-DD HH:mm:ss")
      : "",
    sortField: "",
    sortOrder: "",
  });

  const handleReset = () => {
    setParams(getDefaultParams());
  };

  const resetData = () => {
    setParams(getDefaultParams());
    setDefaultTrangThai("");
    setDefaultText("");
    setDefaultNgayBatDau(null); // Reset Ngày bắt đầu
    setDefaultNgayKetThuc(null); // Reset Ngày kết thúc
  };

  return (
    <>
      <Card title="DANH SÁCH VOUCHER">
        <Row>
          <Col span={8}>
            <Input
              value={params.searchText || defaultText}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Tìm kiếm theo Tên, Mã..."
              allowClear
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            />
          </Col>
          <Col span={2}></Col>
          <Col span={10}>
            <Form.Item label="Trạng thái" style={{ fontWeight: "bold" }}>
              <Select
                value={params.trangThai || defaultTrangThai}
                style={{ width: 230 }}
                onChange={onChangeStatus}
                options={[
                  { value: "", label: "Tất cả" },
                  { value: "UPCOMING", label: "Sắp diễn ra" },
                  { value: "ONGOING", label: "Đang diễn ra" },
                  { value: "ENDING_SOON", label: "Sắp hết hạn" },
                  { value: "EXPIRED", label: "Đã hết" },
                  { value: "OUT_OF_STOCK", label: "Sắp diễn ra" },
                  { value: "CANCELLED", label: "Hủy bỏ" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Link to="/admin/voucher/add">
              <Button type="primary" icon={<PlusOutlined />}>
                Thêm voucher
              </Button>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <Form.Item label="Ngày bắt đầu">
              <DatePicker
                showTime
                onChange={onChangeNgayBatDau}
                value={
                  params.ngayBatDau
                    ? dayjs(params.ngayBatDau)
                    : defaultNgayBatDau
                }
              />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label="Ngày kết thúc">
              <DatePicker
                showTime
                onChange={onChangeNgayKetThuc}
                value={
                  params.ngayKetThuc
                    ? dayjs(params.ngayKetThuc)
                    : defaultNgayKetThuc
                }
              />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Button type="dashed" onClick={handleReset} style={{ width: 141 }}>
              Làm mới
            </Button>
          </Col>
        </Row>
        <Table
          columns={columns}
          pagination={{
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
