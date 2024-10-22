export interface DataType {
  id: number;
  ma: string;
  loaiHoaDon: {
    ten: string;
    moTa: string;
    mauSac: string;
  };
  ngayThanhToan: string;
  phiShip: string;
  tongTien: number;
  tongTienKhiGiam: string;
  giamGia: number;
  ghiChu: string;
  nguoiNhan: string;
  sdtNguoiNhan: string;
  ngayShip: string;
  diaChiNguoiNhan: string;
  emailNguoiNhan: string;
  ngayNhan: string;
  ngayMongMuon: string;
  ngayTao: string;
  ngaySua: string;
  nguoiTao: string;
  nguoiSua: string;
  trangThaiHoaDon: {
    ten: string;
    moTa: string;
    mauSac: string;
  };
  taiKhoan: {
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
    ngayTao: string;
    ngaySua: string;
    trangThai: {
      ten: string;
      mota: string;
      mauSac: string;
    };
  };
  ghiChuTimeLine: string;
  idPhuongThuc: number;
}

export interface UpdatedRequest {
  ma: String;
  diaChiNguoiNhan: String;
  phiShip: string;
  loaiHoaDon: {
    ten: string;
    moTa: string;
    mauSac: string;
  };
  trangThaiHoaDon: {
    ten: string;
    moTa: string;
    mauSac: string;
  };
  emailNguoiNhan: string;
  nguoiNhan: string;
  sdtNguoiNhan: string;
  ghiChu: string;
  ghiChuTimeLine: string;
  idPhuongThuc: number;
}

export interface UpdateDiaChiHoaDon {
  thanhPho: number;
  quanHuyen: number;
  phuongXa: number;
  diaChiCuThe: string;
}

export interface Sorter {
  field: string;
  order: "ascend" | "descend";
}

export interface DataParams {
  page: number;
  pageSize: number;
  searchText?: string;
  loaiHoaDon?: string;
  trangThaiHoaDon?: string;
  sortField?: string;
  sortOrder?: string;
}
