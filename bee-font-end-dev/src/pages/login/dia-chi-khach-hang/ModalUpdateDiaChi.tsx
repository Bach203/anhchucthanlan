import { ExclamationCircleFilled } from "@ant-design/icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import axios from "axios";
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Radio,
  Skeleton,
  Space,
  Select,
  Switch,
  DatePicker,
  message,
  Checkbox,
} from "antd";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UpdatedRequest, DataType } from "~/interfaces/diaChi.type";
interface Option {
  value?: number | null;
  label: React.ReactNode;
  children?: Option[];
  isLeaf?: boolean;
}

import request from "~/utils/request";
import { requestDC } from "~/utils/requestDiaChi";

const { confirm } = Modal;
function ModalUpdateDCKhachHang({ openModal, closeModal, id }) {
  const [data, setData] = useState<DataType | null>(null);
  const [wardCode1, setWardCode1] = useState(data?.phuongXa);
  const [provinces, setProvinces] = useState<Option[]>([]);
  const [districts, setDistricts] = useState<Option[]>([]);
  const [wards, setWards] = useState<Option[]>([]);
  const navigate = useNavigate();
  const [loadingForm, setLoadingForm] = useState(false);
  const [form] = Form.useForm();
  //   let { id } = useParams();
  const fetchProvinces = async () => {
    try {
      const provinceRes = await axios.get(
        "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
        {
          headers: {
            token: "4d0b3d7c-65a5-11ee-a59f-a260851ba65c",
            ContentType: "application/json",
          },
        }
      );

      const provinceOptions: Option[] = provinceRes.data.data.map(
        (province: any) => ({
          value: province.ProvinceID,
          label: province.ProvinceName,
          isLeaf: false,
        })
      );
      setProvinces(provinceOptions);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchDistricts = async (idProvince: number | undefined) => {
    try {
      const districtRes = await axios.get(
        `https://online-gateway.ghn.vn/shiip/public-api/master-data/district`,
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
  const fetchWards = async (idDistrict: number | undefined) => {
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
  useEffect(() => {
    const getOne = async () => {
      setLoadingForm(true);
      try {
        const res = await requestDC.get("/dia-chi/edit/" + id);
        console.log("id   +" + res.data.id);
        fetchProvinces();
        fetchDistricts(res.data?.thanhPho);
        fetchWards(res.data?.quanHuyen);
        // const trangThaiValue = res.data?.trangThai.ten === "ACTIVE";
        const trangThaiDiaChi = res.data?.trangThaiDiaChi?.ten || "ACTIVE";
        form.setFieldsValue({
          hoVaTen: res.data?.hoVaTen,
          soDienThoai: res.data?.soDienThoai,
          email: res.data?.email,
          thanhPho: Number(res.data?.thanhPho),
          quanHuyen: Number(res.data?.quanHuyen),
          phuongXa: res.data?.phuongXa,
          diaChiCuThe: res.data?.diaChiCuThe,
          trangThaiDiaChi:
            res.data.trangThaiDiaChi.ten == "DEFAULT" ? true : false,
        });
        setData(res.data);
        setLoadingForm(false);
      } catch (error) {
        console.log(error);
        setLoadingForm(false);
      }
    };

    getOne();
  }, [id]);

  const onFinish = (values: UpdatedRequest) => {
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
    console.log(diaChi);

    const trangThaiDiaChi =
      values.trangThaiDiaChi === undefined
        ? "DEFAULT"
        : values.trangThaiDiaChi == true
        ? "DEFAULT"
        : "ACTIVE";

    confirm({
      title: "Xác Nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc cập nhật địa chỉ này không?",
      okText: "OK",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          //   const trangThai = values.trangThai ? "ACTIVE" : "INACTIVE";
          const idTaiKhoan = localStorage.getItem("acountId");
          const res = await requestDC.put("dia-chi/update/" + id, {
            hoVaTen: values.hoVaTen,
            soDienThoai: values.soDienThoai,
            email: values.email,
            thanhPho: values.thanhPho,
            quanHuyen: values.quanHuyen,
            phuongXa: values.phuongXa,
            diaChiCuThe: values.diaChiCuThe,
            taiKhoan: { id: idTaiKhoan },
            diaChi: diaChi,
            trangThaiDiaChi: trangThaiDiaChi,
          });
          if (res.data) {
            message.success("Cập nhật địa chỉ thành công");
            closeModal();
          } else {
            console.error("Phản hồi API không như mong đợi:", res);
          }
        } catch (error: any) {
          if (error.response && error.response.status === 400) {
            message.error(error.response.data.message);
          } else {
            console.error("Lỗi không xác định:", error);
            message.error("Cập nhật địa chỉ thất bại");
          }
        }
      },
    });
  };

  return (
    <Modal
      title="CẬP NHẬT ĐỊA CHỈ"
      style={{ top: 20 }}
      width={600}
      open={openModal}
      onCancel={closeModal}
      footer
    >
      <>
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
              name="hoVaTen"
              label="Họ và tên"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên !",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="soDienThoai"
              label="Số điện thoại"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn số điện thoại!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập email !",
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
                  message: "Vui lòng nhập địa chỉ cụ thể !",
                },
              ]}
            >
              <Input />
            </Form.Item>
            {form.getFieldValue("trangThaiDiaChi") == false && (
              <Form.Item label="Đặt làm mặc định">
                <Form.Item name="trangThaiDiaChi" valuePropName="checked">
                  <Checkbox />
                </Form.Item>
              </Form.Item>
            )}

            <Form.Item wrapperCol={{ offset: 20 }}>
              <Space>
                <Button type="primary" htmlType="submit">
                  Cập nhật
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Skeleton>
      </>
    </Modal>
  );
}

export default ModalUpdateDCKhachHang;
