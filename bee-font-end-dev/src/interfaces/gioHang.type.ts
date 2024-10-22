export interface DataType {
  id: number;
  ten: string;
  ngayTao: string;
  ngaySua: string;
  trangThai: {
    ten: string;
    mota: string;
    mauSac: string;
  };
}

export interface DataParams {
  idMauSac?: string;
  idKichCo?: string;
  idLoaiDe?: string;
  idDiaHinhSan?: string;
}
