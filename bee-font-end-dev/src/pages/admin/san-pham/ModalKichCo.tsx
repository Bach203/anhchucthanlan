import React, { useState, useEffect } from "react";
import {
  Modal,
  Checkbox,
  Button,
  Empty,
  Space,
  Form,
  InputNumber,
  Divider,
  message,
} from "antd";
import request from "~/utils/request";
import { formatGiaTienVND, formatSoLuong } from "~/utils/formatResponse";
import FormItem from "antd/es/form/FormItem";
import TableAddSanPham from "./TableAddSanPham";

function ModalKichCo({ fakeData, openModal, closeModal, mauSac, onAddKichCo }) {
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [availableKichCoOptions, setAvailableKichCoOptions] = useState([]);
  const [selectAll, setSelectAll] = useState(false); // Add selectAll state
  const [indeterminate, setIndeterminate] = useState(false);
  const [dataKichCo, setDataKichCo] = useState([]);
  const [form] = Form.useForm();
  const fetchDataKC = async () => {
    try {
      const res = await request.get("kich-co/list");
      setDataKichCo(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchDataKC();
    if (mauSac && mauSac.id) {
      const mauSacFakeData = fakeData.filter(
        (item) => item.mauSac.id === mauSac.id
      );
      const kichCoIdsInFakeData = mauSacFakeData.map((item) => item.kichCo.id);

      const newAvailableOptions = dataKichCo.filter(
        (kichCo) => !kichCoIdsInFakeData.includes(kichCo.id)
      );

      setAvailableKichCoOptions(newAvailableOptions);
    }
  }, [fakeData, dataKichCo]);

  useEffect(() => {
    if (availableKichCoOptions.length === 0) {
      setSelectAll(false);
      setIndeterminate(false);
    } else {
      setSelectAll(checkedKeys.length === availableKichCoOptions.length);
      setIndeterminate(
        checkedKeys.length > 0 &&
          checkedKeys.length < availableKichCoOptions.length
      );
    }
  }, [checkedKeys, availableKichCoOptions]);

  const toggleChecked = (kichCoKey) => {
    const updatedCheckedKeys = [...checkedKeys];

    if (updatedCheckedKeys.includes(kichCoKey)) {
      updatedCheckedKeys.splice(updatedCheckedKeys.indexOf(kichCoKey), 1);
    } else {
      updatedCheckedKeys.push(kichCoKey);
    }
    setCheckedKeys(updatedCheckedKeys);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setCheckedKeys([]);
    } else {
      setCheckedKeys(availableKichCoOptions.map((kichCo) => kichCo.id));
    }
    setSelectAll(!selectAll);
  };

  const handleAddKichCo = (values) => {
    if (checkedKeys.length > 0) {
      if (mauSac && mauSac.id) {
        onAddKichCo(mauSac.ten, checkedKeys, values.soLuong, values.giaTien);
        setCheckedKeys([]);
        closeModal();
      }
    } else {
      message.warning("Bạn chưa chọn kích cỡ muốn thêm");
    }
    console.log(values);
  };
  return (
    <Modal
      title={`THÊM KÍCH CỠ CHO GIÀY ${mauSac ? mauSac.ten.toUpperCase() : ""}`}
      width={540}
      open={openModal}
      onCancel={closeModal}
      footer={() => <></>}
    >
      <Divider style={{ margin: 10 }} />
      {availableKichCoOptions.length === 0 ? null : (
        <Checkbox
          style={{ marginLeft: 5 }}
          checked={selectAll}
          indeterminate={indeterminate}
          onChange={toggleSelectAll}
        >
          Chọn tất cả
        </Checkbox>
      )}
      <br />
      {availableKichCoOptions.length === 0 ? (
        <Empty />
      ) : (
        availableKichCoOptions.map((kichCo) => (
          <Button
            key={kichCo.id}
            style={{ width: 60, height: 40, margin: 5 }}
            type={checkedKeys.includes(kichCo.id) ? "primary" : "default"}
            size="small"
            onClick={() => toggleChecked(kichCo.id)}
          >
            {kichCo.kichCo}
          </Button>
        ))
      )}
      {}

      {availableKichCoOptions.length > 0 ? (
        <Form form={form} onFinish={handleAddKichCo}>
          <Divider style={{ margin: 10 }} />
          <Space>
            {/* SỐ lượng */}
            <Form.Item
              label="Số lượng"
              name="soLuong"
              rules={[{ required: true, message: "Bạn chưa điền số lượng" }]}
            >
              <InputNumber
                // onChange={onChangeSoLuong}
                defaultValue={0}
                style={{ width: "100%" }}
                min={1}
                formatter={(value) => formatSoLuong(value)}
                parser={(value: any) => value.replace(/,/g, "")}
              />
            </Form.Item>
            {/* Giá tiền */}
            <Form.Item
              label="Giá tiền"
              name="giaTien"
              rules={[{ required: true, message: "Bạn chưa điền giá tiền" }]}
            >
              <InputNumber
                defaultValue={0}
                style={{ width: "100%" }}
                min={10000}
                step={10000}
                formatter={(value) => `${formatGiaTienVND(value)}`}
                parser={(value: any) => value.replace(/\D/g, "")}
              />
            </Form.Item>
          </Space>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginTop: 10, float: "right" }}
            >
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      ) : (
        ""
      )}
    </Modal>
  );
}

export default ModalKichCo;
