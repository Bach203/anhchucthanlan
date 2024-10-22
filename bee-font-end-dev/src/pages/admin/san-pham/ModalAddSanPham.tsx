import ImgCrop from "antd-img-crop";
import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Spin,
  Upload,
  message,
} from "antd";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import request, { request4s } from "~/utils/request";
import {
  ExclamationCircleFilled,
  PictureOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { DataType } from "~/interfaces/thuongHieu.type";
import ModalAddThuongHieu from "./ModalAddThuongHieu";

function ModalAddSanPham({ openModal, closeModal, addSanPham }) {
  const [loading, setLoading] = useState(false);
  const [openModalTH, setOpenModalTH] = useState(false);
  const [dataTH, setDataTH] = useState<DataTypeKC[]>([]);
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const offModal = () => {
    closeModal();
    form.resetFields();
  };
  const loadDataTH = async () => {
    try {
      const res = await request.get("thuong-hieu/list");
      setDataTH(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    loadDataTH();
  }, []);
  const addThuongHieu = (newData) => {
    loadDataTH();
    form.setFieldsValue({
      thuongHieu: newData.id,
    });
  };
  const closeModalTH = () => {
    setOpenModalTH(false);
  };
  const onCreate = (values) => {
    confirm({
      title: "Xác Nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc thêm sản phẩm này không?",
      okText: "OK",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const res = await request.post("/san-pham", {
            ten: values.ten,
            thuongHieu: {
              id: values.thuongHieu,
            },
            moTa: values.moTa,
          });
          message.success("Thêm tên sản phẩm thành công");
          form.resetFields();
          addSanPham(res.data);
          closeModal();
        } catch (error) {
          message.error("Thêm tên sản phẩm thất bại");
          console.log(error);
        }
      },
    });
  };
  return (
    <Modal
      title="THÊM TÊN SẢN PHẨM"
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
          label="Tên sản phẩm"
          name="ten"
          initialValue={null}
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
        >
          <Input placeholder="Nhập tên sản phẩm" />
        </Form.Item>
        <Space.Compact block>
          <Form.Item
            style={{ width: "100%" }}
            name="thuongHieu"
            label="Thương hiệu"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn thương hiệu!",
              },
            ]}
          >
            <Select
              allowClear
              showSearch
              placeholder="Chọn loại đế"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input)
              }
              options={dataTH.map((values: DataType) => ({
                label: values.ten,
                value: values.id,
              }))}
            />
          </Form.Item>
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            style={{ marginTop: 31 }}
            onClick={() => {
              setOpenModalTH(true);
            }}
          />
        </Space.Compact>
        <Form.Item
          label="Mô tả"
          name="moTa"
        // rules={[
        //   {
        //     whitespace: true,
        //     required: true,
        //     message: "Vui lòng nhập mô tả",
        //   },
        // ]}
        >
          <TextArea />
        </Form.Item>
      </Form>
      <ModalAddThuongHieu
        openModal={openModalTH}
        closeModal={closeModalTH}
        addThuongHieu={addThuongHieu}
      />
    </Modal>
  );
}
export default ModalAddSanPham;
