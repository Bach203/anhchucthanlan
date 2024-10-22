import { Routes, Route } from "react-router-dom";
import IndexNhanVien from "./pages/admin/nhan-vien/index";
import IndexKhachHang from "./pages/admin/khach-hang/index";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import AddNV from "./pages/admin/nhan-vien/add";
import UpdateNhanVien from "./pages/admin/nhan-vien/update";
import IndexMauSac from "./pages/admin/mau-sac/index";
import AddMauSac from "./pages/admin/mau-sac/add";
import UpdateMauSac from "./pages/admin/mau-sac/update";
import IndexSanPham from "./pages/admin/san-pham/index";
import AddSanPham from "./pages/admin/san-pham/AddSanPham.tsx";
import IndexThuongHieu from "./pages/admin/thuong-hieu/index";
import AddThuongHieu from "./pages/admin/thuong-hieu/add";
import UpdateThuongHieu from "./pages/admin/thuong-hieu/update";
import IndexDiaHinhSan from "./pages/admin/dia-hinh-san/index";
import AddDiaHinhSan from "./pages/admin/dia-hinh-san/add";
import UpdateDiaHinhSan from "./pages/admin/dia-hinh-san/update";
import IndexLoaiDe from "./pages/admin/loai-de/index";
import AddLoaiDe from "./pages/admin/loai-de/add";
import UpdateLoaiDe from "./pages/admin/loai-de/update";
import "./App.css";
import ShopLayout from "./layouts/ShopLayout/ShopLayout";
import Home from "./pages/shop/home/Home";
import GioHang from "./pages/shop/gio-hang/GioHang";
import IndexVoucher from "./pages/admin/voucher/index";
import AddVoucher from "./pages/admin/voucher/addVoucher.tsx";
import UpdateVoucher from "./pages/admin/voucher/updateVoucher.tsx";
import Signin from "./pages/login/sign-in/Signin";
import Signup from "./pages/login/sign-up/Singup";
import Forgotpassword from "./pages/login/forgot-password/Forgotpassword";
import AddKH from "./pages/admin/khach-hang/add";
import UpdateKhachHang from "./pages/admin/khach-hang/update";
import IndexHoaDon from "./pages/admin/hoa-don";
import IndexKichCo from "./pages/admin/kich-co";
import AddKichCo from "./pages/admin/kich-co/add";
import UpdateKichCo from "./pages/admin/kich-co/update";
import DetailHoaDon from "./pages/admin/hoa-don/detailHoaDon";
import DetailSanPham from "./pages/shop/san-pham/detail";
import BanHangTaiQuay from "./pages/admin/ban-hang-tai-quay/BanHangTaiQuay.tsx";
import UpdateSanPham from "./pages/admin/san-pham/UpdateSanPham.tsx";
import ProtectedRoute1 from "./pages/admin/component/ProtectedRoute1.tsx";
import SanPham from "./pages/shop/san-pham/SanPham.tsx";
import ThongKe from "./pages/admin/thong-ke/ThongKe.tsx";
import ProtectedRoute from "./pages/admin/component/ProtextedRoute.tsx";
import DonHangCuaToi from "./pages/shop/don-hang-cua-toi/DonHangCuaToi.tsx";
import ThongTinDonHang from "./pages/shop/don-hang-cua-toi/ThongTinDonHang.tsx";
import ProtectedKH from "./pages/admin/component/AuthContext.tsx";
import DoiMatKhau from "./pages/login/doi-mat-khau/DoiMatKhau.tsx";
import UpdateTT from "./pages/login/thong-tin/ThongTin.tsx";
import AddDCKh from "./pages/login/dia-chi-khach-hang/DiaChiMoi.tsx";

function App() {
  return (
    <Routes>
      <Route path="/sign-in" element={<Signin />} />
      <Route path="/sign-up" element={<Signup />} />
      <Route path="/forgot-password" element={<Forgotpassword />} />
      <Route path="/doi-mat-khau" element={<ProtectedKH element={<DoiMatKhau />} />} />
      <Route path="/them-dia-chi" element={<ProtectedKH element={<AddDCKh />} />} />
      <Route path="/thong-tin" element={<ProtectedKH element={<UpdateTT />} />} />
      <Route path="" element={<ShopLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/san-pham" element={<SanPham />} />
        <Route path="/gio-hang" element={<GioHang />} />
        <Route path="/san-pham/detail/:id" element={<DetailSanPham />} />
        <Route path="/don-hang" element={<DonHangCuaToi />} />
        <Route path="/thong-tin-don-hang" element={<ThongTinDonHang />} />
      </Route>
      <Route
        path="/admin/*"
        element={<ProtectedRoute element={<AdminLayout />} />}
      >
        <Route
          path="nhan-vien"
          element={<ProtectedRoute1 element={<IndexNhanVien />} />}
        />
        <Route path="ban-hang-tai-quay" element={<BanHangTaiQuay />} />
        <Route path="nhan-vien/add" element={<AddNV />} />
        <Route path="nhan-vien/edit/:id" element={<UpdateNhanVien />} />
        <Route path="mau-sac" element={<IndexMauSac />} />
        <Route path="mau-sac/add" element={<AddMauSac />} />
        <Route path="mau-sac/update/:id" element={<UpdateMauSac />} />
        <Route path="san-pham" element={<IndexSanPham />} />
        <Route path="san-pham/add" element={<AddSanPham />} />
        <Route path="san-pham/update/:id" element={<UpdateSanPham />} />
        <Route path="thuong-hieu" element={<IndexThuongHieu />} />
        <Route path="thuong-hieu/add" element={<AddThuongHieu />} />
        <Route path="thuong-hieu/update/:id" element={<UpdateThuongHieu />} />
        <Route path="dia-hinh-san" element={<IndexDiaHinhSan />} />
        <Route path="dia-hinh-san/add" element={<AddDiaHinhSan />} />
        <Route path="dia-hinh-san/update/:id" element={<UpdateDiaHinhSan />} />
        <Route path="loai-de" element={<IndexLoaiDe />} />
        <Route path="loai-de/add" element={<AddLoaiDe />} />
        <Route path="loai-de/update/:id" element={<UpdateLoaiDe />} />
        <Route
          path="voucher"
          element={<ProtectedRoute1 element={<IndexVoucher />} />}
        />
        <Route path="voucher/add" element={<AddVoucher />} />
        <Route path="voucher/:id" element={<UpdateVoucher />} />
        <Route path="hoa-don" element={<IndexHoaDon />} />
        <Route path="kich-co" element={<IndexKichCo />} />
        <Route path="kich-co/add" element={<AddKichCo />} />
        <Route path="kich-co/update/:id" element={<UpdateKichCo />} />
        <Route path="hoa-don/:id" element={<DetailHoaDon />} />
        <Route path="khach-hang" element={<IndexKhachHang />} />
        <Route path="khach-hang/add" element={<AddKH />} />
        <Route path="khach-hang/edit/:id" element={<UpdateKhachHang />} />
        <Route path="voucher/update/:id" element={<UpdateVoucher />} />
        <Route
          path="thong-ke"
          element={<ProtectedRoute1 element={<ThongKe />} />}
        />
      </Route>
    </Routes>
  );
}

export default App;
