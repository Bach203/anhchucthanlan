import React, { useState, useEffect } from "react";
import request from "~/utils/request";
import { fetchData } from "~/api/apiKhachHang";
import {
  Space,
  Card,
  Tag,
  Form,
  Input,
  Button,
  Dropdown,
  Select,
  Avatar,
  Modal,
  Col,
  Row,
  Table,
  Divider,
} from "antd";
import type { MenuProps } from "antd";
import { GrMoreVertical } from "react-icons/gr";
import { Link } from "react-router-dom";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import {
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReadOutlined,
  ManOutlined,
  WomanOutlined,
  UserOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import { formatNgaySinh, formatPhoneNumber } from "~/utils/formatResponse";
import {
  DataType,
  TableParams,
  DescriptionItemProps,
} from "~/interfaces/khachHang.type";

const DescriptionItem: React.FC<DescriptionItemProps> = ({
  title,
  content,
  children,
}) => (
  <Space>
    <p style={{ fontWeight: "bold" }}>{title}:</p>
    <p>{content}</p>
    <p>{children}</p>
  </Space>
);

const index: React.FC = () => {
  const [modal1Open, setModal1Open] = useState(false);
  const [contentModal, setContentModal] = useState<DataType>();
  const [data, setData] = useState<DataType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
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
  });
  const columns: ColumnsType<DataType> = [
    {
      title: "STT",
      key: "stt",
      fixed: "left",
      align: "center",
      rowScope: "row",
      width: 60,
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    // {
    //   title: "Ảnh",
    //   key: "stt",
    //   fixed: "left",
    //   align: "center",
    //   width: 80,
    //   render: () => (
    //     <Avatar src="" shape="square" size="large" icon={<UserOutlined />} />
    //   ),
    // },
    {
      title: "Họ và Tên",
      dataIndex: "hoVaTen",
      fixed: "left",
      key: "hoVaTen",
      sorter: true,
      ellipsis: true,
      // render: (text) => <a>{text}</a>,
    },
    // {
    //   title: "CMT/CCCD",
    //   dataIndex: "canCuocCongDan",
    //   key: "canCuocCongDan",
    //   sorter: true,
    // },
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
      filters: [
        { text: "Nam", value: "MALE" },
        { text: "Nữ", value: "FEMALE" },
        { text: "Khác", value: "OTHER" },
      ],
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
          return null; // Trả về giá trị mặc định hoặc thông báo lỗi tùy thuộc vào ngữ cảnh
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
    {
      title: "Trạng Thái",
      dataIndex: "trangThai",
      key: "trangThai",
      align: "center",
      sorter: true,
      width: "20%",
      render: (trangThai) => (
        <Tag color={trangThai?.mauSac}>{trangThai?.moTa}</Tag>
      ),
    },
    {
      title: "Thao Tác",
      dataIndex: "id",
      fixed: "right",
      align: "center",
      key: "id",
      width: 90,
      render: (id) => {
        const showModal = () => {
          setModal1Open(true);
          request
            .get("khach-hang/edit/" + id)
            .then((res) => setContentModal(res.data))
            .catch((err) => console.log(err));
        };

        const actionItems: MenuProps["items"] = [
          {
            icon: <ReadOutlined />,
            label: (
              <Button
                type="link"
                onClick={showModal}
                style={{ color: "#000000", padding: 0 }}
              >
                <span style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ flex: "1" }}>Xem chi tiết</span>
                </span>
              </Button>
            ),
            key: "0",
          },
          {
            icon: <EditOutlined />,
            label: <Link to={`/admin/khach-hang/edit/${id}`}>Chỉnh sửa</Link>,
            key: "1",
          },
          {
            type: "divider",
          },
          // {
          //   icon: <DeleteOutlined />,
          //   danger: true,
          //   label: (
          //     <Link to={`/admin/khach-hang/status/${id}`}>Ngưng kích hoạt</Link>
          //   ),
          //   key: "3",
          // },
        ];

        return (
          <Dropdown menu={{ items: actionItems }} trigger={["click"]}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <Button
                  type="text"
                  icon={
                    <GrMoreVertical
                      style={{ fontSize: "20", color: "#bfbfbf" }}
                    />
                  }
                />
              </Space>
            </a>
          </Dropdown>
        );
      },
    },
  ];
  useEffect(() => {
    const fetchDataAndLoadData = async () => {
      setLoading(true);
      const fetchedData = await fetchData(getParams(tableParams));
      setData(fetchedData.content);
      setCurrentPage(fetchedData.pageable.pageNumber + 1);
      setPageSize(fetchedData.pageable.pageSize);
      setLoading(false);
      const updatedTableParams = {
        ...tableParams,
        pagination: {
          showSizeChanger: true,
          ...tableParams.pagination,
          total: fetchedData.totalElements,
          showTotal: (total: number, range: [number, number]) =>
            `${range[0]}-${range[1]} of ${total} items`,
        },
      };

      // Kiểm tra xem tableParams thực sự đã thay đổi
      if (JSON.stringify(updatedTableParams) !== JSON.stringify(tableParams)) {
        setTableParams(updatedTableParams);
      }
      console.log(fetchedData.content);
    };

    fetchDataAndLoadData();
  }, [tableParams]);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>, // Đổi kiểu dữ liệu của filters
    sorter: SorterResult<DataType> | SorterResult<DataType>[]
  ) => {
    const sortField = Array.isArray(sorter)
      ? (sorter[0].field || "").toString()
      : (sorter.field || "").toString();
    const sortOrder = Array.isArray(sorter)
      ? (sorter[0].order || "").toString()
      : (sorter.order || "").toString();

    // Loại bỏ các giá trị null khỏi filters
    const cleanedFilters: Record<string, FilterValue> = {};
    for (const key in filters) {
      if (filters[key] !== null) {
        cleanedFilters[key] = filters[key] as FilterValue;
      }
    }

    setTableParams({
      ...tableParams,
      pagination,
      sortField,
      sortOrder,
      filters: cleanedFilters, // Sử dụng cleanedFilters thay vì filters ban đầu
    });

    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  const handleSearch = (searchValue: string) => {
    setTableParams({
      ...tableParams,
      searchText: searchValue,
    });
  };
  const onChangeGender = (value: string) => {
    setTableParams({
      ...tableParams,
      gioiTinh: value,
    });
  };
  const onChangeStatus = (value: string) => {
    setTableParams({
      ...tableParams,
      trangThai: value,
    });
  };
  const exportToExcel = async () => {
    try {
      const currentTime = new Date();
      const dateString = currentTime
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "");
      const timeString = currentTime
        .toTimeString()
        .slice(0, 8)
        .replace(/:/g, "");

      const fileName = `khach-hang_${dateString}_${timeString}.xlsx`;

      const response = await request.get("khach-hang/excel", {
        responseType: "blob", // Yêu cầu response là dạng blob
      });

      const blob = new Blob([response.data], {
        type: "application/octet-stream",
      });

      // Tạo một URL tạm thời để download file Excel
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      // Xoá URL tạm thời
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting to Excel: ", error);
    }
  };
  return (
    <>
      <Card title="DANH SÁCH KHÁCH HÀNG" bordered={true}>
        <Modal
          title="Chi Tiết Khách Hàng"
          style={{ top: 20 }}
          open={modal1Open}
          onOk={() => setModal1Open(false)}
          onCancel={() => setModal1Open(false)}
          okText=" "
          okType="link"
          cancelText="Đóng"
        >
          <Divider />
          <DescriptionItem title="Họ và tên" content={contentModal?.hoVaTen} />
          <Divider style={{ margin: 0 }} />
          {/* <DescriptionItem
            title="CMT/CCCD"
            content={contentModal?.canCuocCongDan}
          /> */}
          <Divider style={{ margin: 0 }} />
          <DescriptionItem
            title="Ngày sinh"
            content={formatNgaySinh(contentModal?.ngaySinh)}
          />
          <Divider style={{ margin: 0 }} />
          <DescriptionItem title="Giới tính">
            <Tag bordered={false} color={contentModal?.gioiTinh.mauSac}>
              {contentModal?.gioiTinh.moTa}
            </Tag>
          </DescriptionItem>
          <Divider style={{ margin: 0 }} />
          <DescriptionItem
            title="Số điện thoại"
            content={formatPhoneNumber(contentModal?.soDienThoai)}
          />
          <Divider style={{ margin: 0 }} />
          <DescriptionItem title="E-mail">
            <a href={`mailto:${contentModal?.email}`}>{contentModal?.email}</a>
          </DescriptionItem>
          <Divider style={{ margin: 0 }} />
          {/* <DescriptionItem
            title="Địa chỉ"
            content={
              <>
                {contentModal?.diaChiCuThe}
                <br />
                {contentModal?.phuongXa}, {contentModal?.quanHuyen},{" "}
                {contentModal?.thanhPho}
              </>
            }
          /> */}
          <Divider style={{ margin: 0 }} />
          <DescriptionItem title="Trạng thái">
            {contentModal?.trangThai.ten==="ACTIVE" ? (
              <Tag color="success">Kích hoạt</Tag>
            ) : (
              <Tag color="error">Ngừng kích hoạt</Tag>
            )}
          </DescriptionItem>
          <Divider style={{ margin: 0 }} />
        </Modal>
        <Row>
          <Col span={8}>
            <Input
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Tìm kiếm theo Tên, SĐT, Email"
              allowClear
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            />
          </Col>
          <Col span={4}></Col>
          <Col span={9}>
            <Space>
              <Form.Item
                label="Giới tính"
                style={{ fontWeight: "bold", marginLeft: 15 }}
              >
                <Select
                  defaultValue=""
                  style={{ width: 90 }}
                  onChange={onChangeGender}
                  options={[
                    { value: "", label: "Tất cả" },
                    { value: "MALE", label: "Nam" },
                    { value: "FEMALE", label: "Nữ" },
                    { value: "OTHER", label: "Khác" },
                  ]}
                />
              </Form.Item>
              <Form.Item label="Trạng thái" style={{ fontWeight: "bold" }}>
                <Select
                  defaultValue=""
                  style={{ width: 150 }}
                  onChange={onChangeStatus}
                  options={[
                    { value: "", label: "Tất cả" },
                    { value: "ACTIVE", label: "Kích hoạt" },
                    { value: "INACTIVE", label: "Ngừng kích hoạt" },
                  ]}
                />
              </Form.Item>
            </Space>
          </Col>
          <Col span={3}>
            <Link to="/admin/khach-hang/add">
              <Button type="primary" icon={<UserAddOutlined />}>
                Thêm khách hàng
              </Button>
            </Link>
            <Button
                  style={{ float: "right", backgroundColor: "green", marginTop:"10px" }}
                  type="primary"
                  onClick={exportToExcel}
                >
                  <FileExcelOutlined /> Xuất File Excel
                </Button>
          </Col>
        </Row>
        <Table
          pagination={tableParams.pagination}
          columns={columns}
          dataSource={data.map((item, index) => ({
            ...item,
            key: index.toString(),
          }))}
          loading={loading}
          onChange={handleTableChange}
          showSorterTooltip={false}
          scroll={{ y: 365 }}
        />
      </Card>
    </>
  );
};

export default index;
