import React, { useState, useEffect } from "react";
import { fetchData } from "~/api/apiDiaChi";
import { Space, Tag, Button, Modal, Divider, List, Typography } from "antd";
interface Option {
  value?: number | null;
  label: React.ReactNode;
  children?: Option[];
  isLeaf?: boolean;
}
import { PlusOutlined } from "@ant-design/icons";
import { formatPhoneNumber } from "~/utils/formatResponse";
import { DataType } from "~/interfaces/diaChi.type";
import axios from "axios";
import request from "~/utils/request";
import ModalUpdateDCKhachHang from "~/pages/login/dia-chi-khach-hang/ModalUpdateDiaChi";
import ModalAddDiaChi from "~/pages/login/dia-chi-khach-hang/DiaChiMoi";

const { Text } = Typography;
function ModalDiaChi22({ openModal, closeModal, onClickDiaChi }) {
  const [modalAddDiaChi, setModalAddDiaChi] = useState(false);
  const [idDiaChi, setIdDiaChi] = useState(null);
  const [modalUpdateDiaChi, setModalUpdateDiaChi] = useState(false);
  const [dataList, setDataList] = useState<DataType[]>([]);

  useEffect(() => {
    fetchDataDC();
  }, [modalUpdateDiaChi, modalAddDiaChi]);
  const idTaiKhoan = localStorage.getItem("acountId");
  const fetchDataDC = async () => {
    try {
      const res = await request.get("dia-chi/list", {
        params: {
          idTaiKhoan: idTaiKhoan,
        },
      });
      console.log(res.data);
      setDataList(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal
        title="Địa chỉ của tôi"
        style={{ top: 20 }}
        width={600}
        footer
        open={openModal}
        onCancel={closeModal}
      >
        <List
          className="demo-loadmore-list"
          //   loading={initLoading}
          itemLayout="horizontal"
          //   loadMore={loadMore}
          dataSource={dataList}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  style={{ padding: 0 }}
                  type="link"
                  key="list-loadmore-edit"
                  onClick={() => {
                    setIdDiaChi(item.id);
                    setModalUpdateDiaChi(true);
                  }}
                >
                  Sửa
                </Button>,
                <Button
                  style={{ padding: 0 }}
                  type="link"
                  key="list-loadmore-more"
                  onClick={() => {
                    onClickDiaChi(item);
                    closeModal();
                  }}
                >
                  Chọn
                </Button>,
              ]}
            >
              <Space direction="vertical">
                <Space>
                  <Text strong>{item.hoVaTen}</Text>
                  {item.trangThaiDiaChi.ten == "DEFAULT" && (
                    <Tag color="red">{item.trangThaiDiaChi.moTa}</Tag>
                  )}
                </Space>
                <Space split={<Divider type="vertical" />}>
                  <Text>{formatPhoneNumber(item.soDienThoai)}</Text>
                  <Text>{item.email}</Text>
                </Space>
                <Text>{}</Text>
                <Text>{item.diaChiCuThe + ", " + item.diaChi}</Text>
              </Space>
            </List.Item>
          )}
        />
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={() => setModalAddDiaChi(true)}
        >
          Thêm địa chỉ mới
        </Button>
      </Modal>
      <ModalUpdateDCKhachHang
        openModal={modalUpdateDiaChi}
        closeModal={() => setModalUpdateDiaChi(false)}
        id={idDiaChi}
      />
      <ModalAddDiaChi
        closeModal={() => setModalAddDiaChi(false)}
        openModal={modalAddDiaChi}
      />
    </>
  );
}

export default ModalDiaChi22;
