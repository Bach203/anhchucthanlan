import * as React from "react";
import { useState, useEffect } from "react";
import {
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  ColorPicker,
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
} from "antd";
import { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";
import { DataParams, DataType } from "~/interfaces/mauSac.type";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import request from "~/utils/request";

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
      width: "10%",
      render: (_, __, index) => (params.page - 1) * params.pageSize + index + 1,
    },
    {
      title: "Mã",
      dataIndex: "ma",
      key: "ma",
      align: "center",
      sorter: true,
      width: "30%",
      render: (ma) => (
        <Space>
          <ColorPicker value={ma} size="small" disabled /> <span>{ma}</span>
        </Space>
      ),
    },
    {
      title: "Tên",
      dataIndex: "ten",
      key: "ten",
      align: "center",
      sorter: true,
      width: "30%",
    },
    {
      title: "Trạng Thái",
      dataIndex: "trangThai",
      key: "trangThai",
      align: "center",
      sorter: true,
      width: "20%",
      render: (trangThai) => (
        <Tag color={trangThai.mauSac}>{trangThai.moTa}</Tag>
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
          <Button type="link" style={{ padding: 0 }}>
            <Tooltip title="Chi tiết">
              <EyeOutlined style={{ color: "orange" }} />
            </Tooltip>
          </Button>
          <Tooltip title="Chỉnh sửa">
            <Link to={`/admin/mau-sac/update/${id}`}>
              <Button type="link" style={{ padding: 0 }}>
                <EditOutlined />
              </Button>
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
    trangThai: params.trangThai,
    sortField: params.sortField,
    sortOrder: params.sortOrder,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await request.get("mau-sac", { params: getParams(params) });
        setData(res.data.content);
        setTotalElements(res.data.totalElements);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        message.error("Lấy dữ liệu màu sắc thất bại");
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
  const onChangeStatus = (value: string) => {
    setParams({
      ...params,
      trangThai: value,
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
      <Card title="DANH SÁCH MÀU SẮC">
        <Row>
          <Col span={8}>
            <Input
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Tìm kiếm theo Mã, Tên..."
              allowClear
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            />
          </Col>
          <Col span={8}></Col>
          <Col span={5}>
            <Form.Item label="Trạng thái" style={{ fontWeight: "bold" }}>
              <Select
                defaultValue=""
                style={{ width: 150 }}
                onChange={onChangeStatus}
                options={[
                  { value: "", label: "Tất cả" },
                  { value: "ACTIVE", label: "Hoạt động" },
                  { value: "INACTIVE", label: "Không hoạt động" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Link to="/admin/mau-sac/add">
              <Button type="primary" icon={<PlusOutlined />}>
                Thêm màu sắc
              </Button>
            </Link>
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
