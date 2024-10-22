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
  Checkbox,
} from "antd";

import { requestTimMatKhau } from "~/utils/request";
import { ExclamationCircleFilled } from "@ant-design/icons";
import axios from "axios";
import { Option } from "antd/es/mentions";
import { requestDC } from "~/utils/requestDiaChi";
const tailLayout = {
  wrapperCol: { offset: 19, span: 16 },
};
interface Option {
  value?: number | null;
  label: React.ReactNode;
  children?: Option[];
  isLeaf?: boolean;
}

function ModalAddDiaChi({ openModal, closeModal }) {
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState<Option[]>([]);
  const [test, setTest] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { confirm } = Modal;
  const [wards, setWards] = useState<Option[]>([]);
  const [districts, setDistricts] = useState<Option[]>([]);
  const onSubmit = async (values: any) => {
    const getProvinceLabelFromId = () => {
      const province = provinces.find((p) => p.value === values.thanhPho);
      return province?.label;
    };
    const getDistrictLabelFromId = () => {
      const district = districts.find((d) => d.value === values.quanHuyen);
      return district?.label;
    };
    const getWardLabelFromId = () => {
      const ward = wards.find((w) => w.value === values.phuongXa);
      return ward?.label;
    };

    const diaChi = `${getWardLabelFromId()}, ${getDistrictLabelFromId()}, ${getProvinceLabelFromId()}`;

    confirm({
      title: "Xác Nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc thêm địa chỉ mới không?",
      okText: "OK",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          
          setLoading(true);
          values.diaChi = diaChi;
          values.trangThaiDiaChi =
            // values.trangThaiDiaChi === undefined
            //   ? "DEFAULT"
            //   : values.trangThaiDiaChi === true
            //   ? "DEFAULT"
            //   : "ACTIVE";
            values.trangThaiDiaChi === undefined ? "ACTIVE" : "DEFAULT";
          const idTaiKhoan = localStorage.getItem("acountId");
          const local123 = localStorage.getItem("refreshToken");
          console.log("ID Tài Khoản:", idTaiKhoan); // In giá trị của idTaiKhoan
          console.log("Refresh Token:", local123); // In giá trị của refreshToken
          
          const response = await requestDC.post(
            `/dia-chi/add?id=${idTaiKhoan}`,
            values,
            {
              headers: {
                Authorization: `Bearer ${local123}`,
              },
            }
          );
          
          console.log("Response from API:", response); // In dữ liệu từ API
          setLoading(false);
          message.success("Thêm địa chỉ mới thành công");
          form.resetFields();
          closeModal();
        } catch (error: any) {
          console.log("Error:", error); // In lỗi ra để xác định lý do
          if (error.response && error.response.data) {
            message.error(error.response.data.message);
          } else {
            message.error("Có lỗi xảy ra khi địa chỉ mới.");
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
            params: { province_id: id },
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
        // Load wards when selecting a district
        const res = await axios.get(
          `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward`,
          {
            params: { district_id: id },
            headers: {
              token: "49e20eea-4a6c-11ee-af43-6ead57e9219a",
              ContentType: "application/json",
            },
          }
        );

        const data = res.data.data.map((item: any) => ({
          value: item.WardCode,
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


  return (
    <Modal
      style={{ top: 20 }}
      width={600}
      title="Địa chỉ của tôi"
      open={openModal}
      onCancel={closeModal}
      footer
    >
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

        <Form.Item label="Đặt làm mặc định">
          <Form.Item name="trangThaiDiaChi" valuePropName="checked">
            <Checkbox />
          </Form.Item>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Space>
            <Button
              style={{ marginRight: "110px" }}
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Thêm
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ModalAddDiaChi;
