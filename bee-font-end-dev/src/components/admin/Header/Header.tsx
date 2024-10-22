import React, { useState } from "react";
import { Layout, Button , message, Select, } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import {requestDangNhap, requestLogout} from "~/utils/request";
import { Link, useNavigate } from "react-router-dom";
import { FaDoorOpen } from "react-icons/fa";
import ModalThongTin from "~/pages/login/thong-tin/ThongTin";
import ModalDoiMK from "~/pages/login/doi-mat-khau/DoiMatKhau";


const CustomHeader: React.FC<{
  
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  colorBgContainer: string;
}> = ({ collapsed, setCollapsed, colorBgContainer }) => {
  // const navigate = useNavigate();
  // const handleLogout = async () => {
  //   const response123 = await requestLogout.post("/logout");
  //   localStorage.removeItem("refreshToken");
  //   localStorage.removeItem("email");
  //   navigate("/sign-in");
  //   message.success("Đăng xuất thành công");
  // }
  const [modalThongTin, setModalThongTin] = useState(false); 
  const [modalDoiMK, setModalDoiMK] = useState(false); 
  const { Option } = Select;
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const response123 = await requestLogout.post("/logout");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("acountId");
      localStorage.removeItem("roleId");
      // localStorage.removeItem("idGioHang");
      
      navigate("/sign-in");
      message.success("Đăng xuất thành công");
    } catch (error) {
      console.error("Error during logout:", error);
      message.error("Có lỗi xảy ra khi đăng xuất.");
    }
  };
  const [sanPhamOpen, setSanPhamOpen] = useState(false);
  const showSanPhamModal = () => {
    setSanPhamOpen(true);
  };

  const roleId = localStorage.getItem("roleId");
  const ten = localStorage.getItem("ten");
  return (
    <Layout.Header
      style={{
        padding: 0,
        top: 0,
        background: colorBgContainer, // Sử dụng giá trị colorBgContainer từ props
        position: "fixed",
        width: "100%",
        zIndex: 1,
      }}
    >
      {/* <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: "16px",
          width: 64,
          height: 64,
        }}
      />
                  <Button
  onClick={handleLogout}
  
  type="primary"
  htmlType="submit"
>
<FaDoorOpen />
</Button> */}

<Select
        defaultValue={roleId}
        style={{ width: 150, marginLeft: 1050 }}
        onChange={(value) => {
          // Check if the selected value is "logout" and call handleLogout
          if (value === "logout") {
            handleLogout();
          } else if(value==="thongTin"){
            showSanPhamModal();
          }
        }}
      >
        {roleId === "1" && <Option value="1">{ten}</Option>}
          {roleId === "2" && <Option value="2">{ten}</Option>}
          {roleId === "3" && <Option value="3">{ten}</Option>}
          <Option value="thongtin"><Button style={{margin:0,padding:0}} type="link" onClick={()=>setModalThongTin(true)} >Thông tin</Button></Option>
          <Option value="doiMatKhau"><Button style={{margin:0,padding:0}} type="link" onClick={()=>setModalDoiMK(true)} >Đổi mật khẩu</Button></Option>
        <Option style={{ color: '#3D6EE0' }} value="logout">Logout</Option>
      </Select>

      {/* <HoaDonChiTietComponent
        isModalVisible={sanPhamOpen}
        setIsModalVisible={setSanPhamOpen}
        idHoaDon={Number(id)}
        loadData={fetchHoaDonData}
      /> */}
      <ModalThongTin openModal={modalThongTin} closeModal={()=>setModalThongTin(false)} />
      <ModalDoiMK openModal={modalDoiMK} closeModal={()=>setModalDoiMK(false)} />
    </Layout.Header>
    

  );
};

export default CustomHeader;
