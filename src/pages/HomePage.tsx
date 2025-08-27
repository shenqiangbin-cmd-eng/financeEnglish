import React from 'react';
import { Link } from 'react-router-dom';
import { useVocabularies, useLearningStats, useCurrentUser } from '../contexts/AppContext';
import { Card, Button } from '../components/UI';
import './HomePage.css';

const HomePage: React.FC = () => {
  const user = useCurrentUser();
  const vocabularies = useVocabularies();
  const stats = useLearningStats();

  return (
    <div className="home-page">
      <div className="welcome-section">
        <h1>欢迎来到财经英语学习平台</h1>
        <p className="welcome-text">
          {user ? `欢迎回来，用户${user.id}！` : '开始您的财经英语学习之旅'}
        </p>
      </div>

      <div className="stats-overview">
        <Card variant="elevated" padding="medium" className="stat-card">
          <h3>词汇总数</h3>
          <div className="stat-number">{vocabularies.length}</div>
          <p>可学习的财经词汇</p>
        </Card>
        
        <Card variant="elevated" padding="medium" className="stat-card">
          <h3>已学习</h3>
          <div className="stat-number">{stats.overall.totalWordsLearned}</div>
          <p>已掌握的词汇数量</p>
        </Card>
        
        <Card variant="elevated" padding="medium" className="stat-card">
          <h3>学习天数</h3>
          <div className="stat-number">{stats.overall.currentStreak}</div>
          <p>连续学习天数</p>
        </Card>
        
        <Card variant="elevated" padding="medium" className="stat-card">
          <h3>准确率</h3>
          <div className="stat-number">{Math.round(stats.overall.averageAccuracy * 100)}%</div>
          <p>平均答题准确率</p>
        </Card>
      </div>

      <div className="quick-actions">
        <h2>快速开始</h2>
        <div className="action-cards">
          <Card variant="outlined" padding="medium" hoverable className="action-card">
            <div className="action-icon">📚</div>
            <h3>开始学习</h3>
            <p>学习新的财经词汇</p>
            <div className="action-button">
              <Button variant="primary" size="medium">
                <Link to="/vocabulary-learning" style={{ color: 'inherit', textDecoration: 'none' }}>开始学习</Link>
              </Button>
            </div>
          </Card>
          
          <Card variant="outlined" padding="medium" hoverable className="action-card">
            <div className="action-icon">📊</div>
            <h3>查看进度</h3>
            <p>了解您的学习进展</p>
            <div className="action-button">
              <Button variant="outline" size="medium">
                <Link to="/progress" style={{ color: 'inherit', textDecoration: 'none' }}>查看进度</Link>
              </Button>
            </div>
          </Card>
          
          <Card variant="outlined" padding="medium" hoverable className="action-card">
            <div className="action-icon">⭐</div>
            <h3>我的收藏</h3>
            <p>管理收藏的词汇</p>
            <div className="action-button">
              <Button variant="outline" size="medium">
                <Link to="/collections" style={{ color: 'inherit', textDecoration: 'none' }}>我的收藏</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <div className="recent-activity">
        <h2>最近学习</h2>
        {stats.daily.length > 0 ? (
          <div className="activity-list">
            {stats.daily.slice(-5).map((day, index) => (
              <Card key={day.date} variant="default" padding="medium" className="activity-item">
                <div className="activity-date">{day.date}</div>
                <div className="activity-stats">
                  <span>新学: {day.newWordsLearned}</span>
                  <span>复习: {day.wordsReviewed}</span>
                  <span>时长: {Math.round(day.studyTimeMinutes)}分钟</span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card variant="outlined" padding="large" className="no-activity">
            <p>还没有学习记录，开始您的第一次学习吧！</p>
            <div style={{ marginTop: '16px' }}>
              <Button variant="primary" size="medium">
                <Link to="/vocabulary-learning" style={{ color: 'inherit', textDecoration: 'none' }}>开始学习</Link>
              </Button>
            </div>
          </Card>
        )}
      </div>


    </div>
  );
};

export { HomePage };
export default HomePage;