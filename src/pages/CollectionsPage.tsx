import React, { useState, useMemo } from 'react';
import { useCollections, useVocabularies, useAppContext } from '../contexts/AppContext';
import { Card, Button } from '../components/UI';
import { financialVocabulary } from '../data/vocabulary';
import { Collection, CollectionType, Vocabulary } from '../types';
import { audioService } from '../services/audioService';
import { storageService } from '../services';

const CollectionsPage: React.FC = () => {
  const collections = useCollections();
  const vocabularies = useVocabularies();
  const { dispatch } = useAppContext();
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');

  // 获取收藏夹中的词汇
  const getCollectionVocabularies = (collection: Collection): Vocabulary[] => {
    return financialVocabulary.filter(vocab => collection.vocabularyIds.includes(vocab.id));
  };

  // 创建新收藏夹
  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) return;
    
    try {
      const newCollection: Collection = {
        id: Date.now().toString(),
        name: newCollectionName,
        type: CollectionType.CUSTOM,
        description: newCollectionDescription,
        vocabularyIds: [],
        userId: 'default',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await storageService.addCollection(newCollection);
      dispatch({ type: 'ADD_COLLECTION', payload: newCollection });
      setNewCollectionName('');
      setNewCollectionDescription('');
      setShowCreateForm(false);
    } catch (error) {
      console.error('创建收藏夹失败:', error);
      alert('创建收藏夹失败，请重试');
    }
  };

  // 从收藏夹移除词汇
  const handleRemoveFromCollection = async (collectionId: string, vocabularyId: string) => {
    const updatedCollection = collections.find(c => c.id === collectionId);
    if (updatedCollection) {
      try {
        const newVocabularyIds = updatedCollection.vocabularyIds.filter(id => id !== vocabularyId);
        const updated = { ...updatedCollection, vocabularyIds: newVocabularyIds, updatedAt: new Date() };
        
        await storageService.updateCollection(updated);
        dispatch({ type: 'UPDATE_COLLECTION', payload: updated });
      } catch (error) {
        console.error('移除词汇失败:', error);
        alert('移除词汇失败，请重试');
      }
    }
  };

  // 删除收藏夹
  const handleDeleteCollection = async (collectionId: string) => {
    if (window.confirm('确定要删除这个收藏夹吗？')) {
      try {
        await storageService.deleteCollection(collectionId);
        dispatch({ type: 'DELETE_COLLECTION', payload: collectionId });
        if (selectedCollection?.id === collectionId) {
          setSelectedCollection(null);
        }
      } catch (error) {
        console.error('删除收藏夹失败:', error);
        alert('删除收藏夹失败，请重试');
      }
    }
  };

  // 播放音频
  const handlePlayAudio = async (word: string) => {
    try {
      await audioService.speakText(word);
    } catch (error) {
      console.error('播放音频失败:', error);
    }
  };

  // 默认收藏夹
  const defaultCollections = useMemo(() => {
    const favoriteVocabs = vocabularies.filter(v => v.id && collections.some(c => 
      c.type === CollectionType.FAVORITES && c.vocabularyIds.includes(v.id)
    ));
    
    const difficultVocabs = vocabularies.filter(v => v.id && collections.some(c => 
      c.type === CollectionType.DIFFICULT && c.vocabularyIds.includes(v.id)
    ));

    return [
      {
        id: 'favorites',
        name: '我的收藏',
        type: CollectionType.FAVORITES,
        description: '收藏的词汇',
        vocabularyIds: favoriteVocabs.map(v => v.id),
        count: favoriteVocabs.length
      },
      {
        id: 'difficult',
        name: '困难词汇',
        type: CollectionType.DIFFICULT,
        description: '标记为困难的词汇',
        vocabularyIds: difficultVocabs.map(v => v.id),
        count: difficultVocabs.length
      }
    ];
  }, [collections, vocabularies]);

  const customCollections = collections.filter(c => c.type === CollectionType.CUSTOM);

  return (
    <div className="collections-page" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="collections-header" style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h1 style={{ fontSize: '2rem', color: '#1976d2', margin: 0 }}>我的收藏</h1>
          <Button 
            variant="primary" 
            onClick={() => setShowCreateForm(true)}
            disabled={showCreateForm}
          >
            + 新建收藏夹
          </Button>
        </div>
        <p style={{ color: '#666', margin: 0 }}>管理您收藏的词汇和自定义收藏夹</p>
      </div>

      {/* 创建收藏夹表单 */}
      {showCreateForm && (
        <Card variant="outlined" padding="large">
          <h3 style={{ color: '#1976d2', marginBottom: '20px' }}>创建新收藏夹</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>收藏夹名称</label>
              <input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="输入收藏夹名称"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>描述（可选）</label>
              <textarea
                value={newCollectionDescription}
                onChange={(e) => setNewCollectionDescription(e.target.value)}
                placeholder="输入收藏夹描述"
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button variant="primary" onClick={handleCreateCollection}>
                创建
              </Button>
              <Button variant="secondary" onClick={() => {
                setShowCreateForm(false);
                setNewCollectionName('');
                setNewCollectionDescription('');
              }}>
                取消
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: selectedCollection ? '300px 1fr' : '1fr', gap: '20px' }}>
        {/* 收藏夹列表 */}
        <div className="collections-list">
          <h2 style={{ fontSize: '1.3rem', marginBottom: '20px', color: '#333' }}>收藏夹列表</h2>
          
          {/* 默认收藏夹 */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#666', marginBottom: '10px' }}>系统收藏夹</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {defaultCollections.map((collection) => (
                <Card 
                  key={collection.id}
                  variant={selectedCollection?.id === collection.id ? "elevated" : "outlined"}
                  padding="medium"
                  hoverable
                  onClick={() => setSelectedCollection({
                     ...collection,
                     userId: 'default',
                     createdAt: new Date(),
                     updatedAt: new Date()
                   } as Collection)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', color: '#1976d2' }}>{collection.name}</h4>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                        {collection.count} 个词汇
                      </p>
                    </div>
                    <span style={{ 
                      backgroundColor: '#e3f2fd', 
                      color: '#1976d2', 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '0.8rem' 
                    }}>
                      {collection.type === CollectionType.FAVORITES ? '收藏' : '困难'}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* 自定义收藏夹 */}
          {customCollections.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.1rem', color: '#666', marginBottom: '10px' }}>自定义收藏夹</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {customCollections.map((collection) => (
                  <Card 
                    key={collection.id}
                    variant={selectedCollection?.id === collection.id ? "elevated" : "outlined"}
                    padding="medium"
                    hoverable
                    onClick={() => setSelectedCollection(collection)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 5px 0', color: '#1976d2' }}>{collection.name}</h4>
                        {collection.description && (
                          <p style={{ margin: '0 0 5px 0', fontSize: '0.8rem', color: '#999' }}>
                            {collection.description}
                          </p>
                        )}
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                          {collection.vocabularyIds.length} 个词汇
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCollection(collection.id);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#f44336',
                          cursor: 'pointer',
                          padding: '4px',
                          borderRadius: '4px'
                        }}
                        title="删除收藏夹"
                      >
                        🗑️
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {customCollections.length === 0 && (
            <Card variant="outlined" padding="large" className="text-center">
              <p style={{ color: '#666', margin: '10px 0' }}>还没有自定义收藏夹</p>
              <p style={{ color: '#999', fontSize: '0.9rem' }}>点击上方按钮创建您的第一个收藏夹</p>
            </Card>
          )}
        </div>

        {/* 收藏夹详情 */}
        {selectedCollection && (
          <div className="collection-detail">
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.5rem', color: '#1976d2', marginBottom: '5px' }}>
                {selectedCollection.name}
              </h2>
              {selectedCollection.description && (
                <p style={{ color: '#666', marginBottom: '10px' }}>{selectedCollection.description}</p>
              )}
              <p style={{ color: '#999', fontSize: '0.9rem' }}>
                共 {getCollectionVocabularies(selectedCollection).length} 个词汇
              </p>
            </div>

            {getCollectionVocabularies(selectedCollection).length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
                {getCollectionVocabularies(selectedCollection).map((vocab) => (
                  <Card key={vocab.id} variant="default" padding="medium">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                          <h4 style={{ margin: 0, color: '#1976d2' }}>{vocab.word}</h4>
                          <button
                            onClick={() => handlePlayAudio(vocab.word)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '1.2rem',
                              padding: '2px'
                            }}
                            title="播放发音"
                          >
                            🔊
                          </button>
                        </div>
                        <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#666' }}>
                          {vocab.pronunciation}
                        </p>
                        <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem' }}>
                          {vocab.definition}
                        </p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#999', fontStyle: 'italic' }}>
                          {vocab.example}
                        </p>
                      </div>
                      {selectedCollection.type === CollectionType.CUSTOM && (
                        <button
                          onClick={() => handleRemoveFromCollection(selectedCollection.id, vocab.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#f44336',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px'
                          }}
                          title="从收藏夹移除"
                        >
                          ❌
                        </button>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                      <span style={{
                        backgroundColor: vocab.difficulty === 'beginner' ? '#e8f5e8' : 
                                       vocab.difficulty === 'intermediate' ? '#fff3e0' : '#ffebee',
                        color: vocab.difficulty === 'beginner' ? '#2e7d32' : 
                               vocab.difficulty === 'intermediate' ? '#f57c00' : '#c62828',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.7rem'
                      }}>
                        {vocab.difficulty === 'beginner' ? '初级' : 
                         vocab.difficulty === 'intermediate' ? '中级' : '高级'}
                      </span>
                      <span style={{
                        backgroundColor: '#f0f0f0',
                        color: '#666',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.7rem'
                      }}>
                        {vocab.category}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card variant="outlined" padding="large" className="text-center">
                <p style={{ color: '#666', margin: '20px 0' }}>这个收藏夹还没有词汇</p>
                <p style={{ color: '#999', fontSize: '0.9rem' }}>在学习页面或词汇学习页面添加词汇到收藏夹</p>
              </Card>
            )}
          </div>
        )}
      </div>

      {!selectedCollection && (
        <Card variant="outlined" padding="large" className="text-center">
          <h3 style={{ color: '#1976d2', marginBottom: '10px' }}>选择一个收藏夹</h3>
          <p style={{ color: '#666', margin: 0 }}>点击左侧的收藏夹来查看其中的词汇</p>
        </Card>
      )}
    </div>
  );
};

export { CollectionsPage };
export default CollectionsPage;