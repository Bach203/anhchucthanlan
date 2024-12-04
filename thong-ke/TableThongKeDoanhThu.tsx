import { Col, Row, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { useState, useEffect } from "react";
import { formatGiaTienVND } from "~/utils/formatResponse";
import request from "~/utils/request";

interface DataType {
  key: string;
  ten: string;
  soLuongDaBan: number;
  doanhThu: number;
}

const TableThongKeDoanhThu: React.FC = () => {
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
      title: "Số lượng sản phẩm đã bán",
      dataIndex: "soLuongDaBan",
      key: "soLuongDaBan",
      render: (_, record) => {
        return record.soLuongDaBan;
      },
    },
    {
      title: "Doanh thu",
      dataIndex: "doanhThu",
      key: "doanhThu",
      render: (_, record) => {
        return formatGiaTienVND(record.doanhThu);
      },
    },
  ];
  useEffect(() => {
    fetchData();
  }, [page, pageSize]);

  const fetchData = async () => {
    try {
      const response = await request.get("thong-ke/doanh-thu", {
        params: { page: page, pageSize: pageSize },
      });
      setData(response.data.content);
      setTotalPage(response.data.totalElements);
    } catch (error) {
      console.error("Error fetching data: ", error);
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
                  THỐNG KÊ DOANH THU THEO SẢN PHẨM
                </span>
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

export default TableThongKeDoanhThu;
