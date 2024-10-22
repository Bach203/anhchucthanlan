// import * as React from "react";
// import { useState, useEffect } from "react";
// import {
//   ArrowLeftOutlined,
//   DeleteOutlined,
//   ExclamationCircleFilled,
//   MinusOutlined,
//   PlusOutlined,
// } from "@ant-design/icons";
// import {
//   Button,
//   Card,
//   Col,
//   Divider,
//   Empty,
//   Image,
//   Input,
//   Modal,
//   Row,
//   Space,
//   Table,
//   TablePaginationConfig,
//   Tooltip,
//   Typography,
//   message,
// } from "antd";
// import { ColumnsType } from "antd/es/table";
// import { Link } from "react-router-dom";
// // lấy tạm data địa hình sân
// import { DataParams, DataType } from "~/interfaces/diaHinhSan.type";
// import { FilterValue, SorterResult } from "antd/es/table/interface";
// import request from "~/utils/request";
// import { formatGiaTien } from "~/utils/formatResponse";
// import HinhAnhSanPham from "./HinhAnhSanPham";
// import ThanhToan from "../thanh-toan/ThanhToan";
// const { Title, Text } = Typography;

// const idGioHangTaiKhoan = localStorage.getItem("cartIdTaiKhoan");
// const idGioHangNull = localStorage.getItem("cartId");

// const index: React.FC = () => {
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState<DataType[]>([]);
//   const { confirm } = Modal;

//   const idGioHangTaiKhoan = localStorage.getItem("cartIdTaiKhoan");
//   const idGioHangNull = localStorage.getItem("cartId");
//   const currentPathname = window.location.pathname;

