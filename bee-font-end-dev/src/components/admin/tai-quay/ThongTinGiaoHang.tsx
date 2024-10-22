import React, { useEffect, useState, useRef } from "react";
import { Col, Form, Input, Row, Select } from "antd";
import { Option } from "antd/es/mentions";
import axios from "axios";
import request from "~/utils/request";

interface Option {
  value?: number | null;
  label: React.ReactNode;
  children?: Option[];
  isLeaf?: boolean;
}

type FieldType = {
  nguoiNhan?: string;
  sdtNguoiNhan?: string;
  emailNguoiNhan?: string;
};

const ThongTinGiaoHang: React.FC<{
  onFullAddressChange: (address: string) => void; // Sửa kiểu dữ liệu của onFullAddressChange
  onFeeResponseChange: (fee: number) => void; // Sửa kiểu dữ liệu của onFeeResponseChange
  onFormValuesChange: (formValues: FieldType) => void; // New prop
}> = ({ onFullAddressChange, onFeeResponseChange, onFormValuesChange }) => {
  const [provinces, setProvinces] = useState<Option[]>([]);
  const [districts, setDistricts] = useState<Option[]>([]);
  const [wards, setWards] = useState<Option[]>([]);
  const [form] = Form.useForm();
  // Thêm các biến state để lưu giá trị của hoVaTen, soDienThoai, email
  const [formValues, setFormValues] = useState<FieldType>({
    nguoiNhan: "",
    sdtNguoiNhan: "",
    emailNguoiNhan: "",
  });

  useEffect(() => {
    getFullAddress(); // Export the getFullAddress function
    onFormValuesChange(formValues);
  }, [form, formValues]);

  useEffect(() => {
    form.validateFields(); // Kiểm tra các trường khi form được mở

    // Rest of your useEffect logic
  }, [form]); // Đảm bảo chỉ gọi khi form thay đổi

  // useEffect(() => {
  //   calculateShippingFee(form.getFieldsValue());
  // }, []);

  const onFinish = (values: any) => {};

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const calculateShippingFee = async (value) => {
    try {
      const feeRes = await request.get(
        `https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee`,
        {
          params: {
            service_type_id: "2",
            to_district_id: value.quanHuyen,
            to_ward_code: value.phuongXa,
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
        console.log(feeResponse);

        // Cập nhật state phiShip sau khi tính phí ship thành công
        onFeeResponseChange(feeResponse);
      } else {
        console.error("Lỗi khi gọi API tính phí ship: ", feeRes.status);
        // Xử lý lỗi và cập nhật state phiShip (ví dụ, set giá trị mặc định hoặc 0 nếu có lỗi)
        onFeeResponseChange(0);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API tính phí ship:", error);
      // Xử lý lỗi và cập nhật state phiShip (ví dụ, set giá trị mặc định hoặc 0 nếu có lỗi)
      onFeeResponseChange(0);
    }
  };

  useEffect(() => {
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

    fetchProvinces();
  }, []);

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
          value: Number(district.DistrictID),
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
  // lấy tên của địa chỉ và cập nhật địa chỉ
  const getProvinceLabelFromId = (id: number | null | undefined) => {
    const province = provinces.find((p) => p.value === id);
    return province?.label;
  };
  const getDistrictLabelFromId = (id: number | null | undefined) => {
    const district = districts.find((d) => d.value === id);
    return district?.label;
  };
  const getWardLabelFromId = (id: number | null | undefined) => {
    const ward = wards.find((w) => w.value === id);
    return ward?.label;
  };

  // Hàm để lấy thông tin địa chỉ chính xác nhất
  const getFullAddress = () => {
    const formValues = form.getFieldsValue();
    const provinceLabel = getProvinceLabelFromId(formValues.thanhPho);
    const districtLabel = getDistrictLabelFromId(formValues.quanHuyen);
    const wardLabel = getWardLabelFromId(formValues.phuongXa);
    const diaChiCuThe = formValues.diaChi;

    // Cộng chuỗi thông tin địa chỉ lại với nhau
    const fullAddress = `${diaChiCuThe}, ${wardLabel}, ${districtLabel}, ${provinceLabel}`;
    onFullAddressChange(fullAddress);
    return fullAddress;
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        name="basic"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        // Sử dụng onChange để theo dõi thay đổi trong biểu mẫu
        onChange={() => {
          const fullAddress = getFullAddress();
          onFullAddressChange(fullAddress);
          calculateShippingFee(form.getFieldsValue());
        }}
      >
        <Row>
          <Col span={12}>
            <Form.Item<FieldType>
              label="Họ và tên"
              name="nguoiNhan"
              style={{ marginRight: 10 }}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập họ và tên",
                },
                {
                  pattern: /^[A-Za-z\sÀ-Ỹà-ỹ]+$/i,
                  message: "Tên chỉ được viết chữ",
                },
                {
                  max: 50,
                  message: "Tên chỉ được tối đa 50 ký tự",
                },
              ]}
            >
              <Input
                value={formValues.nguoiNhan}
                onChange={(e) =>
                  setFormValues({ ...formValues, nguoiNhan: e.target.value })
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<FieldType>
              label="SĐT"
              name="sdtNguoiNhan"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số điện thoại",
                },
                {
                  pattern: /^[0-9]{10}$/,
                  message:
                    "Số điện thoại chỉ được nhập số và phải có đúng 10 số",
                },
              ]}
            >
              <Input
                value={formValues.sdtNguoiNhan}
                onChange={(e) =>
                  setFormValues({ ...formValues, sdtNguoiNhan: e.target.value })
                }
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="Email"
              name="emailNguoiNhan"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập địa chỉ email",
                },
                {
                  type: "email",
                  message: "Địa chỉ email không hợp lệ",
                },
              ]}
            >
              <Input
                value={formValues.emailNguoiNhan}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    emailNguoiNhan: e.target.value,
                  })
                }
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Form.Item
              name="thanhPho"
              label="Tỉnh / Thành phố"
              style={{ marginRight: 3 }}
              rules={[
                {
                  required: true,
                  message: "Bạn chưa điền Tỉnh / Thành ",
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
          </Col>
          <Col span={8}>
            <Form.Item
              name="quanHuyen"
              style={{ marginRight: 3 }}
              label="Quận / Huyện:"
              rules={[
                {
                  required: true,
                  message: "Bạn chưa điền Quận / Huyện",
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
          </Col>

          <Col span={8}>
            <Form.Item
              name="phuongXa"
              label="Phường / Xã"
              rules={[
                {
                  required: true,
                  message: "Bạn chưa điền Phường / Xã",
                },
              ]}
            >
              <Select options={wards} placeholder="Phường / Xã" />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item
              name="diaChi"
              style={{ marginRight: 50 }}
              label="Địa chỉ cụ thể"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Bạn chưa nhập địa chỉ cụ thể",
                },
                {
                  max: 100,
                  message: "Địa chỉ cụ thể không được vượt quá 100 ký tự",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <img
              width={150}
              height={100}
              src="https://inkythuatso.com/uploads/images/2021/12/thiet-ke-khong-ten-04-13-29-21.jpg"
              alt=""
            />
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default ThongTinGiaoHang;
