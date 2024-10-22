import React, { useState, useEffect } from "react";
import { Alert, Button, InputNumber, Table, Tooltip, message } from "antd";
import { formatGiaTienVND, formatSoLuong } from "~/utils/formatResponse";
import {
  DeleteOutlined,
  PictureOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import HinhAnhModal from "./HinhAnhModal";
import ModalKichCo from "./ModalKichCo";

function TableAddSanPham({
  dataMS,
  dataKC,
  soLuong,
  giaTien,
  selectedLoaiDe,
  selectedSanPham,
  selectedDiaHinhSan,
  selectedMauSac,
  selectedKichCo,
  onFakeDataChange,
}) {
  const [fakeData, setFakeData] = useState<DataTypeSanPham[]>([]);

  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Default page size
  const [kichCoModalVisible, setKichCoModalVisible] = useState(false);
  const [selectedMauSacForModal, setSelectedMauSacForModal] = useState(null);
  useEffect(() => {
    onFakeDataChange(fakeData);
  }, [fakeData, onFakeDataChange]);
  useEffect(() => {
    setFakeData(createFakeData());
  }, [
    selectedSanPham,
    selectedMauSac,
    selectedKichCo,
    selectedDiaHinhSan,
    selectedLoaiDe,
    soLuong,
    giaTien,
  ]);

  const mauSacMapping = {};
  dataMS.forEach((ms) => {
    mauSacMapping[ms.ten] = ms.id;
  });

  const kichCoMapping = {};
  dataKC.forEach((kc) => {
    kichCoMapping[kc.kichCo] = kc.id;
  });
  const kichCoMappingId = {};
  dataKC.forEach((kc) => {
    kichCoMappingId[kc.id] = kc.kichCo;
  });

  const handleEditSoLuong = (key, newSoLuong) => {
    setFakeData((prevFakeData: any) =>
      prevFakeData.map((item) =>
        item.key === key ? { ...item, soLuong: newSoLuong } : item
      )
    );
  };

  const handleEditGiaTien = (key, newGiaTien) => {
    setFakeData((prevFakeData: any) =>
      prevFakeData.map((item) =>
        item.key === key ? { ...item, giaTien: newGiaTien } : item
      )
    );
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const createFakeData = () => {
    const fakeData = [];
    if (
      selectedSanPham !== undefined &&
      selectedLoaiDe !== undefined &&
      selectedDiaHinhSan !== undefined &&
      soLuong !== undefined &&
      giaTien !== undefined &&
      selectedMauSac !== undefined &&
      selectedKichCo !== undefined
    ) {
      selectedMauSac.forEach((mauSac) => {
        selectedKichCo.forEach((kichCo) => {
          const uniqueId = `${mauSacMapping[mauSac]}-${kichCo}`;
          fakeData.push({
            key: uniqueId,
            giaTien: giaTien,
            soLuong: soLuong,
            loaiDe: {
              id: selectedLoaiDe,
            },
            diaHinhSan: {
              id: selectedDiaHinhSan,
            },
            sanPham: {
              id: selectedSanPham,
            },
            mauSac: {
              id: mauSacMapping[mauSac],
              ten: mauSac,
            },
            kichCo: {
              id: kichCoMapping[kichCo],
              kichCo: kichCo,
            },
            trangThai: "ACTIVE",
          });
        });
      });
    }
    console.log(fakeData);
    return fakeData;
  };

  const deleteItemFromFakeData = (key) => {
    const updatedData = fakeData.filter((item) => item.key !== key);
    setFakeData(updatedData);
  };
  const handleOpenKichCoModal = (mauSac) => {
    setSelectedMauSacForModal(mauSac);
    setKichCoModalVisible(true);
  };

  const handleAddKichCoToFakeData = (mauSac, selectedKichCo) => {
    const updatedFakeData = fakeData.slice();
    selectedKichCo.forEach((kichCo) => {
      const uniqueId = `${mauSacMapping[mauSac]}-${kichCo}`;
      updatedFakeData.push({
        key: uniqueId,
        giaTien: giaTien,
        soLuong: soLuong,
        loaiDe: { id: selectedLoaiDe },
        diaHinhSan: { id: selectedDiaHinhSan },
        sanPham: { id: selectedSanPham },
        mauSac: { id: mauSacMapping[mauSac], ten: mauSac },
        kichCo: { id: kichCo, kichCo: kichCoMappingId[kichCo] },
        trangThai: "ACTIVE",
      });
    });
    console.log(updatedFakeData);

    setFakeData(updatedFakeData);
  };

  const groupedData = {};
  fakeData.forEach((data) => {
    const mauSacKey = `${data.mauSac.id}`;
    if (!groupedData[mauSacKey]) {
      groupedData[mauSacKey] = [];
    }
    groupedData[mauSacKey].push(data);
  });
  const showModal = () => {
    if (selectedSanPham !== undefined) {
      setOpenModal(true);
    } else {
      message.warning("Bạn chưa chọn sản phẩm");
    }
  };
  const offModal = () => {
    setOpenModal(false);
  };
  return Object.keys(groupedData).map((mauSacKey) => {
    const mauSacData = groupedData[mauSacKey];
    const firstMauSac = mauSacData[0].mauSac;
    return (
      <div key={mauSacKey} style={{ marginBottom: 50 }}>
        <Alert
          style={{ textAlign: "center", fontWeight: "bold" }}
          message={firstMauSac.ten}
          type="info"
        />
        {/* <Space style={{ margin: 5 }}>
          <Button type="primary" danger onClick={clickDelete}>
            <DeleteOutlined />
            Xóa
          </Button>
          <InputNumber
            value={soLuong}
            onChange={(value) => setSoLuong(value)}
            min={1}
            style={{ width: "100%" }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
          />
          <Button type="default" onClick={clickSoLuong}>
            Sửa số lượng
          </Button>
          <InputNumber
            value={giaTien}
            style={{ width: "100%" }}
            min={0}
            step={1000}
            formatter={(value) => `${formatGiaTien(value)}`}
            parser={(value) => value!.replace(/\D/g, "")}
            onChange={(value) => setGiaTien(value)}
          />
          <Button type="default" onClick={clickGiaTien}>
            Sửa giá tiền
          </Button>
        </Space> */}
        <Table
          showSorterTooltip={false}
          dataSource={mauSacData}
          pagination={{
            pageSize: pageSize,
            current: currentPage,
            onChange: (page, pageSize) => handlePageChange(page, pageSize),
          }}
          columns={[
            {
              title: "#",
              rowScope: "row",
              render: (text, record, index) =>
                index + 1 + pageSize * (currentPage - 1),
            },
            {
              title: "Kích Cỡ",
              align: "center",
              dataIndex: "kichCo",
              render: (kichCo, record) => kichCo.kichCo,
              sorter: (a, b) => {
                const kichCoA = parseFloat(a.kichCo.kichCo);
                const kichCoB = parseFloat(b.kichCo.kichCo);
                return kichCoA - kichCoB;
              },
            },
            {
              title: "Số lượng",
              align: "center",
              dataIndex: "soLuong",
              render: (soLuong, record) => (
                <InputNumber
                  value={soLuong}
                  min={1}
                  style={{ width: "100%" }}
                  formatter={(value) => `${formatSoLuong(value)}`}
                  parser={(value) => value.replace(/,/g, "")}
                  onChange={(newSoLuong) =>
                    handleEditSoLuong(record.key, newSoLuong)
                  }
                />
              ),
            },
            {
              title: "Giá tiền",
              align: "center",
              dataIndex: "giaTien",
              render: (giaTien, record) => (
                <InputNumber
                  value={giaTien}
                  style={{ width: "100%" }}
                  min={0}
                  step={1000}
                  formatter={(value) => `${formatGiaTienVND(value)}`}
                  parser={(value) => value!.replace(/\D/g, "")}
                  onChange={(newGiaTien) =>
                    handleEditGiaTien(record.key, newGiaTien)
                  }
                />
              ),
            },
            {
              dataIndex: "key",
              align: "center",
              width: "1px",
              render: (key) => (
                <Button
                  type="link"
                  style={{ padding: 0 }}
                  onClick={() => deleteItemFromFakeData(key)}
                >
                  <Tooltip title="Xóa">
                    <DeleteOutlined style={{ color: "red" }} />
                  </Tooltip>
                </Button>
              ),
            },
            {
              title: "Ảnh",
              align: "center",
              dataIndex: "anh",
              width: "10%",
              render: (text, record, index) => {
                if (index === 0) {
                  return {
                    children: (
                      <Button
                        type="link"
                        style={{ padding: 0, fontSize: 30 }}
                        onClick={() => {
                          setSelectedMauSacForModal(firstMauSac);
                          showModal();
                        }}
                      >
                        <PictureOutlined />
                      </Button>
                    ),
                    props: {
                      rowSpan: mauSacData.length,
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
          ]}
        />
        <Button
          type="dashed"
          style={{ textAlign: "center" }}
          icon={<PlusOutlined />}
          onClick={() => handleOpenKichCoModal(firstMauSac)}
          block
        >
          Thêm Kích Cỡ Giày {firstMauSac.ten}
        </Button>
        <ModalKichCo
          fakeData={fakeData}
          openModal={kichCoModalVisible}
          mauSac={selectedMauSacForModal}
          closeModal={() => setKichCoModalVisible(false)}
          onAddKichCo={handleAddKichCoToFakeData}
        />
        <HinhAnhModal
          sanPham={selectedSanPham}
          mauSac={selectedMauSacForModal}
          openModal={openModal}
          closeModal={offModal}
        />
      </div>
    );
  });
}

export default TableAddSanPham;
