import React from 'react';
import { AlertTriangle } from 'lucide-react';

// Substitui window.confirm por um modal com a identidade visual da marca.
const ConfirmDialog = ({ title, message, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', onConfirm, onCancel }) => (
  <div className="modal-overlay" style={{ zIndex: 300 }} onClick={onCancel}>
    <div className="confirm-dialog-card" onClick={(e) => e.stopPropagation()}>
      <div className="confirm-dialog-icon">
        <AlertTriangle size={22} />
      </div>
      <h3 className="confirm-dialog-title">{title}</h3>
      <p className="confirm-dialog-message">{message}</p>
      <div className="confirm-dialog-actions">
        <button className="btn-confirm-cancel" onClick={onCancel}>{cancelLabel}</button>
        <button className="btn-confirm-ok" onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </div>
  </div>
);

export default ConfirmDialog;
