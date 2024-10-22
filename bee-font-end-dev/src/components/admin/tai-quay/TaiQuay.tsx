import { Modal, Tabs, Typography, message } from "antd";
import React, { useRef, useState, useEffect } from "react";
import GioHangTaiQuay from "./GioHangTaiQuay";
import request from "~/utils/request";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const TaiQuay: React.FC = () => {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState<string | undefined>(undefined);
  const [items, setItems] = useState<React.ReactNode[]>([]);
  const exportPdfExecuted = useRef(false);
  const [hoaDonCho, setHoaDonCho] = useState(0);
  const newTabIndex = useRef(1);
  const { confirm } = Modal;
  const { Text } = Typography;

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const thanhToanParam = queryParams.get("thanhToan");
  const hoaDonParam = queryParams.get("hoaDon");
  const exportPDF = async () => {
    try {
      const response = await request.get("/hoa-don/export/pdf", {
        params: { id: hoaDonParam },
        responseType: "blob", // Quan trọng để xác định kiểu dữ liệu trả về là một Blob
      });
      // Tạo một URL tạm thời từ blob
      const file = new Blob([response.data], {
        type: "application/pdf",
      });
      const fileURL = URL.createObjectURL(file);
      // Tạo một thẻ <a> tạm thời để tải xuống
      const downloadLink = document.createElement("a");
      downloadLink.href = fileURL;
      downloadLink.setAttribute("download", `HoaDon_${hoaDonParam}.pdf`); // Đặt tên file ở đây
      document.body.appendChild(downloadLink);
      downloadLink.click();
      // Dọn dẹp sau khi tải xuống
      URL.revokeObjectURL(fileURL);
      document.body.removeChild(downloadLink);
      // hihi88
      navigate("/admin/ban-hang-tai-quay");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (
      thanhToanParam === "success" &&
      !exportPdfExecuted.current &&
      hoaDonParam != null
    ) {
      exportPDF();
      exportPdfExecuted.current = true;
    }
  }, [thanhToanParam, hoaDonParam]);

  const fetchRecentInvoices = async () => {
    try {
      const response = await request.get("hoa-don/hoa-don-cho");
      const recentInvoices = response.data;
      setHoaDonCho(response.data.length);
      // Cập nhật danh sách các tab với hóa đơn mới nhất
      const newPanes = recentInvoices.map((invoice: any) => {
        const newActiveKey = `newTab${newTabIndex.current++}`;
        return {
          label: invoice.ma,
          children: (
            <GioHangTaiQuay loadHoaDon={fetchRecentInvoices} id={invoice.id} />
          ),
          key: newActiveKey,
        };
      });

      setItems(newPanes);

      // Đặt tab đầu tiên là active khi danh sách được cập nhật
      if (newPanes.length > 0) {
        setActiveKey(newPanes[0].key);
      }
    } catch (error) {
      // Xử lý lỗi từ API nếu có
      message.error("Lỗi khi tải danh sách hóa đơn: " + error);
    }
  };

  useEffect(() => {
    // Gọi API để lấy danh sách 5 hóa đơn mới nhất
    fetchRecentInvoices();
  }, []);

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };

  const add = async () => {
    try {
      const res = await request.get("hoa-don/so-luong-hoa-don-cho");
      const soLuongCho = res.data; // Số lượng hóa đơn chờ từ API
      if (soLuongCho >= 8) {
        message.warning("Số lượng hóa đơn chờ đã đạt mức tối đa");
        return;
      }
      // Thực hiện yêu cầu POST đến API
      const response = await request.post("hoa-don", {
        loaiHoaDon: "COUNTER",
        trangThaiHoaDon: "PENDING",
      });
      const newActiveKey = `newTab${newTabIndex.current++}`;
      const newPanes = [...items];
      newPanes.push({
        label: response.data.ma,
        children: (
          <GioHangTaiQuay
            loadHoaDon={fetchRecentInvoices}
            id={response.data.id}
          />
        ),
        key: newActiveKey,
      });

      setItems(newPanes);
      setActiveKey(newActiveKey);
    } catch (error) {
      // Xử lý lỗi từ API nếu có
      message.error("Lỗi khi thêm tab: " + error);
    }
  };

  const remove = async (targetKey: TargetKey) => {
    const targetInvoice = items.find((item) => item.key === targetKey);
    if (!targetInvoice) return;

    const invoiceId = targetInvoice.children?.props.id;
    const invoiceCode = targetInvoice.label;
    confirm({
      title: "Xác Nhận",
      icon: <ExclamationCircleFilled />,
      content: (
        <div>
          Hóa đơn{" "}
          <Text type="danger" strong>
            #{invoiceCode}
          </Text>{" "}
          chưa được thanh toán. Bạn có chắc muốn hủy hóa đơn này không?
        </div>
      ),
      okText: "OK",
      cancelText: "Hủy",
      onOk: async () => {
        let newActiveKey = activeKey;
        let lastIndex = -1;
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.key === targetKey) {
            lastIndex = i - 1;
            if (item.children) {
              try {
                await request.get(`hoa-don/cancel/${invoiceId}`);
                // Cập nhật giao diện sau khi hóa đơn được hủy
                fetchRecentInvoices();
                message.success("Hóa đơn đã được hủy thành công");
              } catch (error) {
                message.error("Lỗi khi hủy hóa đơn: " + error);
              }
            }
          }
        }
        const newPanes = items.filter((item) => item.key !== targetKey);
        if (newPanes.length && newActiveKey === targetKey) {
          if (lastIndex >= 0) {
            newActiveKey = newPanes[lastIndex].key;
          } else {
            newActiveKey = newPanes[0].key;
          }
        }
        setItems(newPanes);
        setActiveKey(newActiveKey);
      },
    });
  };

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: "add" | "remove"
  ) => {
    if (action === "add") {
      add();
    } else {
      remove(targetKey);
    }
  };

  return (
    <>
      <Tabs
        type="editable-card"
        onChange={onChange}
        activeKey={activeKey}
        onEdit={onEdit}
        items={items}
      />
    </>
  );
};

export default TaiQuay;
