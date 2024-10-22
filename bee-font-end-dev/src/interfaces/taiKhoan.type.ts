import type { TablePaginationConfig } from "antd/es/table";
import type { FilterValue } from "antd/es/table/interface";

export interface DataType {
  id: number;
  hoVaTen: string;
  canCuocCongDan: string;
  ngaySinh: string | undefined;
  gioiTinh: {
    ten: string;
    moTa: string;
    mauSac: string;
  };
  soDienThoai: string;
  email: string;
  thanhPho: string;
  quanHuyen: string;
  phuongXa: string;
  diaChiCuThe: string;
  anhDaiDien: string;
  matKhau: string;
  ngayTao: string;
  ngaySua: string;
  trangThai: {
    ten: string;
    mota: string;
    mauSac: string;
  };
}

export interface Sorter {
  field: string;
  order: "ascend" | "descend";
}

export interface DataParams {
  currentPage: number;
  pageSize: number;
  searchText: string;
  filterStatus: string;
  filterGender: string;
  sorter: string;
  sortOrder: string;
}

export interface TableParams {
  pagination?: TablePaginationConfig;
  searchText?: string;
  trangThai?: string;
  gioiTinh?: string;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}
export interface DescriptionItemProps {
  title?: string;
  content?: React.ReactNode;
  children?: React.ReactNode;
}
export interface QuenMatKhauRequest {
  email: String;
}
export interface DangNhapRequest {
  email: String;
  password:String;
}
export interface DoiMatKhauRequest {
  id: number;
  matKhauCu:String;
  matKhauMoi:String;
  nhapLaiMatKhau:String;
}
