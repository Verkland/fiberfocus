import React from 'react';
import { Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const CategorySection = ({ title, items, color, checkedFoods, onToggle }) => {
    const { t, language } = useLanguage();

    return (
        <section className="category-section" style={{ '--category-color': color }}>
            <div className="category-header">
                <div className="category-title-group">
                    <h2>{t(title)}</h2>
                </div>
                <span className="category-progress">
                    {items.filter(item => checkedFoods.has(item.id)).length} / {items.length}
                </span>
            </div>
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
        </section>
    );
};

export default CategorySection;
