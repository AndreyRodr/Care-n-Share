import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { subscribeToast } from '../utils/toast.js';

// Substitui window.alert por feedback visual consistente com a marca.
const Toaster = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    return subscribeToast((item) => {
      setToasts((prev) => [...prev, item]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== item.id));
      }, 3500);
    });
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-stack">
      {toasts.map((t) => (
        <div key={t.id} className={`toast-item toast-item--${t.type}`} role="status">
          {t.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
};

export default Toaster;
