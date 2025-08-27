// 导出所有服务实例和类型
export { indexedDBService, IndexedDBServiceImpl } from './indexedDB';
export { localStorageService, LocalStorageServiceImpl, STORAGE_KEYS } from './localStorage';
export { storageService, StorageServiceImpl } from './storage';
export { audioService } from './audioService';

// 导出服务相关类型
export type {
  VocabularyService,
  ProgressService,
  CollectionService,
  StatsService,
  SettingsService,
  AudioService,
  StorageService,
  IndexedDBService,
  LocalStorageService,
  SyncService,
  ImportExportService,
  ServiceContainer,
  BatchOperation,
  AudioPlayOptions,
  SyncStatus,
  ImportResult,
  ValidationResult
} from '../types/services';

// 导出音频相关类型
export type { AudioPlayer, SpeechSynthesizer } from '../types/audio';