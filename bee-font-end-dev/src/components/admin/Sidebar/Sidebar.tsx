import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Divider, Layout, Menu } from "antd";
import { FaChartBar } from "react-icons/fa";

import {
  ContainerOutlined,
  TeamOutlined,
  ShopOutlined,
  HomeOutlined,
  GiftOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import logo from "~/image/logo.jpg";
import type { MenuProps } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

const getItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem => {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
};

const CustomSider: React.FC<{
  collapsed: boolean;
  colorBgContainer: string;
}> = ({ collapsed, colorBgContainer }) => {
  const roleId = localStorage.getItem("roleId");
  const [selectedKey, setSelectedKey] = useState<string>("1"); // State to manage the selected key

  useEffect(() => {
    // Set the selected key when the component mounts
    setSelectedKey("1");
  }, []);

  let items: MenuItem[] = [
    getItem(
      <Link to="/admin/ban-hang-tai-quay">Bán hàng tại quầy</Link>,
      "1",
      <ShopOutlined />
    ),
    getItem(
      <Link to="/admin/hoa-don">Quản lý đơn hàng</Link>,
      "2",
      <ContainerOutlined />
    ),

    getItem("Quản lý sản phẩm", "sub1", <AppstoreAddOutlined />, [
      getItem(<Link to="/admin/san-pham">Sản phẩm</Link>, "4"),
      getItem("Thuộc tính", "sub1-2", null, [
        getItem(<Link to="/admin/mau-sac">Màu sắc</Link>, "5"),
        getItem(<Link to="/admin/loai-de">Loại đế</Link>, "6"),
        getItem(<Link to="/admin/thuong-hieu">Thương hiệu</Link>, "7"),
        getItem(<Link to="/admin/dia-hinh-san">Địa hình sân</Link>, "8"),
        getItem(<Link to="/admin/kich-co">Kích cỡ</Link>, "9"),
      ]),
    ]),

    getItem("Quản lý tài khoản", "sub2", <TeamOutlined />, [
      getItem(<Link to="/admin/khach-hang">Khách hàng</Link>, "10"),
      // Only hide "Nhân viên" if roleId is 2
      roleId === "2"
        ? null
        : getItem(<Link to="/admin/nhan-vien">Nhân viên</Link>, "11"),
    ]),

    getItem(
      <Link to="/admin/voucher">Quản lý voucher</Link>,
      "12",
      <GiftOutlined />
    ),
    getItem(<Link to="/admin/thong-ke">Thống kê</Link>, "13", <FaChartBar />),
  ];
  if (roleId === "2") {
    items = items.filter((item) => item?.key !== "13" && item?.key !== "12");
  }

  return (
    <Layout.Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={250}
      style={{
        background: colorBgContainer,
        position: "fixed",
        left: 0,
        top: 0,
        height: "100vh",
        zIndex: 2,
      }}
    >
      <div className="demo-logo-vertical">
        <img src={logo} alt="" width={"100%"} height={"145%"} />
      </div>
      <Menu
        defaultSelectedKeys={[selectedKey]}
        mode="inline"
        items={items}
        style={{ background: colorBgContainer }}
      />
    </Layout.Sider>
  );
};

export default CustomSider;
