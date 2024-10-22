import { Image } from "antd";
import React, { useState, useEffect } from "react";
import request from "~/utils/request";
// other imports...

const HinhAnhSanPham = ({ chiTietSanPham }) => {
  const [imageSrc, setImageSrc] = useState("");

  const hinhAnh = async (idSanPham, idMauSac) => {
    try {
      const res = await request.get("hinh-anh-san-pham", {
        params: {
          idSanPham: idSanPham,
          idMauSac: idMauSac,
        },
      });
      setImageSrc(res.data[0].duongDan);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (chiTietSanPham) {
      hinhAnh(chiTietSanPham.sanPham.id, chiTietSanPham.mauSac.id);
    }
  }, [chiTietSanPham]);

  return (
    <Image
      width={80}
      height={80}
      src={
        imageSrc ? `http://localhost:8081/admin/api/file/view/${imageSrc}` : ""
      }
      fallback="http://localhost:8081/admin/api/file/view/fallback.jpg"
    />
  );
};

export default HinhAnhSanPham;
