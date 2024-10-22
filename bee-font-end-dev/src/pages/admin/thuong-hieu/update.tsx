import { ExclamationCircleFilled } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Skeleton,
  Space,
  Switch,
  message,
} from "antd";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UpdatedRequest } from "~/interfaces/thuongHieu.type";
import request from "~/utils/request";
const { confirm } = Modal;
const UpdatethuongHieu: React.FC = () => {
  const navigate = useNavigate();
  const [loadingForm, setLoadingForm] = useState(false);
  const [form] = Form.useForm();
  let { id } = useParams();
  useEffect(() => {
    const getOne = async () => {
      setLoadingForm(true);
      try {
        const res = await request.get("thuong-hieu/" + id);
        const trangThaiValue =
          res.data?.trangThai.ten === "ACTIVE" ? true : false;
        form.setFieldsValue({
          ten: res.data?.ten,
          trangThai: trangThaiValue,
        });
        setLoadingForm(false);
      } catch (error) {
        console.log(error);
        setLoadingForm(false);
      }
    };
    getOne();
  }, [id]);
  const onFinish = (values: UpdatedRequest) => {
    confirm({
      title: "Xác Nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc cập nhật thương hiệu này không?",
      okText: "OK",
      cancelText: "Hủy",
      onOk: async () => {
        // setLoading(true);
        try {
          const res = await request.put("thuong-hieu/" + id, {
            ten: values.ten,
            trangThai: values.trangThai == true ? "ACTIVE" : "INACTIVE",
          });
          if (res.data) {
            message.success("Cập nhật thương hiệu thành công");
            navigate("/admin/thuong-hieu");
          } else {
            console.error("Phản hồi API không như mong đợi:", res);
          }
        } catch (error: any) {
          if (error.response && error.response.status === 400) {
            message.error(error.response.data.message);
          } else {
            console.error("Lỗi không xác định:", error);
            message.error("Cập nhật thương hiệu thất bại");
          }
        }
      },
    });
  };
  return (
    <>
      <Card title="CẬP NHẬT THƯƠNG HIỆU">
        <Skeleton loading={loadingForm}>
          <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 500 }}
            onFinish={onFinish}
            layout="horizontal"
            form={form}
          >
            <Form.Item
              name="ten"
              label="Tên"
              rules={[
                {
                  whitespace: true,
                  required: true,
                  message: "Vui lòng nhập tên thương hiệu!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="trangThai"
              label="Trạng thái"
              valuePropName="checked"
            >
              <Switch size="small" />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 17 }}>
              <Space>
                <Button type="dashed" htmlType="reset">
                  Reset
                </Button>
                <Button type="primary" htmlType="submit">
                  Cập nhật
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Skeleton>
      </Card>
    </>
  );
};

export default UpdatethuongHieu;
