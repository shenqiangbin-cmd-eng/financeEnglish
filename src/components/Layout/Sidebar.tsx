import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useVocabularies, useLearningStats } from '../../contexts/AppContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const vocabularies = useVocabularies();
  const stats = useLearningStats();

  const isActive = (path: string) => {
    return location.pathname === path ? 'nav-item active' : 'nav-item';
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul className="nav-list">
          <li className={isActive('/')}>
            <Link to="/" className="nav-link">
              <span className="nav-icon">🏠</span>
              <span className="nav-text">首页</span>
            </Link>
          </li>
          
          <li className={isActive('/learn')}>
            <Link to="/learn" className="nav-link">
              <span className="nav-icon">📚</span>
              <span className="nav-text">学习</span>
            </Link>
          </li>
          
          <li className={isActive('/progress')}>
            <Link to="/progress" className="nav-link">
              <span className="nav-icon">📊</span>
              <span className="nav-text">进度</span>
            </Link>
          </li>
          
          <li className={isActive('/collections')}>
            <Link to="/collections" className="nav-link">
              <span className="nav-icon">⭐</span>
              <span className="nav-text">收藏</span>
            </Link>
          </li>
          
          <li className={isActive('/settings')}>
            <Link to="/settings" className="nav-link">
              <span className="nav-icon">⚙️</span>
              <span className="nav-text">设置</span>
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="sidebar-stats">
        <h3>学习统计</h3>
        <div className="stat-item">
          <span className="stat-label">总词汇数:</span>
          <span className="stat-value">{vocabularies.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">已学习:</span>
          <span className="stat-value">{stats.overall.totalWordsLearned}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">连续天数:</span>
          <span className="stat-value">{stats.overall.currentStreak}</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;