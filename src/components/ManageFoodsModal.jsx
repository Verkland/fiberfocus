import { useState } from 'react';
import { X, Trash2, Edit2, Check, X as XIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

function ManageFoodsModal({ isOpen, onClose, customFoods, onDelete, onEdit }) {
  const { t, language } = useLanguage();
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  if (!isOpen) return null;

  const startEdit = (food) => {
    setEditingId(food.id);
    setEditName(food.name[language]);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const handleSaveEdit = (category, foodId) => {
    if (editName.trim()) {
      onEdit(category, foodId, editName.trim());
      setEditingId(null);
      setEditName('');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('manageTitle')}</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="custom-foods-list">
          <h3>{t('yourCustomFoods')}</h3>

          {Object.keys(customFoods).length === 0 ? (
            <p className="no-data">{t('noCustomFoods')}</p>
          ) : (
            Object.entries(customFoods).map(([category, foods]) => (
              <div key={category} className="manage-category">
                <h4>{t(category)}</h4>
                <ul>
                  {foods.map((food) => (
                    <li key={food.id} className="manage-food-item">
                      {editingId === food.id ? (
                        <div className="edit-food-input">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            autoFocus
                          />
                          <button onClick={() => handleSaveEdit(category, food.id)} className="icon-button save">
                            <Check size={16} />
                          </button>
                          <button onClick={cancelEdit} className="icon-button cancel">
                            <XIcon size={16} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span>{food.name[language]}</span>
                          <div className="item-actions">
                            <button onClick={() => startEdit(food)} className="icon-button edit">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => onDelete(category, food.id)} className="icon-button delete">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageFoodsModal;
