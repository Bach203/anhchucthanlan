export interface DataTypeGiaoDich {
  id: number;
  ma: string;
  soTienGiaoDich: number;
  ngayTao: string;
  ngaySua: string;
  trangThaiGiaoDich: {
    ten: string;
    moTa: string;
    mauSac: string;
  };
  hoaDon: {
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
  phuongThucThanhToan: {
    id: number;
    ma: string;
    ten: string;
    ngayTao: string;
    ngaySua: string;
    trangThai: {
      ten: string;
      mota: string;
      mauSac: string;
    };
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
  ten: string;
}
export interface UpdatedRequest {
  ten: string;
  trangThai: boolean;
}
