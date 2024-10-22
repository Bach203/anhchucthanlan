import {
  Badge,
  Button,
  Card,
  Empty,
  Image,
  Input,
  List,
  Modal,
  Progress,
  Radio,
  Space,
  Typography,
} from "antd";
import { red, green } from "@ant-design/colors";
import React, { useState, useEffect } from "react";
import request from "~/utils/request";
import VirtualList from "rc-virtual-list";
import { formatGiaTienVND } from "~/utils/formatResponse";
import dayjs from "dayjs";
const { Text } = Typography;
// other imports...

const KhoVoucher = ({ open, close, onOK, tongTien, tuDongGiamGia }) => {
  const [data, setData] = useState([]);
  const [voucher, setVoucher] = useState(null);
  const [checkedVoucher, setCheckedVoucher] = useState(null);
  const idTaiKhoan = localStorage.getItem("acountId");
  const fetchData = async () => {
    try {
      const res = await request.get("voucher/list-su-dung", {
        params: {
          idTaiKhoan: idTaiKhoan,
        },
      });
      setData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [open, close]);
  const timGiamGiaCaoNhat = (dataSuDung) => {
    let maxDiscount = 0;
    let maxDiscountVoucher = null;
    let nextHigherDonToiThieuVoucher = null;
    if (dataSuDung.length > 0) {
      dataSuDung.forEach((voucher) => {
        const { id, hinhThucGiam, giamToiDa, giaTriGiam, donToiThieu } =
          voucher;

        // Check if tongTien is greater than or equal to donToiThieu
        if (tongTien >= donToiThieu) {
          if (hinhThucGiam.id === 1) {
            // If hinhThucGiam is 1, set the discount as giamToiDa
            if (giamToiDa > maxDiscount) {
              maxDiscount = giamToiDa;
              maxDiscountVoucher = voucher;
            }
          } else if (hinhThucGiam.id === 2) {
            // If hinhThucGiam is 2, calculate the percentage discount
            const discountPercentage = giaTriGiam;
            const discountedAmount = (discountPercentage / 100) * tongTien;

            // Ensure the discounted amount does not exceed giamToiDa
            const currentDiscount = Math.min(discountedAmount, giamToiDa);

            if (currentDiscount > maxDiscount) {
              maxDiscount = currentDiscount;
              maxDiscountVoucher = voucher;
            }
          }
        } else {
          // If tongTien is less than donToiThieu, track the next higher donToiThieu
          if (
            donToiThieu < nextHigherDonToiThieuVoucher?.donToiThieu ||
            nextHigherDonToiThieuVoucher === null
          ) {
            nextHigherDonToiThieuVoucher = voucher;
          }
        }
      });
    }
    setCheckedVoucher(maxDiscountVoucher?.id);
    tuDongGiamGia(
      maxDiscountVoucher,
      tinhGiamGia(maxDiscountVoucher),
      nextHigherDonToiThieuVoucher,
      tinhGiamGia(nextHigherDonToiThieuVoucher)
    );
  };
  useEffect(() => {
    const getVoucherSuDung = async () => {
      try {
        const res = await request.get("voucher/list-su-dung", {
          params: {
            idTaiKhoan: idTaiKhoan,
          },
        });
        timGiamGiaCaoNhat(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    getVoucherSuDung();
  }, [tongTien]);

  const phanTram = (item) => {
    if (item.soLuong !== null) {
      return Math.round((item.hoaDonList.length / item.soLuong) * 100);
    }
    return 0;
  };

  const tinhGiamGia = (voucher) => {
    if (voucher !== null || undefined) {
      const { hinhThucGiam, giamToiDa, giaTriGiam } = voucher;

      if (hinhThucGiam.id === 1) {
        return giamToiDa;
      } else if (hinhThucGiam.id === 2) {
        const discountPercentage = giaTriGiam;
        const discountedAmount = (discountPercentage / 100) * tongTien;
        return Math.min(discountedAmount, giamToiDa);
      }
    }

    return 0;
  };

  return (
    <Modal
      title="Chọn BeeSport Voucher"
      style={{ top: 20 }}
      width={520}
      open={open}
      onOk={() => onOK(voucher, tinhGiamGia(voucher))}
      onCancel={close}
    >
      {data.length > 0 ? (
        <List>
          <Radio.Group value={checkedVoucher}>
            <VirtualList
              data={data}
              height={500}
              itemHeight={47}
              itemKey="email"
            >
              {(item) => (
                <List.Item key={item.ma}>
                  <Space direction="vertical" size="middle">
                    <Radio
                      value={item.id}
                      onChange={() => {
                        setVoucher(item);
                        setCheckedVoucher(item.id);
                      }}
                      disabled={
                        tongTien < item.donToiThieu || phanTram(item) == 100
                          ? true
                          : false
                      }
                    >
                      <Badge.Ribbon
                        text={item.ma}
                        color={
                          tongTien < item.donToiThieu || phanTram(item) == 100
                            ? "#00000073"
                            : "volcano"
                        }
                      >
                        <Card
                          title={item.ten}
                          size="small"
                          style={{ width: "440px" }}
                        >
                          <Space direction="vertical">
                            {item.hinhThucGiam.id == 1 ? (
                              <Text strong>
                                Giảm {formatGiaTienVND(item.giaTriGiam)}
                              </Text>
                            ) : (
                              <Text strong>Giảm {item.giaTriGiam}%</Text>
                            )}
                            <Space>
                              <Text>
                                Đơn Tối Thiểu{" "}
                                {formatGiaTienVND(item.donToiThieu)}
                              </Text>
                              {item.hinhThucGiam.id == 2 ? (
                                <Text>
                                  Giảm Tối Đa {formatGiaTienVND(item.giamToiDa)}
                                </Text>
                              ) : null}
                            </Space>

                            <Space
                              direction="vertical"
                              style={{ padding: 0, margin: 0 }}
                            >
                              <Space>
                                <Text italic>
                                  {`Hạn sử dụng: ${dayjs(
                                    item.ngayKetThuc
                                  ).format("DD-MM-YYYY")}`}
                                </Text>
                              </Space>
                            </Space>
                          </Space>
                        </Card>
                      </Badge.Ribbon>
                    </Radio>
                  </Space>
                </List.Item>
              )}
            </VirtualList>
          </Radio.Group>
        </List>
      ) : (
        <Empty />
      )}
    </Modal>
  );
};

export default KhoVoucher;
