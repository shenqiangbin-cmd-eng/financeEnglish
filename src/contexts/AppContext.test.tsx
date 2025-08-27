import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';

import { AppProvider, useAppContext, useVocabularies, useUserSettings } from './AppContext';


// Mock storage service
vi.mock('../services', () => ({
  storageService: {
    getUserSettings: vi.fn().mockResolvedValue(null),
    getVocabularies: vi.fn().mockResolvedValue([]),
    getUserProgress: vi.fn().mockResolvedValue([]),
    getCollections: vi.fn().mockResolvedValue([]),
    getLearningStats: vi.fn().mockResolvedValue(null),
    updateUserSettings: vi.fn().mockResolvedValue(undefined)
  }
}));

// Simple test component
function TestComponent() {
  const { state, dispatch } = useAppContext();
  const vocabularies = useVocabularies();
  const userSettings = useUserSettings();

  const handleAddVocabulary = () => {
    dispatch({
      type: 'ADD_VOCABULARY',
      payload: {
        id: 'test-vocab',
        word: 'test',
        pronunciation: '/test/',
        definition: 'A test word',
        example: 'This is a test.',
        exampleTranslation: '这是一个测试。',
        difficulty: 'beginner',
        category: 'test',
        tags: ['test'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
  };

  const handleSetLoading = () => {
    dispatch({ type: 'SET_LOADING', payload: true });
  };

  return (
    <div>
      <div data-testid="loading">{state.loading ? 'loading' : 'not-loading'}</div>
      <div data-testid="vocabularies-count">{vocabularies.length}</div>
      <div data-testid="user-settings">{userSettings ? 'has-settings' : 'no-settings'}</div>
      <button data-testid="add-vocabulary" onClick={handleAddVocabulary}>
        Add Vocabulary
      </button>
      <button data-testid="set-loading" onClick={handleSetLoading}>
        Set Loading
      </button>
    </div>
  );
}

describe('AppContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该提供初始状态', async () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    // 等待初始化完成
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    expect(screen.getByTestId('vocabularies-count')).toHaveTextContent('0');
    expect(screen.getByTestId('user-settings')).toHaveTextContent('no-settings');
  });

  it('应该能够设置加载状态', async () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    const setLoadingButton = screen.getByTestId('set-loading');
    
    await act(async () => {
      setLoadingButton.click();
    });

    expect(screen.getByTestId('loading')).toHaveTextContent('loading');
  });

  it('应该能够添加词汇', async () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    // 等待初始化完成
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(screen.getByTestId('vocabularies-count')).toHaveTextContent('0');

    const addButton = screen.getByTestId('add-vocabulary');
    
    await act(async () => {
      addButton.click();
    });

    expect(screen.getByTestId('vocabularies-count')).toHaveTextContent('1');
  });

  it('应该抛出错误当在Provider外使用时', () => {
    // 捕获console.error以避免测试输出中的错误信息
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAppContext must be used within an AppProvider');
    
    consoleSpy.mockRestore();
  });

  it('应该正确使用selector hooks', async () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    // 等待初始化完成
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // 验证selector hooks返回正确的初始值
    expect(screen.getByTestId('vocabularies-count')).toHaveTextContent('0');
    expect(screen.getByTestId('user-settings')).toHaveTextContent('no-settings');
    expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
  });
});