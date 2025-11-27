import React from 'react';
import { Search, Menu, Settings, Calendar, Moon, Sun, RotateCcw, X, Target, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Header = ({ checkedCount, totalGoal = 30, onReset, searchQuery, setSearchQuery, onOpenManage, onOpenHistory, onOpenGoal }) => {
    const { t, language, setLanguage } = useLanguage();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const menuRef = React.useRef(null);

    const [isDarkMode, setIsDarkMode] = React.useState(() => {
        return localStorage.getItem('fiberFocus_theme') === 'dark';
    });

    React.useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('fiberFocus_theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('fiberFocus_theme', 'light');
        }
    }, [isDarkMode]);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };
    const progress = Math.min((checkedCount / totalGoal) * 100, 100);
    const isGoalReached = checkedCount >= totalGoal;

    return (
        <header className="app-header">
            <div className="header-top">
                <div className="header-content">
                    <h1>{t('appTitle')}</h1>
                    <p className="subtitle">{t('subtitle', { goal: totalGoal })}</p>
                </div>
                <div className="header-actions" ref={menuRef}>
                    <button
                        className="menu-button"
                        onClick={onReset}
                        title={t('resetWeek')}
                        style={{ marginRight: '0.5rem', color: '#e74c3c' }}
                    >
                        <RotateCcw size={24} />
                    </button>
                    <button
                        className="menu-button"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        title="Menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {isMenuOpen && (
                        <div className="header-menu-dropdown">
                            <button className="menu-item" onClick={() => { toggleTheme(); setIsMenuOpen(false); }}>
                                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                                <span>{isDarkMode ? t('lightMode') : t('darkMode')}</span>
                            </button>
                            <button className="menu-item" onClick={() => {
                                setLanguage(language === 'en' ? 'no' : 'en');
                                setIsMenuOpen(false);
                            }}>
                                <Globe size={18} />
                                <span>{language === 'en' ? 'Norsk' : 'English'}</span>
                            </button>
                            <button className="menu-item" onClick={() => { onOpenGoal(); setIsMenuOpen(false); }}>
                                <Target size={18} />
                                <span>{t('changeGoal')}</span>
                            </button>
                            <button className="menu-item" onClick={() => { onOpenHistory(); setIsMenuOpen(false); }}>
                                <Calendar size={18} />
                                <span>{t('history')}</span>
                            </button>
                            <button className="menu-item" onClick={() => { onOpenManage(); setIsMenuOpen(false); }}>
                                <Settings size={18} />
                                <span>{t('manageFoods')}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="progress-container">
                <div className="progress-stats">
                    <span className="count">{checkedCount}</span>
                    <span className="goal">/ {totalGoal}</span>
                </div>
                <div className="progress-bar-bg">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                {isGoalReached && (
                    <div className="goal-badge">
                        <span>{t('goalReached')}</span>
                        <span>🎉</span>
                    </div>
                )}
            </div>

            <div className="search-container">
                <Search className="search-icon" size={20} />
                <input
                    type="text"
                    className="search-input"
                    placeholder={t('searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </header>
    );
};

export default Header;
