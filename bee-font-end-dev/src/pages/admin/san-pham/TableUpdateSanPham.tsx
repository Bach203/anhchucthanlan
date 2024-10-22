import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Divider,
  InputNumber,
  Modal,
  Radio,
  Row,
  Space,
  Table,
  Tooltip,
  message,
} from "antd";
import { formatGiaTienVND, formatSoLuong } from "~/utils/formatResponse";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  PictureOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import request, { request4s } from "~/utils/request";
import ModalKichCo from "./ModalKichCo";
import { ColumnsType } from "antd/es/table";
import HinhAnhModal from "./HinhAnhModal";
import { DataTypeCTSP } from "~/interfaces/ctsp.type";
// import ModalAddMauSac from "./ModalAddMauSac";
import TableAllSanpham from "./TableAllSanPham";
import ModalAddMauSac from "./ModalAddMauSac";
import { useNavigate } from "react-router";

function TableUpdateSanpham({ idSanPham }) {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [idLoaiDe, setIdLoaiDe] = useState(null);
  const [idDiaHinhSan, setIdDiaHinhSan] = useState(null);
  const [openModalMauSac, setOpenModalMauSac] = useState(false);
  const [dataChiTietSanPham, setDataChiTietSanPham] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [dataFake, setDataFake] = useState<DataTypeCTSP[]>([]);
  const [dataKichCo, setDataKichCo] = useState([]);
  const [dataMauSacFull, setDataMauSacFull] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [idMauSac, setIdMauSac] = useState();
  const [mauSac, setMauSac] = useState(null);
  const [checkedMauSac, setCheckedMauSac] = useState();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { confirm } = Modal;
  useEffect(() => {
    getDataMauSacFull();
    getDataChiTietSanPham();
    getDataKichCo();
  }, []);
  useEffect(() => {}, [idMauSac]);
  const getDataMauSacFull = async () => {
    try {
      const res = await request.get(`mau-sac/list`);
      setDataMauSacFull(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getDataChiTietSanPham = async () => {
    try {
      const res = await request.get("chi-tiet-san-pham/" + idSanPham);
      setDataChiTietSanPham(res.data);
      setIdLoaiDe(res.data[0].loaiDe.id);
      setIdDiaHinhSan(res.data[0].diaHinhSan.id);
      const list = [];
      res.data.forEach((item: string) => {
        const uniqueId = `${item.mauSac.id}-${item.kichCo.id}`;
        list.push({
          key: uniqueId,
          id: item.id,
          mauSac: {
            id: item.mauSac.id,
            ten: item.mauSac.ten,
          },
          kichCo: {
            id: item.kichCo.id,
            kichCo: item.kichCo.kichCo,
          },
          soLuong: item.soLuong,
          giaTien: item.giaTien,
          loaiDe: {
            id: item.loaiDe.id,
          },
          diaHinhSan: {
            id: item.diaHinhSan.id,
          },
          sanPham: { id: item.sanPham.id },
          trangThai: item.trangThai.ten,
        });
      });

      setDataFake(list); // Move this line outside the forEach loop
    } catch (error) {
      console.log(error);
    }
  };

  const getDataKichCo = async () => {
    try {
      const res = await request4s.get("kich-co/list");
      setDataKichCo(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const groupedData = {};
  dataFake.forEach((data) => {
    const mauSacKey = `${data.mauSac.id}`;
    if (!groupedData[mauSacKey]) {
      groupedData[mauSacKey] = [];
    }
    groupedData[mauSacKey].push(data);
  });
  const mauSacMapping = {};
  dataMauSacFull.forEach((ms) => {
    mauSacMapping[ms.ten] = ms.id;
  });
  const mauSacMappingTen = {};
  dataMauSacFull.forEach((ms) => {
    mauSacMappingTen[ms.id] = ms.ten;
  });
  const kichCoMapping = {};
  dataKichCo.forEach((kc) => {
    kichCoMapping[kc.id] = kc.kichCo;
  });
  const onClickUpdate = async () => {
    const selectedData = dataFake.filter((row) =>
      selectedRowKeys.includes(row.key)
    );
    try {
      console.log(selectedData);

      await request.put("chi-tiet-san-pham/update", selectedData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      getDataChiTietSanPham();
      setSelectedRowKeys([]);
      message.success("Chỉnh sửa dữ liệu thành công");
      navigate("/admin/san-pham");
    } catch (error) {
      message.error("Chỉnh sửa dữ liệu thất bại");
      console.log(error);
    }
  };
  const colums: ColumnsType<any> = [
    {
      title: "STT",
      rowScope: "row",
      width: "10%",
      render: (text, record, index) => index + 1 + pageSize * (page - 1),
    },
    {
      title: "Kích Cỡ",
      align: "center",
      dataIndex: "kichCo",
      render: (kichCo) => kichCo.kichCo,
      sorter: (a, b) => {
        const kichCoA = parseFloat(a.kichCo.kichCo);
        const kichCoB = parseFloat(b.kichCo.kichCo);
        return kichCoA - kichCoB;
      },
    },
    {
      title: "Số lượng",
      dataIndex: "soLuong",
      width: "250px",
      render: (soLuong, record) => {
        if (selectedRowKeys.includes(record.key)) {
          return (
            <InputNumber
              value={soLuong} // Make sure this is the correct value from your data
              min={1}
              style={{ width: "100%" }}
              formatter={(value) => formatSoLuong(value)}
              parser={(value: any) => value.replace(/,/g, "")}
              onChange={(newSoLuong) => editSoLuong(record.key, newSoLuong)}
            />
          );
        } else {
          return (
            <span style={{ marginLeft: 12 }}>{formatSoLuong(soLuong)}</span>
          );
        }
      },
    },
    {
      title: "Giá tiền",
      dataIndex: "giaTien",
      width: "250px",
      render: (giaTien, record) => {
        if (selectedRowKeys.includes(record.key)) {
          return (
            <InputNumber
              value={giaTien}
              style={{ width: "100%" }}
              min={1000}
              step={10000}
              formatter={(value) => `${formatGiaTienVND(value)}`}
              parser={(value: any) => value.replace(/\D/g, "")}
              onChange={(newSoLuong) => editGiaTien(record.key, newSoLuong)}
            />
          );
        } else {
          return (
            <span style={{ marginLeft: 12 }}>{formatGiaTienVND(giaTien)}</span>
          );
        }
      },
    },
    {
      dataIndex: "key",
      align: "center",
      width: "1px",
      render: (key, record) => (
        <Button type="link" style={{ padding: 0 }}>
          <Tooltip title="Xóa">
            <DeleteOutlined
              style={{ color: "red" }}
              onClick={() => deleteItem(key, record)}
            />
          </Tooltip>
        </Button>
      ),
    },
    {
      title: "Ảnh",
      dataIndex: "anh",
      width: "10%",
      render: (text, record, index) => {
        if (index === 0) {
          return {
            children: (
              <Button
                type="link"
                style={{ padding: 0, fontSize: 30 }}
                onClick={() => setOpenModal(true)}
              >
                <PictureOutlined />
              </Button>
            ),
            props: {
              rowSpan: 10,
            },
          };
        } else {
          return {
            children: null,
            props: {
              rowSpan: 0,
            },
          };
        }
      },
    },
  ];

  const onClickMauSac = (event) => {
    const selectedValue = event.target.value;
    setIdMauSac(selectedValue);
    setCheckedMauSac(selectedValue);
    setPage(1);
  };
  const deleteItem = (key, record) => {
    confirm({
      title: "Xác Nhận",
      icon: <ExclamationCircleFilled />,
      content: (
        <span>
          Bạn có chắc xóa kích cỡ <strong>{record.kichCo.kichCo}</strong> không?
        </span>
      ),
      okText: "OK",
      cancelText: "Hủy",
      onOk: async () => {
        const updatedData = dataFake.filter((item) => item.key !== key);
        setDataFake(updatedData);
        message.success("Xóa thành công");
        if (record.id !== null) {
          try {
            await request.put(`chi-tiet-san-pham/update-status/${record.id}`);
          } catch (error) {
            message.error("Xóa thất bại");
            console.log(error);
          }
        }
      },
    });
  };
  const onAddModalKichCo = (
    mauSac: any,
    selectedKichCo: any,
    soLuong: number,
    giaTien: number
  ) => {
    console.log(mauSac);

    const updatedFakeData: DataTypeCTSP[] = [...dataFake];
    const newSelectedKeys: string[] = [];
    selectedKichCo.forEach((kichCo: string) => {
      const uniqueId = `${mauSac}-${kichCo}`;
      updatedFakeData.push({
        id: null,
        key: uniqueId,
        mauSac: {
          id: mauSacMapping[mauSac],
          ten: mauSac,
        },
        kichCo: {
          id: kichCo,
          kichCo: kichCoMapping[kichCo],
        },
        soLuong: soLuong,
        giaTien: giaTien,
        loaiDe: {
          id: 1,
        },
        diaHinhSan: {
          id: 1,
        },
        sanPham: { id: idSanPham },
        trangThai: "ACTIVE",
      });

      newSelectedKeys.push(uniqueId);
    });

    setDataFake(updatedFakeData);
    setSelectedRowKeys((prevSelectedKeys: string[]) => [
      ...prevSelectedKeys,
      ...newSelectedKeys,
    ]);
  };

  const editGiaTien = (key, newGiaTien) => {
    setDataFake((prevFakeData: any) =>
      prevFakeData.map((item) =>
        item.key === key ? { ...item, giaTien: newGiaTien } : item
      )
    );
  };
  const editSoLuong = (key, newSoLuong) => {
    setDataFake((prevFakeData: any) =>
      prevFakeData.map((item) =>
        item.key === key ? { ...item, soLuong: newSoLuong } : item
      )
    );
  };
  const onAddMauSac = (idMauSac, listKichCo, soLuong, giaTien) => {
    const updatedList: DataTypeCTSP[] = [...dataFake];
    const newSelectedKeys = [];
    const mauSac = {
      id: idMauSac,
      ten: mauSacMappingTen[idMauSac],
    };
    listKichCo.forEach((kichCo) => {
      const uniqueId = `${idMauSac}-${kichCo}`;
      updatedList.push({
        id: null,
        key: uniqueId,
        mauSac: {
          id: idMauSac,
          ten: mauSacMappingTen[idMauSac],
        },
        kichCo: {
          id: kichCo,
          kichCo: kichCoMapping[kichCo],
        },
        soLuong: soLuong,
        giaTien: giaTien,
        loaiDe: {
          id: idLoaiDe,
        },
        diaHinhSan: {
          id: idDiaHinhSan,
        },
        sanPham: { id: idSanPham },
        trangThai: "ACTIVE",
      });
      newSelectedKeys.push(uniqueId);
    });
    setIdMauSac(idMauSac);
    setDataFake(updatedList);
    console.log(updatedList);

    setCheckedMauSac(idMauSac);
    // Add the new selected keys to the state
    setSelectedRowKeys((prevSelectedKeys) => [
      ...prevSelectedKeys,
      ...newSelectedKeys,
    ]);
  };

  const filteredData = dataFake.filter((item) => item.mauSac.id === idMauSac);
  const mauSacList = Array.from(
    new Set(dataFake.map((item) => JSON.stringify(item.mauSac)))
  ).map((item) => JSON.parse(item));

  return (
    <>
      <Radio.Group
        buttonStyle="outline"
        // defaultValue={mauSacList[0].id}
        value={checkedMauSac}
        onChange={onClickMauSac}
      >
        <Space>
          <Row gutter={[10, 10]}>
            <Radio.Button type="default" style={{ marginRight: 5 }}>
              Tất cả
            </Radio.Button>
          </Row>
          <Space>
            {mauSacList.map((record: any) => (
              <Row gutter={[10, 10]} key={record.id}>
                <Col>
                  <Radio.Button
                    onClick={() => {
                      console.log(record);
                      setMauSac(record);
                    }}
                    value={record.id}
                  >
                    {record.ten}
                  </Radio.Button>
                </Col>
              </Row>
            ))}
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => setOpenModalMauSac(true)}
            >
              Thêm
            </Button>
          </Space>
        </Space>
      </Radio.Group>
      <Button
        onClick={onClickUpdate}
        type="primary"
        icon={<EditOutlined />}
        style={{ float: "right", backgroundColor: "green" }}
      >
        Hoàn Tất Chỉnh Sửa
      </Button>
      {checkedMauSac === undefined ? (
        <TableAllSanpham
          idSanPham={idSanPham}
          loadData={getDataChiTietSanPham}
        />
      ) : (
        <Table
          showSorterTooltip={false}
          pagination={{
            showSizeChanger: true,
            current: page,
            pageSize: pageSize,
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
          dataSource={filteredData}
          rowSelection={{
            selectedRowKeys,
            onChange: (selectedRowKeys: any, selectedRows: any) => {
              setSelectedRowKeys(selectedRowKeys);
            },
            checkStrictly: true,
            type: "checkbox",
          }}
          columns={colums}
          footer={() => (
            <Button
              type="dashed"
              style={{ textAlign: "center" }}
              icon={<PlusOutlined />}
              onClick={() => {
                setShowModal(true);
              }}
              block
            >
              Thêm Kích Cỡ
            </Button>
          )}
        />
      )}

      <ModalKichCo
        openModal={showModal}
        closeModal={() => setShowModal(false)}
        mauSac={mauSac}
        fakeData={dataFake}
        onAddKichCo={onAddModalKichCo}
      />
      <ModalAddMauSac
        onAddMauSac={onAddMauSac}
        idSanPham={idSanPham}
        openModal={openModalMauSac}
        closeModal={() => setOpenModalMauSac(false)}
      />
      <HinhAnhModal
        sanPham={idSanPham}
        mauSac={mauSac}
        openModal={openModal}
        closeModal={() => setOpenModal(false)}
      />
    </>
  );
}

export default TableUpdateSanpham;
