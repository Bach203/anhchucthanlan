export interface DataType {
  id: number;
  soLuong: number;
  donGia: number;
  ghiChu: string;
  ngayTao: string;
  ngaySua: string;
  nguoiTao: string;
  nguoiSua: string;
  thanhTien: number;
  trangThaiHoaDonChiTiet: {
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
    tongTien: string;
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
  chiTietSanPham: {
    id: number;
    soLuong: string;
    giaTien: string;
    ngayTao: string;
    ngaySua: string;
    nguoiTao: string;
    nguoiSua: string;
    trangThai: {
      ten: string;
      moTa: string;
      mauSac: string;
    };
    loaiDe: {
      id: number;
      ten: string;
      ngayTao: string;
      ngaySua: string;
      trangThai: {
        ten: string;
        mota: string;
        mauSac: string;
      };
    };
    diaHinhSan: {
      id: number;
      ten: string;
      ngayTao: string;
      ngaySua: string;
      trangThai: {
        ten: string;
        mota: string;
        mauSac: string;
      };
    };
    sanPham: {
      id: number;
      ma: string;
      ten: string;
      ngayTao: string;
      ngaySua: string;
      moTa: string;
      thuongHieu: {
        id: number;
        ten: string;
        ngaySua: string;
        ngayTao: string;
      };
      trangThai: {
        ten: string;
        mota: string;
        mauSac: string;
      };
    };
    mauSac: {
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
    kichCo: {
      id: number;
      kichCo: number;
      ngayTao: string;
      ngaySua: string;
      trangThai: {
        ten: string;
        mota: string;
        mauSac: string;
      };
    };
  };
}

export interface UpdatedRequest {
  ma: String;
}

export interface Sorter {
  field: string;
  order: "ascend" | "descend";
}

export interface DataParams {
  page: number;
  pageSize: number;
  searchText?: string;
  sortField?: string;
  sortOrder?: string;
}
