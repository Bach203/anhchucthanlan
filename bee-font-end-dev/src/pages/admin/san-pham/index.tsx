import * as React from "react";
import { useState, useEffect } from "react";
import {
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Image,
  Input,
  Row,
  Select,
  Slider,
  Space,
  Table,
  TablePaginationConfig,
  Tag,
  Tooltip,
  message,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";
import { DataParams, DataType } from "~/interfaces/thuongHieu.type";
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
      rowScope: "row",
      render: (_, __, index) => (params.page - 1) * params.pageSize + index + 1,
    },
    {
      title: "Ảnh",
      dataIndex: "listHinhAnhSanPham",
      key: "anh",
      align: "center",
      render: (listHinhAnhSanPham) => (
        <Image
          width={80}
          height={80}
          src={
            listHinhAnhSanPham.length > 0
              ? `http://localhost:8081/admin/api/file/view/${listHinhAnhSanPham[0].duongDan}`
              : undefined
          }
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
        />
      ),
    },
    {
      title: "Mã Sản Phẩm",
      dataIndex: "ma",
      key: "ma",
      align: "center",
      sorter: true,
      width: "15%",
    },
    {
      title: "Tên Sản Phẩm",
      dataIndex: "ten",
      key: "ten",
      // align: "center",
      sorter: true,
    },

    {
      key: "thuongHieu",
      title: "Thương Hiệu",
      dataIndex: "thuongHieu",
      sorter: true,
      render: (thuongHieu) => <span>{thuongHieu.ten}</span>,
    },
    {
      title: "Số Lượng Tồn",
      dataIndex: "listChiTietSanPham",
      key: "soLuong",
      align: "center",
      sorter: true,
      render: (listChiTietSanPham) => {
        // Tính tổng số lượng từ danh sách listChiTietSanPham
        const totalQuantity = listChiTietSanPham.reduce((total, item) => {
          return total + item.soLuong;
        }, 0);

        return totalQuantity;
      },
    },
    {
      title: "Trạng Thái",
      dataIndex: "trangThai",
      key: "trangThai",
      align: "center",
      sorter: true,
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
            <Link to={`/admin/san-pham/update/${id}`}>
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
        const res = await request.get("san-pham", {
          params: getParams(params),
        });
        setData(res.data.content);
        setTotalElements(res.data.totalElements);
        console.log(res.data.content);

        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        message.error("Lấy dữ liệu sản phẩm thất bạiiiii");
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
      <Card title="DANH SÁCH SẢN PHẨM">
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
            <Link to="/admin/san-pham/add">
              <Button type="primary" icon={<PlusOutlined />}>
                Thêm sản phẩm
              </Button>
            </Link>
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
