import type { TablePaginationConfig } from "antd/es/table";
import type { FilterValue } from "antd/es/table/interface";

export interface DataType {
  id: number;
  hoVaTen: string;
  soDienThoai: string;
  thanhPho: number;
  quanHuyen: number;
  phuongXa: number;
  diaChiCuThe: string;
  loaiDiaChi: {
    ten: string;
    mota: string;
    mauSac: string;
  };
  ngayTao: string;
  ngaySua: string;
  trangThaiDiaChi: {
    ten: string;
    mota: string;
    mauSac: string;
  };
  email: string;
}
export interface UpdatedRequest {
  hoVaTen: string;
  soDienThoai: string;
  thanhPho: number;
  quanHuyen: number;
  phuongXa: string;
  diaChiCuThe: string;
  loaiDiaChi: {
    ten: string;
    mota: string;
    mauSac: string;
  };
  ngayTao: string;
  ngaySua: string;
  trangThaiDiaChi: {
    ten: string;
    mota: string;
    mauSac: string;
  };
  email: string;
  taiKhoan:{id:number};
}
export interface ResponseDiaChi {
  diaChi: DataType;
}

export interface Sorter {
  field: string;
  order: "ascend" | "descend";
}

export interface DataParams {
  currentPage: number;
  pageSize: number;
  searchText: string;
  loaiDiaChi: string;
  sorter: string;
  sortOrder: string;
}

export interface TableParams {
  pagination?: TablePaginationConfig;
  searchText?: string;
  trangThaiDiaChi?: string;
  loaiDiaChi?: string;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}
export interface DescriptionItemProps {
  title?: string;
  content?: React.ReactNode;
  children?: React.ReactNode;
}
