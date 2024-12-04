import { FileExcelOutlined } from "@ant-design/icons";
import { Button, Col, Row, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { useState, useEffect } from "react";
import request from "~/utils/request";

interface DataType {
  key: string;
  ten: string;
  soLuongTon: number;
}

const TableSoLuongTon: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(0);

  const columns: ColumnsType<DataType> = [
    {
      title: "STT",
      align: "center",
      rowScope: "row",
      width: "60px",
      render: (_, __, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "Tên Sản phẩm",
      dataIndex: "ten",
      key: "ten",
      render: (_, record) => {
        return record.ten;
      },
    },
    {
      title: "Số lượng tồn",
      dataIndex: "soLuongTon",
      key: "soLuongTonge",
      render: (_, record) => {
        return record.soLuongTon < 10 ? (
          <div style={{ color: "red", fontWeight: "bold" }}>
            {record.soLuongTon}
          </div>
        ) : (
          <div>{record.soLuongTon}</div>
        );
      },
    },
  ];

  useEffect(() => {
    fetchData();
  }, [page, pageSize]);

  const fetchData = async () => {
    try {
      const response = await request.get("thong-ke/so-luong-ton", {
        params: { page: page, pageSize: pageSize },
      });
      setData(response.data.content);
      setTotalPage(response.data.totalElements);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };
  const exportToExcel = async () => {
    try {
      const currentTime = new Date();
      const dateString = currentTime
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "");
      const timeString = currentTime
        .toTimeString()
        .slice(0, 8)
        .replace(/:/g, "");

      const fileName = `so_luong_ton_${dateString}_${timeString}.xlsx`;

      const response = await request.get("thong-ke/excel", {
        responseType: "blob", // Yêu cầu response là dạng blob
      });

      const blob = new Blob([response.data], {
        type: "application/octet-stream",
      });

      // Tạo một URL tạm thời để download file Excel
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      // Xoá URL tạm thời
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting to Excel: ", error);
    }
  };

  return (
    <>
      <Row style={{ marginRight: 25 }}>
        <Col span={1}></Col>
        <Col span={22}>
          <Table
            title={() => (
              <>
                <span style={{ fontWeight: "bold" }}>
                  DANH SÁCH SẢN PHẨM TỒN
                </span>
                <Button
                  style={{ float: "right", backgroundColor: "green" }}
                  type="primary"
                  onClick={exportToExcel}
                >
                  <FileExcelOutlined /> Xuất File Excel
                </Button>
              </>
            )}
            pagination={{
              total: totalPage,
              onChange(page, pageSize) {
                setPage(page);
                setPageSize(pageSize);
              },
            }}
            style={{ marginTop: 50 }}
            columns={columns}
            dataSource={data}
          />
        </Col>
        <Col span={1}></Col>
      </Row>
    </>
  );
};

export default TableSoLuongTon;
