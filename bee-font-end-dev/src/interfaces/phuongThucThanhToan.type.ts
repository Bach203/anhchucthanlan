export interface DataTypePhuongThucThanhToan {
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
  