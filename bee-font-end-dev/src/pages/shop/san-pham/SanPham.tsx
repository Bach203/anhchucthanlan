import {
  Affix,
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  CollapseProps,
  ColorPicker,
  Divider,
  Input,
  Pagination,
  PaginationProps,
  Row,
  Select,
  Slider,
  Space,
  Typography,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { formatGiaTien, formatGiaTienVND } from "~/utils/formatResponse";
import request from "~/utils/request";
import { Link } from "react-router-dom";
import { DataParam } from "~/interfaces/filterSanPham.type";

const { Title } = Typography;
const { Text } = Typography;

const SanPham: React.FC = () => {
  const [thuongHieus, setThuongHieus] = useState([]);
  const [diaHinhSans, setDiaHinhSans] = useState([]);
  const [loaiDes, setLoaiDes] = useState([]);
  const [kichCos, setKichCos] = useState([]);
  const [mauSacs, setMauSacs] = useState([]);
  const [sanPhams, setSanPhams] = useState([]);
  const [giaTienRange, setGiaTienRange] = useState([0, 10000000]);
  const [dataParams, setDataParams] = useState<DataParam>();
  const [totalElements, setTotalElements] = useState(1);
  const [selectedDiaHinhSan, setSelectedDiaHinhSan] = useState([]);
  const [selectedKichCo, setSelectedKichCo] = useState([]);
  const [selectedLoaiDe, setSelectedLoaiDe] = useState([]);
  const [selectedThuongHieu, setSelectedThuongHieu] = useState([]);
  const [selectedMauSac, setSelectedMauSac] = useState([]);
  const [selectedSapXep, setSelectedSapXep] = useState([]);
  const [top, setTop] = React.useState<number>(100);
  const [search, setSearch] = useState("");

  const kichCoLength = Math.ceil(kichCos.length / 3);
  const leftKichCo = kichCos.slice(0, kichCoLength);
  const middleKichCo = kichCos.slice(kichCoLength, 2 * kichCoLength);
  const rightKichCo = kichCos.slice(2 * kichCoLength);

  const mauSacLength = Math.ceil(mauSacs.length / 3);
  const leftMauSac = mauSacs.slice(0, mauSacLength);
  const middleMauSac = mauSacs.slice(mauSacLength, 2 * mauSacLength);
  const rightMauSac = mauSacs.slice(2 * mauSacLength);

  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (
    current,
    pageSize
  ) => {
    setDataParams({
      ...dataParams,
      page: current,
      pageSize: pageSize,
    });
  };

  const handleThuongHieuChange = (brandId: string, checked: boolean) => {
    let updatedSelectedThuongHieu = [...selectedThuongHieu];
    if (checked) {
      // If checked, add the brand ID to selectedThuongHieu
      const selectedBrand = thuongHieus.find((item) => item.id === brandId);
      if (selectedBrand) {
        updatedSelectedThuongHieu = [
          ...updatedSelectedThuongHieu,
          selectedBrand,
        ];
      }
    } else {
      updatedSelectedThuongHieu = updatedSelectedThuongHieu.filter(
        (brand) => brand.id !== brandId
      );
    }

    setSelectedThuongHieu(updatedSelectedThuongHieu);
  };

  const handleDiaHinhSanChange = (diaHinhSanId: string, checked: boolean) => {
    let updateSelectedDiaHinhSan = [...selectedDiaHinhSan];
    if (checked) {
      const selectedDiaHinh = diaHinhSans.find(
        (item) => item.id === diaHinhSanId
      );
      if (selectedDiaHinh) {
        updateSelectedDiaHinhSan = [
          ...updateSelectedDiaHinhSan,
          selectedDiaHinh,
        ];
      }
    } else {
      updateSelectedDiaHinhSan = updateSelectedDiaHinhSan.filter(
        (dhs) => dhs.id !== diaHinhSanId
      );
    }

    setSelectedDiaHinhSan(updateSelectedDiaHinhSan);
  };

  const handleLoaiDeChange = (loaiDeId: string, checked: boolean) => {
    let updateSelectedLoaiDe = [...selectedLoaiDe];
    if (checked) {
      const selectedDe = loaiDes.find((item) => item.id === loaiDeId);
      if (selectedDe) {
        updateSelectedLoaiDe = [...updateSelectedLoaiDe, selectedDe];
      }
    } else {
      updateSelectedLoaiDe = updateSelectedLoaiDe.filter(
        (ld) => ld.id !== loaiDeId
      );
    }

    setSelectedLoaiDe(updateSelectedLoaiDe);
  };

  const handleKichCoChange = (kichCoId: string, checked: boolean) => {
    let updatedSelectedKichCo = [...selectedKichCo];
    if (checked) {
      const selectCo = kichCos.find((item) => item.id === kichCoId);
      if (selectCo) {
        updatedSelectedKichCo = [...updatedSelectedKichCo, selectCo];
      }
    } else {
      updatedSelectedKichCo = updatedSelectedKichCo.filter(
        (kc) => kc.id !== kichCoId
      );
    }

    setSelectedKichCo(updatedSelectedKichCo);
  };

  const handleMauSacChange = (mauSacId: string, checked: boolean) => {
    let updateSelectedMauSac = [...selectedMauSac];
    if (checked) {
      const selectMau = mauSacs.find((item) => item.id === mauSacId);
      if (selectMau) {
        updateSelectedMauSac = [...updateSelectedMauSac, selectMau];
      }
    } else {
      updateSelectedMauSac = updateSelectedMauSac.filter(
        (kc) => kc.id !== mauSacId
      );
    }

    setSelectedMauSac(updateSelectedMauSac);
  };

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: "GIÁ SẢN PHẨM",
      children: (
        <p>
          <Slider
            range
            min={0}
            max={10000000}
            step={100000}
            value={giaTienRange} // Sử dụng giá trị từ state
            onChange={(value) => setGiaTienRange(value)} // Cập nhật giá trị vào state
            tipFormatter={(value) => `${formatGiaTienVND(value)}`}
          />
          <span>
            Từ: {formatGiaTienVND(giaTienRange[0])} - Đến:{" "}
            {formatGiaTienVND(giaTienRange[1])}
          </span>
        </p>
      ),
    },
    {
      key: "2",
      label: "THƯƠNG HIỆU",
      children: (
        <p>
          {thuongHieus.map((item, index) => (
            <div key={index} style={{ marginBottom: 10 }}>
              <Checkbox
                onChange={(e) =>
                  handleThuongHieuChange(item.id, e.target.checked)
                }
              >
                {item.ten}
              </Checkbox>
            </div>
          ))}
        </p>
      ),
    },
    {
      key: "3",
      label: "ĐỊA HÌNH SÂN",
      children: (
        <p>
          {diaHinhSans.map((item, index) => (
            <div key={index} style={{ marginBottom: 10 }}>
              <Checkbox
                onChange={(e) =>
                  handleDiaHinhSanChange(item.id, e.target.checked)
                }
              >
                {item.ten}
              </Checkbox>
            </div>
          ))}
        </p>
      ),
    },
    {
      key: "4",
      label: "LOẠI ĐẾ",
      children: (
        <p>
          {loaiDes.map((item, index) => (
            <div key={index} style={{ marginBottom: 10 }}>
              <Checkbox
                onChange={(e) => handleLoaiDeChange(item.id, e.target.checked)}
              >
                {item.ten}
              </Checkbox>
            </div>
          ))}
        </p>
      ),
    },
    {
      key: "5",
      label: "KÍCH CỠ",
      children: (
        <p>
          <Row style={{ marginTop: 10 }}>
            <Col span={8}>
              {leftKichCo.map((item, index) => (
                <div key={index} style={{ marginBottom: 10 }}>
                  <Checkbox
                    onChange={(e) =>
                      handleKichCoChange(item.id, e.target.checked)
                    }
                  >
                    {item.kichCo}
                  </Checkbox>
                </div>
              ))}
            </Col>
            <Col span={8}>
              {middleKichCo.map((item, index) => (
                <div key={index} style={{ marginBottom: 10 }}>
                  <Checkbox
                    onChange={(e) =>
                      handleKichCoChange(item.id, e.target.checked)
                    }
                  >
                    {item.kichCo}
                  </Checkbox>
                </div>
              ))}
            </Col>
            <Col span={8}>
              {rightKichCo.map((item, index) => (
                <div key={index} style={{ marginBottom: 10 }}>
                  <Checkbox
                    onChange={(e) =>
                      handleKichCoChange(item.id, e.target.checked)
                    }
                  >
                    {item.kichCo}
                  </Checkbox>
                </div>
              ))}
            </Col>
          </Row>
        </p>
      ),
    },
    {
      key: "6",
      label: "MÀU SẮC",
      children: (
        <p>
          <Row style={{ marginTop: 10 }}>
            <Col span={8}>
              {leftMauSac.map((item, index) => (
                <div key={index} style={{ marginBottom: 10 }}>
                  <Checkbox
                    onChange={(e) =>
                      handleMauSacChange(item.id, e.target.checked)
                    }
                  >
                    <ColorPicker value={item.ma} size="small" disabled />
                    {item.ten}
                  </Checkbox>
                </div>
              ))}
            </Col>
            <Col span={8}>
              {middleMauSac.map((item, index) => (
                <div key={index} style={{ marginBottom: 10 }}>
                  <Checkbox
                    onChange={(e) =>
                      handleMauSacChange(item.id, e.target.checked)
                    }
                  >
                    <ColorPicker value={item.ma} size="small" disabled />
                    {item.ten}
                  </Checkbox>
                </div>
              ))}
            </Col>
            <Col span={8}>
              {rightMauSac.map((item, index) => (
                <div key={index} style={{ marginBottom: 10 }}>
                  <Checkbox
                    onChange={(e) =>
                      handleMauSacChange(item.id, e.target.checked)
                    }
                  >
                    <ColorPicker value={item.ma} size="small" disabled />
                    {item.ten}
                  </Checkbox>
                </div>
              ))}
            </Col>
          </Row>
        </p>
      ),
    },
  ];

  const onChange = (key: string | string[]) => {};

  const handleChange = (value: string) => {
    setSelectedSapXep(value);
  };

  useEffect(() => {
    const fetchThuongHieu = async () => {
      try {
        const res = await request.get("/thuong-hieu/list");
        setThuongHieus(res.data);
      } catch (error) {
        console.log(error);
        message.error("Lấy dữ liệu thương hiệu thất bại");
      }
    };

    const fetchDiaHinhSan = async () => {
      try {
        const res = await request.get("/dia-hinh-san/list");
        setDiaHinhSans(res.data);
      } catch (error) {
        console.log(error);
        message.error("Lấy dữ liệu địa hình sân thất bại");
      }
    };

    const fetchLoaiDe = async () => {
      try {
        const res = await request.get("/loai-de/list");
        setLoaiDes(res.data);
      } catch (error) {
        console.log(error);
        message.error("Lấy dữ liệu loại đế thất bại");
      }
    };

    const fetchSize = async () => {
      try {
        const res = await request.get("/kich-co/list");
        setKichCos(res.data);
      } catch (error) {
        console.log(error);
        message.error("Lấy dữ liệu kích cỡ thất bại");
      }
    };

    const fetchMauSac = async () => {
      try {
        const res = await request.get("/mau-sac/list");
        setMauSacs(res.data);
      } catch (error) {
        console.log(error);
        message.error("Lấy dữ liệu màu sắc thất bại");
      }
    };

    const fetchSanPham = async () => {
      const params = {
        minPrice: giaTienRange[0],
        maxPrice: giaTienRange[1],
        sapXep: selectedSapXep,
        listThuongHieu: selectedThuongHieu.map((item) => item.id).join(","),
        listDiaHinhSan: selectedDiaHinhSan.map((item) => item.id).join(","),
        listLoaiDe: selectedLoaiDe.map((item) => item.id).join(","),
        listKichCo: selectedKichCo.map((item) => item.id).join(","),
        listMauSac: selectedMauSac.map((item) => item.id).join(","),
        search: search,
      };

      try {
        const res = await request.get("/san-pham/filter", {
          params: { ...dataParams, ...params },
        });

        setSanPhams(res.data.content);
        setTotalElements(res.data.totalElements);
      } catch (error) {
        console.log(error);
        message.error("Lấy dữ liệu sản phẩm thất bạiii");
      }
    };

    fetchThuongHieu();
    fetchDiaHinhSan();
    fetchLoaiDe();
    fetchSize();
    fetchMauSac();
    fetchSanPham();
  }, [
    dataParams,
    selectedThuongHieu,
    selectedDiaHinhSan,
    selectedLoaiDe,
    selectedKichCo,
    selectedMauSac,
    giaTienRange,
    selectedSapXep,
    search,
  ]);
  return (
    <>
      <div
        style={{
          backgroundColor: "#EEEEEE",
          height: 35,
          fontSize: 16,
          display: "flex",
          alignItems: "center",
          paddingLeft: 65,
          marginBottom: 20,
        }}
      >
        <span>Trang chủ/</span>
        <span style={{ fontWeight: "bold", paddingLeft: 5 }}>Sản phẩm</span>
      </div>
      <Row>
        <Col span={1}></Col>
        <Col span={6}>
          <Collapse items={items} onChange={onChange} />
        </Col>

        <Col span={15} style={{ marginLeft: 30 }}>
          <Space>
            <p style={{ fontWeight: "bold", float: "left" }}>
              DANH SÁCH SẢN PHẨMM
            </p>
            <Affix offsetTop={top}>
              <Input
                style={{ width: 400, marginLeft: 60 }}
                value={search}
                onChange={(e) => setSearch(e.target.value.trimStart())}
                placeholder="Tìm kiếm Sản phẩm ..."
              />
            </Affix>
            <Select
              defaultValue={"6"}
              style={{ width: 140, marginLeft: 125 }}
              onChange={handleChange}
              options={[
                { value: "3", label: "Tên: A-Z" },
                { value: "4", label: "Tên: Z-A" },
                { value: "5", label: "Cũ nhất" },
                { value: "6", label: "Mới nhất" },
              ]}
            />
          </Space>
          <Row gutter={16}>
            {sanPhams.map((product) => (
              <Col key={product.id} style={{ marginRight: 25 }}>
                <Link
                  to={`/san-pham/detail/${product.id}`}
                  style={{ color: "black", margin: 0 }}
                >
                  <Card
                    hoverable
                    style={{ width: 267, marginBottom: 10 }}
                    cover={
                      <img
                        style={{ padding: "0px 10px" }}
                        alt="example"
                        src={`http://localhost:8081/admin/api/file/view/${product.duongDan}`}
                      />
                    }
                  >
                    <Divider style={{ margin: 0, padding: 0 }} />
                    <Text style={{ textAlign: "left" }} strong>
                      {product.ten}
                      <Title level={5} style={{ color: "red", margin: 0 }}>
                        {product.giaMin === product.giaMax
                          ? `${formatGiaTien(product.giaMax)}`
                          : `${formatGiaTien(product.giaMin)} - ${formatGiaTien(
                              product.giaMax
                            )}`}
                      </Title>
                    </Text>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
          <Pagination
            style={{ marginLeft: 390, marginBottom: 50 }}
            defaultPageSize={9}
            showSizeChanger={false}
            onChange={onShowSizeChange}
            defaultCurrent={1}
            total={totalElements}
          />
        </Col>
      </Row>
    </>
  );
};

export default SanPham;
