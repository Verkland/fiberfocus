import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText, isDangerous }) {
    const { t } = useLanguage();
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content confirmation-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{title}</h2>
                </div>

                <div className="confirmation-body">
                    {isDangerous && <AlertTriangle className="warning-icon" size={48} />}
                    <p>{message}</p>
                </div>

                <div className="confirmation-actions">
                    <button className="cancel-button" onClick={onClose}>
                        {t('cancel')}
                    </button>
                    <button
                        className={`confirm-button ${isDangerous ? 'danger' : ''}`}
                        onClick={onConfirm}
                    >
                        {confirmText || t('resetConfirm')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModal;
