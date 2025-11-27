import { useState, useEffect } from 'react';
import { X, Target } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

function EditGoalModal({ isOpen, onClose, currentGoal, onSave }) {
    const { t } = useLanguage();
    const [goal, setGoal] = useState(currentGoal);

    useEffect(() => {
        setGoal(currentGoal);
    }, [currentGoal, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const newGoal = parseInt(goal, 10);
        if (newGoal > 0) {
            onSave(newGoal);
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{t('setGoalTitle')}</h2>
                    <button className="close-button" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="goal-input">{t('targetPlants')}</label>
                        <div style={{ position: 'relative' }}>
                            <Target className="search-icon" size={20} style={{ left: '1rem', color: 'var(--color-primary)' }} />
                            <input
                                id="goal-input"
                                type="number"
                                min="1"
                                max="100"
                                value={goal}
                                onChange={(e) => setGoal(e.target.value)}
                                style={{ paddingLeft: '3rem' }}
                                autoFocus
                            />
                        </div>
                        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-light)' }}>
                            {t('goalRecommendation')}
                        </p>
                    </div>

                    <button type="submit" className="submit-button">
                        {t('saveGoal')}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditGoalModal;
