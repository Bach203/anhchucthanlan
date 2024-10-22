import {
  LeftOutlined,
  MinusOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Carousel,
  Col,
  ColorPicker,
  Divider,
  Form,
  Image,
  Input,
  Popover,
  Radio,
  Row,
  Space,
  Tooltip,
  Typography,
  message,
} from "antd";
import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DataParams } from "~/interfaces/gioHang.type";
import { DataType } from "~/interfaces/loaiDe.type";
import { formatGiaTien } from "~/utils/formatResponse";
import request from "~/utils/request";
const { Title, Text } = Typography;
const detailSanPham: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [dataSanPham, setDataSanPham] = useState<any[]>([]);
  const [dataMauSac, setDataMauSac] = useState<DataType[]>([]);
  const [dataKichCo, setDataKichCo] = useState<any[]>([]);
  const [dataLoaiDe, setDataLoaiDe] = useState<DataType[]>([]);
  const [dataDHS, setDataDHS] = useState<any[]>([]);
  const [dataHinhAnh, setDataHinhAnh] = useState<any[]>([]);
  const [titleMauSac, setTitleMauSac] = useState("");
  const [titleKichCo, setTitleKichCo] = useState("");
  const [titleLoaiDe, setTitleLoaiDe] = useState("");
  const [titleDiaHinhSan, setTitleDiaHinhSan] = useState("");
  const [idMauSac, setIdMauSac] = useState(null);
  const [idKichCo, setIdKichCo] = useState(null);
  const [idLoaiDe, setIdLoaiDe] = useState(null);
  const [idDiaHinhSan, setIdDiaHinhSan] = useState(null);
  const [idGioHang, setIdGioHang] = useState(null);

  const [anhDaiDien, setAnhDaiDien] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [giaTienMin, setGiaTienMin] = useState(0);
  const [giaTienMax, setGiaTienMax] = useState(0);
  const [quantity, setQuantity] = useState(1); // Số lượng sản phẩm, mặc định là 1
  const [form] = Form.useForm();
  const { id } = useParams();

  const idGioHangTaiKhoan = localStorage.getItem("cartIdTaiKhoan");
  const idGioHangNull = localStorage.getItem("cartId");

  // Hàm xử lý khi bấm nút cộng
  const handleIncrement = () => {
    if (quantity < totalQuantity) {
      setQuantity(quantity + 1);
    }
  };

  // Hàm xử lý khi bấm nút trừ
  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  const fetchDataMS = async () => {
    try {
      const res = await request.get("/mau-sac/detail/" + id);
      setDataMauSac(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchDataSize = async () => {
    try {
      const res = await request.get("/kich-co/detail/" + id);
      setDataKichCo(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataLoaiDe = async () => {
    try {
      const res = await request.get("/loai-de/detail/" + id);
      setDataLoaiDe(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchDataDHS = async () => {
    try {
      const res = await request.get("/dia-hinh-san/detail/" + id);
      setDataDHS(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const sanPham = async () => {
    try {
      const res = await request.get("/san-pham/" + id);
      setDataSanPham(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const hinhAnh = async () => {
    try {
      const res = await request.get("hinh-anh-san-pham", {
        params: {
          idSanPham: id,
          idMauSac: idMauSac,
        },
      });
      setAnhDaiDien(res.data[0].duongDan);
      setDataHinhAnh(res.data);
      setCurrentPage(1);
    } catch (error) {
      console.log(error);
    }
  };
  const sanPhamChiTiet = async () => {
    try {
      const res = await request.get("/chi-tiet-san-pham/" + id, {
        params: {
          idMauSac: idMauSac,
          idKichCo: idKichCo,
          idLoaiDe: idLoaiDe,
          idDiaHinhSan: idDiaHinhSan,
        },
      });
      const sanPhamList = res.data;
      setData(sanPhamList);

      const giaTienMin = sanPhamList.reduce((min, sanPham) => {
        return sanPham.giaTien < min ? sanPham.giaTien : min;
      }, sanPhamList[0].giaTien);

      const giaTienMax = sanPhamList.reduce((max, sanPham) => {
        return sanPham.giaTien > max ? sanPham.giaTien : max;
      }, sanPhamList[0].giaTien);

      setGiaTienMin(giaTienMin);
      setGiaTienMax(giaTienMax);
    } catch (error) {
      console.log(error);
    }
  };
  const totalQuantity = data.reduce((total, item) => total + item.soLuong, 0);

  const generateUniqueCartId = async () => {
    try {
      const res = await request.post(`gio-hang`, {
        ghiChu: "khong xac dinh",
      });
      console.log(res);

      return res.data.id;
    } catch (error) {
      console.error("Lỗi khi tạo gio-hang:", error);
      throw new Error("Lỗi khi tạo gio-hang");
    }
  };

  const getCartId = async () => {
    return new Promise(async (resolve, reject) => {
      let cartId = localStorage.getItem("cartId");

      if (!cartId) {
        try {
          const newCartId = await generateUniqueCartId();
          localStorage.setItem("cartId", newCartId);
          resolve(newCartId);
        } catch (error) {
          console.error("Lỗi khi lấy ID giỏ hàng:", error);
          reject(error);
        }
      } else {
        resolve(cartId);
      }
    });
  };

  const onFinish = async () => {
    // Kiểm tra thông tin sản phẩm
    if (
      idMauSac === null ||
      idKichCo === null ||
      idLoaiDe === null ||
      idDiaHinhSan === null
    ) {
      message.error("Bạn chưa nhập thông tin sản phẩm muốn thêm vào giỏ hàng");
      return;
    } else if (totalQuantity <= 0) { // Kiểm tra số lượng tồn kho
      message.error("Sản phẩm đã hết hàng");
      return;
    }
  
    try {
      let cartId;
  
      // Không null thì sử dụng trực tiếp
      if (idGioHangTaiKhoan != null) {
        cartId = idGioHangTaiKhoan;
      } else {
        // Otherwise, use the provided idGioHangNull or generate a new one
        cartId = await getCartId();
      }
  
      // Lấy thông tin chi tiết sản phẩm
      const productResponse = await request.get(
        "/chi-tiet-san-pham/get-one/" + id,
        {
          params: {
            idMauSac: idMauSac,
            idKichCo: idKichCo,
            idDiaHinhSan: idDiaHinhSan,
            idLoaiDe: idLoaiDe,
          },
        }
      );
  
      if (productResponse.data) {
        const productDetail = productResponse.data;
        const stockQuantity = productDetail.soLuong; // Số lượng tồn kho
  
        // Lấy số lượng hiện tại trong giỏ hàng
        const cartResponse = await request.get(`/gio-hang/${cartId}`);
        const cartItems = cartResponse.data.gioHangChiTietList || [];
        const existingItem = cartItems.find(
          (item: any) => item.chiTietSanPham.id === productDetail.id
        );
  
        const existingQuantity = existingItem ? existingItem.soLuong : 0;
        const totalQuantityInCart = existingQuantity + quantity; // Tổng số lượng dự kiến
  
        // Kiểm tra số lượng tồn kho
        if (totalQuantityInCart > stockQuantity) {
          message.warning(`Số lượng giỏ hàng của bạn đã vượt quá số lượng trong kho là ${stockQuantity}`);
          return; // Dừng lại không thêm sản phẩm
        }
  
        // Thêm sản phẩm vào giỏ hàng nếu số lượng hợp lệ
        await request.post("/gio-hang-chi-tiet", {
          gioHang: {
            id: cartId,
          },
          soLuong: quantity,
          chiTietSanPham: { id: productDetail.id },
        });
  
        message.success("Thêm sản phẩm vào giỏ hàng thành công");
        await navigate("/gio-hang");
      }
    } catch (error) {
      message.error("Thêm sản phẩm vào giỏ hàng thất bại");
      console.log(error);
    }
  };
  

  const handleMauSac = (event) => {
    setIdMauSac(event.id !== idMauSac ? event.id : null);
    setTitleMauSac(event.ten);
    setQuantity(1);
  };
  const handleKichCo = (event) => {
    setTitleKichCo(event.kichCo);
    setIdKichCo(event.id === idKichCo ? null : event.id);
    setQuantity(1);
  };
  const handleLoaiDe = (event) => {
    setQuantity(1);
    setIdLoaiDe(event.id === idLoaiDe ? null : event.id);
    setTitleLoaiDe(event.ten);
  };

  const handleDiaHinhSan = (event) => {
    setQuantity(1);
    setTitleDiaHinhSan(event.ten);
    setIdDiaHinhSan(event.id === idDiaHinhSan ? null : event.id);
  };

  useEffect(() => {
    sanPham();
    sanPhamChiTiet();
    fetchDataMS();
    fetchDataLoaiDe();
    fetchDataSize();
    fetchDataDHS();
  }, [idMauSac, idKichCo, idLoaiDe, idDiaHinhSan]);
  useEffect(() => {
    hinhAnh();
  }, [idMauSac]);
  const onChangeHinhAnh = (event) => {
    const selectedImageIndex = dataHinhAnh.findIndex(
      (image) => image.id === event.id
    );

    setAnhDaiDien(event.duongDan);
    setSelectedImageIndex(selectedImageIndex);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 5;

  // Function to get the current set of images based on the current page
  const getCurrentImages = () => {
    const startIndex = (currentPage - 1) * imagesPerPage;
    const endIndex = startIndex + imagesPerPage;
    return dataHinhAnh.slice(startIndex, endIndex);
  };

  // Function to handle next page
  const handleNextPage = () => {
    const totalPages = Math.ceil(dataHinhAnh.length / imagesPerPage);
    setCurrentPage((prevPage) =>
      prevPage < totalPages ? prevPage + 1 : prevPage
    );
  };

  // Function to handle previous page
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };
  const isLastPage =
    currentPage >= Math.ceil(dataHinhAnh.length / imagesPerPage);
  const isFirstPage = currentPage <= 1;
  return (
    <>
      <Row style={{ margin: 40 }}>
        <Col span={2}></Col>
        <Col span={9}>
          <Image
            preview={false}
            width={500}
            height={500}
            fallback="http://localhost:8081/admin/api/file/view/fallback.jpg"
            src={`http://localhost:8081/admin/api/file/view/${anhDaiDien}`}
          />
          {dataHinhAnh.length > 0 && (
            <>
              <Space>
                <Button
                  type="link"
                  style={{ margin: 0, padding: 0 }}
                  onClick={handlePrevPage}
                  disabled={isFirstPage}
                >
                  <LeftOutlined style={{ fontSize: 25 }} />
                </Button>
                <Radio.Group
                  // style={{ margin: "15px 0px" }}
                  buttonStyle="solid"
                  defaultValue={dataHinhAnh[selectedImageIndex]?.id}
                  value={dataHinhAnh[selectedImageIndex]?.id}
                >
                  <Row gutter={[15, 15]}>
                    {/* Only render the images for the current page */}
                    {getCurrentImages().map((record) => (
                      <Col key={record.id}>
                        <Radio.Button
                          value={record.id}
                          style={{ margin: 0, padding: 0, height: 71.5 }}
                          onClick={() => onChangeHinhAnh(record)}
                        >
                          <Image
                            preview={false}
                            width={70}
                            height={70}
                            fallback="http://localhost:8081/admin/api/file/view/fallback.jpg"
                            src={`http://localhost:8081/admin/api/file/view/${record.duongDan}`}
                          />
                        </Radio.Button>
                      </Col>
                    ))}
                  </Row>
                </Radio.Group>

                {/* Add buttons to navigate to the next and previous pages */}

                <Button
                  type="link"
                  style={{ margin: 0, padding: 0 }}
                  onClick={handleNextPage}
                  disabled={isLastPage}
                >
                  <RightOutlined style={{ fontSize: 25 }} />
                </Button>
              </Space>
            </>
          )}
        </Col>
        <Col span={10}>
          <Title level={3} style={{ margin: 0 }}>
            {dataSanPham.ten}
          </Title>
          <Divider style={{ margin: 5, padding: 0 }} />
          <Title level={3} style={{ color: "red", margin: 10 }}>
            {giaTienMin === giaTienMax
              ? `${formatGiaTien(giaTienMax)}`
              : `${formatGiaTien(giaTienMin)} - ${formatGiaTien(giaTienMax)}`}
          </Title>
          <Space direction="vertical">
            <Text>Thông tin sản phẩm</Text>
            <Text> - Mã sản phẩm: {dataSanPham.ma}</Text>
            <Text>
              - Nhà cung cấp:{" "}
              {dataSanPham.thuongHieu && dataSanPham.thuongHieu.ten}
            </Text>
          </Space>
          <Form layout="vertical">
            <Space direction="vertical">
              <Text>Màu sắc: {idMauSac !== null ? titleMauSac : ""}</Text>
              <Radio.Group buttonStyle="solid" value={idMauSac}>
                <Row gutter={[15, 15]}>
                  {dataMauSac.map((record: any) => (
                    <Tooltip title={record.ten}>
                      <Col key={record.id}>
                        <Radio.Button
                          onClick={() => handleMauSac(record)}
                          value={record.id}
                          style={{ margin: 0, padding: 0, border: "0" }}
                          disabled={
                            !data.some((item) => item.mauSac.id === record.id)
                          }
                        >
                          <ColorPicker
                            value={record.ma}
                            size="middle"
                            disabled
                          />
                        </Radio.Button>
                      </Col>
                    </Tooltip>
                  ))}
                </Row>
              </Radio.Group>
              <Text>Kích cỡ: {idKichCo !== null ? titleKichCo : ""}</Text>
              <Radio.Group buttonStyle="solid" value={idKichCo}>
                <Row gutter={[15, 15]}>
                  {dataKichCo.map((record: any) => (
                    <Col key={record.id}>
                      <Radio.Button
                        onClick={() => handleKichCo(record)}
                        value={record.id}
                        disabled={
                          !data.some((item) => item.kichCo.id === record.id)
                        }
                      >
                        {record.kichCo}
                      </Radio.Button>
                    </Col>
                  ))}
                </Row>
              </Radio.Group>

              <Text>Loại đế: {idLoaiDe !== null ? titleLoaiDe : ""}</Text>
              <Radio.Group buttonStyle="solid" value={idLoaiDe}>
                <Row gutter={[15, 15]}>
                  {dataLoaiDe.map((record) => (
                    <Col key={record.id}>
                      <Radio.Button
                        onClick={() => handleLoaiDe(record)}
                        value={record.id}
                        disabled={
                          !data.some((item) => item.loaiDe.id === record.id)
                        }
                      >
                        {record.ten}
                      </Radio.Button>
                    </Col>
                  ))}
                </Row>
              </Radio.Group>
              <Text>
                Địa hình sân: {idDiaHinhSan !== null ? titleDiaHinhSan : ""}
              </Text>
              <Radio.Group buttonStyle="solid" value={idDiaHinhSan}>
                <Row gutter={[15, 15]}>
                  {dataDHS.map((record: any) => (
                    <Col key={record.id}>
                      <Radio.Button
                        onClick={() => handleDiaHinhSan(record)}
                        value={record.id}
                        disabled={
                          !data.some((item) => item.diaHinhSan.id === record.id)
                        }
                      >
                        {record.ten}
                      </Radio.Button>
                    </Col>
                  ))}
                </Row>
              </Radio.Group>

              <Text>Số lượng:</Text>
              <Space>
                <Space.Compact block>
                  <Button icon={<MinusOutlined />} onClick={handleDecrement} />
                  <Input
                    style={{ textAlign: "center", width: 70 }}
                    value={quantity}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value, 10);
                      if (isNaN(newValue) || newValue < 1) {
                        setQuantity(1);
                      } else {
                        setQuantity(Math.min(newValue, totalQuantity));
                      }
                    }}
                  />

                  <Button icon={<PlusOutlined />} onClick={handleIncrement} />
                </Space.Compact>
                <Text style={{ color: "red" }}>
                  {totalQuantity} sản phẩm có sẵn
                </Text>
              </Space>
              <Space style={{ marginTop: 8 }}>
                <Button type="primary" danger onClick={onFinish}>
                  THÊM VÀO GIỎ HÀNG
                </Button>
              </Space>
            </Space>
          </Form>
        </Col>
      </Row>
    </>
  );
};
export default detailSanPham;
