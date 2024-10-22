import ImgCrop from "antd-img-crop";
import React, { useState, useEffect } from "react";
import { Modal, Spin, Upload, message } from "antd";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import request from "~/utils/request"; // Ensure this imports your request utility
import { PictureOutlined, PlusOutlined } from "@ant-design/icons";

function HinhAnhModal({ openModal, closeModal, mauSac, sanPham }) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]); // State to hold the URLs of uploaded images

  useEffect(() => {
    if (openModal) {
      // Load existing images if necessary when the modal opens
    }
  }, [openModal, mauSac]);

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    // Update file list, filter out any files that are not successful uploads
    setFileList(newFileList.filter((file) => file.status !== "error"));
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const onRemove = (file: UploadFile) => {
    setFileList(fileList.filter((item) => item.uid !== file.uid)); // Remove the file from the list
  };

  const handleCancel = () => {
    setPreviewOpen(false);
  };

  const okModal = async () => {
    if (fileList.length > 0) {
      setLoading(true);
      try {
        // Create FormData to hold the files
        const formData = new FormData();
        fileList.forEach((file) => {
          formData.append("files", file.originFileObj); // Append the file to the FormData
        });

        // Upload files to the server
        const response = await request.post("hinh-anh-san-pham", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200) {
          const uploadedUrls = response.data.map((item) => item.url); // Assuming the server returns the uploaded file URLs
          setUploadedImageUrls(uploadedUrls); // Store URLs in state
          message.success("Đã lưu ảnh thành công");
          closeModal(); // Close the modal
        } else {
          message.error("Lưu ảnh thất bại");
        }
      } catch (error) {
        message.error("Đã xảy ra lỗi khi lưu ảnh");
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      message.warning("Vui lòng tải ảnh lên để thêm");
    }
  };

  return (
    <Spin spinning={loading}>
      <Modal
        title={`HÌNH ẢNH SẢN PHẨM`}
        open={openModal}
        onCancel={closeModal}
        okText={
          <span>
            <PictureOutlined style={{ marginRight: 5 }} />
            THÊM ẢNH
          </span>
        }
        cancelText="Hủy"
        onOk={okModal}
        width={600}
      >
        <ImgCrop rotationSlider>
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={onChange}
            onPreview={handlePreview}
            onRemove={onRemove}
            accept=".png,.jpg,.gif"
          >
            {fileList.length >= 5 ? null : (
              <div>
                <PlusOutlined style={{ fontSize: 20 }} />
                <div style={{ marginTop: 5 }}>Tải ảnh lên</div>
              </div>
            )}
          </Upload>
        </ImgCrop>
        <Modal
          width={617}
          style={{ top: 20 }}
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </Modal>
    </Spin>
  );
}

export default HinhAnhModal;
