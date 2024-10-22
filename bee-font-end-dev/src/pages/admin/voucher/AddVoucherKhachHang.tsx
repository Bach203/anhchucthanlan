import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Space,
  message,
  InputNumber,
  Select,
  TimeRangePickerProps,
  Table,
  Tooltip,
  Tag,
  Divider,
  Steps,
  Typography,
} from "antd";
const { Text, Link } = Typography;

import dayjs from "dayjs";
import request from "~/utils/request";
import {
  DeleteOutlined,
  ExclamationCircleFilled,
  EyeOutlined,
} from "@ant-design/icons";
import { CreatedRequest } from "~/interfaces/voucher.type";
import { formatGiaTienVND, formatSoLuong } from "~/utils/formatResponse";
import { ColumnsType } from "antd/es/table";
import { DataType } from "~/interfaces/khachHang.type";
import ModalKhachHang from "./ModalKhachHang";
const { Option } = Select;

function AddVoucherKhachHang() {
  const [openModal, setOpenModal] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [form] = Form.useForm();
  const { confirm } = Modal;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dataHinhThucGiamGia, setDataHinhThucGiamGia] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await request.get("hinh-thuc-giam-gia");
        setDataHinhThucGiamGia(res.data.content);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const onFinish = (values: CreatedRequest) => {
    if (dataTable.length === 0) {
      message.warning("Bạn chưa chọn khách hàng muốn thêm");
      return;
    }
    confirm({
      title: "Xác Nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc thêm voucher này không?",
      okText: "OK",
      cancelText: "Hủy",
      onOk: async () => {
        const data = {
          ten: values.ten,
          ngayBatDau: values.dateRange[0].format("YYYY-MM-DD HH:mm:ss"),
          ngayKetThuc: values.dateRange[1].format("YYYY-MM-DD HH:mm:ss"),
          hinhThucGiam: { id: values.hinhThucGiam },
          donToiThieu: values.donToiThieu,
          giaTriGiam:
            values.hinhThucGiam === 2 ? values.giaTriGiam : values.giamToiDa,
          giamToiDa: values.giamToiDa,
          loaiVoucher: "CUSTOMER",
        };
        try {
          setLoading(true);
          const res = await request.post("voucher", data);
          try {
            setLoading(true);
            console.log(fakeList(res.data.id));

            await request.post("/voucher-chi-tiet/add", fakeList(res.data.id), {
              headers: {
                "Content-Type": "application/json",
              },
            });
            setLoading(false);
            message.success("Thêm voucher thành công");
            navigate("/admin/voucher");
          } catch (error) {
            console.log(error);
            message.error(error.response.data);
            setLoading(false);
          }
        } catch (error: any) {
          console.log(error);
          message.error(error.response.data);
          setLoading(false);
        }
      },
    });
  };
  const rangePresets: TimeRangePickerProps["presets"] = [
    { label: "Hạn 7 ngày", value: [dayjs(), dayjs().add(+7, "d")] },
    { label: "Hạn 14 ngày", value: [dayjs(), dayjs().add(+14, "d")] },
    { label: "Hạn 30 ngày", value: [dayjs(), dayjs().add(+30, "d")] },
    { label: "Hạn 90 ngày", value: [dayjs(), dayjs().add(+90, "d")] },
  ];
  const onChangeHinhThucGiamGia = () => {
    form.setFieldsValue({
      donToiThieu: 0,
      giaTriGiam: 0,
      giamToiDa: 0,
    });
  };

  // con
  const columns: ColumnsType<DataType> = [
    {
      title: "STT",
      align: "center",
      rowScope: "row",
      width: "60px",
      render: (_, __, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "Tên",
      dataIndex: "ten",
      key: "ten",
      ellipsis: true,
    },
    {
      title: "Liên hệ",
      dataIndex: "lienHe",
      key: "lienHe",
      ellipsis: true,
      render: (lienHe, record) => (
        <Space direction="vertical">
          <Text type="success">{record.soDienThoai}</Text>
          <Text type="warning">{record.email}</Text>
        </Space>
      ),
    },
    {
      title: "Số lần sử dụng",
      dataIndex: "soLanSuDung",
      key: "soLanSuDung",
      width: 130,
      render: (soLanSuDung, record) => (
        <Space>
          <InputNumber
            value={soLanSuDung}
            min={1}
            style={{ width: "100%" }}
            formatter={(value) => `${formatSoLuong(value)}`}
            parser={(value) => value.replace(/,/g, "")}
            onChange={(newSoLuong) =>
              handleEditSoLuong(record.idKH, newSoLuong)
            }
          />
          <Button type="link" style={{ padding: 0 }}>
            <Tooltip title="Xóa">
              <DeleteOutlined
                style={{ color: "red" }}
                onClick={() => deleteItem(record.idKH)}
              />
            </Tooltip>
          </Button>
        </Space>
      ),
    },
  ];

  const listKhachHang = (data: any) => {
    setDataTable((prevDataTable) => {
      const updatedDataTable = [...prevDataTable];

      // Update existing items and add new items
      data.forEach((item: any) => {
        const existingIndex = updatedDataTable.findIndex(
          (existingItem) => existingItem.id === item.id
        );

        if (existingIndex !== -1) {
          updatedDataTable[existingIndex] = {
            ...updatedDataTable[existingIndex],
            soLanSuDung: updatedDataTable[existingIndex].soLanSuDung + 1,
          };
        } else {
          updatedDataTable.push({
            idKH: item.id,
            key: item.id,
            ten: item.hoVaTen,
            soDienThoai: item.soDienThoai,
            email: item.email,
            soLanSuDung: 1,
          });
        }
      });

      return updatedDataTable;
    });
  };

  const handleEditSoLuong = (id, value) => {
    // Find the index of the item with the given id
    const index = dataTable.findIndex((item) => item.idKH === id);

    // Update the soLanSuDung value for the item at the found index
    if (index !== -1) {
      setDataTable((prevDataTable) => {
        const updatedDataTable = [...prevDataTable];
        updatedDataTable[index] = {
          ...updatedDataTable[index],
          soLanSuDung: value,
        };
        return updatedDataTable;
      });
    }
  };
  const deleteItem = (id) => {
    setDataTable((prevDataTable) =>
      prevDataTable.filter((item) => item.idKH !== id)
    );
  };

  const fakeList = (idVoucher) => {
    const dataFake = dataTable.map((item) => ({
      voucher: {
        id: idVoucher,
      },
      taiKhoan: {
        id: item.idKH,
      },
      soLanSuDung: item.soLanSuDung,
    }));
    return dataFake;
  };
  return (
    <Row>
      <Col span={12}>
        <Form
          form={form}
          onFinish={onFinish}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 17 }}>
          <Form.Item
            name="ten"
            label="Tên voucher"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Vui lòng điền tên voucher!",
              },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.soLanSuDung !== currentValues.soLanSuDung
            }>
            {({ getFieldValue }) =>
              getFieldValue("soLanSuDung") === 1 ? (
                <Form.Item
                  name="soLuong"
                  label="Số lượng"
                  rules={[
                    { required: true, message: "Bạn chưa điền số lượng!" },
                  ]}>
                  <InputNumber
                    defaultValue={0}
                    style={{ width: "100%" }}
                    min={1}
                    formatter={(value) => formatSoLuong(value)}
                    parser={(value: any) => value.replace(/,/g, "")}
                  />
                </Form.Item>
              ) : null
            }
          </Form.Item>
          <Form.Item
            label="Thời gian áp dụng"
            name="dateRange"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ngày bắt đầu ~ ngày kết thúc !",
              },
            ]}>
            <DatePicker.RangePicker
              style={{ width: "100%" }}
              presets={[
                {
                  label: (
                    <span aria-label="Current Time to End of Day">
                      Hiện tại ~ Cuối ngày
                    </span>
                  ),
                  value: () => [dayjs(), dayjs().endOf("day")],
                },
                ...rangePresets,
              ]}
              showTime
              format="DD/MM/YYYY HH:mm:ss"
            />
          </Form.Item>
          <Form.Item
            name="hinhThucGiam"
            label="Hình thức giảm giá"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn hình thức giảm giá !",
              },
            ]}>
            <Select
              onChange={onChangeHinhThucGiamGia}
              placeholder="Chọn hình thức giảm giá"
              options={dataHinhThucGiamGia.map((values: any) => ({
                label: values.ten,
                value: values.id,
              }))}></Select>
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.hinhThucGiam !== currentValues.hinhThucGiam
            }>
            {({ getFieldValue }) =>
              getFieldValue("hinhThucGiam") === 1 ? (
                <>
                  <Form.Item
                    initialValue={0}
                    name="donToiThieu"
                    label="Đơn tối thiểu"
                    rules={[
                      {
                        required: true,
                        message: "Bạn chưa điền đơn tối thiểu!",
                      },
                    ]}>
                    <InputNumber
                      style={{ width: "100%" }}
                      min={0}
                      step={5000}
                      formatter={(value) => `${formatGiaTienVND(value)}`}
                      parser={(value: any) => value.replace(/\D/g, "")}
                    />
                  </Form.Item>
                  <Form.Item
                    name="giamToiDa"
                    label="Số tiền giảm"
                    rules={[
                      {
                        required: true,
                        message: "Bạn chưa điền số tiền giảm!",
                      },
                      {
                        validator: (_, value) => {
                          const donToiThieu = form.getFieldValue("donToiThieu");
                          if (value >= donToiThieu) {
                            return Promise.reject(
                              new Error(
                                "Số tiền giảm phải nhỏ hơn đơn tối thiểu!"
                              )
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}>
                    <InputNumber
                      // defaultValue={0}
                      style={{ width: "100%" }}
                      min={1000}
                      step={5000}
                      formatter={(value) => `${formatGiaTienVND(value)}`}
                      parser={(value: any) => value.replace(/\D/g, "")}
                    />
                  </Form.Item>
                </>
              ) : getFieldValue("hinhThucGiam") === 2 ? (
                <>
                  <Form.Item
                    initialValue={0}
                    name="donToiThieu"
                    label="Đơn tối thiểu"
                    rules={[
                      {
                        required: true,
                        message: "Bạn chưa điền đơn tối thiểu!",
                      },
                    ]}>
                    <InputNumber
                      style={{ width: "100%" }}
                      min={0}
                      step={5000}
                      formatter={(value) => `${formatGiaTienVND(value)}`}
                      parser={(value: any) => value.replace(/\D/g, "")}
                    />
                  </Form.Item>
                  <Form.Item
                    name="giaTriGiam"
                    label="Giảm giá (%)"
                    rules={[
                      {
                        required: true,
                        message: "Bạn chưa điền giảm giá(%)",
                      },
                      {
                        validator: (_, value) => {
                          if (value <= 1) {
                            return Promise.reject(
                              new Error("Giá trị giảm phải lớn hơn 0%")
                            );
                          } else if (value > 100) {
                            return Promise.reject(
                              new Error("Chỉ giảm tối đa 100%")
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}>
                    <InputNumber
                      defaultValue={0}
                      style={{ width: "100%" }}
                      min={1}
                      max={100}
                      step={1}
                      formatter={(value) => `${value}%`}
                      parser={(value: any) => value!.replace("%", "")}
                    />
                  </Form.Item>
                  <Form.Item
                    name="giamToiDa"
                    label="Giảm tối đa"
                    rules={[
                      {
                        required: true,
                        message: "Bạn chưa điền giảm tối đa!",
                      },
                      {
                        validator: (_, value) => {
                          if (value <= 0) {
                            return Promise.reject(
                              new Error("Giá trị giảm tối đa lớn hơn 0")
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}>
                    <InputNumber
                      defaultValue={0}
                      style={{ width: "100%" }}
                      min={1000}
                      step={5000}
                      formatter={(value) => `${formatGiaTienVND(value)}`}
                      parser={(value: any) => value.replace(/\D/g, "")}
                    />
                  </Form.Item>
                </>
              ) : null
            }
          </Form.Item>
          <Form.Item name="soLanSuDung" label="Khách hàng">
            <Button onClick={() => setOpenModal(true)}>Chọn khách hàng</Button>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 15 }}>
            <Space style={{ float: "right" }}>
              <Button
                type="dashed"
                htmlType="reset"
                style={{ margin: "0 12px" }}>
                Reset
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Thêm
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Col>
      <Col span={12}>
        <Table
          pagination={{
            defaultPageSize: 5,
            onChange(page, pageSize) {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
          bordered
          columns={columns}
          dataSource={dataTable}
        />
      </Col>
      <ModalKhachHang
        list={dataTable}
        listKhachHang={listKhachHang}
        openModal={openModal}
        closeModal={() => setOpenModal(false)}
      />
    </Row>
  );
}

export default AddVoucherKhachHang;
