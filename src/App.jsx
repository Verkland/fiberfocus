import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Plus } from 'lucide-react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import Header from './components/Header';
import CategorySection from './components/CategorySection';
import AddFoodModal from './components/AddFoodModal';
import ManageFoodsModal from './components/ManageFoodsModal';
import HistoryModal from './components/HistoryModal';
import ConfirmationModal from './components/ConfirmationModal';
import EditGoalModal from './components/EditGoalModal';
import { foodData as initialFoodData } from './data/foodData';

function AppContent() {
  const { t, language } = useLanguage();
  // Load initial state from localStorage
  const [checkedFoods, setCheckedFoods] = useState(() => {
    const saved = localStorage.getItem('fiberFocus_checked');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  // Load custom foods from localStorage
  const [customFoods, setCustomFoods] = useState(() => {
    const saved = localStorage.getItem('fiberFocus_customFoods');
    return saved ? JSON.parse(saved) : {};
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  // Load goal from localStorage
  const [goal, setGoal] = useState(() => {
    const saved = localStorage.getItem('fiberFocus_goal');
    return saved ? parseInt(saved, 10) : 30;
  });

  // Load history from localStorage
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('fiberFocus_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('fiberFocus_checked', JSON.stringify([...checkedFoods]));
  }, [checkedFoods]);

  useEffect(() => {
    localStorage.setItem('fiberFocus_customFoods', JSON.stringify(customFoods));
  }, [customFoods]);

  useEffect(() => {
    localStorage.setItem('fiberFocus_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('fiberFocus_goal', goal.toString());
  }, [goal]);

  const toggleFood = (foodId) => {
    const newChecked = new Set(checkedFoods);
    if (newChecked.has(foodId)) {
      newChecked.delete(foodId);
    } else {
      newChecked.add(foodId);
      // Check if we just hit the goal
      if (newChecked.size === goal) {
        triggerConfetti();
      }
    }
    setCheckedFoods(newChecked);
  };

  const resetWeek = () => {
    setIsResetConfirmOpen(true);
  };

  const confirmReset = () => {
    // Save current week to history
    const today = new Date().toLocaleDateString(language === 'no' ? 'no-NO' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    const newHistoryEntry = {
      date: today,
      count: checkedFoods.size,
      goal: goal
    };

    setHistory(prev => [newHistoryEntry, ...prev]);

    // Reset checked foods
    setCheckedFoods(new Set());
    setIsResetConfirmOpen(false);
  };

  const addCustomFood = (name, category) => {
    // Create a simple ID from the name for custom foods
    const id = `custom_${Date.now()}_${name.toLowerCase().replace(/\s+/g, '_')}`;
    setCustomFoods(prev => ({
      ...prev,
      [category]: [...(prev[category] || []), { id, name: { en: name, no: name } }] // Store as object with ID and localized name (same for both initially)
    }));
    // Automatically check the newly added food
    toggleFood(id);
  };

  const deleteCustomFood = (category, foodId) => {
    setCustomFoods(prev => {
      const newCategoryFoods = prev[category].filter(item => item.id !== foodId);
      const newCustomFoods = { ...prev, [category]: newCategoryFoods };
      if (newCategoryFoods.length === 0) {
        delete newCustomFoods[category];
      }
      return newCustomFoods;
    });
    // Also uncheck it if it was checked
    if (checkedFoods.has(foodId)) {
      const newChecked = new Set(checkedFoods);
      newChecked.delete(foodId);
      setCheckedFoods(newChecked);
    }
  };

  const editCustomFood = (category, foodId, newName) => {
    setCustomFoods(prev => {
      const newCategoryFoods = prev[category].map(item =>
        item.id === foodId ? { ...item, name: { en: newName, no: newName } } : item
      );
      return { ...prev, [category]: newCategoryFoods };
    });
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#27ae60', '#e67e22', '#8e44ad', '#f1c40f', '#d35400']
    });
  };

  // Merge initial data with custom foods
  // Deep copy to avoid mutating initialFoodData
  const allCategories = Object.keys(initialFoodData).reduce((acc, key) => {
    acc[key] = {
      ...initialFoodData[key],
      items: [...initialFoodData[key].items]
    };
    return acc;
  }, {});

  Object.entries(customFoods).forEach(([category, foods]) => {
    if (!allCategories[category]) {
      allCategories[category] = {
        id: category,
        label: category === 'custom' ? 'custom' : category, // Use 'custom' key for translation
        color: '#95a5a6',
        items: []
      };
    }
    // Ensure custom foods are in the correct format (array of objects)
    // Previous custom foods might be strings if loaded from old localStorage
    const formattedFoods = foods.map(f => {
      if (!f) return null;
      if (typeof f === 'string') {
        return { id: f, name: { en: f, no: f } };
      }
      // Handle case where f is object but name is string (intermediate legacy state?)
      if (f && typeof f.name === 'string') {
        return { ...f, name: { en: f.name, no: f.name } };
      }
      return f;
    }).filter(Boolean); // Remove nulls

    allCategories[category].items = [
      ...(allCategories[category].items || []),
      ...formattedFoods
    ];
  });

  // Filter based on search query
  const filteredCategories = Object.entries(allCategories).reduce((acc, [key, category]) => {
    const filteredItems = category.items.filter(item =>
      item.name[language].toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredItems.length > 0) {
      acc[key] = { ...category, items: filteredItems };
    }
    return acc;
  }, {});

  return (
    <div className="app-container">
      <Header
        checkedCount={checkedFoods.size}
        totalGoal={goal}
        onReset={resetWeek}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenManage={() => setIsManageModalOpen(true)}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        onOpenGoal={() => setIsGoalModalOpen(true)}
      />

      <main className="categories-grid">
        {Object.entries(filteredCategories).map(([key, data]) => (
          <CategorySection
            key={key}
            title={data.label}
            items={data.items}
            color={data.color}
            checkedFoods={checkedFoods}
            onToggle={toggleFood}
            searchQuery={searchQuery}
          />
        ))}
      </main>

      <button
        className="fab"
        onClick={() => setIsModalOpen(true)}
        title="Add Custom Food"
      >
        <Plus size={24} />
      </button>

      <AddFoodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addCustomFood}
        categories={allCategories}
      />

      <ManageFoodsModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        customFoods={customFoods}
        onDelete={deleteCustomFood}
        onEdit={editCustomFood}
      />



      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
      />

      <ConfirmationModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={confirmReset}
        title={t('resetTitle')}
        message={t('resetMessage')}
        confirmText={t('resetConfirm')}
        isDangerous={true}
      />

      <EditGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        currentGoal={goal}
        onSave={setGoal}
      />

      <footer className="app-footer">
        <p>{t('appTitle')} &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
