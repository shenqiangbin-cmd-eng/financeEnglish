import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, AppAction, Vocabulary, UserProgress, UserSettings, LearningStats } from '../types';
import { storageService } from '../services';
import { VocabularyLevel, LearningStatus } from '../types';

// 初始状态
const initialState: AppState = {
  user: null,
  vocabularies: [],
  userProgress: [],
  collections: [],
  learningStats: {
    daily: [],
    overall: {
      totalWordsLearned: 0,
      totalWordsReviewed: 0,
      totalStudyTimeMinutes: 0,
      currentStreak: 0,
      longestStreak: 0,
      averageAccuracy: 0,
      lastStudyDate: new Date()
    },
    levelProgress: [
      { level: VocabularyLevel.BEGINNER, totalWords: 0, learnedWords: 0, masteredWords: 0, accuracy: 0 },
      { level: VocabularyLevel.INTERMEDIATE, totalWords: 0, learnedWords: 0, masteredWords: 0, accuracy: 0 },
      { level: VocabularyLevel.ADVANCED, totalWords: 0, learnedWords: 0, masteredWords: 0, accuracy: 0 }
    ],
    updatedAt: new Date()
  },
  currentSession: null,
  audioState: {
    isPlaying: false,
    currentVocabularyId: undefined,
    playbackSpeed: 1.0,
    volume: 1.0
  },
  loading: false,
  error: null
};

// Reducer函数
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_VOCABULARIES':
      return { ...state, vocabularies: action.payload };
    
    case 'ADD_VOCABULARY':
      return { ...state, vocabularies: [...(state.vocabularies || []), action.payload] };
    
    case 'UPDATE_VOCABULARY':
      return {
        ...state,
        vocabularies: (state.vocabularies || []).map(vocab =>
          vocab.id === action.payload.id ? action.payload : vocab
        )
      };
    
    case 'DELETE_VOCABULARY':
      return {
        ...state,
        vocabularies: (state.vocabularies || []).filter(vocab => vocab.id !== action.payload)
      };
    
    case 'SET_USER_PROGRESS':
      return { ...state, userProgress: action.payload };
    
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        userProgress: (state.userProgress || []).map(progress =>
          progress.id === action.payload.id ? action.payload : progress
        )
      };
    
    case 'SET_COLLECTIONS':
      return { ...state, collections: action.payload };
    
    case 'ADD_COLLECTION':
      return { ...state, collections: [...(state.collections || []), action.payload] };
    
    case 'UPDATE_COLLECTION':
      return {
        ...state,
        collections: (state.collections || []).map(collection =>
          collection.id === action.payload.id ? action.payload : collection
        )
      };
    
    case 'DELETE_COLLECTION':
      return {
        ...state,
        collections: (state.collections || []).filter(collection => collection.id !== action.payload)
      };
    
    case 'SET_LEARNING_STATS':
      return { ...state, learningStats: action.payload };
    
    case 'START_SESSION':
      return { ...state, currentSession: action.payload };
    
    case 'END_SESSION':
      return { ...state, currentSession: null };
    
    case 'UPDATE_SESSION':
      return {
        ...state,
        currentSession: state.currentSession ? { ...state.currentSession, ...action.payload } : null
      };
    
    case 'SET_AUDIO_STATE':
      return {
        ...state,
        audioState: { ...state.audioState, ...action.payload }
      };
    
    default:
      return state;
  }
}

// Context创建
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider组件
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // 初始化应用数据
  useEffect(() => {
    const initializeApp = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        // 加载用户设置
        const settings = await storageService.getUserSettings('default-user');
        if (settings) {
          const user = {
            id: 'default-user',
            settings: settings
          };
          dispatch({ type: 'SET_USER', payload: user });
        }
        
        // 加载词汇数据
        const vocabularies = await storageService.getVocabularies();
        dispatch({ type: 'SET_VOCABULARIES', payload: vocabularies });
        
        // 加载用户进度
        const progress = await storageService.getUserProgress('default-user');
        dispatch({ type: 'SET_USER_PROGRESS', payload: progress });
        
        // 加载收藏夹
        const collections = await storageService.getCollections('default-user');
        dispatch({ type: 'SET_COLLECTIONS', payload: collections });
        
        // 加载学习统计
        const stats = await storageService.getLearningStats('default-user');
        if (stats) {
          dispatch({ type: 'SET_LEARNING_STATS', payload: stats });
        }
        
      } catch (error) {
        console.error('Failed to initialize app:', error);
        dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeApp();
  }, []);

  // 自动保存用户设置
  useEffect(() => {
    const saveSettings = async () => {
      try {
        if (state.user?.settings) {
          await storageService.updateUserSettings(state.user.settings);
        }
      } catch (error) {
        console.error('Failed to save user settings:', error);
      }
    };

    // 延迟保存，避免频繁写入
    const timeoutId = setTimeout(saveSettings, 1000);
    return () => clearTimeout(timeoutId);
  }, [state.user?.settings]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook for using context
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

// 便捷的选择器hooks
export function useVocabularies() {
  const { state } = useAppContext();
  return state.vocabularies;
}

export function useUserProgress() {
  const { state } = useAppContext();
  return state.userProgress;
}

export function useUserSettings() {
  const { state } = useAppContext();
  return state.user?.settings || null;
}

export function useCurrentSession() {
  const { state } = useAppContext();
  return state.currentSession;
}

export function useLearningStats() {
  const { state } = useAppContext();
  return state.learningStats;
}

export function useCollections() {
  const { state } = useAppContext();
  return state.collections;
}

export function useAudioState() {
  const { state } = useAppContext();
  return state.audioState;
}

export function useAppLoading() {
  const { state } = useAppContext();
  return state.loading;
}

export function useAppError() {
  const { state } = useAppContext();
  return state.error;
}

export function useCurrentUser() {
  const { state } = useAppContext();
  return state.user;
}