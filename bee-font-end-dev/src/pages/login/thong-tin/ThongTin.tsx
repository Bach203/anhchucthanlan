import { ExclamationCircleFilled } from "@ant-design/icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import ModalAddDiaChi from "~/pages/login/dia-chi-khach-hang/DiaChiMoi";
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
} from "antd";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UpdatedRequest, DataType } from "~/interfaces/khachHang.type";
interface Option {
  value?: number | null;
  label: React.ReactNode;
  children?: Option[];
  isLeaf?: boolean;
}

import request from "~/utils/request";
import { requestDoiMK } from "~/utils/requestDoiMK";
import ModalDiaChi from "../dia-chi-khach-hang/DiaChiTableModal";

const { confirm } = Modal;
function ModalThongTin({ openModal, closeModal }) {
  const [modalAddDiaChi, setModalAddDiaChi] = useState(false);
  const [modalDiaChi, setModalDiaChi] = useState(false);
  const [data, setData] = useState<DataType | null>(null);
  const [wardCode1, setWardCode1] = useState(data?.phuongXa);
  const [provinces, setProvinces] = useState<Option[]>([]);
  const [districts, setDistricts] = useState<Option[]>([]);
  const [wards, setWards] = useState<Option[]>([]);
  const navigate = useNavigate();
  const [loadingForm, setLoadingForm] = useState(false);
  const [form] = Form.useForm();
  let { id } = useParams();
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
        const doiMK = localStorage.getItem("acountId");
        const res = await requestDoiMK.get("/editTT/" + doiMK);
        fetchProvinces();
        fetchDistricts(res.data?.thanhPho);
        fetchWards(res.data?.quanHuyen);
        const gioiTinhValue = res.data?.gioiTinh?.ten || "OTHER";
        const ngaySinhValue = dayjs(res.data?.ngaySinh);
        form.setFieldsValue({
          hoVaTen: res.data?.hoVaTen,
          canCuocCongDan: res.data?.canCuocCongDan,
          ngaySinh: ngaySinhValue,
          gioiTinh: gioiTinhValue,
          soDienThoai: res.data?.soDienThoai,
          email: res.data?.email,
          thanhPho: Number(res.data?.thanhPho),
          quanHuyen: Number(res.data?.quanHuyen),
          phuongXa: res.data?.phuongXa,
          diaChiCuThe: res.data?.diaChiCuThe,
          // matKhau:res.data?.matKhau,
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
    confirm({
      title: "Xác Nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc cập nhật thông tin không?",
      okText: "OK",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const doiMK = localStorage.getItem("acountId");
          const trangThai = values.trangThai ? "ACTIVE" : "INACTIVE";
          const res = await requestDoiMK.put("updateTT/" + doiMK, {
            hoVaTen: values.hoVaTen,
            // canCuocCongDan: values.canCuocCongDan,
            ngaySinh: values.ngaySinh,
            gioiTinh: values.gioiTinh,
            soDienThoai: values.soDienThoai,
            email: values.email,
            // thanhPho: values.thanhPho,
            // quanHuyen: values.quanHuyen,
            // phuongXa: values.phuongXa,
            // diaChiCuThe: values.diaChiCuThe,
            // trangThai: trangThai,
          });
          if (res.data) {
            message.success("Cập nhật thông tin thành công");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("acountId");
            localStorage.removeItem("roleId");
            navigate("/sign-in");
            console.log(values.trangThai);
          } else {
            console.error("Phản hồi API không như mong đợi:", res);
          }
        } catch (error: any) {
          if (error.response && error.response.status === 400) {
            message.error(error.response.data.message);
          } else {
            console.error("Lỗi không xác định:", error);
            message.error("Cập nhật thông tin thất bại");
          }
        }
      },
    });
  };
  const roleId = localStorage.getItem("roleId");
  return (
    <Modal
      style={{ top: 20 }}
      footer
      width={600}
      title="THÔNG TIN TÀI KHOẢN"
      open={openModal}
      onCancel={closeModal}
    >
      <>
        <Card
          style={{
            width: "550px",
            display: "grid",
            placeItems: "center",
            minHeight: "60vh",
            minWidth: "50vh",
          }}
          title=""
        >
          <Skeleton loading={loadingForm}>
            <Form onFinish={onFinish} layout="horizontal" form={form}>
              <Form.Item
                name="hoVaTen"
                label="Họ và tên"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên khách hàng!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="ngaySinh"
                label="Ngày Sinh:"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngày sinh!",
                  },
                ]}
              >
                <DatePicker
                  format={"DD/MM/YYYY"}
                  placeholder="Chọn ngày sinh"
                />
              </Form.Item>

              <Form.Item
                name="gioiTinh"
                label="Giới tính"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn giới tính",
                  },
                ]}
              >
                <Radio.Group>
                  <Radio value="MALE">Nam</Radio>
                  <Radio value="FEMALE">Nữ</Radio>
                  <Radio value="OTHER">Khác</Radio>
                </Radio.Group>
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
                    message: "Vui lòng chọn email!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              {roleId === "2" && (
                <Form.Item
                  name="canCuocCongDan"
                  label="CCCD"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập căn cước công dân!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              )}
              {roleId === "2" && (
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
              )}
              {roleId === "2" && (
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
              )}
              {roleId === "2" && (
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
              )}
              {roleId === "2" && (
                <Form.Item name="diaChiCuThe" label="Địa chỉ cụ thể">
                  <Input />
                </Form.Item>
              )}
              <Form.Item wrapperCol={{ offset: 10 }}>
                <Space>
                  {(roleId === "1" || roleId === "3") && (
                    <Button type="dashed" htmlType="reset">
                      Reset
                    </Button>
                  )}
                  {(roleId === "1" || roleId === "3") && (
                    <Button type="primary" htmlType="submit">
                      Cập nhật
                    </Button>
                  )}
                </Space>
              </Form.Item>
            </Form>
          </Skeleton>
        </Card>
        <ModalAddDiaChi
          openModal={modalAddDiaChi}
          closeModal={() => setModalAddDiaChi(false)}
        />
      </>
    </Modal>
  );
}

export default ModalThongTin;
