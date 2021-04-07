import { Modal } from "antd";
import React from "react";
import { connectModal } from "redux-modal";

export const BetModal = connectModal({
  name: "bet",
  destroyOnHide: true,
  getModalState: state => state.get("modal")
})(({ show }) => {
  return (
    <Modal centered={true} footer={null} title="Bet" visible={show}>
      asdadad
    </Modal>
  );
});
