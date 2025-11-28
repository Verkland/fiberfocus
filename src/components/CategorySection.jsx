import React from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const CategorySection = ({ title, items, color, checkedFoods, onToggle }) => {
    const { t, language } = useLanguage();
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <section className="category-section" style={{ '--category-color': color }}>
            <div
                className="category-header"
                onClick={() => setIsOpen(!isOpen)}
                style={{ cursor: 'pointer' }}
            >
                <div className="category-title-group">
                    {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    <h2>{t(title)}</h2>
                </div>
                <div className="category-info-group">
                    {!isOpen && <span className="category-hint">{t('clickToExpand')}</span>}
                    <span className="category-progress">
                        {items.filter(item => checkedFoods.has(item.id)).length} / {items.length}
                    </span>
                </div>
            </div>
            {isOpen && (
                <div className="food-grid">
                    {items.map((item) => {
                        if (!item || !item.id) return null;
                        const isChecked = checkedFoods.has(item.id);
                        return (
                            <label
                                key={item.id}
                                className={`food-item ${isChecked ? 'checked' : ''}`}
                                style={{ '--item-color': color }}
                            >
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => onToggle(item.id)}
                                />
                                <div className="checkmark">
                                    {isChecked && <Check size={16} />}
                                </div>
                                <span className="food-name">{item.name?.[language] || item.id}</span>
                            </label>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default CategorySection;
