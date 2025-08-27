import React from 'react';
import { useLearningStats, useVocabularies } from '../contexts/AppContext';
import { Card } from '../components/UI';
import { financialVocabulary } from '../data/vocabulary';

const ProgressPage: React.FC = () => {
  const stats = useLearningStats();
  const vocabularies = useVocabularies();
  
  const totalVocabularies = financialVocabulary.length;
  const learnedPercentage = totalVocabularies > 0 ? (stats.overall.totalWordsLearned / totalVocabularies) * 100 : 0;
  
  const difficultyStats = {
    beginner: financialVocabulary.filter(v => v.difficulty === 'beginner').length,
    intermediate: financialVocabulary.filter(v => v.difficulty === 'intermediate').length,
    advanced: financialVocabulary.filter(v => v.difficulty === 'advanced').length
  };
  
  const categoryStats = {
    finance: financialVocabulary.filter(v => v.category === 'finance').length,
    economics: financialVocabulary.filter(v => v.category === 'economics').length,
    banking: financialVocabulary.filter(v => v.category === 'banking').length,
    'personal finance': financialVocabulary.filter(v => v.category === 'personal finance').length
  };

  return (
    <div className="progress-page" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="progress-header" style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '10px', color: '#1976d2' }}>学习进度</h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>查看您的学习统计和进度</p>
      </div>

      {/* 总体进度 */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#333' }}>总体进度</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <Card variant="elevated" padding="large">
            <h3 style={{ color: '#1976d2', marginBottom: '10px' }}>学习进度</h3>
            <div style={{ marginBottom: '15px' }}>
              <div style={{ 
                width: '100%', 
                height: '20px', 
                backgroundColor: '#e0e0e0', 
                borderRadius: '10px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${learnedPercentage}%`,
                  height: '100%',
                  backgroundColor: '#4caf50',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
              <p style={{ margin: '10px 0', textAlign: 'center' }}>
                {stats.overall.totalWordsLearned} / {totalVocabularies} 词汇 ({Math.round(learnedPercentage)}%)
              </p>
            </div>
          </Card>
          
          <Card variant="elevated" padding="large">
            <h3 style={{ color: '#1976d2', marginBottom: '10px' }}>连续学习</h3>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ff9800', marginBottom: '10px' }}>
                {stats.overall.currentStreak}
              </div>
              <p style={{ color: '#666' }}>天</p>
            </div>
          </Card>
          
          <Card variant="elevated" padding="large">
            <h3 style={{ color: '#1976d2', marginBottom: '10px' }}>平均准确率</h3>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#4caf50', marginBottom: '10px' }}>
                {Math.round(stats.overall.averageAccuracy * 100)}%
              </div>
              <p style={{ color: '#666' }}>答题准确率</p>
            </div>
          </Card>
          
          <Card variant="elevated" padding="large">
            <h3 style={{ color: '#1976d2', marginBottom: '10px' }}>总学习时间</h3>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#9c27b0', marginBottom: '10px' }}>
                {Math.round(stats.overall.totalStudyTimeMinutes)}
              </div>
              <p style={{ color: '#666' }}>分钟</p>
            </div>
          </Card>
        </div>
      </div>

      {/* 词汇分布统计 */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#333' }}>词汇分布</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <Card variant="outlined" padding="large">
            <h3 style={{ color: '#1976d2', marginBottom: '15px' }}>按难度分布</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#4caf50', fontWeight: 'bold' }}>初级</span>
                <span>{difficultyStats.beginner} 个</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#ff9800', fontWeight: 'bold' }}>中级</span>
                <span>{difficultyStats.intermediate} 个</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#f44336', fontWeight: 'bold' }}>高级</span>
                <span>{difficultyStats.advanced} 个</span>
              </div>
            </div>
          </Card>
          
          <Card variant="outlined" padding="large">
            <h3 style={{ color: '#1976d2', marginBottom: '15px' }}>按类别分布</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>金融</span>
                <span>{categoryStats.finance} 个</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>经济学</span>
                <span>{categoryStats.economics} 个</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>银行业</span>
                <span>{categoryStats.banking} 个</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>个人理财</span>
                <span>{categoryStats['personal finance']} 个</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 最近学习记录 */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#333' }}>最近学习记录</h2>
        {stats.daily.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
            {stats.daily.slice(-7).reverse().map((day, index) => (
              <Card key={day.date} variant="default" padding="medium">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ color: '#1976d2', margin: 0 }}>{day.date}</h4>
                  <span style={{ 
                    backgroundColor: '#e3f2fd', 
                    color: '#1976d2', 
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '0.8rem' 
                  }}>
                    {Math.round(day.studyTimeMinutes)} 分钟
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '15px', fontSize: '0.9rem', color: '#666' }}>
                   <span>新学: {day.newWordsLearned}</span>
                   <span>复习: {day.wordsReviewed}</span>
                   <span>准确率: {day.totalAnswers > 0 ? Math.round((day.correctAnswers / day.totalAnswers) * 100) : 0}%</span>
                 </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card variant="outlined" padding="large" className="text-center">
            <p style={{ color: '#666', margin: '20px 0' }}>还没有学习记录</p>
            <p style={{ color: '#999', fontSize: '0.9rem' }}>开始学习后，这里会显示您的学习历史</p>
          </Card>
        )}
      </div>

      {/* 学习建议 */}
      <div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#333' }}>学习建议</h2>
        <Card variant="elevated" padding="large" className="bg-light">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div>
              <h4 style={{ color: '#1976d2', marginBottom: '10px' }}>📚 学习目标</h4>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>建议每天学习5-10个新词汇，保持连续学习习惯</p>
            </div>
            <div>
              <h4 style={{ color: '#1976d2', marginBottom: '10px' }}>🎯 复习计划</h4>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>定期复习已学词汇，巩固记忆效果</p>
            </div>
            <div>
              <h4 style={{ color: '#1976d2', marginBottom: '10px' }}>⏰ 学习时间</h4>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>建议每次学习15-30分钟，保持专注度</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export { ProgressPage };
export default ProgressPage;