import { Button, Card, Input, Modal, message } from "antd";
import React, { useState } from "react";
import { Form } from "antd";
import { request4s } from "~/utils/request";
import request4ss from "~/utils/requestImg";

interface ModalAddKhachHangProps {
  open: boolean;
  onCancel: () => void;
  loadData: () => void;
}

const ModalAddKhachHang: React.FC<ModalAddKhachHangProps> = ({
  open,
  onCancel,
  loadData,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await request4ss.post("khach-hang/add", values);
      console.log("Kết quả từ API:", response.data);
      // Hiển thị thông báo thành công
      message.success("Thêm khách hàng thành công");
      // Xóa dữ liệu trong modal
      form.resetFields();
      setLoading(false);
      // Tắt modal
      onCancel();
      loadData();
    } catch (error) {
      // Xử lý lỗi từ API (error) ở đây, ví dụ hiển thị thông báo lỗi cho người dùng.
      console.error("Lỗi từ API:", error);
      message.error("Có lỗi xảy ra khi thêm khách hàng");
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={""}
      title="Thêm khách hàng mới"
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Họ và tên"
          name="hoVaTen"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập Họ và tên!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              type: "email",
              message: "Email không hợp lệ!",
            },
            {
              required: true,
              message: "Vui lòng nhập email!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Số Điện Thoại"
          name="soDienThoai"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập số điện thoại!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Thêm mới
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalAddKhachHang;
