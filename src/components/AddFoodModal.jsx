import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

function AddFoodModal({ isOpen, onClose, onAdd, categories }) {
    const { t } = useLanguage();
    const [name, setName] = useState('');
    const [category, setCategory] = useState('vegetables');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onAdd(name.trim(), category);
            setName('');
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{t('addFoodTitle')}</h2>
                    <button className="close-button" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="food-name">{t('foodName')}</label>
                        <input
                            id="food-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Dragon Fruit"
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="food-category">{t('category')}</label>
                        <select
                            id="food-category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            {Object.entries(categories).map(([key, data]) => (
                                <option key={key} value={key}>
                                    {t(data.label || key)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="submit-button">
                        <Plus size={20} />
                        {t('addFood')}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddFoodModal;
