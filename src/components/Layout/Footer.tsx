import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>财经英语学习</h4>
            <p>专业的财经英语词汇学习平台</p>
          </div>
          
          <div className="footer-section">
            <h4>功能</h4>
            <ul>
              <li>词汇学习</li>
              <li>进度跟踪</li>
              <li>收藏管理</li>
              <li>学习统计</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>关于</h4>
            <ul>
              <li>使用帮助</li>
              <li>反馈建议</li>
              <li>版本信息</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} 财经英语学习平台. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;