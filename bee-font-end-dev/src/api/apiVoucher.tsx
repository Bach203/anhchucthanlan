import request from "../utils/request";
import { DataParams, TableParams } from "../interfaces/voucher.type";

export const fetchData = async (params: TableParams) => {
  try {
    const res = await request.get("voucher", { params });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getOneUser = async (id: number) => {
  try {
    const res = await request.get("voucher/" + id);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
