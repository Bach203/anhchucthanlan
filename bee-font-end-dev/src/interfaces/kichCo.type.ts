export interface DataType {
  id: number;
  kichCo: number;
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
  searchText?: string;
  trangThai?: string;
  sortField?: string;
  sortOrder?: string;
}

export interface CreatedRequest {
  kichCo: number;
}
export interface UpdatedRequest {
  kichCo: number;
  trangThai: boolean;
}
