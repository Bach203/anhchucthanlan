import { Modal, Input, Button } from "antd";
import React, { useState } from "react";
import { UpdatedRequest } from "~/interfaces/hoaDon.type";

interface ConfirmHoaDonGhiChuProps {
  open: boolean;
  onUpdate: (
    values: UpdatedRequest | null,
    status: any,
    title: string,
    ghiChuTimeLine: string
  ) => void;
  onCancel: () => void;
  updateRequest: UpdatedRequest | null;
  status: any;
  titleStatus: string;
}
const ConfirmHoaDonComponent: React.FC<ConfirmHoaDonGhiChuProps> = ({
  open,
  onUpdate,
  onCancel,
  updateRequest,
  status,
  titleStatus,
}) => {
  const [ghiChuTimeLine, setGhiChuTimeLine] = useState("");
  const [visible, setVisible] = React.useState(false);

  const handleOk = async () => {
    try {
      onUpdate(updateRequest, status, titleStatus, ghiChuTimeLine);
    } catch (info) {
      console.log("Validate Failed:", info);
    }
  };

  React.useEffect(() => {
    setVisible(open);
  }, [open]);

  const closeModal = () => {
    setGhiChuTimeLine("");
    onCancel();
  };

  return (
    <Modal
      title={"Ghi chú"}
      open={visible}
      onCancel={closeModal}
      okText="Xong"
      cancelText="Hủy"
      onOk={() => {
        handleOk();
        setGhiChuTimeLine("");
        // onCancel();
      }}
    >
      <Input.TextArea
        showCount
        style={{ width: "100%", height: 100, resize: "none" }}
        maxLength={200}
        value={ghiChuTimeLine}
        onChange={(e) => setGhiChuTimeLine(e.target.value)}
      />
      <Button type="link"></Button>
    </Modal>
  );
};

export default ConfirmHoaDonComponent;
