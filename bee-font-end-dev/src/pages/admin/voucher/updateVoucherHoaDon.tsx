import { ExclamationCircleFilled } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Skeleton,
  Space,
  DatePicker,
  message,
  Select,
  InputNumber,
  TimeRangePickerProps,
  Typography,
  Divider,
} from "antd";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UpdatedRequest } from "~/interfaces/voucher.type";
import request from "~/utils/request";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { formatGiaTienVND, formatSoLuong } from "~/utils/formatResponse";
dayjs.extend(customParseFormat);
const { Text } = Typography;
const { RangePicker } = DatePicker;

const { confirm } = Modal;
const { Option } = Select;

export function UpdateVoucherHoaDon() {
  const navigate = useNavigate();
  const [loadingForm, setLoadingForm] = useState(false);
  const [form] = Form.useForm();
  let { id } = useParams();
  const [dataHinhThucGiamGia, setDataHinhThucGiamGia] = useState([]);
  const [ngayBatDau, setNgayBatDau] = useState(null);
  const [ngayKetThuc, setNgayKetThuc] = useState(null);
  const [daSuDung, setDaSuDung] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await request.get("hinh-thuc-giam-gia");
        setDataHinhThucGiamGia(res.data.content);
      } catch (error) {
        console.log(error);
      }
    };
    const getOne = async () => {
      setLoadingForm(true);
      try {
        const res = await request.get("voucher/" + id);
        const ngayBatDau = dayjs(res.data?.ngayBatDau, "YYYY-MM-DD HH:mm:ss");
        const ngayKetThuc = dayjs(res.data?.ngayKetThuc, "YYYY-MM-DD HH:mm:ss");

        form.setFieldsValue({
          id: res.data?.id,
          ma: res.data?.ma,
          ten: res.data?.ten,
          soLanSuDung: res.data.soLuong !== null ? 1 : 0,
          soLuong: res.data?.soLuong,
          dateRange: [ngayBatDau, ngayKetThuc],
          hinhThucGiam: res.data?.hinhThucGiam.id,
          donToiThieu: res.data?.donToiThieu,
          giaTriGiam: res.data?.giaTriGiam,
          giamToiDa: res.data?.giamToiDa,
        });
        setLoadingForm(false);
        setNgayBatDau(res.data?.ngayBatDau);
        setNgayKetThuc(res.data?.ngayKetThuc);

        await getDaSuDung(res.data?.ngayBatDau, res.data?.ngayKetThuc);
      } catch (error) {
        console.log(error);
        setLoadingForm(false);
      }
    };
    getOne();
    fetchData();
  }, [id]);

  const getDaSuDung = async (startDate, endDate) => {
    try {
      const res = await request.get("voucher/da-su-dung", {
        params: {
          idVoucher: id,
          startDate: dayjs(startDate).format("YYYY-MM-DD"),
          endDate: dayjs(endDate).format("YYYY-MM-DD"),
        },
      });
      setDaSuDung(res?.data);
    } catch (error) {
      console.log(error);
      setLoadingForm(false);
    }
  };

  const onRangeChange = (dates: null | (Dayjs | null)[]) => {
    if (dates) {
      getDaSuDung(dates[0], dates[1]);
    } else {
      console.log("Clear");
    }
  };

  const onFinish = (values: UpdatedRequest) => {
    confirm({
      title: "Xác Nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc cập nhật voucher này không?",
      okText: "OK",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const data = {
            ten: values.ten,
            ngayBatDau: values.dateRange[0].format("YYYY-MM-DD HH:mm:ss"),
            ngayKetThuc: values.dateRange[1].format("YYYY-MM-DD HH:mm:ss"),
            hinhThucGiam: { id: values.hinhThucGiam },
            donToiThieu: values.donToiThieu,
            giaTriGiam:
              values.hinhThucGiam === 2 ? values.giaTriGiam : values.giamToiDa,
            giamToiDa: values.giamToiDa,
            soLuong: values.soLuong,
            loaiVoucher: "INVOICE",
          };
          const res = await request.put("voucher/" + id, data);
          console.log(values);
          if (res.data) {
            message.success("Cập nhật voucher thành công");
            navigate("/admin/voucher");
          } else {
            console.error("Phản hồi API không như mong đợi:", res);
          }
        } catch (error: any) {
          console.log(values);
          if (error.response && error.response.status === 400) {
            message.error(error.response.data.message);
          } else {
            console.error("Lỗi không xác định:", error);
            message.error("Cập nhật voucher thất bại");
          }
        }
      },
    });
  };
  const onChangeHinhThucGiamGia = () => {
    form.setFieldsValue({
      donToiThieu: 0,
      giaTriGiam: 0,
      giamToiDa: 0,
    });
  };
  const rangePresets: TimeRangePickerProps["presets"] = [
    { label: "Hạn 7 ngày", value: [dayjs(), dayjs().add(+7, "d")] },
    { label: "Hạn 14 ngày", value: [dayjs(), dayjs().add(+14, "d")] },
    { label: "Hạn 30 ngày", value: [dayjs(), dayjs().add(+30, "d")] },
    { label: "Hạn 90 ngày", value: [dayjs(), dayjs().add(+90, "d")] },
  ];
  const clickHuyBo = () => {
    confirm({
      title: "Xác Nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc hủy bỏ voucher này không?",
      okText: "Có",
      cancelText: "Không",
      onOk: async () => {
        try {
          await request.put("voucher/cancel-voucher/" + id);
          message.success("Hủy bỏ voucher thành công");
          navigate("/admin/voucher");
        } catch (error) {
          message.error("Hủy bỏ voucher thất bại");
          console.log(error);
        }
      },
    });
  };
  return (
    <>
      <Skeleton loading={loadingForm}>
        <Space direction="vertical">
          <Space size={[230, 0]} wrap>
            <Text strong>Đã sử dụng: {daSuDung}</Text>
            {ngayBatDau != null && (
              <RangePicker
                defaultValue={[dayjs(ngayBatDau), dayjs(ngayKetThuc)]}
                onChange={onRangeChange}
                format={"DD/MM/YYYY"}
                allowClear={false}
              />
            )}
          </Space>
          <Divider style={{ margin: 0 }} />
          <Form
            form={form}
            onFinish={onFinish}
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 750 }}
          >
            <Form.Item label="mã voucher">
              <Text strong>{form.getFieldValue("ma")}</Text>
            </Form.Item>
            <Form.Item
              name="ten"
              label="Tên voucher"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Vui lòng điền tên voucher!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Thời gian áp dụng"
              name="dateRange"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn ngày bắt đầu ~ ngày kết thúc !",
                },
              ]}
            >
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
              ]}
            >
              <Select
                onChange={onChangeHinhThucGiamGia}
                placeholder="Chọn hình thức giảm giá"
                options={dataHinhThucGiamGia.map((values: any) => ({
                  label: values.ten,
                  value: values.id,
                }))}
              ></Select>
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.hinhThucGiam !== currentValues.hinhThucGiam
              }
            >
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
                      ]}
                    >
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
                            const donToiThieu =
                              form.getFieldValue("donToiThieu");
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
                      ]}
                    >
                      
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
                      ]}
                    >
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
                      ]}
                    >
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
                      ]}
                    >
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
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Space style={{ float: "right" }}>
                <Button type="primary" htmlType="submit">
                  Cập nhật
                </Button>
                <Button
                  type="primary"
                  htmlType="button"
                  danger
                  onClick={clickHuyBo}
                >
                  Hủy bỏ
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Space>
      </Skeleton>
    </>
  );
}

export default UpdateVoucherHoaDon;
