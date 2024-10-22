import {
  Card,
  DatePicker,
  DatePickerProps,
  Skeleton,
  Space,
  Typography,
} from "antd";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import request from "~/utils/request";
import UpdateVoucherHoaDon from "./updateVoucherHoaDon";
import UpdateVoucherKhachHang from "./UpdateVoucherKhachHang";
const { Text } = Typography;
export function UpdateVoucher() {
  const [loadingForm, setLoadingForm] = useState(false);
  const [data, setData] = useState([]);
  let { id } = useParams();

  useEffect(() => {
    const getOne = async () => {
      setLoadingForm(true);
      try {
        const res = await request.get("voucher/" + id);
        setData(res.data.voucherChiTietList);
        setLoadingForm(false);
      } catch (error) {
        console.log(error);
        setLoadingForm(false);
      }
    };
    getOne();
  }, []);
  return (
    <>
      <Card title="CẬP NHẬT VOUCHER">
        <Skeleton loading={loadingForm}>
          {data.length === 0 ? (
            <UpdateVoucherHoaDon />
          ) : (
            <UpdateVoucherKhachHang id={id} />
          )}
        </Skeleton>
      </Card>
    </>
  );
}

export default UpdateVoucher;