//   const fetchData = async () => {
//     try {
//       const res = await request.get(
//         `/gio-hang/${
//           idGioHangTaiKhoan != null ? idGioHangTaiKhoan : idGioHangNull
//         }`
//       );
//       setData(res.data.gioHangChiTietList);
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   useEffect(() => {
//     fetchData();
//   }, [idGioHangTaiKhoan, idGioHangNull, currentPathname]);

//   const confirmDelete = (id) => {
//     confirm({
//       title: "Xác Nhận",
//       icon: <ExclamationCircleFilled />,
//       content: "Bạn có chắc muốn xóa sản phẩm này?",
//       okText: "Xóa",
//       cancelText: "Hủy",
//       onOk: () => handleDeleteItem(id), // Pass the ID to the function
//     });
//   };
//   const handleDeleteItem = async (id) => {
//     try {
//       setLoading(true);
//       await request.delete(`gio-hang-chi-tiet/${id}`);
//       setLoading(false);
//       fetchData();
//       message.success("Xóa sản phẩm thành công");
//     } catch (error) {
//       message.error("Xóa sản phẩm thất bại");
//       setLoading(false);
//     }
//   };

//   const [updatedQuantities, setUpdatedQuantities] = useState([]);
//   const handleIncrement = (record: DataType) => {
//     const newData = [...data];
//     const index = newData.indexOf(record);

//     // Check if the incremented quantity is less than the limit
//     if (newData[index].soLuong < newData[index].chiTietSanPham.soLuong) {
//       newData[index].soLuong += 1;

//       // Add the item ID to updatedQuantities if not already in the array
//       if (!updatedQuantities.includes(record.id)) {
//         setUpdatedQuantities((prev) => [...prev, record.id]);
//       }

//       setData(newData);
//     } else {
//       // Handle when the quantity reaches the limit (if needed)
//       message.warning(
//         `Rất tiếc, bạn chỉ có thể mua tối đa ${newData[index].chiTietSanPham.soLuong} sản phẩm.`
//       );
//     }
//   };

//   const countSanPham = data.reduce((acc, item) => acc + item.soLuong, 0);

//   const handleDecrement = (record: DataType) => {
//     if (record.soLuong > 1) {
//       const newData = [...data];
//       const index = newData.indexOf(record);
//       newData[index].soLuong -= 1;
//       setData(newData);

//       // Add the item ID to updatedQuantities if not already in the array
//       if (!updatedQuantities.includes(record.id)) {
//         setUpdatedQuantities((prev) => [...prev, record.id]);
//       }
//     }
//   };

//   const [params, setParams] = useState<DataParams>({
//     page: 1,
//     pageSize: 10,
//   });
//   const totalAmount = data.reduce((acc, item) => {
//     const itemPrice = item.chiTietSanPham.giaTien; // Unit price
//     const itemQuantity = item.soLuong; // Quantity
//     const itemTotalPrice = itemPrice * itemQuantity; // Total price for the item
//     return acc + itemTotalPrice;
//   }, 0);

//   const columns: ColumnsType<DataType> = [
//     {
//       title: "Thông tin sản phẩm",
//       dataIndex: "chiTietSanPham",
//       key: "ten",
//       align: "left",
//       render: (chiTietSanPham, record) => (
//         <Space>
//           <HinhAnhSanPham chiTietSanPham={chiTietSanPham} />
//           <Space direction="vertical">
//             <Text strong>{chiTietSanPham.sanPham.ten}</Text>
//             <Text>{`[${chiTietSanPham.mauSac.ten} - ${chiTietSanPham.kichCo.kichCo} - ${chiTietSanPham.loaiDe.ten} - ${chiTietSanPham.diaHinhSan.ten}]`}</Text>
//             {chiTietSanPham.soLuong === 0 && (
//               <Text type="danger" strong italic>
//                 Hết hàng
//               </Text>
//             )}
//             {chiTietSanPham.soLuong > 0 &&
//               record.soLuong > chiTietSanPham.soLuong && (
//                 <Text type="danger" italic strong>
//                   Chỉ có thể mua tối đa {chiTietSanPham.soLuong} sản phẩm
//                 </Text>
//               )}
//           </Space>
//         </Space>
//       ),
//     },
//     {
//       title: "Đơn giá",
//       dataIndex: "chiTietSanPham",
//       key: "giaTien",
//       align: "center",
//       render: (_, record) => (
//         <Text type="danger" style={{ fontWeight: "bold" }}>
//           {formatGiaTien(record.chiTietSanPham.giaTien)}
//         </Text>
//       ),
//     },
//     {
//       title: "Số lượng",
//       dataIndex: "soLuong",
//       key: "soLuong",
//       align: "center",
//       render: (soLuong: number, record: DataType) => (
//         <Space.Compact>
//           <Button
//             icon={<MinusOutlined />}
//             onClick={() => handleDecrement(record)}
//           />
//           <Input
//             style={{ textAlign: "center", width: 70 }}
//             value={soLuong.toString()}
//             onChange={(e) => {
//               const newValue = parseInt(e.target.value, 10);
//               if (isNaN(newValue) || newValue < 1) {
//                 const newData = [...data];
//                 const index = newData.findIndex(
//                   (item) => item.id === record.id
//                 );
//                 newData[index].soLuong = 1; // Set to 1 if the entered value is empty or less than 1
//                 setData(newData);
//               } else {
//                 const newData = [...data];
//                 const index = newData.findIndex(
//                   (item) => item.id === record.id
//                 );
//                 newData[index].soLuong = Math.min(
//                   newValue,
//                   newData[index].chiTietSanPham.soLuong
//                 );
//                 setData(newData);
//               }
//               // Add the item ID to updatedQuantities if not already in the array
//               if (!updatedQuantities.includes(record.id)) {
//                 setUpdatedQuantities((prev) => [...prev, record.id]);
//               }
//             }}
//           />

//           <Button
//             icon={<PlusOutlined />}
//             onClick={() => handleIncrement(record)}
//           />
//         </Space.Compact>
//       ),
//     },
//     {
//       title: "Thành tiền",
//       dataIndex: "thanhTien",
//       key: "thanhTien",
//       align: "center",
//       render: (text, record) => (
//         <Text type="danger" style={{ fontWeight: "bold" }}>
//           {formatGiaTien(record.chiTietSanPham.giaTien * record.soLuong)}
//         </Text>
//       ),
//     },

//     {
//       dataIndex: "id",
//       align: "center",
//       // width: "1px",
//       render: (id, record) => (
//         <>
//           <Tooltip title="Xóa">
//             <Button
//               type="link"
//               style={{ padding: 0 }}
//               onClick={() => confirmDelete(id)}
//             >
//               <DeleteOutlined style={{ color: "red" }} />
//             </Button>
//           </Tooltip>
//         </>
//       ),
//     },
//   ];

//   const onChangeTable = (
//     pagination: TablePaginationConfig,
//     filters: Record<string, FilterValue | null>,
//     sorter: SorterResult<DataType> | any
//   ) => {
//     filters;
//     const page = pagination.current !== undefined ? pagination.current : 1;
//     const pageSize =
//       pagination.pageSize !== undefined ? pagination.pageSize : 10;
//     setParams({
//       ...params,
//       page: page,
//       pageSize: pageSize,
//       sortField: sorter.field,
//       sortOrder: sorter.order,
//     });
//   };
//   const onUpdateCart = async () => {
//     if (updatedQuantities.length === 0) {
//       return;
//     }
//     const updatedData = data
//       .filter((item) => updatedQuantities.includes(item.id))
//       .map((item) => ({
//         id: item.id,
//         soLuong: item.soLuong,
//       }));
//     try {
//       setLoading(true);
//       await request.put("/gio-hang-chi-tiet/update/" + id, updatedData);
//       setLoading(false);
//       message.success("Cập nhật giỏ hàng thành công");
//     } catch (error) {
//       message.error("Cập nhật giỏ hàng thất bại");
//       setLoading(false);
//     }
//   };
//   return (
//     <>
//       <Card
//         title={
//           <Title level={4} style={{ fontWeight: "bold" }}>
//             Giỏ hàng của bạn
//           </Title>
//         }
//       >
//         {data.length > 0 ? (
//           <Row>
//             <Col span={15}>
//               <Card>
//                 <Table
//                   columns={columns}
//                   dataSource={data}
//                   onChange={onChangeTable}
//                   loading={loading}
//                   showSorterTooltip={false}
//                   pagination={false}
//                   footer={() => (
//                     <Space>
//                       <Link to="/">
//                         <Button type="dashed">
//                           <ArrowLeftOutlined />
//                           TIẾP TỤC MUA SẮM
//                         </Button>
//                       </Link>
//                     </Space>
//                   )}
//                 />
//               </Card>
//             </Col>
//             <Col span={1}></Col>
//             <Col span={8}>
//               <ThanhToan
//                 tamTinh={totalAmount}
//                 dataSanPham={data}
//                 soSanPham={countSanPham}
//               />
//             </Col>
//           </Row>
//         ) : (
//           <Empty
//             description={
//               <>
//                 <Title level={5}>Giỏ hàng của bạn còn trống</Title>
//                 <Link to="/san-pham">
//                   <Button type="dashed">MUA NGAY</Button>
//                 </Link>
//               </>
//             }
//           />
//         )}
//       </Card>
//     </>
//   );
// };

// export default index;
import * as React from "react";
import { useState, useEffect } from "react";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Input,
  Modal,
  Row,
  Space,
  Table,
  TablePaginationConfig,
  Tooltip,
  Typography,
  message,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";
import { DataParams, DataType } from "~/interfaces/diaHinhSan.type";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import request from "~/utils/request";
import { formatGiaTien } from "~/utils/formatResponse";
import HinhAnhSanPham from "./HinhAnhSanPham";
import ThanhToan from "../thanh-toan/ThanhToan";
const { Title, Text } = Typography;

const idGioHangTaiKhoan = localStorage.getItem("cartIdTaiKhoan");
const idGioHangNull = localStorage.getItem("cartId");

const index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataType[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]); // Thêm state để theo dõi sản phẩm được chọn
  const { confirm } = Modal;

  const currentPathname = window.location.pathname;

  const fetchData = async () => {
    try {
      const res = await request.get(
        `/gio-hang/${
          idGioHangTaiKhoan != null ? idGioHangTaiKhoan : idGioHangNull
        }`
      );
      setData(res.data.gioHangChiTietList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [idGioHangTaiKhoan, idGioHangNull, currentPathname]);

  const confirmDelete = (id: number) => {
    confirm({
      title: "Xác Nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn xóa sản phẩm này?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: () => handleDeleteItem(id),
    });
  };

  const handleDeleteItem = async (id: number) => {
    try {
      setLoading(true);
      await request.delete(`gio-hang-chi-tiet/${id}`);
      setLoading(false);
      fetchData();
      message.success("Xóa sản phẩm thành công");
    } catch (error) {
      message.error("Xóa sản phẩm thất bại");
      setLoading(false);
    }
  };

  const [updatedQuantities, setUpdatedQuantities] = useState<number[]>([]);
  const handleIncrement = (record: DataType) => {
    const newData = [...data];
    const index = newData.indexOf(record);

    if (newData[index].soLuong < newData[index].chiTietSanPham.soLuong) {
      newData[index].soLuong += 1;

      if (!updatedQuantities.includes(record.id)) {
        setUpdatedQuantities((prev) => [...prev, record.id]);
      }

      setData(newData);
    } else {
      message.warning(
        `Rất tiếc, bạn chỉ có thể mua tối đa ${newData[index].chiTietSanPham.soLuong} sản phẩm.`
      );
    }
  };

  const handleDecrement = (record: DataType) => {
    if (record.soLuong > 1) {
      const newData = [...data];
      const index = newData.indexOf(record);
      newData[index].soLuong -= 1;
      setData(newData);

      if (!updatedQuantities.includes(record.id)) {
        setUpdatedQuantities((prev) => [...prev, record.id]);
      }
    }
  };

  const [params, setParams] = useState<DataParams>({
    page: 1,
    pageSize: 10,
  });

  // Tính toán dữ liệu của các sản phẩm được chọn
  const selectedData = data.filter((item) => selectedProducts.includes(item.id));

  const totalSelectedAmount = selectedData.reduce((acc, item) => {
    const itemPrice = item.chiTietSanPham.giaTien;
    const itemQuantity = item.soLuong;
    const itemTotalPrice = itemPrice * itemQuantity;
    return acc + itemTotalPrice;
  }, 0);
  
//phần thêm
  const handleQuantityChange = async (record: DataType) => {
    if (updatedQuantities.includes(record.id)) {
      try {
        await updateProductQuantity(record.id, record.soLuong);
        //message.success(`Sản phẩm với ID ${record.id} đã được cập nhật thành công.`);
      } catch (error) {
        message.error('Cập nhật sản phẩm thất bại.');
      }
    }
  };
  const updateProductQuantity = async (id: number, soLuong: number) => {
    try {
      await request.put(`/gio-hang-chi-tiet/${id}`, { soLuong });
    } catch (error) {
      throw new Error('Cập nhật sản phẩm thất bại');
    }
  };
  


  // Thêm cột checkbox để chọn sản phẩm
  const columns: ColumnsType<DataType> = [
    {
      title: "Chọn",
      dataIndex: "selected",
      key: "selected",
      align: "center",
      render: (_, record) => (
        <Input
          type="checkbox"
          checked={selectedProducts.includes(record.id)}
          onChange={() => handleSelectProduct(record.id)} // Sự kiện chọn sản phẩm
        />
      ),
    },
    {
      title: "Thông tin sản phẩm",
      dataIndex: "chiTietSanPham",
      key: "ten",
      align: "left",
      render: (chiTietSanPham, record) => (
        <Space>
          <HinhAnhSanPham chiTietSanPham={chiTietSanPham} />
          <Space direction="vertical">
            <Text strong>{chiTietSanPham.sanPham.ten}</Text>
            <Text>{`[${chiTietSanPham.mauSac.ten} - ${chiTietSanPham.kichCo.kichCo} - ${chiTietSanPham.loaiDe.ten} - ${chiTietSanPham.diaHinhSan.ten}]`}</Text>
            {chiTietSanPham.soLuong === 0 && (
              <Text type="danger" strong italic>
                Hết hàng
              </Text>
            )}
            {chiTietSanPham.soLuong > 0 &&
              record.soLuong > chiTietSanPham.soLuong && (
                <Text type="danger" italic strong>
                  Chỉ có thể mua tối đa {chiTietSanPham.soLuong} sản phẩm
                </Text>
              )}
          </Space>
        </Space>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "chiTietSanPham",
      key: "giaTien",
      align: "center",
      render: (_, record) => (
        <Text type="danger" style={{ fontWeight: "bold" }}>
          {formatGiaTien(record.chiTietSanPham.giaTien)}
        </Text>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "soLuong",
      key: "soLuong",
      align: "center",
      render: (soLuong: number, record: DataType) => (
        <Space.Compact>
          <Button
            icon={<MinusOutlined />}
            onClick={() => {
              handleDecrement(record);
              handleQuantityChange(record);
            }}
          />
          <Input
            style={{ textAlign: "center", width: 70 }}
            value={soLuong.toString()}
            onChange={(e) => {
              const newValue = parseInt(e.target.value, 10);
              const newData = [...data];
              const index = newData.findIndex((item) => item.id === record.id);
              if (isNaN(newValue) || newValue < 1) {
                newData[index].soLuong = 1;
              } else {
                newData[index].soLuong = Math.min(newValue, newData[index].chiTietSanPham.soLuong);
              }
              setData(newData);
              if (!updatedQuantities.includes(record.id)) {
                setUpdatedQuantities((prev) => [...prev, record.id]);
              }
            }}
            onBlur={() => handleQuantityChange(record)} // Gọi hàm khi rời khỏi ô input
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault(); // Ngăn chặn hành vi mặc định của Enter
                handleQuantityChange(record); // Gọi hàm khi nhấn Enter
              }
            }}
          />
          <Button
            icon={<PlusOutlined />}
            onClick={() => {
              handleIncrement(record);
              handleQuantityChange(record);
            }}
          />
        </Space.Compact>
      ),
    },
    {
      title: "Thành tiền",
      dataIndex: "thanhTien",
      key: "thanhTien",
      align: "center",
      render: (text, record) => (
        <Text type="danger" style={{ fontWeight: "bold" }}>
          {formatGiaTien(record.chiTietSanPham.giaTien * record.soLuong)}
        </Text>
      ),
    },
    {
      dataIndex: "id",
      align: "center",
      render: (id, record) => (
        <>
          <Tooltip title="Xóa">
            <Button
              type="link"
              style={{ padding: 0 }}
              onClick={() => confirmDelete(id)}
            >
              <DeleteOutlined style={{ color: "red" }} />
            </Button>
          </Tooltip>
        </>
      ),
    },
  ];

  // Xử lý sự kiện chọn sản phẩm
  const handleSelectProduct = (productId: number) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const onChangeTable = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<DataType> | any
  ) => {
    filters;
    const page = pagination.current !== undefined ? pagination.current : 1;
    const pageSize =
      pagination.pageSize !== undefined ? pagination.pageSize : 10;
    setParams({
      ...params,
      page: page,
      pageSize: pageSize,
      sortField: sorter.field,
      sortOrder: sorter.order,
    });
  };

  const onUpdateCart = async () => {
    if (updatedQuantities.length === 0) {
      return;
    }
    const updatedData = data
      .filter((item) => updatedQuantities.includes(item.id))
      .map((item) => ({
        id: item.id,
        soLuong: item.soLuong,
      }));
    try {
      setLoading(true);
      await request.put("/gio-hang-chi-tiet/update/" + idGioHangTaiKhoan, updatedData);
      setLoading(false);
      message.success("Cập nhật giỏ hàng thành công");
    } catch (error) {
      message.error("Cập nhật giỏ hàng thất bại");
      setLoading(false);
    }
  };
  

  return (
    <>
      <Card
        title={
          <Title level={4} style={{ fontWeight: "bold" }}>
            Giỏ hàng của bạn
          </Title>
        }
      >
        {data.length > 0 ? (
          <Row>
            <Col span={15}>
              <Card>
                <Table
                  columns={columns}
                  dataSource={data}
                  onChange={onChangeTable}
                  loading={loading}
                  showSorterTooltip={false}
                  pagination={false}
                  footer={() => (
                    <Space>
                      <Link to="/">
                        <Button type="dashed">
                          <ArrowLeftOutlined />
                          TIẾP TỤC MUA SẮM
                        </Button>
                      </Link>
                    </Space>
                  )}
                />
              </Card>
            </Col>
            <Col span={1}></Col>
            <Col span={8}>
              <ThanhToan
                tamTinh={totalSelectedAmount}
                dataSanPham={selectedData}
                soSanPham={selectedData.reduce((acc, item) => acc + item.soLuong, 0)}
              />
            </Col>
          </Row>
        ) : (
          <Empty
            description={
              <>
                <Title level={5}>Giỏ hàng của bạn còn trống</Title>
                <Link to="/san-pham">
                  <Button type="dashed">MUA NGAY</Button>
                </Link>
              </>
            }
          />
        )}
      </Card>
    </>
  );
};

export default index;
