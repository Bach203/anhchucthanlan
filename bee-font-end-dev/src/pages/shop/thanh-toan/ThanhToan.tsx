// import React, { useState, useEffect, Component } from "react";
// import { useNavigate } from "react-router-dom";
// import { LuTicket } from "react-icons/lu";

// import {
//   Button,
//   Card,
//   Col,
//   Divider,
//   Form,
//   Input,
//   Layout,
//   Modal,
//   Radio,
//   RadioChangeEvent,
//   Row,
//   Select,
//   Space,
//   Table,
//   Tag,
//   Typography,
//   message,
// } from "antd";

// import request from "~/utils/request";
// import { ExclamationCircleFilled } from "@ant-design/icons";
// import axios from "axios";
// import { Option } from "antd/es/mentions";
// import { Content, Header } from "antd/es/layout/layout";
// import TextArea from "antd/es/input/TextArea";
// import { formatGiaTienVND } from "~/utils/formatResponse";
// import KhoVoucher from "./KhoVoucher";
// import { FaMapMarkedAlt } from "react-icons/fa";
// import ModalDiaChi22 from "./ModalDiaChi";
// import requestClient from "~/utils/requestClient";
// const { Text } = Typography;
// const idGioHangTaiKhoan = localStorage.getItem("cartIdTaiKhoan");
// const idGioHangNull = localStorage.getItem("cartId");
// const tailLayout = {
//   wrapperCol: { offset: 15, span: 9 },
// };
// interface Option {
//   value?: number | null;
//   label: React.ReactNode;
//   children?: Option[];
//   isLeaf?: boolean;
// }
// const ThanhToan = ({ tamTinh, dataSanPham, soSanPham }) => {
//   const [form] = Form.useForm();
//   const [provinces, setProvinces] = useState<Option[]>([]);
//   const [districts, setDistricts] = useState<Option[]>([]);
//   const [wards, setWards] = useState<Option[]>([]);
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [modalDiaChi, setModalDiaChi] = useState(false);
//   const [openModalVoucher, setOpenModalVoucher] = useState(false);
//   const { confirm } = Modal;
//   const [idQuanHuyen, setIdQuanHuyen] = useState(null);
//   const [idPhuongXa, setIdPhuongXa] = useState(null);
//   const [phiShip, setPhiShip] = useState(0);
//   const [giamGiam, setGiamGia] = useState(0);
//   const [idVoucher, setIdVoucher] = useState(null);
//   const [goiY, setGoiY] = useState(null);
//   const [giamGiaGoiY, setGiamGiaGoiY] = useState(null);
//   const [voucher, setVoucher] = useState(null);

//   const idTaiKhoan = localStorage.getItem("acountId");

//   const tongTien = () => {
//     return tamTinh - giamGiam + phiShip;
//   };
//   useEffect(() => {
//     const getOne = async () => {
//       try {
//         const res = await request.get("dia-chi/default", {
//           params: {
//             idTaiKhoan: idTaiKhoan,
//           },
//         });
//         console.log(res.data);
//         const values = res.data;
//         const districts = await fetchDistricts(values.thanhPho);
//         const wards = await fetchWards(values.quanHuyen);
//         setIdQuanHuyen(values.quanHuyen);
//         setIdPhuongXa(values.phuongXa);

