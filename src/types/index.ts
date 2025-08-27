// 核心数据类型定义

// 词汇难度等级
export enum VocabularyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate', 
  ADVANCED = 'advanced'
}

// 学习状态
export enum LearningStatus {
  NEW = 'new',
  LEARNING = 'learning',
  REVIEWING = 'reviewing',
  MASTERED = 'mastered'
}

// 词汇数据结构
export interface Vocabulary {
  id: string;
  word: string;
  pronunciation: string;
  definition: string;
  example: string;
  exampleTranslation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  audioUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  // 向后兼容字段
  translation?: string;
  level?: VocabularyLevel;
}

// 用户学习进度
export interface UserProgress {
  id: string;
  vocabularyId: string;
  userId: string;
  status: LearningStatus;
  correctCount: number;
  incorrectCount: number;
  lastReviewedAt: Date;
  nextReviewAt: Date;
  easeFactor: number;
  interval: number;
  repetitions: number;
  createdAt: Date;
  updatedAt: Date;
}

// 收藏夹类型
export enum CollectionType {
  FAVORITES = 'favorites',
  DIFFICULT = 'difficult',
  CUSTOM = 'custom'
}

// 收藏夹数据结构
export interface Collection {
  id: string;
  name: string;
  type: CollectionType;
  description?: string;
  vocabularyIds: string[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// 每日学习统计
export interface DailyStats {
  date: string; // YYYY-MM-DD
  newWordsLearned: number;
  wordsReviewed: number;
  correctAnswers: number;
  totalAnswers: number;
  studyTimeMinutes: number;
}

// 整体学习统计
export interface OverallStats {
  totalWordsLearned: number;
  totalWordsReviewed: number;
  totalStudyTimeMinutes: number;
  currentStreak: number;
  longestStreak: number;
  averageAccuracy: number;
  lastStudyDate: Date;
}

// 等级进度统计
export interface LevelProgress {
  level: VocabularyLevel;
  totalWords: number;
  learnedWords: number;
  masteredWords: number;
  accuracy: number;
}

// 学习统计汇总
export interface LearningStats {
  daily: DailyStats[];
  overall: OverallStats;
  levelProgress: LevelProgress[];
  updatedAt: Date;
}

// 用户设置
export interface UserSettings {
  id: string;
  userId: string;
  language: 'zh-CN' | 'en-US';
  theme: 'light' | 'dark' | 'auto';
  audioEnabled: boolean;
  voiceType: 'us' | 'uk';
  playbackSpeed: number;
  dailyGoal: number;
  reminderEnabled: boolean;
  reminderTime: string; // HH:mm
  autoPlayAudio: boolean;
  showTranslation: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 分页参数
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 分页响应
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 搜索过滤参数
export interface VocabularyFilter {
  level?: VocabularyLevel;
  category?: string;
  status?: LearningStatus;
  tags?: string[];
  search?: string;
}

// 学习会话数据
export interface LearningSession {
  id: string;
  vocabularies: Vocabulary[];
  currentIndex: number;
  startTime: Date;
  endTime?: Date;
  results: LearningResult[];
  type: 'learn' | 'review' | 'test';
}

// 学习结果
export interface LearningResult {
  vocabularyId: string;
  isCorrect: boolean;
  timeSpent: number; // 毫秒
  attempts: number;
  timestamp: Date;
}

// 音频播放状态
export interface AudioState {
  isPlaying: boolean;
  currentVocabularyId?: string;
  playbackSpeed: number;
  volume: number;
}

// 应用状态接口
export interface AppState {
  user: {
    id: string;
    settings: UserSettings;
  } | null;
  vocabularies: Vocabulary[];
  userProgress: UserProgress[];
  collections: Collection[];
  learningStats: LearningStats;
  currentSession: LearningSession | null;
  audioState: AudioState;
  loading: boolean;
  error: string | null;
}

// 应用操作类型
export type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: AppState['user'] }
  | { type: 'SET_VOCABULARIES'; payload: Vocabulary[] }
  | { type: 'ADD_VOCABULARY'; payload: Vocabulary }
  | { type: 'UPDATE_VOCABULARY'; payload: Vocabulary }
  | { type: 'DELETE_VOCABULARY'; payload: string }
  | { type: 'SET_USER_PROGRESS'; payload: UserProgress[] }
  | { type: 'UPDATE_PROGRESS'; payload: UserProgress }
  | { type: 'SET_COLLECTIONS'; payload: Collection[] }
  | { type: 'ADD_COLLECTION'; payload: Collection }
  | { type: 'UPDATE_COLLECTION'; payload: Collection }
  | { type: 'DELETE_COLLECTION'; payload: string }
  | { type: 'SET_LEARNING_STATS'; payload: LearningStats }
  | { type: 'START_SESSION'; payload: LearningSession }
  | { type: 'END_SESSION' }
  | { type: 'UPDATE_SESSION'; payload: Partial<LearningSession> }
  | { type: 'SET_AUDIO_STATE'; payload: Partial<AudioState> };