import React from 'react';

const FoodItem = ({ name, isChecked, onToggle, color }) => {
    return (
        <label
            className={`food-item ${isChecked ? 'checked' : ''}`}
            style={{ '--item-color': color }}
        >
            <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(name)}
            />
            <span className="checkmark">
                {isChecked && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                )}
            </span>
            <span className="food-name">{name}</span>
        </label>
    );
};

export default FoodItem;
