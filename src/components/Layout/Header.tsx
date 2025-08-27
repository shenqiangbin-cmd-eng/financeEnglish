import React from 'react';
import { Link } from 'react-router-dom';
import { useAppLoading } from '../../contexts/AppContext';

const Header: React.FC = () => {
  const loading = useAppLoading();

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo">
            <h1>财经英语学习</h1>
          </Link>
        </div>
        
        <nav className="header-nav">
          <Link to="/" className="nav-link">首页</Link>
          <Link to="/learn" className="nav-link">学习</Link>
          <Link to="/progress" className="nav-link">进度</Link>
          <Link to="/collections" className="nav-link">收藏</Link>
          <Link to="/settings" className="nav-link">设置</Link>
        </nav>
        
        <div className="header-right">
          {loading && <div className="loading-indicator">加载中...</div>}
        </div>
      </div>
    </header>
  );
};

export default Header;