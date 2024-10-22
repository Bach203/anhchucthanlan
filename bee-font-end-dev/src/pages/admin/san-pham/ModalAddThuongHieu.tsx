import { useState } from "react";
import { Button, Form, Input, Modal, message } from "antd";
import request from "~/utils/request";
import { ExclamationCircleFilled } from "@ant-design/icons";
function ModalAddThuongHieu({ openModal, closeModal, addThuongHieu }) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const offModal = () => {
    closeModal();
    form.resetFields();
  };
  const onCreate = (values) => {
    confirm({
      title: "Xác Nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc thêm thương hiệu này không?",
      okText: "OK",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const res = await request.post("/thuong-hieu", {
            ten: values.ten,
          });
          message.success("Thêm thương hiệu thành công");
          form.resetFields();
          addThuongHieu(res.data);
          closeModal();
        } catch (error) {
          message.error("Thêm thương hiệu thất bại");
          console.log(error);
        }
      },
    });
  };
  return (
    <Modal
      title="THÊM THƯƠNG HIỆU"
      open={openModal}
      onCancel={offModal}
      width={600}
      footer={[
        <Button
          key="back"
          type="dashed"
          onClick={() => {
            form.resetFields();
          }}
        >
          Reset
        </Button>,
        <Button
          key="done"
          type="primary"
          onClick={() => {
            form
              .validateFields()
              .then((values) => {
                onCreate(values);
              })
              .catch((info) => {
                console.log("Validate Failed:", info);
              });
          }}
        >
          Lưu
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{ modifier: "public" }}
      >
        <Form.Item
          label="Tên thương hiệu"
          name="ten"
          initialValue={null}
          rules={[
            { required: true, message: "Vui lòng nhập tên thương hiệu!" },
          ]}
        >
          <Input placeholder="Nhập tên thương hiệu" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
export default ModalAddThuongHieu;
