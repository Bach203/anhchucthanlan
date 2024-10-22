import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  InputNumber,
  Row,
  Space,
  Typography,
} from "antd";
import type { DatePickerProps } from "antd";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import request from "~/utils/request";
import { RangeValue } from "rc-picker/lib/interface";
import { formatGiaTienVND } from "~/utils/formatResponse";
import TableSoLuongTon from "./TableSoLuongTon";
import TableThongKeDoanhThu from "./TableThongKeDoanhThu";
import ChartThongKe from "./ChartThongKe";

import "chart.js/auto";
const { Text } = Typography;
const { RangePicker } = DatePicker;

interface chartDataProps {
  ngay: string[];
  doanhThu: number[];
  tongSoDonThanhCong: number[];
  tongSoDonHuy: number[];
  tongSoSanPhamDaBan: number[];
  tongSoDonTaiQuay: number[];
  tongSoDonOnline: number[];
}

const ThongKe: React.FC = () => {
  const [thongKeNgay, setThongKeNgay] = useState<any>(null); // Dữ liệu thống kê ngày
  const [thongKeTuan, setThongKeTuan] = useState(null);
  const [thongKeThang, setThongKeThang] = useState(null);
  const [thongKeNam, setThongKeNam] = useState(null);
  const [thongKeKhoangNgay, setThongKeKhoangNgay] =
    useState<chartDataProps | null>(null);
  const [selectedDateRange, setSelectedDateRange] =
    useState<RangeValue<Dayjs> | null>(null);
  const [dateRangeDisplay, setDateRangeDisplay] = useState<{
    start: string | null;
    end: string | null;
  }>({ start: null, end: null });
  const onChangeNgay: DatePickerProps["onChange"] = (date) => {
    getThongKeNgay(date);
  };

  const onChangeTuan: DatePickerProps["onChange"] = (date) => {
    getThongKeTuan(date);
  };

  const onChangeThang: DatePickerProps["onChange"] = (date) => {
    getThongKeThang(date);
  };

  const onChangeNam: DatePickerProps["onChange"] = (date) => {
    getThongKeNam(date);
  };

  const disableFutureDates = (current: Dayjs) => {
    return current && current > dayjs().endOf("day");
  };

  const disablePastDate = (current: Dayjs) => {
    return current && current < dayjs().subtract(7, "day").startOf("day");
  };
  const onChangeKhoangNgay = (
    values: RangeValue<Dayjs>,
    formatString: [string, string]
  ) => {
    if (values && values.length === 2) {
      const start = values[0];
      const end = values[1];
      const differenceInDays = end.diff(start, "day");

      if (differenceInDays < 1 || differenceInDays > 6) {
        alert("Khoảng thời gian chọn nằm trong 2 - 7 ngày.");
      } else {
        setDateRangeDisplay({
          start: start.format("DD-MM-YYYY"),
          end: end.format("DD-MM-YYYY"),
        }); // Cập nhật ngày hiển thị
        setSelectedDateRange(values);
        getThongKeKhoangNgay(values);
      }
    }
  };

  const getThongKeNgay = async (date) => {
    try {
      const res = await request.get("thong-ke/ngay", {
        params: { ngay: date.format("YYYY-MM-DD") },
      });
      setThongKeNgay(res.data);
      if (res.data) {
        const chartData = {
          labels: [
            "Tổng doanh thu",
            "Tổng số đơn thành công",
            "Tổng số đơn hủy",
            "Tổng số sản phẩm đã bán",
            "Tổng số đơn Tại quầy",
            "Tổng số đơn Online",
          ],
          datasets: [
            {
              label: "Thống kê ngày",
              data: [
                res.data.tongDoanhThu,
                res.data.tongSoDonThanhCong,
                res.data.tongSoDonHuy,
                res.data.tongSoSanPhamDaBan,
                res.data.tongSoDonTaiQuay,
                res.data.tongSoDonOnline,
              ],
              backgroundColor: [
                "rgba(75, 192, 192, 0.6)",
                "rgba(153, 102, 255, 0.6)",
                "rgba(255, 159, 64, 0.6)",
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 206, 86, 0.6)",
              ],
              borderColor: [
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
              ],
              borderWidth: 1,
            },
          ],
        };
      }
      console.log("thongKeNgay toi da log:", res.data); // Log giá trị nhận được từ API
    } catch (e) {
      console.log("lỗi");
    }
  };
  const defaultData = {
    labels: [],
    datasets: [
      {
        label: "Thống kê ngày",
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  };

  const getThongKeTuan = async (date) => {
    const startOfWeek = date.startOf("week").format("YYYY-MM-DD");
    const endOfWeek = date.endOf("week").format("YYYY-MM-DD");

    const tuan = {
      startOfWeek: startOfWeek,
      endOfWeek: endOfWeek,
    };

    try {
      const res = await request.get("thong-ke/tuan", {
        params: tuan,
      });
      setThongKeTuan(res.data);
      console.log(res);
    } catch (e) {
      console.log("lỗi");
    }
  };

  const getThongKeThang = async (date) => {
    const startOfMonth = date.startOf("month").format("YYYY-MM-DD");
    const endOfMonth = date.endOf("month").format("YYYY-MM-DD");

    const thang = {
      startOfMonth: startOfMonth,
      endOfMonth: endOfMonth,
    };

    try {
      const res = await request.get("thong-ke/thang", {
        params: thang,
      });
      setThongKeThang(res.data);
      console.log(res);
    } catch (e) {
      console.log("lỗi");
    }
  };

  const getThongKeNam = async (date) => {
    const startOfYear = date.startOf("year").format("YYYY-MM-DD");
    const endOfYear = date.endOf("year").format("YYYY-MM-DD");

    const nam = {
      startOfYear: startOfYear,
      endOfYear: endOfYear,
    };

    try {
      const res = await request.get("thong-ke/nam", {
        params: nam,
      });
      setThongKeNam(res.data);
      console.log(res);
    } catch (e) {
      console.log("lỗi");
    }
  };

  const getThongKeKhoangNgay = async (
    date: [Dayjs | null, Dayjs | null] | null
  ) => {
    if (date && date.length === 2) {
      const start = date[0]?.format("YYYY-MM-DD");
      const end = date[1]?.format("YYYY-MM-DD");
      const khoangNgay = {
        start: start,
        end: end,
      };

      try {
        const res = await request.get("thong-ke/khoang-ngay", {
          params: khoangNgay,
        });
        setThongKeKhoangNgay(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thống kê theo khoảng ngày:", error);
      }
    }
  };

  useEffect(() => {
    getThongKeNgay(dayjs());
    getThongKeTuan(dayjs());
    getThongKeThang(dayjs());
    getThongKeNam(dayjs());
  }, []);

  return (
    <>
      <Row>
        <Row style={{ margin: "20px" }}>
          <Col span={24}>
            <Card
              title="Thống Kê Theo Ngày"
              hoverable
              extra={
                <DatePicker
                  allowClear={false}
                  format="DD-MM-YYYY"
                  onChange={onChangeNgay}
                  defaultValue={dayjs()}
                />
              }
              style={{ height: "580px", width: "580px" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  height: "600px",
                }}
              >
                <div style={{ flex: 3 }}>
                  <ChartThongKe title="Thống Kê Theo Ngày" data={thongKeNgay} />
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        <Row style={{ margin: "20px" }}>
          <Col span={24}>
            <Card
              title="Thống Kê Theo Tuần"
              hoverable
              extra={
                <DatePicker
                  allowClear={false}
                  format="DD-MM-YYYY"
                  picker="week"
                  onChange={onChangeTuan}
                  defaultValue={dayjs().endOf("week")}
                />
              }
              style={{ height: "580px", width: "580px" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <div style={{ flex: 3 }}>
                  <ChartThongKe title="Thống Kê Theo Tuần" data={thongKeTuan} />
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        <Row style={{ margin: "20px" }}>
          <Col span={24}>
            <Card
              title="Thống Kê Theo Tháng"
              hoverable
              extra={
                <DatePicker
                  allowClear={false}
                  format="MM-YYYY"
                  picker="month"
                  onChange={onChangeThang}
                  defaultValue={dayjs().endOf("month")}
                />
              }
              style={{ height: "580px", width: "580px" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <div style={{ flex: 3 }}>
                  <ChartThongKe
                    title="Thống Kê Theo Tháng"
                    data={thongKeThang}
                  />
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        <Row style={{ margin: "20px" }}>
          <Col span={24}>
            <Card
              title="Thống Kê Theo Năm"
              hoverable
              extra={
                <DatePicker
                  allowClear={false}
                  picker="year"
                  format="YYYY"
                  onChange={onChangeNam}
                  defaultValue={dayjs().endOf("year")}
                />
              }
              style={{ height: "580px", width: "580px" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <div style={{ flex: 3 }}>
                  <ChartThongKe title="Thống Kê Theo Năm" data={thongKeNam} />
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Row>
      <Row>
        <Col
          style={{
            marginLeft: 50,
            marginRight: 70,
            marginTop: 30,
            width: "100%",
          }}
        >
          <Card
            title={
              <span>
                Thống Kê Theo khoảng ngày ( 2 - 7 ngày )
                {dateRangeDisplay.start && dateRangeDisplay.end && (
                  <span style={{ marginLeft: 10, color: "red" }}>
                    Ngày {dateRangeDisplay.start} đến hết ngày{" "}
                    {dateRangeDisplay.end}
                  </span>
                )}
              </span>
            }
            hoverable
            style={{ width: "auto", height: "auto", position: "relative" }}
          >
            <div
              style={{ position: "absolute", top: 13, right: 10, zIndex: 1 }}
            >
              <RangePicker
                allowClear={false}
                style={{ width: "auto" }}
                onChange={onChangeKhoangNgay}
                disabledDate={disableFutureDates}
                value={selectedDateRange}
              />
            </div>
            <Col>
              <ChartThongKe
                title="Thống Kê Theo Khoảng Ngày"
                data={thongKeKhoangNgay}
              />
            </Col>
            <Row>
              <Col span={4}>
                <Space>
                  Tổng doanh thu:
                  <Text strong>
                    {formatGiaTienVND(
                      thongKeKhoangNgay !== null
                        ? thongKeKhoangNgay.tongDoanhThu
                        : 0
                    )}
                  </Text>
                </Space>
              </Col>
              <Col span={4}>
                <Space>
                  Tổng số đơn thành công:
                  <Text strong>
                    {thongKeKhoangNgay !== null
                      ? thongKeKhoangNgay.tongSoDonThanhCong
                      : 0}
                  </Text>
                </Space>
              </Col>
              <Col span={3}>
                <Space>
                  Tổng số đơn hủy:
                  <Text strong>
                    {thongKeKhoangNgay !== null
                      ? thongKeKhoangNgay.tongSoDonHuy
                      : 0}
                  </Text>
                </Space>
              </Col>
              <Col span={5}>
                <Space>
                  Tổng số sản phẩm đã bán:
                  <Text strong>
                    {thongKeKhoangNgay !== null
                      ? thongKeKhoangNgay.tongSoSanPhamDaBan
                      : 0}
                  </Text>
                </Space>
              </Col>
              <Col span={4}>
                <Space>
                  Tổng số đơn Tại quầy:
                  <Text strong>
                    {thongKeKhoangNgay !== null
                      ? thongKeKhoangNgay.tongSoDonTaiQuay
                      : 0}
                  </Text>
                </Space>
              </Col>
              <Col span={4}>
                <Space>
                  Tổng số đơn Online:
                  <Text strong>
                    {thongKeKhoangNgay !== null
                      ? thongKeKhoangNgay.tongSoDonOnline
                      : 0}
                  </Text>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Row style={{ margin: "20px" }}>
        <Col span={24}>
          <TableSoLuongTon />
        </Col>
      </Row>
      <Row style={{ margin: "20px" }}>
        <Col span={24}>
          <TableThongKeDoanhThu />
        </Col>
      </Row>
    </>
  );
};

export default ThongKe;
