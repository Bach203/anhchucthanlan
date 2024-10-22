import React, { useState, useEffect } from "react";
import request from "~/utils/request";
import { fetchData } from "~/api/apiDiaChi";
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
interface Option {
  value?: number | null;
  label: React.ReactNode;
  children?: Option[];
  isLeaf?: boolean;
}
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
} from "@ant-design/icons";
import { formatNgaySinh, formatPhoneNumber } from "~/utils/formatResponse";
import {
  DataType,
  TableParams,
  DescriptionItemProps,
} from "~/interfaces/diaChi.type";
import ModalAddDiaChi from "./DiaChiMoi";
import ModalUpdateDiaChi from "./ModalUpdateDiaChi";
import { requestDC } from "~/utils/requestDiaChi";
import ModalUpdateDCKhachHang from "./ModalUpdateDiaChi";
import axios from "axios";

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

function ModalDiaChi({ openModal, closeModal }) {
  const [modal1Open, setModal1Open] = useState(false);
  const [id, setIdDiaChi] = useState();
  const [districtId, setDistrictId] = useState();
  const [contentModal, setContentModal] = useState<DataType>();
  const [modalAddDiaChi, setModalAddDiaChi] = useState(false);
  const [modalUpdateDiaChi, setModalUpdateDiaChi] = useState(false);
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
  const handOnClickUpdateDc = (id: any) => {
    setIdDiaChi(id);
    setModalUpdateDiaChi(true);
  };
  const handOnClickUpdateTT = async (id: any) => {
    try {
      //   const trangThai = values.trangThai ? "ACTIVE" : "INACTIVE";
      const idTaiKhoan = localStorage.getItem("acountId");
      const res = await requestDC.put("dia-chi/updateTT/" + id, {
        trangThaiDiaChi: "DEFAULT",
        
      });
      fetchDataAndLoadData();
     
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
      } else {
        console.error("Lỗi không xác định:", error);
      }
    }
  };
  const handOnClickDeleteTT = async (id: any) => {
    try {
      //   const trangThai = values.trangThai ? "ACTIVE" : "INACTIVE";
      const idTaiKhoan = localStorage.getItem("acountId");
      const res = await requestDC.delete("dia-chi/delete/" + id);
      fetchDataAndLoadData();
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
      } else {
        console.error("Lỗi không xác định:", error);
      }
    }
  };
  const getParams = (params: TableParams) => ({
    currentPage: data.length !== 0 ? params.pagination?.current : 1,
    pageSize: params.pagination?.pageSize,
    searchText: params.searchText,
    trangThaiDiaChi: params.trangThaiDiaChi,
    loaiDiaChi: params.loaiDiaChi,
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
    //     title: "Giới Tính",
    //     dataIndex: "gioiTinh",
    //     align: "center",
    //     sorter: true,
    //     key: "gioiTinh",
    //     filters: [
    //       { text: "Nam", value: "MALE" },
    //       { text: "Nữ", value: "FEMALE" },
    //       { text: "Khác", value: "OTHER" },
    //     ],
    //     render: (gioiTinh) => {
    //       if (gioiTinh) {
    //         const genderInfo: Record<
    //           string,
    //           { icon: JSX.Element; color: string }
    //         > = {
    //           MALE: { icon: <ManOutlined />, color: gioiTinh.mauSac },
    //           FEMALE: { icon: <WomanOutlined />, color: gioiTinh.mauSac },
    //           OTHER: { icon: <UserOutlined />, color: gioiTinh.mauSac },
    //         };
    //         const { icon, color } = genderInfo[gioiTinh.ten];
    //         return (
    //           <Tag bordered={false} icon={icon} color={color}>
    //             {gioiTinh.moTa}
    //           </Tag>
    //         );
    //       } else {
    //         return null; // Trả về giá trị mặc định hoặc thông báo lỗi tùy thuộc vào ngữ cảnh
    //       }
    //     },
    //   },
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
      title: "Thành phố",
      dataIndex: "thanhPho",
      fixed: "left",
      key: "thanhPho",
      sorter: true,
      ellipsis: true,
      render: (thanhPho, record) => {
        mangGiaTri.push(record.thanhPho);
        return getProvinceLabelFromId();
      },
    },
    {
      title: "Quận huyện",
      dataIndex: "quanHuyen",
      fixed: "left",
      key: "quanHuyen",
      sorter: true,
      ellipsis: true,
      render: (quanHuyen, record) => {
        mangGiaTriQH.push(record.quanHuyen);
        return getDistrictLabelFromId();
      },
    },
    {
      title: "Phường xã",
      dataIndex: "phuongXa",
      fixed: "left",
      key: "phuongXa",
      sorter: true,
      ellipsis: true,
      render: (phuongXa, record) => {
        mangGiaTriPX.push(String(record.phuongXa));
        return getWardLabelFromId();
      },
    },
    {
      title: "Trạng Thái",
      dataIndex: "trangThaiDiaChi",
      key: "trangThaiDiaChi",
      align: "center",
      sorter: true,
      width: "20%",
      render: (trangThaiDiaChi) => (
        <Tag color={trangThaiDiaChi?.mauSac}>{trangThaiDiaChi?.moTa}</Tag>
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
        const actionItems: MenuProps["items"] = [
          {
            // icon: <EditOutlined />,
            label: (
              <Button
                style={{ margin: 0, padding: 0 }}
                type="link"
                onClick={() => handOnClickUpdateDc(id)}
              >
                Chỉnh sửa
              </Button>
            ),
            key: "1",
          },
          {
            // icon: <EditOutlined />,
            label: (
              <Button
                style={{ margin: 0, padding: 0 }}
                type="link"
                onClick={() => handOnClickUpdateTT(id)}
              >
                Đặt làm mặc định
              </Button>
            ),
            key: "2",
          },
          {
            // icon: <EditOutlined />,
            label: (
              <Button
                style={{ margin: 0, padding: 0 }}
                type="link"
                onClick={() => handOnClickDeleteTT(id)}
              >
                Xóa địa chỉ
              </Button>
            ),
            key: "3",
          },
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
  const [provinces, setProvinces] = useState<Option[]>([]);
  const [districts, setDistricts] = useState<Option[]>([]);
  const [wards, setWards] = useState<Option[]>([]);
  const [fakeArray, setFakeArray] = useState<Option[]>([]);
  const fetchProvinces = async () => {
    try {
      const provinceRes = await axios.get(
        "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
        {
          headers: {
            token: "4d0b3d7c-65a5-11ee-a59f-a260851ba65c",
            ContentType: "application/json",
          },
        }
      );
      const provinceOptions: Option[] = provinceRes.data.data.map(
        (province: any) => ({
          value: province.ProvinceID,
          label: province.ProvinceName,
          isLeaf: false,
        })
      );

      setProvinces(provinceOptions);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchDistricts = async (idProvince: number | undefined) => {
    try {
      const districtRes = await axios.get(
        `https://online-gateway.ghn.vn/shiip/public-api/master-data/district`,
        {
          params: {
            province_id: idProvince,
          },
          headers: {
            token: "4d0b3d7c-65a5-11ee-a59f-a260851ba65c",
            ContentType: "application/json",
          },
        }
      );
      const districtOptions: Option[] = districtRes.data.data.map(
        (district: any) => ({
          value: district.DistrictID,
          label: district.DistrictName,
          isLeaf: false,
        })
      );
      setDistricts(districtOptions);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchWards = async (idDistrict: number | undefined) => {
    try {
      const idDis = data.map((item) => item.quanHuyen);
      const wardOptions: Option[] = [];

      for (const districtId of idDis || []) {
        const wardRes = await axios.get(
          `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtId}`,
          {
            headers: {
              token: "4d0b3d7c-65a5-11ee-a59f-a260851ba65c",
              ContentType: "application/json",
            },
          }
        );
        const wardsForDistrict: Option[] = wardRes.data.data.map(
          (ward: any) => ({
            value: ward.WardCode,
            label: ward.WardName,
            isLeaf: false,
          })
        );

        wardOptions.push(...wardsForDistrict);
      }

      setWards(wardOptions);
    } catch (error) {
      console.error(error);
    }
  };

  let mangGiaTri: number[] = [];
  let mangGiaTriQH: number[] = [];
  let mangGiaTriPX: string[] = [];
  const getProvinceLabelFromId = () => {
    const idArray = Array.isArray(mangGiaTri) ? mangGiaTri : [mangGiaTri];

    // Get the last element in the array
    const lastId = idArray[idArray.length - 1];
    const lastProvince = provinces.find((p) => p.value == lastId);
    return lastProvince ? lastProvince.label : "Không tìm thấy";
  };
  const getDistrictLabelFromId = () => {
    const idArray = Array.isArray(mangGiaTriQH) ? mangGiaTriQH : [mangGiaTriQH];
    // Get the last element in the array
    const lastId = idArray[idArray.length - 1];

    // Find the district with the last ID
    const lastDistrict = districts.find((d) => d.value == lastId);

    // Return the label of the last district or 'Không tìm thấy' if not found
    return lastDistrict ? lastDistrict.label : "Không tìm thấy";
  };

  const getWardLabelFromId = () => {
    const idArray = Array.isArray(mangGiaTriPX) ? mangGiaTriPX : [mangGiaTriPX];
    // Get the last element in the array
    const lastId = idArray[idArray.length - 1];

    // Find the district with the last ID
    const lastIdNumber = parseInt(lastId);
    const lastWard = wards.find((d) => d.value == lastIdNumber);
    // Return the label of the last district or 'Không tìm thấy' if not found
    return lastWard ? lastWard.label : "Không tìm thấy";
  };

  const fetchDataAndLoadData = async () => {
    setLoading(true);
    try {
      const fetchedData = await fetchData(getParams(tableParams));
      console.log("Dữ liệu địa chỉ đã được lấy:", fetchedData); // Log dữ liệu đã lấy
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
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu địa chỉ:", error); // Log lỗi nếu có
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDataAndLoadData();
    fetchProvinces();
    fetchDistricts(id);
    fetchWards(id);
  }, [tableParams, modalAddDiaChi, modalUpdateDiaChi]);

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
      loaiDiaChi: value,
    });
  };
  const onChangeStatus = (value: string) => {
    setTableParams({
      ...tableParams,
      trangThaiDiaChi: value,
    });
  };

  return (
    <>
      <Modal
        style={{ top: 20 }}
        width={1200}
        open={openModal}
        onCancel={closeModal}
      >
        <Card title="DANH SÁCH ĐỊA CHỈ" bordered={true}>
          <Modal
            title="Chi Tiết Địa Chỉ"
            style={{ top: 20 }}
            open={modal1Open}
            onOk={() => setModal1Open(false)}
            onCancel={() => setModal1Open(false)}
            okText=" "
            okType="link"
            cancelText="Đóng"
          >
            <Divider />
            <DescriptionItem
              title="Họ và tên"
              content={contentModal?.hoVaTen}
            />
            <Divider style={{ margin: 0 }} />

            {/* <Divider style={{ margin: 0 }} />
          <DescriptionItem title="Giới tính">
            <Tag bordered={false} color={contentModal?.gioiTinh.mauSac}>
              {contentModal?.gioiTinh.moTa}
            </Tag>
          </DescriptionItem>
          <Divider style={{ margin: 0 }} /> */}
            <DescriptionItem
              title="Số điện thoại"
              content={formatPhoneNumber(contentModal?.soDienThoai)}
            />
            <Divider style={{ margin: 0 }} />
            <DescriptionItem title="E-mail">
              <a href={`mailto:${contentModal?.email}`}>
                {contentModal?.email}
              </a>
            </DescriptionItem>
            <Divider style={{ margin: 0 }} />
            <DescriptionItem
              title="Địa chỉ"
              content={
                <>
                  {contentModal?.diaChiCuThe}
                  <br />
                  {contentModal?.phuongXa}, {contentModal?.quanHuyen},{" "}
                  {contentModal?.thanhPho}
                </>
              }
            />
            {/* <Divider style={{ margin: 0 }} />
          <DescriptionItem title="Trạng thái">
            {contentModal?.trangThai.ten === "ACTIVE" ? (
              <Tag color="success">Kích hoạt</Tag>
            ) : (
              <Tag color="error">Ngừng kích hoạt</Tag>
            )}
          </DescriptionItem>
          <Divider style={{ margin: 0 }} /> */}
          </Modal>
          <Row>
            <Col span={8}>
              <Input
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Tìm kiếm theo Tên, SĐT, Email,..."
                allowClear
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              />
            </Col>
            <Col span={4}></Col>
            <Col span={9}>
              <Space>
                {/* <Form.Item
                  label="Loại địa chỉ"
                  style={{ fontWeight: "bold", marginLeft: 10 }}
                >
                  <Select
                    defaultValue=""
                    style={{ width: 150 }}
                    onChange={onChangeGender}
                    options={[
                      { value: "", label: "Tất cả" },
                      { value: "HOME", label: "Nhà" },
                      { value: "COMPANY", label: "Nơi làm việc" },
                      { value: "OTHER", label: "Khác" },
                    ]}
                  />
                </Form.Item> */}
                <Form.Item label="Trạng thái" style={{ fontWeight: "bold" }}>
                  <Select
                    defaultValue=""
                    style={{ width: 150 }}
                    onChange={onChangeStatus}
                    options={[
                      { value: "", label: "Tất cả" },
                      { value: "ACTIVE", label: "Hoạt động" },
                      // { value: "INACTIVE", label: "Không hoạt động" },
                      { value: "DEFAULT", label: "Mặc định" },
                      // { value: "DELETED", label: "Xóa" },
                    ]}
                  />
                </Form.Item>
              </Space>
            </Col>
            <Col span={3}>
              <Button onClick={() => setModalAddDiaChi(true)} type="primary">
                Thêm địa chỉ mới
              </Button>
            </Col>
          </Row>
          <Table
            pagination={tableParams.pagination}
            columns={columns}
            dataSource={data.map((item, index) => {
              return {
                ...item,

                key: index.toString(),
              };
            })}
            loading={loading}
            onChange={handleTableChange}
            showSorterTooltip={false}
            scroll={{ y: 365 }}
          />
        </Card>

        <ModalAddDiaChi
          openModal={modalAddDiaChi}
          closeModal={() => setModalAddDiaChi(false)}
        />
        <ModalUpdateDCKhachHang
          id={id}
          openModal={modalUpdateDiaChi}
          closeModal={() => setModalUpdateDiaChi(false)}
        />
      </Modal>
    </>
  );
}

export default ModalDiaChi;
