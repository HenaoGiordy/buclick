import React from 'react';
import { Modal as AntModal } from 'antd';

const Modal = ({ children, open, onClose, modalTitle }) => {
  return (
    <AntModal
      title={modalTitle}
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      style={{
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
      }}
      className="blurred-modal"
    >
      {children}
    </AntModal>
  );
};

export default Modal;
