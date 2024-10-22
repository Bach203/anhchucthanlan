import React, { useState, useEffect } from "react";
import { Badge, Col, Row, Space, Tabs } from "antd";
import type { TabsProps } from "antd";
import DonHangChiTiet from "./DonHangChiTiet";
import { CiViewList } from "react-icons/ci";
import {
  MdOutlineChecklist,
  MdOutlineLocalShipping,
  MdOutlinePlaylistRemove,
} from "react-icons/md";
import { GoChecklist } from "react-icons/go";
import { BsBoxSeam } from "react-icons/bs";
import requestClient from "~/utils/requestClient";

const DonHangCuaToi: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [badgeAll, setBadgeAll] = useState(0);
  const [badgePENDING, setBadgePENDING] = useState(0);
  const [badgePICKUP, setBadgePICKUP] = useState(0);
  const [badgeSHIPPING, setBadgeSHIPPING] = useState(0);
  const [badgeAPPROVED, setBadgeAPPROVED] = useState(0);
  const [badgeCANCELLED, setBadgeCANCELLED] = useState(0);
  const idTaiKhoan = localStorage.getItem("acountId");

  const onChange = (key: string) => {
    console.log(key);
  };

  const getAll = async () => {
    setLoading(true);
    console.log(idTaiKhoan);

    try {
      const response = await requestClient.get("/don-hang/count", {
        params: {
          taiKhoanId: idTaiKhoan,
          trangThai: "",
        },
      });
      setBadgeAll(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getPending = async () => {
    setLoading(true);
    try {
      const response = await requestClient.get("/don-hang/count", {
        params: {
          taiKhoanId: idTaiKhoan,
          trangThai: "PENDING",
        },
      });
      setBadgePENDING(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getPickUp = async () => {
    setLoading(true);
    try {
      const response = await requestClient.get("/don-hang/count", {
        params: {
          taiKhoanId: idTaiKhoan,
          trangThai: "PICKUP",
        },
      });
      setBadgePICKUP(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getShipping = async () => {
    setLoading(true);
    try {
      const response = await requestClient.get("/don-hang/count", {
        params: {
          taiKhoanId: idTaiKhoan,
          trangThai: "SHIPPING",
        },
      });
      setBadgeSHIPPING(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getApproved = async () => {
    setLoading(true);
    try {
      const response = await requestClient.get("/don-hang/count", {
        params: {
          taiKhoanId: idTaiKhoan,
          trangThai: "APPROVED",
        },
      });
      setBadgeAPPROVED(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getCancelled = async () => {
    setLoading(true);
    try {
      const response = await requestClient.get("/don-hang/count", {
        params: {
          taiKhoanId: idTaiKhoan,
          trangThai: "CANCELLED",
        },
      });
      setBadgeCANCELLED(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAll();
    getPending();
    getPickUp();
    getShipping();
    getApproved();
    getCancelled();
  }, []);

  const items: TabsProps["items"] = [
    {
      key: "",
      label: (
        <Space>
          <CiViewList style={{ marginTop: 6 }} />
          <Badge count={badgeAll}>
            <span style={{ paddingRight: 15 }}>Tất cả</span>
          </Badge>
        </Space>
      ),
      children: <DonHangChiTiet currentKey={""} />,
    },
    {
      key: "PENDING",
      label: (
        <Space>
          <MdOutlineChecklist style={{ marginTop: 6 }} />
          <Badge count={badgePENDING}>
            <span style={{ paddingRight: 15 }}>Chờ xác nhận</span>
          </Badge>
        </Space>
      ),
      children: <DonHangChiTiet currentKey={"PENDING"} />,
    },
    {
      key: "PICKUP",
      label: (
        <Space>
          <BsBoxSeam style={{ marginTop: 6 }} />
          <Badge count={badgePICKUP}>
            <span style={{ paddingRight: 15 }}>Chờ lấy hàng</span>
          </Badge>
        </Space>
      ),
      children: <DonHangChiTiet currentKey={"PICKUP"} />,
    },
    {
      key: "SHIPPING",
      label: (
        <Space>
          <MdOutlineLocalShipping style={{ marginTop: 6 }} />
          <Badge count={badgeSHIPPING}>
            <span style={{ paddingRight: 15 }}>Đang giao hàng</span>
          </Badge>
        </Space>
      ),
      children: <DonHangChiTiet currentKey={"SHIPPING"} />,
    },
    {
      key: "APPROVED",
      label: (
        <Space>
          <GoChecklist style={{ marginTop: 6 }} />
          <Badge count={badgeAPPROVED}>
            <span style={{ paddingRight: 15 }}>Đã giao</span>
          </Badge>
        </Space>
      ),
      children: <DonHangChiTiet currentKey={"APPROVED"} />,
    },
    {
      key: "CANCELLED",
      label: (
        <Space>
          <MdOutlinePlaylistRemove style={{ marginTop: 6 }} />
          <Badge count={badgeCANCELLED}>
            <span style={{ paddingRight: 15 }}>Đã hủy</span>
          </Badge>
        </Space>
      ),
      children: <DonHangChiTiet currentKey={"CANCELLED"} />,
    },
  ];
  return (
    <>
      <Row>
        <Col span={5}></Col>
        <Col span={14}>
          <Tabs
            defaultActiveKey=""
            items={items}
            onChange={onChange}
            tabBarGutter={48} // Thiết lập khoảng cách giữa các tab
          />
        </Col>
        <Col span={5}></Col>
      </Row>
    </>
  );
};
export default DonHangCuaToi;
