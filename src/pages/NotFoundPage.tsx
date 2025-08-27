import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const pageStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    textAlign: 'center'
  };
  
  const h1Style: React.CSSProperties = {
    fontSize: '72px',
    color: '#1976d2',
    margin: 0,
    fontWeight: 'bold'
  };
  
  const h2Style: React.CSSProperties = {
    fontSize: '24px',
    color: '#333',
    margin: '16px 0'
  };
  
  const pStyle: React.CSSProperties = {
    color: '#666',
    marginBottom: '32px',
    fontSize: '16px'
  };
  
  const btnStyle: React.CSSProperties = {
    display: 'inline-block',
    backgroundColor: '#1976d2',
    color: 'white',
    textDecoration: 'none',
    padding: '12px 24px',
    borderRadius: '6px',
    fontWeight: 500,
    transition: 'background-color 0.2s'
  };

  return (
    <div style={pageStyle}>
      <div>
        <h1 style={h1Style}>404</h1>
        <h2 style={h2Style}>页面未找到</h2>
        <p style={pStyle}>抱歉，您访问的页面不存在。</p>
        <Link to="/" style={btnStyle}>
          返回首页
        </Link>
      </div>
    </div>
  );
};

export { NotFoundPage };
export default NotFoundPage;