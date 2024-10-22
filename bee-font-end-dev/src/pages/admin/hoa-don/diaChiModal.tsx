import {
  Modal,
  Form,
  Select,
  Col,
  Row,
  Input,
  Divider,
  Typography,
  Space,
  InputNumber,
  Button,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { useEffect, useState } from "react";
import { formatGiaTienVND } from "~/utils/formatResponse";

interface Option {
  value?: number | null;
  label: React.ReactNode;
  children?: Option[];
  isLeaf?: boolean;
}

interface DiaChiProps {
  open: boolean;
  onUpdate: (values: any) => void;
  onCancel: () => void;
}
const DiaChiComponent: React.FC<DiaChiProps> = ({
  open,
  onCancel,
  onUpdate,
}) => {
  const [form] = Form.useForm();
  const { Text } = Typography;
  const [provinces, setProvinces] = useState<Option[]>([]);
  const [districts, setDistricts] = useState<Option[]>([]);
  const [wards, setWards] = useState<Option[]>([]);

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

  const fetchDistricts = async (idProvince: string) => {
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

  const fetchWards = async (idDistrict: string) => {
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
  const getPhiShip = async () => {
    try {
      const feeRes = await axios.get(
        `https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee`,
        {
          params: {
            service_type_id: "2",
            to_district_id: form.getFieldValue("quanHuyen"),
            to_ward_code: form.getFieldValue("phuongXa"),
            height: "9",
            length: "29",
            weight: "300",
            width: "18",
          },
          headers: {
            token: "4d0b3d7c-65a5-11ee-a59f-a260851ba65c",
            shop_id: "4611572",
            ContentType: "application/json",
          },
        }
      );

      if (feeRes.status === 200) {
        const feeResponse = feeRes.data.data.total;
        // Cập nhật state phiShip sau khi tính phí ship thành công
        console.log(feeResponse);
        form.setFieldValue("phiShip", feeResponse);
      } else {
        console.error("Lỗi khi gọi API tính phí ship: ", feeRes.status);
        // Xử lý lỗi và cập nhật state phiShip (ví dụ, set giá trị mặc định hoặc 0 nếu có lỗi)
        form.setFieldValue("phiShip", 0);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API tính phí ship:", error);
      // Xử lý lỗi và cập nhật state phiShip (ví dụ, set giá trị mặc định hoặc 0 nếu có lỗi)
      form.setFieldValue("phiShip", 0);
    }
  };

  const cancelModal = () => {
    form.resetFields();
    setDistricts([]);
    setWards([]);
    onCancel();
  };
  useEffect(() => {
    fetchProvinces();
  }, []);
  const onFinish = (values: any) => {
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

    const diaChi = `${
      values.diaChiCuThe
    }, ${getWardLabelFromId()}, ${getDistrictLabelFromId()}, ${getProvinceLabelFromId()}`;

    onUpdate({ diaChi: diaChi, phiShip: values.phiShip });
    cancelModal();
  };
  return (
    <Modal
      width={600}
      style={{ height: 1600 }}
      title={"TÙY CHỈNH ĐỈA CHỈ MỚI"}
      open={open}
      onCancel={cancelModal}
      footer
    >
      <Divider />
      <Form
        onFinish={onFinish}
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{ modifier: "public" }}
      >
        <Space>
          <Space direction="vertical">
            <Text strong>Tỉnh/ Thành Phố:</Text>
            <Form.Item
              name="thanhPho"
              rules={[
                {
                  required: true,
                  message: "Bạn chưa chọn Tỉnh/ Thành ",
                },
              ]}
            >
              <Select
                options={provinces}
                placeholder="Tỉnh/ Thành"
                style={{ width: "180px" }}
                onChange={(value) => {
                  form.setFieldsValue({
                    quanHuyen: undefined,
                    phuongXa: undefined,
                    phiShip: 0,
                  });
                  fetchDistricts(value);
                }}
              />
            </Form.Item>
          </Space>
          <Space direction="vertical">
            <Text strong>Quận / Huyện:</Text>
            <Form.Item
              name="quanHuyen"
              rules={[
                {
                  required: true,
                  message: "Bạn chưa chọn Quận/ Huyện",
                },
              ]}
            >
              <Select
                options={districts}
                placeholder="Quận/ Huyện"
                style={{ width: "180px" }}
                onChange={(value) => {
                  form.setFieldsValue({ phuongXa: undefined, phiShip: 0 });
                  fetchWards(value);
                }}
              />
            </Form.Item>
          </Space>
          <Space direction="vertical">
            <Text strong>Phường / Xã:</Text>
            <Form.Item
              name="phuongXa"
              rules={[
                {
                  required: true,
                  message: "Bạn chưa chọn Phường/ Xã",
                },
              ]}
            >
              <Select
                onChange={() => getPhiShip()}
                options={wards}
                placeholder="Phường / Xã"
                style={{ width: "180px" }}
              />
            </Form.Item>
          </Space>
        </Space>
        <Form.Item label={<Text strong>Địa chỉ cụ thể:</Text>}>
          <Form.Item
            name="diaChiCuThe"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Vui lòng nhập địa chỉ cụ thể!",
              },
            ]}
          >
            <TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
          </Form.Item>
        </Form.Item>
        <Form.Item
          label={<Text strong>Phí ship:</Text>}
          name="phiShip"
          style={{ margin: 0 }}
        >
          <InputNumber
            defaultValue={0}
            style={{ width: "100%" }}
            min={0}
            step={1000}
            formatter={(value) => `${formatGiaTienVND(value)}`}
            parser={(value: any) => value.replace(/\D/g, "")}
          />
        </Form.Item>
        <Form.Item style={{ paddingTop: 20 }}>
          <Button type="primary" htmlType="submit" style={{ float: "right" }}>
            Thay đổi
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DiaChiComponent;
