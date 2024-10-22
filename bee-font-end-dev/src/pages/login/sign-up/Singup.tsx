import React, { useState, useEffect } from "react";
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

import {requestDangKi} from "~/utils/request";
import {
  ExclamationCircleFilled,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  LockOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { Option } from "antd/es/mentions";
import { KhachHangRequest, DataType } from "~/interfaces/khachHang.type";
const tailLayout = {
  wrapperCol: { offset: 19, span: 16 },
};
interface Option {
  value?: number | null;
  label: React.ReactNode;
  children?: Option[];
  isLeaf?: boolean;
}

const dangKiKhachHang: React.FC = () => {
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState<Option[]>([]);
  const [test, setTest] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { confirm } = Modal;
  const [wards, setWards] = useState<Option[]>([]);
  const [districts, setDistricts] = useState<Option[]>([]);
  const onSubmit = async (values: KhachHangRequest) => {
    try {
      setLoading(true);
      const response = await requestDangKi.post("/sign-up", {
        hoVaTen: values.hoVaTen,
        soDienThoai: values.soDienThoai,
        email: values.email,
        matKhau: values.matKhau,
      });
      if (response.status === 200) {
        // Nếu mã trạng thái HTTP là 200, thực hiện các hành động thành công.
        message.success("Tạo tài khoản thành công. Bạn hãy check mail");
        navigate("/sign-in");
      } else {
        // Nếu mã trạng thái HTTP không phải 200, hiển thị thông báo lỗi từ server.
        message.error("Có lỗi xảy ra khi tạo tài khoản.");
      }
    } catch (error: any) {
      console.log("Error:", error); // In lỗi ra để xác định lý do
      if (error.response && error.response.data) {
        message.error(error.response.data.message);
      } else if (error.response && error.response.status === 403) {
        message.error("Email đã tồn tại trên hệ thống.");
      } else {
        message.error("Có lỗi xảy ra khi tạo tài khoản.");
      }
    } finally {
      setLoading(false);
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
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh",
      }}
    >
      <Col span={12}>
        <Card
          title="Đăng ký tài khoản"
          style={{
            width:"700px",
            display: "grid",
            placeItems: "center",
            minHeight: "60vh",
            minWidth: "50vh",
          }}
        >
          <Row>
            <Form form={form} onFinish={onSubmit} layout="vertical">
              <Form.Item
                name="hoVaTen"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập họ và tên!",
                  },
                  {
                    pattern: /^[\p{L}\s']+$/u,
                    message: "Họ và tên không hợp lệ!",
                  },
                ]}
                style={{ width: "500px" }} // Đặt chiều rộng 100%
              >
                <Input prefix={<UserOutlined />} placeholder="Họ và Tên" />
              </Form.Item>
              <Form.Item
                name="soDienThoai"
                rules={[
                  {
                    required: true,
                    message: "Bạn chưa điền số điện thoại!",
                  },
                  {
                    pattern: /^0[35789]\d{8}$/,
                    message: "Số điện thoại không hợp lệ!",
                  },
                ]}
                style={{ width: "100%" }} // Đặt chiều rộng 100%
              >
                <Input prefix={<PhoneOutlined />} placeholder="Số Điện Thoại" />
              </Form.Item>
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Bạn chưa điền E-mail!",
                  },
                  {
                    max: 200,
                    message: 'Email không được vượt quá 200 ký tự',
                  },
                  {
                    type: "email",
                    message: "E-mail không hợp lệ!",
                  },
                ]}
                style={{ width: "100%" }} // Đặt chiều rộng 100%
              >
                <Input prefix={<MailOutlined />} placeholder="E-mail" />
              </Form.Item>
              <Form.Item
                name="matKhau"
                rules={[
                  {
                    required: true,
                    message: 'Bạn chưa điền Mật khẩu!',
                  },
                  {
                    min: 8,
                    message: 'Mật khẩu phải có ít nhất 8 ký tự',
                  },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                    message: 'Mật khẩu phải chứa ít nhất một chữ in hoa, một chữ thường, một số và một ký tự đặc biệt',
                  },
                ]}
                style={{ width: "100%" }} // Đặt chiều rộng 100%
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Mật khẩu"
                />
              </Form.Item>
              <Form.Item {...tailLayout} wrapperCol={{ offset: 7 }}>
                <Space>
                  <Button type="dashed" htmlType="reset">
                    Reset
                  </Button>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Đăng ký
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Row>
        </Card>
      </Col>
    </div>
  );
};

export default dangKiKhachHang;
