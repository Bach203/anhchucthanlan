import { ExclamationCircleFilled } from "@ant-design/icons";
import {
  Button,
  Card,
  ColorPicker,
  Form,
  Input,
  Modal,
  Space,
  message,
} from "antd";
import { Color } from "antd/es/color-picker";
import * as React from "react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CreatedRequest, DataType } from "~/interfaces/mauSac.type";
import request from "~/utils/request";
const { confirm } = Modal;
const add: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [colorHex, setColorHex] = useState<Color | string>("");
  const hexString = useMemo(
    () =>
      typeof colorHex === "string"
        ? colorHex.toUpperCase()
        : colorHex.toHexString().toUpperCase(),
    [colorHex]
  );
  const onFinish = (values: CreatedRequest) => {
    confirm({
      title: "Xác Nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc thêm màu sắc này không?",
      okText: "OK",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          setLoading(true);
          await request.post("mau-sac", {
            ma: hexString,
            ten: values.ten,
          });
          setLoading(false);
          message.success("Thêm màu sắc thành công");
          navigate("/admin/mau-sac");
        } catch (error: any) {
          console.log(error);
          message.error(error.response.data.message);
          setLoading(false);
        }
      },
    });
  };
  return (
    <>
      <Card title="THÊM MÀU SẮC">
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 500 }}
          onFinish={onFinish}
          layout="horizontal"
        >
          <Form.Item
            label="Mã"
            name="ma"
            initialValue={null}
            rules={[{ required: true, message: "Vui lòng nhập mã màu sắc!" }]}
          >
            <ColorPicker
              format={"hex"}
              onChange={setColorHex}
              showText
              disabledAlpha
            />
          </Form.Item>
          <Form.Item
            name="ten"
            label="Tên"
            rules={[
              {
                whitespace: true,
                required: true,
                message: "Vui lòng nhập tên màu sắc!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 17 }}>
            <Space>
              <Button type="dashed" htmlType="reset">
                Reset
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Thêm
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default add;
