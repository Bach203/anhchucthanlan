import { ExclamationCircleFilled } from "@ant-design/icons";
import {
  Button,
  Card,
  ColorPicker,
  Form,
  Input,
  Modal,
  Skeleton,
  Space,
  Switch,
  message,
} from "antd";
import { Color } from "antd/es/color-picker";
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UpdatedRequest } from "~/interfaces/mauSac.type";
import request from "~/utils/request";
const { confirm } = Modal;
const UpdateMauSac: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [colorHex, setColorHex] = useState<Color | string>("");
  const [form] = Form.useForm();
  const hexString = useMemo(
    () =>
      typeof colorHex === "string"
        ? colorHex.toUpperCase()
        : colorHex.toHexString().toUpperCase(),
    [colorHex]
  );
  let { id } = useParams();
  useEffect(() => {
    const getOne = async () => {
      setLoadingForm(true);
      try {
        const res = await request.get("mau-sac/" + id);
        const trangThaiValue =
          res.data?.trangThai.ten === "ACTIVE" ? true : false;
        form.setFieldsValue({
          ma: res.data?.ma,
          ten: res.data?.ten,
          trangThai: trangThaiValue,
        });
        setColorHex(res.data?.ma);
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
      content: "Bạn có chắc thêm màu sắc này không?",
      okText: "OK",
      cancelText: "Hủy",
      onOk: async () => {
        // setLoading(true);
        try {
          const res = await request.put("mau-sac/" + id, {
            ma: hexString,
            ten: values.ten,
            trangThai: values.trangThai == true ? "ACTIVE" : "INACTIVE",
          });
          if (res.data) {
            message.success("Cập nhật màu sắc thành công");
            navigate("/admin/mau-sac");
          } else {
            console.error("Phản hồi API không như mong đợi:", res);
          }
        } catch (error: any) {
          if (error.response && error.response.status === 400) {
            message.error(error.response.data.message);
          } else {
            console.error("Lỗi không xác định:", error);
            message.error("Cập nhật màu sắc thất bại");
          }
        }
      },
    });
  };
  return (
    <>
      <Card title="THÊM MÀU SẮC">
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
                <Button type="primary" htmlType="submit" loading={loading}>
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

export default UpdateMauSac;
