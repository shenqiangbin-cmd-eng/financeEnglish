import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useVocabularies, useAppContext } from '../contexts/AppContext';
import { Card, Button } from '../components/UI';
import { VocabularyAudio } from '../components/UI';
import { financialVocabulary, getVocabularyByDifficulty, getVocabularyByCategory } from '../data/vocabulary';
import { Vocabulary } from '../types';

const LearnPage: React.FC = () => {
  const vocabularies = useVocabularies();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredVocabularies, setFilteredVocabularies] = useState<Vocabulary[]>(financialVocabulary);
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpToPage, setJumpToPage] = useState('');
  const itemsPerPage = 6;

  useEffect(() => {
    let filtered = financialVocabulary;
    
    if (selectedDifficulty !== 'all') {
      filtered = getVocabularyByDifficulty(selectedDifficulty);
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(v => v.category === selectedCategory);
    }
    
    setFilteredVocabularies(filtered);
    setCurrentPage(1);
  }, [selectedDifficulty, selectedCategory]);

  const totalPages = Math.ceil(filteredVocabularies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentVocabularies = filteredVocabularies.slice(startIndex, startIndex + itemsPerPage);

  const handleAddToFavorites = (vocabulary: Vocabulary) => {
    // 添加到收藏的逻辑
    console.log('Added to favorites:', vocabulary.word);
  };

  const handleJumpToPage = () => {
    const pageNum = parseInt(jumpToPage);
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setJumpToPage('');
    } else {
      alert(`请输入1到${totalPages}之间的页码`);
    }
  };

  const handleJumpInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJumpToPage();
    }
  };

  return (
    <div className="learn-page" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="learn-header" style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '10px', color: '#1976d2' }}>词汇学习</h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>浏览和学习财经英语词汇</p>
        
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link to="/vocabulary-learning">
            <Button variant="primary" size="medium">开始学习模式</Button>
          </Link>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <label>难度:</label>
            <select 
              value={selectedDifficulty} 
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              <option value="all">全部</option>
              <option value="beginner">初级</option>
              <option value="intermediate">中级</option>
              <option value="advanced">高级</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <label>类别:</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              <option value="all">全部</option>
              <option value="finance">金融</option>
              <option value="economics">经济学</option>
              <option value="banking">银行业</option>
              <option value="personal finance">个人理财</option>
            </select>
          </div>
        </div>
      </div>

      <div className="vocabulary-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        {currentVocabularies.map((vocabulary) => (
          <Card key={vocabulary.id} variant="outlined" padding="large" hoverable>
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <h3 style={{ fontSize: '1.5rem', color: '#1976d2', margin: 0 }}>{vocabulary.word}</h3>
                <span style={{ 
                  backgroundColor: vocabulary.difficulty === 'beginner' ? '#4caf50' : 
                                 vocabulary.difficulty === 'intermediate' ? '#ff9800' : '#f44336',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.8rem'
                }}>
                  {vocabulary.difficulty === 'beginner' ? '初级' : 
                   vocabulary.difficulty === 'intermediate' ? '中级' : '高级'}
                </span>
              </div>
              <p style={{ color: '#666', margin: '5px 0', fontStyle: 'italic' }}>{vocabulary.pronunciation}</p>
              <p style={{ fontWeight: 'bold', margin: '10px 0' }}>{vocabulary.definition}</p>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <p style={{ margin: '5px 0', fontStyle: 'italic' }}>"{vocabulary.example}"</p>
              <p style={{ margin: '5px 0', color: '#666', fontSize: '0.9rem' }}>{vocabulary.exampleTranslation}</p>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
              {vocabulary.tags.map((tag, index) => (
                <span key={index} style={{
                  backgroundColor: '#e3f2fd',
                  color: '#1976d2',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.8rem'
                }}>
                  {tag}
                </span>
              ))}
            </div>
            
            <VocabularyAudio vocabulary={vocabulary} variant="compact" />
            
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
              <Button 
                variant="outline" 
                size="small"
                onClick={() => handleAddToFavorites(vocabulary)}
              >
                收藏
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button 
            variant="outline" 
            size="small"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            上一页
          </Button>
          
          <span style={{ margin: '0 10px' }}>
            第 {currentPage} 页，共 {totalPages} 页
          </span>
          
          <Button 
            variant="outline" 
            size="small"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            下一页
          </Button>
          
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem' }}>跳转到:</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={jumpToPage}
              onChange={(e) => setJumpToPage(e.target.value)}
              onKeyPress={handleJumpInputKeyPress}
              placeholder="页码"
              style={{
                width: '60px',
                padding: '4px 8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                textAlign: 'center'
              }}
            />
            <Button 
              variant="outline" 
              size="small"
              onClick={handleJumpToPage}
            >
              跳转
            </Button>
          </div>
        </div>
      )}
      
      <div style={{ textAlign: 'center', marginTop: '30px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <p style={{ margin: '10px 0', color: '#666' }}>共有 {filteredVocabularies.length} 个词汇</p>
        <Link to="/vocabulary-learning">
          <Button variant="primary" size="large">开始学习测试</Button>
        </Link>
      </div>
    </div>
  );
};

export { LearnPage };
export default LearnPage;