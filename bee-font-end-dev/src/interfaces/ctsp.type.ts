export interface DataType {
  id: number;
  key: string;
  soLuong: number;
  giaTien: number;
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
}
