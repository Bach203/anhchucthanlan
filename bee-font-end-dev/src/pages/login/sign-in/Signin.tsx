import {
  ExclamationCircleFilled,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Button, Card, Form, Input, Modal, Row, Col, message } from "antd";
import * as React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DangNhapRequest } from "~/interfaces/taiKhoan.type";
import request, { requestDangNhap, requestLogout } from "~/utils/request";

const { confirm } = Modal;

const DangNhap: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Thêm state để lưu thông báo lỗi

  const onFinish = async (values: DangNhapRequest) => {
    try {
      const response = await requestDangNhap.post("/sign-in", values);
      const { refreshToken, roleId, acountId, ten } = response.data; // Assuming your response contains accessToken and refreshToken
      localStorage.setItem("refreshToken", refreshToken); // Store the access token
      localStorage.setItem("roleId", roleId);
      localStorage.setItem("acountId", acountId);
      localStorage.setItem("ten", ten);
      // localStorage.setItem("idGioHang", idGioHang);
      // console.log("IdGioHang",idGioHang)
      console.log("acountId", acountId);
      // console.log("AA  "+ response.data.refreshToken)
      console.log("BB  " + response.data.roleId);

      if (response.data.roleId === 1) {
        // localStorage.setItem("2","11")
        navigate("/admin/ban-hang-tai-quay");
      } else if (response.data.roleId === 2) {
        // localStorage.setItem("2","111111")
        navigate("/admin/ban-hang-tai-quay");
      } else if (response.data.roleId === 3) {
        try {
          const res = await request.get(`gio-hang/tai-khoan/${acountId}`);
          localStorage.setItem("cartIdTaiKhoan", res.data.id);
        } catch (error) {
          console.log(error);
        }
        navigate("/");
        window.location.reload();
      }
      message.success("Đăng nhập thành công");
    } catch (error: any) {
      console.log("Error:", error);
  
      // Kiểm tra xem có phản hồi từ server hay không
      if (error.response) {
          const status = error.response.status;
          const data = error.response.data;
  
          if (status === 403) {
              // Thông báo lỗi khi tài khoản bị khóa
              message.error("Tài khoản của bạn đã bị khóa.");
          } else if (data && data.message) {
              // Thông báo lỗi cụ thể từ server
              message.error(data.message);
          } else {
              // Thông báo lỗi chung khi không có thông tin cụ thể
              message.error("Có lỗi xảy ra khi đăng nhập.");
          }
      } else {
          // Thông báo lỗi khi không có phản hồi từ server
          message.error("Có lỗi xảy ra khi kết nối với máy chủ.");
      }
  }
   finally {
      setLoading(false);
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
      <Card title="Đăng nhập">
        <Form
          labelCol={{ flex: "110px" }}
          labelAlign="left"
          labelWrap
          wrapperCol={{ flex: 1 }}
          colon={false}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          layout="horizontal"
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Bạn chưa điền E-mail!",
              },
              {
                type: "email",
                message: "E-mail không hợp lệ!",
              },
            ]}
            style={{ width: "100%" }} // Đặt chiều rộng 100%
          >
            <Input prefix={<MailOutlined />} placeholder="E - Mail" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Bạn chưa điền Mật khẩu!",
              },
            ]}
            style={{ width: "100%" }}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>
          <Form.Item style={{ width: 500 }}>
            <Row style={{ marginBottom: 10, height: 35 }}>
              <Col span={24}>
                <Button
                  style={{ height: "100%", width: "100%" }}
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                >
                  Đăng nhập
                </Button>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Link to="/sign-up">
                  <Button
                    style={{ width: "100%" }}
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                  >
                    Đăng ký
                  </Button>
                </Link>
              </Col>
              <Col span={1}></Col>
              <Col span={11}>
                <Link to="/forgot-password">
                  <Button
                    style={{ width: "100%" }}
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                  >
                    Quên mật khẩu?
                  </Button>
                </Link>
              </Col>
            </Row>
          </Form.Item>
          {error && (
            <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
          )}
        </Form>
      </Card>
    </div>
  );
};

export default DangNhap;
