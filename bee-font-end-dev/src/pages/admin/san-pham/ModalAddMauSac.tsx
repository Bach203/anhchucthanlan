import {
  Button,
  Checkbox,
  Col,
  ColorPicker,
  Divider,
  Form,
  InputNumber,
  Modal,
  Radio,
  Row,
  Space,
  Typography,
  message,
} from "antd";
import { useState, useEffect } from "react";
import { formatGiaTienVND, formatSoLuong } from "~/utils/formatResponse";
import request from "~/utils/request";
const { Text, Link } = Typography;

function ModalAddMauSac({ idSanPham, openModal, closeModal, onAddMauSac }) {
  const [dataMauSac, setDataMauSac] = useState([]);
  const [dataKichCo, setDataKichCo] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectAll, setSelectAll] = useState(false); // Add selectAll state
  const [indeterminate, setIndeterminate] = useState(false);
  const [mauSacChuaCo, setMauSacChuaCo] = useState([]);
  const [dataMauSacDaCo, setDataMauSacDaCo] = useState([]);
  const [idMauSac, setIdMauSac] = useState(null);
  useEffect(() => {
    getDataMauSac();
    getDataKichCo();
    getDataMauSacDaCo();
  }, []);
  useEffect(() => {
    if (dataKichCo.length === 0) {
      setSelectAll(false);
      setIndeterminate(false);
    } else {
      setSelectAll(checkedKeys.length === dataKichCo.length);
      setIndeterminate(
        checkedKeys.length > 0 && checkedKeys.length < dataKichCo.length
      );
    }
  }, [checkedKeys, dataKichCo]);

  const getDataMauSac = async () => {
    try {
      const res = await request.get("mau-sac/list");
      setDataMauSac(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getDataMauSacDaCo = async () => {
    try {
      const res = await request.get(`mau-sac/detail/${idSanPham}`);
      setDataMauSacDaCo(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (dataMauSac.length > 0 && dataMauSacDaCo.length > 0) {
      // Tạo danh sách màu sắc chưa có
      const mauSacIdsDaCo = dataMauSacDaCo.map((mauSacDaCo) => mauSacDaCo.id);
      const mauSacChuaCo = dataMauSac.filter(
        (mauSac) => !mauSacIdsDaCo.includes(mauSac.id)
      );
      setMauSacChuaCo(mauSacChuaCo);
    }
  }, [dataMauSac, dataMauSacDaCo]);
  const getDataKichCo = async () => {
    try {
      const res = await request.get("kich-co/list");
      setDataKichCo(res.data);
    } catch (error) {
      console.log(error);
    }
  };

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
      setCheckedKeys(dataKichCo.map((kichCo) => kichCo.id));
    }
    setSelectAll(!selectAll);
  };
  const onClickAdd = (values) => {
    if (idMauSac === null) {
      message.error("Bạn chưa chọn màu sắc để thêm");
    } else if (checkedKeys.length === 0) {
      message.error("Bạn chưa chọn kích cỡ để thêm");
    } else {
      onAddMauSac(idMauSac, checkedKeys, values.soLuong, values.giaTien);
      setCheckedKeys([]);
      setIdMauSac(null);
      closeModal();
    }
  };
  const offModal = () => {
    setIdMauSac(null);
    setCheckedKeys([]);
    closeModal();
  };
  return (
    <>
      <Modal
        title="THÊM MÀU SẮC MỚI"
        open={openModal}
        onCancel={offModal}
        footer={() => <></>}
        width={540}
      >
        <Divider style={{ margin: 10 }} />
        <Text>Chọn màu sắc:</Text>
        <br />
        <Radio.Group value={idMauSac} buttonStyle="solid">
          <Row gutter={[15, 15]}>
            {mauSacChuaCo.map((record: any) => (
              <Col key={record.id}>
                <Radio.Button
                  value={record.id}
                  onClick={() =>
                    idMauSac !== record.id
                      ? setIdMauSac(record.id)
                      : setIdMauSac(null)
                  }
                >
                  <Space>
                    <ColorPicker
                      value={record.ma}
                      size="small"
                      disabled
                      style={{ marginTop: 3 }}
                    />
                    <span>{record.ten}</span>
                  </Space>
                </Radio.Button>
              </Col>
            ))}
          </Row>
        </Radio.Group>
        <Divider style={{ margin: 10 }} />
        <Text>Chọn kích cỡ:</Text>
        <br />
        <Checkbox
          style={{ marginLeft: 5 }}
          checked={selectAll}
          indeterminate={indeterminate}
          onChange={toggleSelectAll}
        >
          Chọn tất cả
        </Checkbox>
        <br />
        {dataKichCo.map((kichCo) => (
          <Button
            key={kichCo.id}
            style={{ width: 60, height: 40, margin: 5 }}
            type={checkedKeys.includes(kichCo.id) ? "primary" : "default"}
            size="small"
            onClick={() => toggleChecked(kichCo.id)}
          >
            {kichCo.kichCo}
          </Button>
        ))}
        <Divider style={{ margin: 10 }} />
        <Form onFinish={onClickAdd}>
          <Space>
            {/* SỐ lượng */}
            <Form.Item
              label="Số lượng"
              name="soLuong"
              rules={[{ required: true, message: "Bạn chưa điền số lượng" }]}
            >
              <InputNumber
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
            <Button type="primary" htmlType="submit" style={{ float: "right" }}>
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
export default ModalAddMauSac;
