import React from 'react';
import EnquiryModal from './EnquiryModal';

export default function ConsultationModal({ isOpen, onClose, defaultService }) {
  return (
    <EnquiryModal
      isOpen={isOpen}
      onClose={onClose}
      preselectedService={defaultService}
    />
  );
}

