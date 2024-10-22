import request from "../utils/request";
import { DataParams, TableParams } from "../interfaces/diaChi.type";
import { requestDC } from "~/utils/requestDiaChi";

export const fetchData = async (params: TableParams) => {
  const doiMK = localStorage.getItem("acountId");
  try {
    const res = await requestDC.get(`/dia-chi?taiKhoanId=${doiMK}`, {
      params, // Chỉ gửi params thay vì { params: { params } }
    });
    // console.log("ThanhPho", res.data.content.map((item) => item.thanhPho));
    // console.log("QuanHuyen", res.data.content.map((item) => item.quanHuyen));
    // console.log("PhuongXa", res.data.content.map((item) => item.phuongXa));
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getOneUser = async (id: number) => {
  try {
    const res = await requestDC.get("dia-chi/edit" + id);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
