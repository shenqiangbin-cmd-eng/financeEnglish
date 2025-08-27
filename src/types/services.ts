import {
  Vocabulary,
  UserProgress,
  Collection,
  LearningStats,
  UserSettings,
  VocabularyFilter,
  PaginationParams,
  PaginatedResponse,
  ApiResponse,
  LearningResult
} from './index';

// 词汇服务接口
export interface VocabularyService {
  // 获取词汇列表
  getVocabularies(filter?: VocabularyFilter, pagination?: PaginationParams): Promise<PaginatedResponse<Vocabulary>>;
  
  // 根据ID获取词汇
  getVocabularyById(id: string): Promise<Vocabulary | null>;
  
  // 添加词汇
  addVocabulary(vocabulary: Omit<Vocabulary, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vocabulary>;
  
  // 更新词汇
  updateVocabulary(id: string, updates: Partial<Vocabulary>): Promise<Vocabulary>;
  
  // 删除词汇
  deleteVocabulary(id: string): Promise<boolean>;
  
  // 批量导入词汇
  importVocabularies(vocabularies: Omit<Vocabulary, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<Vocabulary[]>;
  
  // 搜索词汇
  searchVocabularies(query: string, filter?: VocabularyFilter): Promise<Vocabulary[]>;
  
  // 获取随机词汇
  getRandomVocabularies(count: number, filter?: VocabularyFilter): Promise<Vocabulary[]>;
}

// 进度服务接口
export interface ProgressService {
  // 获取用户进度
  getUserProgress(userId: string, vocabularyId?: string): Promise<UserProgress[]>;
  
  // 更新学习进度
  updateProgress(progress: Omit<UserProgress, 'createdAt' | 'updatedAt'>): Promise<UserProgress>;
  
  // 批量更新进度
  batchUpdateProgress(progressList: Omit<UserProgress, 'createdAt' | 'updatedAt'>[]): Promise<UserProgress[]>;
  
  // 记录学习结果
  recordLearningResult(userId: string, vocabularyId: string, result: LearningResult): Promise<UserProgress>;
  
  // 获取需要复习的词汇
  getVocabulariesForReview(userId: string, limit?: number): Promise<{ vocabulary: Vocabulary; progress: UserProgress }[]>;
  
  // 重置进度
  resetProgress(userId: string, vocabularyIds?: string[]): Promise<boolean>;
}

// 收藏服务接口
export interface CollectionService {
  // 获取收藏夹列表
  getCollections(userId: string): Promise<Collection[]>;
  
  // 根据ID获取收藏夹
  getCollectionById(id: string): Promise<Collection | null>;
  
  // 创建收藏夹
  createCollection(collection: Omit<Collection, 'id' | 'createdAt' | 'updatedAt'>): Promise<Collection>;
  
  // 更新收藏夹
  updateCollection(id: string, updates: Partial<Collection>): Promise<Collection>;
  
  // 删除收藏夹
  deleteCollection(id: string): Promise<boolean>;
  
  // 添加词汇到收藏夹
  addVocabularyToCollection(collectionId: string, vocabularyId: string): Promise<boolean>;
  
  // 从收藏夹移除词汇
  removeVocabularyFromCollection(collectionId: string, vocabularyId: string): Promise<boolean>;
  
  // 获取收藏夹中的词汇
  getCollectionVocabularies(collectionId: string): Promise<Vocabulary[]>;
}

// 统计服务接口
export interface StatsService {
  // 获取学习统计
  getLearningStats(userId: string): Promise<LearningStats>;
  
  // 更新每日统计
  updateDailyStats(userId: string, date: string, stats: Partial<import('./index').DailyStats>): Promise<void>;
  
  // 获取学习趋势
  getLearningTrend(userId: string, days: number): Promise<import('./index').DailyStats[]>;
  
  // 获取等级进度
  getLevelProgress(userId: string): Promise<import('./index').LevelProgress[]>;
  
  // 重置统计数据
  resetStats(userId: string): Promise<boolean>;
}

// 设置服务接口
export interface SettingsService {
  // 获取用户设置
  getUserSettings(userId: string): Promise<UserSettings | null>;
  
  // 更新用户设置
  updateUserSettings(userId: string, settings: Partial<UserSettings>): Promise<UserSettings>;
  
  // 重置设置为默认值
  resetSettings(userId: string): Promise<UserSettings>;
}

// 音频服务接口
export interface AudioService {
  // 播放文本
  playText(text: string, options?: AudioPlayOptions): Promise<void>;
  
  // 停止播放
  stop(): void;
  
  // 暂停播放
  pause(): void;
  
  // 恢复播放
  resume(): void;
  
  // 设置播放速度
  setPlaybackSpeed(speed: number): void;
  
  // 设置音量
  setVolume(volume: number): void;
  
  // 获取可用语音
  getAvailableVoices(): SpeechSynthesisVoice[];
  
  // 检查浏览器支持
  isSupported(): boolean;
}

// 音频播放选项
export interface AudioPlayOptions {
  voice?: SpeechSynthesisVoice;
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
}

// 数据存储服务接口
export interface StorageService {
  // 获取数据
  get<T>(key: string): Promise<T | null>;
  
  // 设置数据
  set<T>(key: string, value: T): Promise<void>;
  
  // 删除数据
  remove(key: string): Promise<void>;
  
  // 清空所有数据
  clear(): Promise<void>;
  
  // 获取所有键
  keys(): Promise<string[]>;
  
  // 检查键是否存在
  has(key: string): Promise<boolean>;
}

// IndexedDB服务接口
export interface IndexedDBService extends StorageService {
  // 初始化数据库
  init(): Promise<void>;
  
  // 获取数据库版本
  getVersion(): number;
  
  // 升级数据库
  upgrade(newVersion: number): Promise<void>;
  
  // 批量操作
  batch(operations: BatchOperation[]): Promise<void>;
  
  // 查询数据
  query<T>(storeName: string, query?: IDBKeyRange | IDBValidKey): Promise<T[]>;
  
  // 计数
  count(storeName: string, query?: IDBKeyRange | IDBValidKey): Promise<number>;
}

// 批量操作类型
export interface BatchOperation {
  type: 'add' | 'put' | 'delete';
  storeName: string;
  key?: IDBValidKey;
  value?: any;
}

// LocalStorage服务接口
export interface LocalStorageService extends StorageService {
  // 获取存储大小
  getSize(): number;
  
  // 获取剩余空间
  getRemainingSpace(): number;
}

// 数据同步服务接口
export interface SyncService {
  // 同步数据到本地
  syncToLocal(): Promise<void>;
  
  // 从本地同步数据
  syncFromLocal(): Promise<void>;
  
  // 检查同步状态
  getSyncStatus(): Promise<SyncStatus>;
  
  // 强制同步
  forceSync(): Promise<void>;
}

// 同步状态
export interface SyncStatus {
  lastSyncTime: Date;
  isInSync: boolean;
  pendingChanges: number;
  errors: string[];
}

// 导入导出服务接口
export interface ImportExportService {
  // 导出数据
  exportData(format: 'json' | 'csv' | 'xlsx'): Promise<Blob>;
  
  // 导入数据
  importData(file: File): Promise<ImportResult>;
  
  // 验证导入文件
  validateImportFile(file: File): Promise<ValidationResult>;
}

// 导入结果
export interface ImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  errors: string[];
  data?: any[];
}

// 验证结果
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  preview?: any[];
}

// 服务容器接口
export interface ServiceContainer {
  vocabularyService: VocabularyService;
  progressService: ProgressService;
  collectionService: CollectionService;
  statsService: StatsService;
  settingsService: SettingsService;
  audioService: AudioService;
  storageService: StorageService;
  indexedDBService: IndexedDBService;
  localStorageService: LocalStorageService;
  syncService: SyncService;
  importExportService: ImportExportService;
}