import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { Vocabulary } from '../types';
import { Button, Card, VocabularyAudio, AudioControls } from '../components/UI';
import './VocabularyLearning.css';

interface LearningSession {
  vocabularies: Vocabulary[];
  currentIndex: number;
  correctAnswers: number;
  totalAnswered: number;
  startTime: Date;
  mode: 'recognition' | 'recall' | 'mixed';
}

const VocabularyLearning: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAppContext();
  const [session, setSession] = useState<LearningSession | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAudioControls, setShowAudioControls] = useState(false);

  useEffect(() => {
    initializeLearningSession();
  }, []);

  const initializeLearningSession = async () => {
    try {
      setIsLoading(true);
      
      // 获取所有词汇
      const vocabularies = state.vocabularies;
      
      if (vocabularies.length === 0) {
        console.warn('No vocabularies available for learning');
        return;
      }

      // 随机打乱词汇顺序
      const shuffledVocabularies = [...vocabularies].sort(() => Math.random() - 0.5);
      
      // 创建学习会话
      const newSession: LearningSession = {
        vocabularies: shuffledVocabularies,
        currentIndex: 0,
        correctAnswers: 0,
        totalAnswered: 0,
        startTime: new Date(),
        mode: 'mixed' // 默认混合模式
      };
      
      setSession(newSession);
    } catch (error) {
      console.error('Failed to initialize learning session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentVocabulary = (): Vocabulary | null => {
    if (!session || session.currentIndex >= session.vocabularies.length) {
      return null;
    }
    return session.vocabularies[session.currentIndex];
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleAnswerSubmit = () => {
    const currentVocab = getCurrentVocabulary();
    if (!currentVocab || !userAnswer.trim()) {
      return;
    }

    const isCorrect = userAnswer.toLowerCase().trim() === currentVocab.word.toLowerCase();
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    
    setSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
        totalAnswered: prev.totalAnswered + 1
      };
    });

    setShowAnswer(true);
  };

  const handleNextVocabulary = () => {
    if (!session) return;

    if (session.currentIndex + 1 >= session.vocabularies.length) {
      // 学习完成
      handleSessionComplete();
      return;
    }

    setSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        currentIndex: prev.currentIndex + 1
      };
    });

    // 重置状态
    setShowAnswer(false);
    setUserAnswer('');
    setFeedback(null);
  };

  const handleSessionComplete = () => {
    if (!session) return;

    const accuracy = session.totalAnswered > 0 ? (session.correctAnswers / session.totalAnswered) * 100 : 0;
    const duration = new Date().getTime() - session.startTime.getTime();
    
    alert(`学习完成！\n正确率: ${accuracy.toFixed(1)}%\n用时: ${Math.round(duration / 1000)}秒`);
    navigate('/');
  };

  const handleSkip = () => {
    setShowAnswer(true);
    setSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        totalAnswered: prev.totalAnswered + 1
      };
    });
  };

  const handleRestart = () => {
    setSession(null);
    setShowAnswer(false);
    setUserAnswer('');
    setFeedback(null);
    initializeLearningSession();
  };

  if (isLoading) {
    return (
      <div className="vocabulary-learning-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>正在准备学习内容...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="vocabulary-learning-container">
        <Card className="error-card">
          <h2>无法开始学习</h2>
          <p>没有可用的词汇内容，请先导入词汇数据。</p>
          <Button onClick={() => navigate('/')} variant="primary">
            返回首页
          </Button>
        </Card>
      </div>
    );
  }

  const currentVocab = getCurrentVocabulary();
  if (!currentVocab) {
    return (
      <div className="vocabulary-learning-container">
        <Card className="completion-card">
          <h2>🎉 学习完成！</h2>
          <div className="completion-stats">
            <p>正确率: {session.totalAnswered > 0 ? ((session.correctAnswers / session.totalAnswered) * 100).toFixed(1) : 0}%</p>
            <p>总题数: {session.totalAnswered}</p>
            <p>正确数: {session.correctAnswers}</p>
          </div>
          <div className="completion-actions">
            <Button onClick={handleRestart} variant="primary">
              重新开始
            </Button>
            <Button onClick={() => navigate('/')} variant="outline">
              返回首页
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const progress = ((session.currentIndex + 1) / session.vocabularies.length) * 100;
  const accuracy = session.totalAnswered > 0 ? (session.correctAnswers / session.totalAnswered) * 100 : 0;

  return (
    <div className="vocabulary-learning-container">
      {/* 顶部进度条和统计 */}
      <div className="learning-header">
        <div className="progress-section">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="progress-text">
            {session.currentIndex + 1} / {session.vocabularies.length}
          </div>
        </div>
        
        <div className="stats-section">
          <span className="stat-item">正确率: {accuracy.toFixed(1)}%</span>
          <span className="stat-item">已答: {session.totalAnswered}</span>
        </div>

        <div className="header-actions">
          <Button 
            variant="ghost" 
            size="small"
            onClick={() => setShowAudioControls(!showAudioControls)}
          >
            🎵 音频设置
          </Button>
          <Button 
            variant="outline" 
            size="small"
            onClick={() => navigate('/')}
          >
            退出学习
          </Button>
        </div>
      </div>

      {/* 音频控制面板 */}
      {showAudioControls && (
        <div className="audio-controls-panel">
          <AudioControls />
        </div>
      )}

      {/* 主学习区域 */}
      <div className="learning-content">
        <Card className="vocabulary-card">
          <div className="vocabulary-header">
            <h2 className="vocabulary-category">{currentVocab.category}</h2>
            <VocabularyAudio 
              vocabulary={currentVocab} 
              variant="compact"
            />
          </div>

          {!showAnswer ? (
            /* 问题模式 */
            <div className="question-mode">
              <div className="question-section">
                <h3>请根据释义写出对应的英文单词：</h3>
                <div className="definition-display">
                  <p className="definition-text">{currentVocab.definition}</p>
                  {currentVocab.example && (
                    <div className="example-section">
                      <p className="example-label">例句：</p>
                      <p className="example-text">{currentVocab.example}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="answer-input-section">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="请输入英文单词..."
                  className="answer-input"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAnswerSubmit();
                    }
                  }}
                  autoFocus
                />
                
                <div className="question-actions">
                  <Button 
                    onClick={handleAnswerSubmit}
                    variant="primary"
                    disabled={!userAnswer.trim()}
                  >
                    提交答案
                  </Button>
                  <Button 
                    onClick={handleShowAnswer}
                    variant="outline"
                  >
                    显示答案
                  </Button>
                  <Button 
                    onClick={handleSkip}
                    variant="ghost"
                  >
                    跳过
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* 答案模式 */
            <div className="answer-mode">
              <div className="answer-section">
                <div className="correct-answer">
                  <h3>正确答案：</h3>
                  <div className="word-display">
                    <span className="word-text">{currentVocab.word}</span>
                    {currentVocab.pronunciation && (
                      <span className="pronunciation">/{currentVocab.pronunciation}/</span>
                    )}
                  </div>
                </div>

                {userAnswer && (
                  <div className={`user-answer ${feedback}`}>
                    <p>你的答案: <span className="user-answer-text">{userAnswer}</span></p>
                    {feedback === 'correct' && <span className="feedback-icon">✅ 正确！</span>}
                    {feedback === 'incorrect' && <span className="feedback-icon">❌ 错误</span>}
                  </div>
                )}

                <div className="vocabulary-details">
                  <div className="detail-item">
                    <strong>释义：</strong>
                    <span>{currentVocab.definition}</span>
                  </div>
                  
                  {currentVocab.example && (
                    <div className="detail-item">
                      <strong>例句：</strong>
                      <span>{currentVocab.example}</span>
                    </div>
                  )}
                  
                  {currentVocab.tags && currentVocab.tags.length > 0 && (
                    <div className="detail-item">
                      <strong>标签：</strong>
                      <div className="tags">
                        {currentVocab.tags.map((tag, index) => (
                          <span key={index} className="tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="answer-actions">
                  <Button 
                    onClick={handleNextVocabulary}
                    variant="primary"
                    size="large"
                  >
                    {session.currentIndex + 1 >= session.vocabularies.length ? '完成学习' : '下一个'}
                  </Button>
                  
                  <VocabularyAudio 
                    vocabulary={currentVocab} 
                    variant="full"
                    showDefinitionAudio={true}
                    showExampleAudio={true}
                  />
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default VocabularyLearning;