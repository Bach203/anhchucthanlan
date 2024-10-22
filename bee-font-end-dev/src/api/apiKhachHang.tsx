import request from "../utils/request";
import { DataParams, TableParams } from "../interfaces/khachHang.type";

export const fetchData = async (params: TableParams) => {
  try {
    const res = await request.get("khach-hang", {
      params  // Chỉ gửi params thay vì { params: { params } }
      
    });
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getOneUser = async (id: number) => {
  try {
    const res = await request.get("khach-hang/" + id);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
