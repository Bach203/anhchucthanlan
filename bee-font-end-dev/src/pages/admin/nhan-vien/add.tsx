import React, { useState, useEffect } from "react";
import { FaHome, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Cascader,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Space,
  message,
  Select,
} from "antd";

import {requestTimMatKhau} from "~/utils/request";
import { ExclamationCircleFilled } from "@ant-design/icons";
import axios from "axios";
import { Option } from "antd/es/mentions";
const tailLayout = {
  wrapperCol: { offset: 19, span: 16 },
};
interface Option {
  value?: number | null;
  label: React.ReactNode;
  children?: Option[];
  isLeaf?: boolean;
}

const AddNV: React.FC = () => {
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState<Option[]>([]);
  const [test, setTest] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { confirm } = Modal;
  const [wards, setWards] = useState<Option[]>([]);
  const [districts, setDistricts] = useState<Option[]>([]);
  const onSubmit = async (values: any) => {
    confirm({
      title: "Xác Nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc thêm nhân viên không?",
      okText: "OK",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          setLoading(true);
          const local123 = localStorage.getItem('refreshToken');
          const response = await requestTimMatKhau.post("nhan-vien/add", values,
          {
            headers: {
              Authorization: `Bearer ${local123}`
            }
          }
          );
          console.log("Response from API:", response); // In dữ liệu từ API
          setLoading(false);
          message.success("Thêm nhân viên thành công");
          navigate("/admin/nhan-vien");
        } catch (error: any) {
          console.log("Error:", error); // In lỗi ra để xác định lý do
          if (error.response && error.response.data) {
            message.error(error.response.data.message);
          } if(error.response && error.response.status === 403) {
            message.error("Số điện thoại đã tồn tại.");
          } else {
            message.error("Có lỗi xảy ra khi thêm nhân viên.");
          }
          setLoading(false);
        }
      },
    });
  };
  const fetchDistricts = async (idProvince: string) => {
    try {
      const districtRes = await axios.get(
        `https://online-gateway.ghn.vn/shiip/public-api/master-data/district?`,
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
  const fetchWards = async (idDistrict: string) => {
    try {
      const wardRes = await axios.get(
        `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward`,
        {
          params: {
            district_id: idDistrict,
          },
          headers: {
            token: "4d0b3d7c-65a5-11ee-a59f-a260851ba65c",
            ContentType: "application/json",
          },
        }
      );

      const wardOptions: Option[] = wardRes.data.data.map((ward: any) => ({
        value: ward.WardCode,
        label: ward.WardName,
        isLeaf: false,
      }));
      setWards(wardOptions);
    } catch (error) {
      console.error(error);
    }
  };
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await axios.get(
          "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
          {
            headers: {
              token: "49e20eea-4a6c-11ee-af43-6ead57e9219a",
              ContentType: "application/json",
            },
          }
        );

        const provinceOptions: Option[] = res.data.data.map(
          (province: any) => ({
            value: province.ProvinceID,
            label: province.ProvinceName,
            isLeaf: false,
          })
        );
        setProvinces(provinceOptions);
        setTest(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProvinces();
  }, []);

  const loadData = async (selectedOptions: Option[]) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];

    if (targetOption && typeof targetOption.value === "number") {
      const id = targetOption.value;
      setTest(false);

      try {
        if (!targetOption.isLeaf && test === false) {
          // Load districts when selecting a province
          const res = await axios.get(
            "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
            {
              params: {
                province_id: id,
              },
              headers: {
                token: "49e20eea-4a6c-11ee-af43-6ead57e9219a",
                ContentType: "application/json",
              },
            }
          );

          const data = res.data.data.map((item: any) => ({
            value: item.DistrictID,
            label: item.DistrictName,
            isLeaf: false,
          }));

          targetOption.children = data;
          setProvinces([...provinces]);
          setTest(true);
        } else {
          console.log(id);

          // Load wards when selecting a district
          const res = await axios.get(
            `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward`,
            {
              params: {
                district_id: id,
              },
              headers: {
                token: "49e20eea-4a6c-11ee-af43-6ead57e9219a",
                ContentType: "application/json",
              },
            }
          );

          const data = res.data.data.map((item: any) => ({
            value: item.DistrictID,
            label: item.WardName,
            isLeaf: true,
          }));

          targetOption.children = data;
          setProvinces([...provinces]);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  const getProvinceLabelFromId = (id: number | null | undefined) => {
    const province = provinces.find((p) => p.value === id);
    return province?.label;
  };

  const getDistrictLabelFromId = (id: number | null | undefined) => {
    const district = districts.find((d) => d.value === id);
    return district?.label;
  };

  const getWardLabelFromId = (id: number | null | undefined) => {
    const ward = wards.find((w) => w.value === id);
    return ward?.label;
  };
  const onChange = (value: (string | number)[], selectedOptions: Option[]) => {
    console.log(value, selectedOptions);
  };
  return (
    
    <Card title="THÊM NHÂN VIÊN">
      <Row>
        
        <Col span={16}>
          <Form form={form} onFinish={onSubmit} {...formItemLayout}>
            <Form.Item
              name="hoVaTen"
              label="Họ và Tên:"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Vui lòng nhập họ và tên!",
                },
                {
                  pattern: /^[\p{L}\s']+$/u,
                  message: "Họ và tên không hợp lệ!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="canCuocCongDan"
              label="CCCD/Mã định danh:"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Vui lòng nhập CMT/CCCD!",
                },
                {
                  pattern: /^\d{9}$|^\d{12}$/,
                  message: "CMT/CCCD không hợp lệ!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="ngaySinh"
              label="Ngày Sinh:"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn ngày sinh!",
                },
                {
                  async validator(_, value) {
                    const currentDate = new Date();
                    const selectedDate = new Date(value);
                    if (value !== undefined) {
                      if (selectedDate < currentDate) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Ngày sinh không được là ngày tương lai!")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <DatePicker format={"DD/MM/YYYY"} placeholder="chọn ngày sinh" />
            </Form.Item>
            <Form.Item
              name="gioiTinh"
              label="Giới tính"
              initialValue="MALE"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn giới tính",
                },
              ]}
            >
              <Radio.Group>
                <Radio value="MALE">Nam</Radio>
                <Radio value="FEMALE">Nữ</Radio>
                <Radio value="OTHER">Khác</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="soDienThoai"
              label="Số Điện Thoại:"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Bạn chưa điền số điện thoại!",
                },
                {
                  pattern: /^0[35789]\d{8}$/,
                  message: "Số điện thoại không hợp lệ!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="E-mail:"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Bạn chưa điền e-mail!",
                },
                {
                  type: "email",
                  message: "E-mail không hợp lệ!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="thanhPho"
              label="Tỉnh / Thành"
              rules={[
                {
                  required: true,
                  message: "Bạn chưa điền Tỉnh / Thành !",
                },
              ]}
            >
              <Select
                options={provinces}
                placeholder="Tỉnh/ Thành Phố"
                onChange={(value) => {
                  form.setFieldsValue({
                    quanHuyen: undefined,
                    phuongXa: undefined,
                  });
                  fetchDistricts(value);
                }}
              />
            </Form.Item>
            <Form.Item
              name="quanHuyen"
              label="Quận / Huyện:"
              rules={[
                {
                  required: true,
                  message: "Bạn chưa điền Quận / Huyện!",
                },
              ]}
            >
              <Select
                options={districts}
                placeholder="Quận / Huyện"
                onChange={(value) => {
                  form.setFieldsValue({ phuongXa: undefined });
                  fetchWards(value);
                }}
              />
            </Form.Item>
            <Form.Item
              name="phuongXa"
              label="Phường / Xã"
              rules={[
                {
                  required: true,
                  message: "Bạn chưa điền Phường / Xã !",
                },
              ]}
            >
              <Select options={wards} placeholder="Phường / Xã" />
            </Form.Item>
            <Form.Item
              name="diaChiCuThe"
              label="Địa chỉ cụ thể"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Bạn chưa điền đia chỉ!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Space>
                <Button
                  type="dashed"
                  htmlType="reset"
                  style={{ margin: "0 12px" }}
                >
                  Reset
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Thêm
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Col>
        <Col span={4}></Col>
      </Row>
    </Card>
  );
};

export default AddNV;
