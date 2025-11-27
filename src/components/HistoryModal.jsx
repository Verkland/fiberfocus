import React from 'react';
import { X, Calendar, Trophy } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

function HistoryModal({ isOpen, onClose, history }) {
    const { t } = useLanguage();
    if (!isOpen) return null;

    // Sort history by date descending
    const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content history-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{t('historyTitle')}</h2>
                    <button className="close-button" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                {sortedHistory.length === 0 ? (
                    <div className="empty-state">
                        <Calendar size={48} className="empty-icon" />
                        <p>{t('noHistory')}</p>
                    </div>
                ) : (
                    <div className="history-list">
                        {sortedHistory.map((entry, index) => (
                            <div key={index} className="history-item">
                                <div className="history-info">
                                    <span className="history-date">{entry.date}</span>
                                    <span className="history-score">
                                        {entry.count} / {entry.goal || 30}
                                        {entry.count >= (entry.goal || 30) && <Trophy size={16} className="trophy-icon" />}
                                    </span>
                                </div>
                                <div className="history-bar-bg">
                                    <div
                                        className="history-bar-fill"
                                        style={{
                                            width: `${Math.min((entry.count / (entry.goal || 30)) * 100, 100)}%`,
                                            backgroundColor: entry.count >= (entry.goal || 30) ? 'var(--color-primary)' : 'var(--color-secondary)'
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default HistoryModal;
