export interface DataType {
  id: number;
  ma: string;
  ten: string;
  ngayBatDau: string;
  ngayKetThuc: string;
  hinhThucGiam: {
    id: number;
    ten: string;
    mota: string;
    hinhThucGiam: string;
  };
  giaToiThieu: string;
  giaTriGiam: string;
  giaTriGiamToiDa: string;
  soLuong: number | null;
  ngayTao: string;
  ngaySua: string;
  trangThai: {
    ten: string;
    mota: string;
    mauSac: string;
  };
}

export interface DataParams {
  page: number;
  pageSize: number;
  searchText: string;
  filterStatus: string;
  filterGender: string;
  sorter: string;
  sortOrder: string;
  ngayBatDau?: string;
  ngayKetThuc?: string;
}

export interface CreatedRequest {
  id: number;
  ma: string;
  ten: string;
  ngayBatDau: string;
  ngayKetThuc: string;
  hinhThucGiam: number;
  donToiThieu: number;
  giaTriGiam: number;
  giamToiDa: number;
  dateRange: any;
  soLuong: number | null;
}
export interface UpdatedRequest {
  id: number;
  ma: string;
  ten: string;
  ngayBatDau: string;
  ngayKetThuc: string;
  hinhThucGiam: number;
  donToiThieu: number;
  giaTriGiam: number;
  giamToiDa: number;
  dateRange: any;
  soLuong: number | null;
}