//         form.setFieldsValue({
//           hoVaTen: values.hoVaTen,
//           soDienThoai: values.soDienThoai,
//           email: values.email,
//           thanhPho: Number(values.thanhPho),
//           quanHuyen: Number(values.quanHuyen),
//           phuongXa: values.phuongXa,
//           diaChiCuThe: values.diaChiCuThe,
//           phiShip: phiShip,
//         });
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     if (idTaiKhoan !== null) {
//       getOne();
//     }
//   }, [idTaiKhoan]);
//   useEffect(() => {
//     const getPhiShip = async () => {
//       try {
//         const feeRes = await request.get(
//           `https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee`,
//           {
//             params: {
//               service_type_id: "2",
//               to_district_id: idQuanHuyen,
//               to_ward_code: idPhuongXa,
//               height: "9",
//               length: "29",
//               weight: "300",
//               width: "18",
//             },
//             headers: {
//               token: "4d0b3d7c-65a5-11ee-a59f-a260851ba65c",
//               shop_id: "4611572",
//               ContentType: "application/json",
//             },
//           }
//         );

//         if (feeRes.status === 200) {
//           const feeResponse = feeRes.data.data.total;
//           // Cập nhật state phiShip sau khi tính phí ship thành công
//           setPhiShip(feeResponse);
//         } else {
//           console.error("Lỗi khi gọi API tính phí ship: ", feeRes.status);
//           // Xử lý lỗi và cập nhật state phiShip (ví dụ, set giá trị mặc định hoặc 0 nếu có lỗi)
//           setPhiShip(0);
//         }
//       } catch (error) {
//         console.error("Lỗi khi gọi API tính phí ship:", error);
//         // Xử lý lỗi và cập nhật state phiShip (ví dụ, set giá trị mặc định hoặc 0 nếu có lỗi)
//         setPhiShip(0);
//       }
//     };
//     getPhiShip();
//   }, [idPhuongXa]);
//   const dataHoaDonChiTiet = (idHoaDon) => {
//     return dataSanPham.map((item) => ({
//       hoaDon: { id: idHoaDon },
//       chiTietSanPham: { id: item.chiTietSanPham.id },
//       soLuong: item.soLuong,
//       donGia: item.chiTietSanPham.giaTien,
//       trangThaiHoaDonChiTiet: "APPROVED",
//     }));
//   };

//   const onClickDiaChi = async (values) => {
//     try {
//       // Assuming fetchDistricts and fetchWards are asynchronous functions that return Promises
//       const districts = await fetchDistricts(values.thanhPho);
//       const wards = await fetchWards(values.quanHuyen);
//       setIdQuanHuyen(values.quanHuyen);
//       setIdPhuongXa(values.phuongXa);

//       form.setFieldsValue({
//         hoVaTen: values.hoVaTen,
//         soDienThoai: values.soDienThoai,
//         email: values.email,
//         thanhPho: Number(values.thanhPho),
//         quanHuyen: Number(values.quanHuyen),
//         phuongXa: values.phuongXa,
//         diaChiCuThe: values.diaChiCuThe,
//         phiShip: phiShip,
//       });
//     } catch (error) {
//       // Handle fetchDistricts or fetchWards error if necessary
//       console.error("Error fetching districts or wards:", error);
//     }
//   };

//   const onSubmit = async (values: any) => {
//     const isQuantityValid = dataSanPham.every(
//       (item) => item.soLuong > item.chiTietSanPham.soLuong
//     );

//     if (isQuantityValid) {
//       message.warning("Số lượng sản phẩm trong giỏ hàng không hợp lệ.");
//       return; // Prevent form submission
//     }

//     const getProvinceLabelFromId = () => {
//       const province = provinces.find((p) => p.value === values.thanhPho);
//       return province?.label;
//     };
//     const getDistrictLabelFromId = () => {
//       const district = districts.find((d) => d.value === values.quanHuyen);
//       return district?.label;
//     };
//     const getWardLabelFromId = () => {
//       const ward = wards.find((w) => w.value === values.phuongXa);
//       return ward?.label;
//     };

//     const diaChi = `${
//       values.diaChiCuThe
//     }, ${getWardLabelFromId()}, ${getDistrictLabelFromId()}, ${getProvinceLabelFromId()}`;
//     confirm({
//       title: "Xác Nhận",
//       icon: <ExclamationCircleFilled />,
//       content: "Bạn có chắc đặt hàng không?",
//       okText: "OK",
//       cancelText: "Hủy",
//       onOk: async () => {
//         console.log(values);

//         try {
//           setLoading(true);

//           const voucherObject = idVoucher != null ? { id: idVoucher } : null;
//           const taiKhoanObject = idTaiKhoan != null ? { id: idTaiKhoan } : null;

//           const res = await request.post("hoa-don", {
//             giamGia: giamGiam,
//             loaiHoaDon: "ONLINE",
//             voucher: voucherObject,
//             taiKhoan: taiKhoanObject,
//             phiShip: phiShip,
//             tongTien: tamTinh,
//             tongTienKhiGiam: tongTien(),
//             ghiChu: values.ghiChu,
//             nguoiNhan: values.hoVaTen,
//             sdtNguoiNhan: values.soDienThoai,
//             emailNguoiNhan: values.email,
//             diaChiNguoiNhan: diaChi,
//             trangThaiHoaDon: "PENDING",
//             idPhuongThuc: values.phuongThucThanhToan,
//           });

//           console.log(res);

//           if (res.status === 201) {
//             try {
//               const hoaDonChiTietData = dataHoaDonChiTiet(res.data.id);
//               const response = await request.post(
//                 "hoa-don-chi-tiet/add-list",
//                 hoaDonChiTietData
//               );
//               let cartId;
//               if (idGioHangTaiKhoan != null) {
//                 cartId = idGioHangTaiKhoan;
//               } else {
//                 // Otherwise, use the provided idGioHangNull
//                 cartId = idGioHangNull;
//               }
//               await request.delete("gio-hang-chi-tiet/delete-all", {
//                 params: {
//                   idGioHang: cartId,
//                 },
//               });
//             } catch (error) {
//               console.log(error);
//             }

//             try {
//               const resGD = await request.post("giao-dich", {
//                 taiKhoan: taiKhoanObject,
//                 soTienGiaoDich: tongTien(),
//                 hoaDon: {
//                   id: res.data.id,
//                 },
//                 phuongThucThanhToan: {
//                   id: values.phuongThucThanhToan,
//                 },
//                 trangThaiGiaoDich: "PENDING",
//               });
//               if (res.status == 201 && values.phuongThucThanhToan == 2) {
//                 const resVNPay = await request.get("vn-pay/create-payment", {
//                   params: {
//                     soTienThanhToan: tongTien(),
//                     maGiaoDich: resGD.data.maGiaoDich,
//                   },
//                 });
//                 window.location.href = resVNPay.data;
//               } else if (res.status == 201 && values.phuongThucThanhToan == 3) {
//                 try {
//                   await requestClient.get(`don-hang/sendEmail/${res.data.id}`);
//                   message.success("Đặt hàng thành công");
//                   setLoading(false);
//                   navigate("/don-hang");
//                 } catch (error) {
//                   console.log(error);
//                 }
//               }
//             } catch (error) {
//               console.log(error);
//             }
//           }
//         } catch (error) {
//           message.error(error?.response?.data?.message || "Có lỗi xảy ra");
//         } finally {
//           setLoading(false);
//         }
//       },
//     });
//   };
//   useEffect(() => {
//     const fetchProvinces = async () => {
//       try {
//         const provinceRes = await axios.get(
//           "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
//           {
//             headers: {
//               token: "4d0b3d7c-65a5-11ee-a59f-a260851ba65c",
//               ContentType: "application/json",
//             },
//           }
//         );

//         const provinceOptions: Option[] = provinceRes.data.data.map(
//           (province: any) => ({
//             value: province.ProvinceID,
//             label: province.ProvinceName,
//             isLeaf: false,
//           })
//         );
//         setProvinces(provinceOptions);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchProvinces();
//   }, []);

//   const fetchDistricts = async (idProvince: string) => {
//     try {
//       const districtRes = await axios.get(
//         `https://online-gateway.ghn.vn/shiip/public-api/master-data/district?`,
//         {
//           params: {
//             province_id: idProvince,
//           },
//           headers: {
//             token: "4d0b3d7c-65a5-11ee-a59f-a260851ba65c",
//             ContentType: "application/json",
//           },
//         }
//       );

//       const districtOptions: Option[] = districtRes.data.data.map(
//         (district: any) => ({
//           value: district.DistrictID,
//           label: district.DistrictName,
//           isLeaf: false,
//         })
//       );
//       setDistricts(districtOptions);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const fetchWards = async (idDistrict: string) => {
//     try {
//       const wardRes = await axios.get(
//         `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward`,
//         {
//           params: {
//             district_id: idDistrict,
//           },
//           headers: {
//             token: "4d0b3d7c-65a5-11ee-a59f-a260851ba65c",
//             ContentType: "application/json",
//           },
//         }
//       );

//       const wardOptions: Option[] = wardRes.data.data.map((ward: any) => ({
//         value: ward.WardCode,
//         label: ward.WardName,
//         isLeaf: false,
//       }));
//       setWards(wardOptions);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const addVoucher = (obj, value) => {
//     setVoucher(obj);
//     setIdVoucher(obj?.id);
//     setGiamGia(value);
//     setOpenModalVoucher(false);
//   };
//   const goiYGiamGia = (obj, value, objGoiY, valueGoiY) => {
//     setVoucher(obj);
//     setIdVoucher(obj?.id);
//     setGiamGia(value);
//     setGoiY(objGoiY);
//     setGiamGiaGoiY(valueGoiY);
//   };

//   return (
//     <Content style={{ width: 509 }}>
//       <Form
//         form={form}
//         onFinish={onSubmit}
//         layout="vertical"
//         labelCol={{ span: 24 }}
//         wrapperCol={{ span: 24 }}
//         initialValues={{ phuongThucThanhToan: 3 }}
//       >
//         <Card
//           title={
//             <Space>
//               <Text>THÔNG TIN NHẬN HÀNG</Text>
//               {idTaiKhoan !== null && (
//                 <Button
//                   type="default"
//                   icon={<FaMapMarkedAlt />}
//                   onClick={() => setModalDiaChi(true)}
//                 />
//               )}
//             </Space>
//           }
//           bordered={true}
//         >
//           <Form.Item label="Họ và Tên:">
//             <Form.Item
//               noStyle
//               name="hoVaTen"
//               style={{ width: "100%" }}
//               rules={[
//                 {
//                   required: true,
//                   whitespace: true,
//                   message: "Vui lòng nhập họ và tên!",
//                 },
//                 {
//                   pattern: /^[\p{L}\s']+$/u,
//                   message: "Họ và tên không hợp lệ!",
//                 },
//               ]}
//             >
//               <Input />
//             </Form.Item>
//           </Form.Item>

//           <Space>
//             <Form.Item label="Số Điện Thoại:">
//               <Form.Item
//                 noStyle
//                 name="soDienThoai"
//                 rules={[
//                   {
//                     required: true,
//                     whitespace: true,
//                     message: "Bạn chưa điền số điện thoại!",
//                   },
//                   {
//                     pattern: /^0[35789]\d{8}$/,
//                     message: "Số điện thoại không hợp lệ!",
//                   },
//                 ]}
//               >
//                 <Input style={{ width: 230 }} />
//               </Form.Item>
//             </Form.Item>
//             <Form.Item label="E-mail:">
//               <Form.Item
//                 noStyle
//                 name="email"
//                 rules={[
//                   {
//                     required: true,
//                     whitespace: true,
//                     message: "Bạn chưa điền e-mail!",
//                   },
//                   {
//                     type: "email",
//                     message: "E-mail không hợp lệ!",
//                   },
//                 ]}
//               >
//                 <Input style={{ width: 230 }} />
//               </Form.Item>
//             </Form.Item>
//           </Space>
//           <Space>
//             <Form.Item label="Tỉnh / Thành">
//               <Form.Item
//                 name="thanhPho"
//                 noStyle
//                 rules={[
//                   {
//                     required: true,
//                     message: "Bạn chưa điền Tỉnh / Thành !",
//                   },
//                 ]}
//               >
//                 <Select
//                   style={{ width: 150 }}
//                   options={provinces}
//                   placeholder="Tỉnh/ Thành Phố"
//                   onChange={(value) => {
//                     form.setFieldsValue({
//                       quanHuyen: undefined,
//                       phuongXa: undefined,
//                     });
//                     fetchDistricts(value);
//                     setPhiShip(0);
//                   }}
//                 />
//               </Form.Item>
//             </Form.Item>
//             <Form.Item label="Quận / Huyện:">
//               <Form.Item
//                 name="quanHuyen"
//                 noStyle
//                 rules={[
//                   {
//                     required: true,
//                     message: "Bạn chưa điền Quận / Huyện!",
//                   },
//                 ]}
//               >
//                 <Select
//                   style={{ width: 150 }}
//                   options={districts}
//                   placeholder="Quận / Huyện"
//                   onChange={(value) => {
//                     form.setFieldsValue({ phuongXa: undefined });
//                     fetchWards(idQuanHuyen);
//                     setIdQuanHuyen(value);
//                     setPhiShip(0);
//                   }}
//                 />
//               </Form.Item>
//             </Form.Item>
//             <Form.Item label="Phường / Xã">
//               <Form.Item
//                 name="phuongXa"
//                 noStyle
//                 rules={[
//                   {
//                     required: true,
//                     message: "Bạn chưa điền Phường / Xã !",
//                   },
//                 ]}
//               >
//                 <Select
//                   style={{ width: 150 }}
//                   options={wards}
//                   placeholder="Phường / Xã"
//                   onChange={(value) => setIdPhuongXa(value)}
//                 />
//               </Form.Item>
//             </Form.Item>
//           </Space>
//           <Form.Item label="Địa chỉ cụ thể">
//             <Form.Item
//               name="diaChiCuThe"
//               noStyle
//               rules={[
//                 {
//                   required: true,
//                   whitespace: true,
//                   message: "Bạn chưa điền đia chỉ!",
//                 },
//               ]}
//             >
//               <Input />
//             </Form.Item>
//           </Form.Item>
//           <Form.Item name="ghiChu" label="Ghi chú">
//             <TextArea showCount maxLength={100} />
//           </Form.Item>
//         </Card>
//         <Card title="PHƯƠNG THỨC THANH TOÁN">
//           <Form.Item name="phuongThucThanhToan">
//             <Radio.Group>
//               <Space direction="vertical">
//                 <Radio value={3}>
//                   <Card style={{ width: "450px" }}>
//                     Thanh toán khi nhận hàng
//                   </Card>
//                 </Radio>
//                 <Radio value={2}>
//                   <Card style={{ width: "450px" }}>
//                     Thanh toán qua cổng VNPAY
//                   </Card>
//                 </Radio>
//               </Space>
//             </Radio.Group>
//           </Form.Item>
//         </Card>
//         <Card title={`Đơn hàng (${soSanPham} sản phẩm)`}>
//           <div>
//             <Space.Compact>
//               <LuTicket style={{ fontSize: 23, color: "#1677ff" }} />
//               <Text strong>BeeSport Voucher</Text>
//             </Space.Compact>
//             <Button
//               size="large"
//               type="link"
//               style={{ float: "right", padding: 0 }}
//               onClick={() => setOpenModalVoucher(true)}
//             >
//               Chọn Voucher
//             </Button>
//             <br />
//             <Space direction="vertical" style={{ marginTop: 10 }}>
//               {voucher !== null && (
//                 <Text>
//                   Đã áp dụng mã voucher:{" "}
//                   <Tag color="green-inverse" bordered={false}>
//                     {voucher?.ma}
//                   </Tag>
//                 </Text>
//               )}
//               {goiY !== null && (
//                 <Text type="warning" italic>
//                   Gợi ý: Mua thêm{" "}
//                   {formatGiaTienVND(goiY?.donToiThieu - tamTinh)} để được giảm{" "}
//                   {formatGiaTienVND(giamGiaGoiY)}
//                 </Text>
//               )}
//             </Space>
//             <KhoVoucher
//               open={openModalVoucher}
//               close={() => setOpenModalVoucher(false)}
//               onOK={addVoucher}
//               tongTien={tamTinh}
//               tuDongGiamGia={goiYGiamGia}
//             />
//           </div>

//           <Divider />
//           <div>
//             <div>
//               <Text type="secondary" strong>
//                 Tổng tiền hàng:
//               </Text>
//               <Text style={{ float: "right" }}>
//                 {formatGiaTienVND(tamTinh)}
//               </Text>
//             </div>

//             <div>
//               <Text type="secondary" strong>
//                 Giảm giá:
//               </Text>
//               <Text style={{ float: "right" }}>
//                 {formatGiaTienVND(giamGiam)}
//               </Text>
//             </div>
//             <div>
//               <Text type="secondary" strong>
//                 Phí vận chuyển:
//               </Text>
//               <Text style={{ float: "right" }}>
//                 {phiShip !== 0 ? formatGiaTienVND(phiShip) : "Miễn phí"}
//               </Text>
//             </div>

//             <Divider style={{ margin: 5, padding: 0, color: "black" }} />
//             <div style={{ display: "flex", justifyContent: "flex-start" }}>
//               <Text
//                 strong
//                 style={{
//                   marginTop: 10,
//                 }}
//               >
//                 Tổng thanh toán:
//               </Text>
//               <Text
//                 style={{
//                   fontSize: 25,
//                   color: "red",
//                   fontWeight: "bold",
//                   marginLeft: "auto",
//                 }}
//               >
//                 {formatGiaTienVND(tongTien())}
//               </Text>
//             </div>
//           </div>
//         </Card>
//         <Button
//           loading={loading}
//           htmlType="submit"
//           type="primary"
//           style={{
//             width: "100%",
//             height: "50px",
//             marginTop: 10,
//             marginRight: 20,
//             fontSize: "18px",
//             fontWeight: "bold",
//           }}
//         >
//           ĐẶT HÀNG
//         </Button>
//       </Form>
//       <ModalDiaChi22
//         openModal={modalDiaChi}
//         closeModal={() => setModalDiaChi(false)}
//         onClickDiaChi={onClickDiaChi}
//       />
//     </Content>
//   );
// };

// export default ThanhToan;
import React, { useState, useEffect, Component } from "react";
import { useNavigate } from "react-router-dom";
import { LuTicket } from "react-icons/lu";

import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Layout,
  Modal,
  Radio,
  RadioChangeEvent,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";

import request from "~/utils/request";
import { ExclamationCircleFilled } from "@ant-design/icons";
import axios from "axios";
import { Option } from "antd/es/mentions";
import { Content, Header } from "antd/es/layout/layout";
import TextArea from "antd/es/input/TextArea";
import { formatGiaTienVND } from "~/utils/formatResponse";
import KhoVoucher from "./KhoVoucher";
import { FaMapMarkedAlt } from "react-icons/fa";
import ModalDiaChi22 from "./ModalDiaChi";
import requestClient from "~/utils/requestClient";
const { Text } = Typography;
const idGioHangTaiKhoan = localStorage.getItem("cartIdTaiKhoan");
const idGioHangNull = localStorage.getItem("cartId");
const tailLayout = {
  wrapperCol: { offset: 15, span: 9 },
};
interface Option {
  value?: number | null;
  label: React.ReactNode;
  children?: Option[];
  isLeaf?: boolean;
}
const ThanhToan = ({ tamTinh, dataSanPham, soSanPham }) => {
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState<Option[]>([]);
  const [districts, setDistricts] = useState<Option[]>([]);
  const [wards, setWards] = useState<Option[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [modalDiaChi, setModalDiaChi] = useState(false);
  const [openModalVoucher, setOpenModalVoucher] = useState(false);
  const { confirm } = Modal;
  const [idQuanHuyen, setIdQuanHuyen] = useState(null);
  const [idPhuongXa, setIdPhuongXa] = useState(null);
  const [phiShip, setPhiShip] = useState(0);
  const [giamGiam, setGiamGia] = useState(0);
  const [idVoucher, setIdVoucher] = useState(null);
  const [goiY, setGoiY] = useState(null);
  const [giamGiaGoiY, setGiamGiaGoiY] = useState(null);
  const [voucher, setVoucher] = useState(null);

  const idTaiKhoan = localStorage.getItem("acountId");

  const tongTien = () => {
    return tamTinh - giamGiam + phiShip;
  };
  useEffect(() => {
    const getOne = async () => {
      try {
        const res = await request.get("dia-chi/default", {
          params: {
            idTaiKhoan: idTaiKhoan,
          },
        });
        console.log(res.data);
        const values = res.data;
        const districts = await fetchDistricts(values.thanhPho);
        const wards = await fetchWards(values.quanHuyen);
        setIdQuanHuyen(values.quanHuyen);
        setIdPhuongXa(values.phuongXa);

        form.setFieldsValue({
          hoVaTen: values.hoVaTen,
          soDienThoai: values.soDienThoai,
          email: values.email,
          thanhPho: Number(values.thanhPho),
          quanHuyen: Number(values.quanHuyen),
          phuongXa: values.phuongXa,
          diaChiCuThe: values.diaChiCuThe,
          phiShip: phiShip,
        });
      } catch (error) {
        console.log(error);
      }
    };
    if (idTaiKhoan !== null) {
      getOne();
    }
  }, [idTaiKhoan]);
  useEffect(() => {
    const getPhiShip = async () => {
      try {
        const feeRes = await request.get(
          `https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee`,
          {
            params: {
              service_type_id: "2",
              to_district_id: idQuanHuyen,
              to_ward_code: idPhuongXa,
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
          // Cập nhật state phiShip sau khi tính phí ship thành công
          setPhiShip(feeResponse);
        } else {
          console.error("Lỗi khi gọi API tính phí ship: ", feeRes.status);
          // Xử lý lỗi và cập nhật state phiShip (ví dụ, set giá trị mặc định hoặc 0 nếu có lỗi)
          setPhiShip(0);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API tính phí ship:", error);
        // Xử lý lỗi và cập nhật state phiShip (ví dụ, set giá trị mặc định hoặc 0 nếu có lỗi)
        setPhiShip(0);
      }
    };
    getPhiShip();
  }, [idPhuongXa]);
  const dataHoaDonChiTiet = (idHoaDon) => {
    return dataSanPham.map((item) => ({
      hoaDon: { id: idHoaDon },
      chiTietSanPham: { id: item.chiTietSanPham.id },
      soLuong: item.soLuong,
      donGia: item.chiTietSanPham.giaTien,
      trangThaiHoaDonChiTiet: "APPROVED",
    }));
  };

  const onClickDiaChi = async (values) => {
    try {
      // Assuming fetchDistricts and fetchWards are asynchronous functions that return Promises
      const districts = await fetchDistricts(values.thanhPho);
      const wards = await fetchWards(values.quanHuyen);
      setIdQuanHuyen(values.quanHuyen);
      setIdPhuongXa(values.phuongXa);

      form.setFieldsValue({
        hoVaTen: values.hoVaTen,
        soDienThoai: values.soDienThoai,
        email: values.email,
        thanhPho: Number(values.thanhPho),
        quanHuyen: Number(values.quanHuyen),
        phuongXa: values.phuongXa,
        diaChiCuThe: values.diaChiCuThe,
        phiShip: phiShip,
      });
    } catch (error) {
      // Handle fetchDistricts or fetchWards error if necessary
      console.error("Error fetching districts or wards:", error);
    }
  };

  const onSubmit = async (values: any) => {
    // Kiểm tra xem giỏ hàng có sản phẩm nào không
    if (dataSanPham.length === 0) {
      message.warning("Bạn chưa chọn sản phẩm nào để thanh toán!!.");
      return; // Ngăn chặn việc gửi biểu mẫu
    }

    // Kiểm tra số lượng sản phẩm
    const isQuantityValid = dataSanPham.every(
      (item) => item.soLuong <= item.chiTietSanPham.soLuong
    );

    if (!isQuantityValid) {
      message.warning("Số lượng sản phẩm trong giỏ hàng không hợp lệ.");
      return; // Ngăn chặn việc gửi biểu mẫu
    }

    // Hàm lấy tên tỉnh từ ID
    const getProvinceLabelFromId = () => {
      const province = provinces.find((p) => p.value === values.thanhPho);
      return province?.label;
    };

    // Hàm lấy tên quận/huyện từ ID
    const getDistrictLabelFromId = () => {
      const district = districts.find((d) => d.value === values.quanHuyen);
      return district?.label;
    };

    // Hàm lấy tên phường/xã từ ID
    const getWardLabelFromId = () => {
      const ward = wards.find((w) => w.value === values.phuongXa);
      return ward?.label;
    };

    const diaChi = `${
      values.diaChiCuThe
    }, ${getWardLabelFromId()}, ${getDistrictLabelFromId()}, ${getProvinceLabelFromId()}`;

    confirm({
      title: "Xác Nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc đặt hàng không?",
      okText: "OK",
      cancelText: "Hủy",
      onOk: async () => {
        console.log(values);

        try {
          setLoading(true);

          const voucherObject = idVoucher != null ? { id: idVoucher } : null;
          const taiKhoanObject = idTaiKhoan != null ? { id: idTaiKhoan } : null;

          // Tạo hóa đơn
          const res = await request.post("hoa-don", {
            giamGia: giamGiam,
            loaiHoaDon: "ONLINE",
            voucher: voucherObject,
            taiKhoan: taiKhoanObject,
            phiShip: phiShip,
            tongTien: tamTinh,
            tongTienKhiGiam: tongTien(),
            ghiChu: values.ghiChu,
            nguoiNhan: values.hoVaTen,
            sdtNguoiNhan: values.soDienThoai,
            emailNguoiNhan: values.email,
            diaChiNguoiNhan: diaChi,
            trangThaiHoaDon: "PENDING",
            idPhuongThuc: values.phuongThucThanhToan,
          });

          console.log(res);

          if (res.status === 201) {
            try {
              // Thêm chi tiết hóa đơn
              const hoaDonChiTietData = dataHoaDonChiTiet(res.data.id);
              await request.post(
                "hoa-don-chi-tiet/add-list",
                hoaDonChiTietData
              );

              // Xóa sản phẩm đã chọn khỏi giỏ hàng
              let cartId =
                idGioHangTaiKhoan != null ? idGioHangTaiKhoan : idGioHangNull;
              await request.delete("gio-hang-chi-tiet/delete-selected", {
                params: {
                  idGioHang: cartId,
                },
                data: dataSanPham.map((item) => item.chiTietSanPham.id), // Đảm bảo gửi danh sách ID đúng
              });
            } catch (error) {
              console.log(error);
            }

            try {
              // Tạo giao dịch
              const resGD = await request.post("giao-dich", {
                taiKhoan: taiKhoanObject,
                soTienGiaoDich: tongTien(),
                hoaDon: {
                  id: res.data.id,
                },
                phuongThucThanhToan: {
                  id: values.phuongThucThanhToan,
                },
                trangThaiGiaoDich: "PENDING",
              });

              if (resGD.status === 201 && values.phuongThucThanhToan === 2) {
                // Thanh toán VNPay
                const resVNPay = await request.get("vn-pay/create-payment", {
                  params: {
                    soTienThanhToan: tongTien(),
                    maGiaoDich: resGD.data.maGiaoDich,
                  },
                });
                window.location.href = resVNPay.data;
              } else if (
                resGD.status === 201 &&
                values.phuongThucThanhToan === 3
              ) {
                // Gửi email xác nhận
                await requestClient.get(`don-hang/sendEmail/${res.data.id}`);
                message.success("Đặt hàng thành công");
                setLoading(false);
                let idAcc = localStorage.getItem("acountId");
                if (idAcc) {
                  navigate("/don-hang");
                } else {
                  navigate("/");
                }
                navigate("/don-hang");
              }
            } catch (error) {
              console.log(error);
            }
          }
        } catch (error) {
          message.error(error?.response?.data?.message || "Có lỗi xảy ra");
        } finally {
          setLoading(false);
        }
      },
    });
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
          value: district.DistrictID,
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

  const addVoucher = (obj, value) => {
    setVoucher(obj);
    setIdVoucher(obj?.id);
    setGiamGia(value);
    setOpenModalVoucher(false);
  };
  const goiYGiamGia = (obj, value, objGoiY, valueGoiY) => {
    setVoucher(obj);
    setIdVoucher(obj?.id);
    setGiamGia(value);
    setGoiY(objGoiY);
    setGiamGiaGoiY(valueGoiY);
  };

  return (
    <Content style={{ width: 509 }}>
      <Form
        form={form}
        onFinish={onSubmit}
        layout="vertical"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        initialValues={{ phuongThucThanhToan: 3 }}>
        <Card
          title={
            <Space>
              <Text>THÔNG TIN NHẬN HÀNG</Text>
              {idTaiKhoan !== null && (
                <Button
                  type="default"
                  icon={<FaMapMarkedAlt />}
                  onClick={() => setModalDiaChi(true)}
                />
              )}
            </Space>
          }
          bordered={true}>
          <Form.Item label="Họ và Tên:">
            <Form.Item
              noStyle
              name="hoVaTen"
              style={{ width: "100%" }}
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Vui lòng nhập họ và tên!",
                },
                {
                  pattern: /^[\p{L}\s']+$/u,
                  message: "Họ và tên không hợp lệ!",
                },
              ]}>
              <Input />
            </Form.Item>
          </Form.Item>

          <Space>
            <Form.Item label="Số Điện Thoại:">
              <Form.Item
                noStyle
                name="soDienThoai"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Bạn chưa điền số điện thoại!",
                  },
                  {
                    pattern: /^0[35789]\d{8}$/,
                    message: "Số điện thoại không hợp lệ!",
                  },
                ]}>
                <Input style={{ width: 230 }} />
              </Form.Item>
            </Form.Item>
            <Form.Item label="E-mail:">
              <Form.Item
                noStyle
                name="email"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Bạn chưa điền e-mail!",
                  },
                  {
                    type: "email",
                    message: "E-mail không hợp lệ!",
                  },
                ]}>
                <Input style={{ width: 230 }} />
              </Form.Item>
            </Form.Item>
          </Space>
          <Space>
            <Form.Item label="Tỉnh / Thành">
              <Form.Item
                name="thanhPho"
                noStyle
                rules={[
                  {
                    required: true,
                    message: "Bạn chưa điền Tỉnh / Thành !",
                  },
                ]}>
                <Select
                  style={{ width: 150 }}
                  options={provinces}
                  placeholder="Tỉnh/ Thành Phố"
                  onChange={(value) => {
                    form.setFieldsValue({
                      quanHuyen: undefined,
                      phuongXa: undefined,
                    });
                    fetchDistricts(value);
                    setPhiShip(0);
                  }}
                />
              </Form.Item>
            </Form.Item>
            <Form.Item label="Quận / Huyện:">
              <Form.Item
                name="quanHuyen"
                noStyle
                rules={[
                  {
                    required: true,
                    message: "Bạn chưa điền Quận / Huyện!",
                  },
                ]}>
                <Select
                  style={{ width: 150 }}
                  options={districts}
                  placeholder="Quận / Huyện"
                  onChange={(value) => {
                    form.setFieldsValue({ phuongXa: undefined });
                    fetchWards(idQuanHuyen);
                    setIdQuanHuyen(value);
                    setPhiShip(0);
                  }}
                />
              </Form.Item>
            </Form.Item>
            <Form.Item label="Phường / Xã">
              <Form.Item
                name="phuongXa"
                noStyle
                rules={[
                  {
                    required: true,
                    message: "Bạn chưa điền Phường / Xã !",
                  },
                ]}>
                <Select
                  style={{ width: 150 }}
                  options={wards}
                  placeholder="Phường / Xã"
                  onChange={(value) => setIdPhuongXa(value)}
                />
              </Form.Item>
            </Form.Item>
          </Space>
          <Form.Item label="Địa chỉ cụ thể">
            <Form.Item
              name="diaChiCuThe"
              noStyle
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Bạn chưa điền đia chỉ!",
                },
              ]}>
              <Input />
            </Form.Item>
          </Form.Item>
          <Form.Item name="ghiChu" label="Ghi chú">
            <TextArea showCount maxLength={100} />
          </Form.Item>
        </Card>
        <Card title="PHƯƠNG THỨC THANH TOÁN">
          <Form.Item name="phuongThucThanhToan">
            <Radio.Group>
              <Space direction="vertical">
                <Radio value={3}>
                  <Card style={{ width: "450px" }}>
                    Thanh toán khi nhận hàng
                  </Card>
                </Radio>
                <Radio value={2}>
                  <Card style={{ width: "450px" }}>
                    Thanh toán qua cổng VNPAY
                  </Card>
                </Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
        </Card>
        <Card title={`Đơn hàng (${soSanPham} sản phẩm)`}>
          <div>
            <Space.Compact>
              <LuTicket style={{ fontSize: 23, color: "#1677ff" }} />
              <Text strong>BeeSport Voucher</Text>
            </Space.Compact>
            <Button
              size="large"
              type="link"
              style={{ float: "right", padding: 0 }}
              onClick={() => setOpenModalVoucher(true)}>
              Chọn Voucher
            </Button>
            <br />
            <Space direction="vertical" style={{ marginTop: 10 }}>
              {voucher !== null && (
                <Text>
                  Đã áp dụng mã voucher:{" "}
                  <Tag color="green-inverse" bordered={false}>
                    {voucher?.ma}
                  </Tag>
                </Text>
              )}
              {goiY !== null && (
                <Text type="warning" italic>
                  Gợi ý: Mua thêm{" "}
                  {formatGiaTienVND(goiY?.donToiThieu - tamTinh)} để được giảm{" "}
                  {formatGiaTienVND(giamGiaGoiY)}
                </Text>
              )}
            </Space>
            <KhoVoucher
              open={openModalVoucher}
              close={() => setOpenModalVoucher(false)}
              onOK={addVoucher}
              tongTien={tamTinh}
              tuDongGiamGia={goiYGiamGia}
            />
          </div>

          <Divider />
          <div>
            <div>
              <Text type="secondary" strong>
                Tổng tiền hàng:
              </Text>
              <Text style={{ float: "right" }}>
                {formatGiaTienVND(tamTinh)}
              </Text>
            </div>

            <div>
              <Text type="secondary" strong>
                Giảm giá:
              </Text>
              <Text style={{ float: "right" }}>
                {formatGiaTienVND(giamGiam)}
              </Text>
            </div>
            <div>
              <Text type="secondary" strong>
                Phí vận chuyển:
              </Text>
              <Text style={{ float: "right" }}>
                {phiShip !== 0 ? formatGiaTienVND(phiShip) : "Miễn phí"}
              </Text>
            </div>

            <Divider style={{ margin: 5, padding: 0, color: "black" }} />
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <Text
                strong
                style={{
                  marginTop: 10,
                }}>
                Tổng thanh toán:
              </Text>
              <Text
                style={{
                  fontSize: 25,
                  color: "red",
                  fontWeight: "bold",
                  marginLeft: "auto",
                }}>
                {formatGiaTienVND(tongTien())}
              </Text>
            </div>
          </div>
        </Card>
        <Button
          loading={loading}
          htmlType="submit"
          type="primary"
          style={{
            width: "100%",
            height: "50px",
            marginTop: 10,
            marginRight: 20,
            fontSize: "18px",
            fontWeight: "bold",
          }}>
          ĐẶT HÀNG
        </Button>
      </Form>
      <ModalDiaChi22
        openModal={modalDiaChi}
        closeModal={() => setModalDiaChi(false)}
        onClickDiaChi={onClickDiaChi}
      />
    </Content>
  );
};

export default ThanhToan;
