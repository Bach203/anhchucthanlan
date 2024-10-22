import { ExclamationCircleFilled, MailOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  ColorPicker,
  Form,
  Input,
  Modal,
  Space,
  message,
  Row,
  Col,
} from "antd";
import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuenMatKhauRequest, DataType } from "~/interfaces/taiKhoan.type";
import { requestTimMatKhau1 } from "~/utils/request";
const { confirm } = Modal;
const add: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const onFinish = (values: QuenMatKhauRequest) => {
    confirm({
      title: "Xác Nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn tìm lại mật khẩu không?",
      okText: "OK",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          setLoading(true);
          const response = await requestTimMatKhau1.post("/forgot-password", {
            email: values.email,
          });
          console.log("Response from API:", response); // In dữ liệu từ API
          message.success("Tìm lại mật khẩu thành công.Bạn hãy check mail");
          navigate("/sign-in");
        } catch (error) {
          console.log("Error:", error); // In lỗi ra để xác định lý do
          message.error("Có lỗi xảy ra khi tìm mật khẩu");
        } finally {
          setLoading(false);
        }
      },
    });
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "70vh",
        }}
      >
        <Col
          span={24}
          style={{
            display: "flex",
            justifyContent: "center",
            minHeight: "5vh",
            minWidth: "50vh",
          }}
        >
          <Card
            title="Quên mật khẩu"
            style={{ minHeight: "60vh", maxWidth: 500 }}
          >
            <Form onFinish={onFinish} layout="horizontal">
              <Form.Item
                name="email"
                rules={[
                  {
                    whitespace: true,
                    required: true,
                    message: "Vui lòng nhập email!",
                  },
                  {
                    max: 200,
                    message: "Email không được vượt quá 200 ký tự",
                  },
                  {
                    type: "email",
                    message: "E-mail không hợp lệ!",
                  },
                ]}
                style={{ width: "400px" }} // Đặt chiều rộng 100%
              >
                <Input prefix={<MailOutlined />} placeholder="E-mail" />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 5 }}>
                <Space>
                  <Button type="dashed" htmlType="reset">
                    Reset
                  </Button>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Xác nhận
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </div>
    </>
  );
};

export default add;
