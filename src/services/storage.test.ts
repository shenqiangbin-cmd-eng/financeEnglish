import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Vocabulary, UserProgress, LearningStatus } from '../types';

// Mock the services
vi.mock('./indexedDB', () => ({
  indexedDBService: {
    init: vi.fn().mockResolvedValue(undefined),
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
    keys: vi.fn(),
    has: vi.fn(),
    getVocabularies: vi.fn(),
    addVocabulary: vi.fn(),
    updateVocabulary: vi.fn(),
    deleteVocabulary: vi.fn(),
    getUserProgress: vi.fn(),
    updateUserProgress: vi.fn(),
    getCollections: vi.fn(),
    updateCollection: vi.fn(),
    getLearningStats: vi.fn(),
    updateLearningStats: vi.fn(),
    getUserSettings: vi.fn(),
    updateUserSettings: vi.fn(),
    batch: vi.fn(),
    getVersion: vi.fn().mockReturnValue(1)
  }
}));

vi.mock('./localStorage', () => ({
  localStorageService: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
    keys: vi.fn(),
    has: vi.fn(),
    getSize: vi.fn().mockReturnValue(1024),
    getRemainingSpace: vi.fn().mockReturnValue(4096),
    isAvailable: vi.fn().mockReturnValue(true),
    exportData: vi.fn(),
    importData: vi.fn(),
    removeMultiple: vi.fn()
  },
  STORAGE_KEYS: {
    USER_SETTINGS: 'user_settings'
  }
}));

import { StorageServiceImpl } from './storage';
import { indexedDBService } from './indexedDB';
import { localStorageService } from './localStorage';

describe('StorageService', () => {
  let storageService: StorageServiceImpl;

  beforeEach(() => {
    vi.clearAllMocks();
    storageService = new StorageServiceImpl();
  });

  describe('基础存储接口', () => {
    it('应该能够获取数据', async () => {
      const testData = { test: 'value' };
      vi.mocked(indexedDBService.get).mockResolvedValue(testData);

      const result = await storageService.get('test-key');

      expect(indexedDBService.get).toHaveBeenCalledWith('test-key');
      expect(result).toEqual(testData);
    });

    it('应该能够设置数据', async () => {
      const testData = { test: 'value' };
      vi.mocked(indexedDBService.set).mockResolvedValue(undefined);

      await storageService.set('test-key', testData);

      expect(indexedDBService.set).toHaveBeenCalledWith('test-key', testData);
    });

    it('应该能够删除数据', async () => {
      vi.mocked(indexedDBService.remove).mockResolvedValue(undefined);

      await storageService.remove('test-key');

      expect(indexedDBService.remove).toHaveBeenCalledWith('test-key');
    });

    it('应该能够清空所有数据', async () => {
      vi.mocked(indexedDBService.clear).mockResolvedValue(undefined);

      await storageService.clear();

      expect(indexedDBService.clear).toHaveBeenCalled();
    });

    it('应该能够获取所有键', async () => {
      const keys = ['key1', 'key2', 'key3'];
      vi.mocked(indexedDBService.keys).mockResolvedValue(keys);

      const result = await storageService.keys();

      expect(indexedDBService.keys).toHaveBeenCalled();
      expect(result).toEqual(keys);
    });

    it('应该能够检查键是否存在', async () => {
      vi.mocked(indexedDBService.has).mockResolvedValue(true);

      const result = await storageService.has('test-key');

      expect(indexedDBService.has).toHaveBeenCalledWith('test-key');
      expect(result).toBe(true);
    });
  });

  describe('词汇相关方法', () => {
    const mockVocabulary: Vocabulary = {
      id: 'vocab-1',
      word: 'investment',
      pronunciation: '/ɪnˈvestmənt/',
      definition: '投资',
      example: 'Long-term investment is important.',
      exampleTranslation: '长期投资很重要。',
      difficulty: 'intermediate',
      category: 'finance',
      tags: ['finance', 'business'],
      audioUrl: 'https://example.com/audio/investment.mp3',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    it('应该能够获取所有词汇', async () => {
      const vocabularies = [mockVocabulary];
      vi.mocked(indexedDBService.getVocabularies).mockResolvedValue(vocabularies);

      const result = await storageService.getVocabularies();

      expect(indexedDBService.getVocabularies).toHaveBeenCalled();
      expect(result).toEqual(vocabularies);
    });

    it('应该能够添加词汇', async () => {
      vi.mocked(indexedDBService.addVocabulary).mockResolvedValue(undefined);

      await storageService.addVocabulary(mockVocabulary);

      expect(indexedDBService.addVocabulary).toHaveBeenCalledWith(mockVocabulary);
    });

    it('应该能够更新词汇', async () => {
      vi.mocked(indexedDBService.updateVocabulary).mockResolvedValue(undefined);

      await storageService.updateVocabulary(mockVocabulary);

      expect(indexedDBService.updateVocabulary).toHaveBeenCalledWith(mockVocabulary);
    });

    it('应该能够删除词汇', async () => {
      vi.mocked(indexedDBService.deleteVocabulary).mockResolvedValue(undefined);

      await storageService.deleteVocabulary('vocab-1');

      expect(indexedDBService.deleteVocabulary).toHaveBeenCalledWith('vocab-1');
    });

    it('应该能够批量添加词汇', async () => {
      const vocabularies = [mockVocabulary];
      vi.mocked(indexedDBService.batch).mockResolvedValue(undefined);

      await storageService.addVocabularies(vocabularies);

      expect(indexedDBService.batch).toHaveBeenCalledWith([
        {
          type: 'add',
          storeName: 'vocabularies',
          value: mockVocabulary
        }
      ]);
    });
  });

  describe('用户进度相关方法', () => {
    const mockProgress: UserProgress = {
      id: 'progress-1',
      userId: 'user-1',
      vocabularyId: 'vocab-1',
      status: LearningStatus.LEARNING,
      correctCount: 3,
      incorrectCount: 1,
      lastReviewedAt: new Date(),
      nextReviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      easeFactor: 2.5,
      interval: 1,
      repetitions: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    it('应该能够获取用户进度', async () => {
      const progressList = [mockProgress];
      vi.mocked(indexedDBService.getUserProgress).mockResolvedValue(progressList);

      const result = await storageService.getUserProgress('user-1');

      expect(indexedDBService.getUserProgress).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(progressList);
    });

    it('应该能够更新用户进度', async () => {
      vi.mocked(indexedDBService.updateUserProgress).mockResolvedValue(undefined);

      await storageService.updateUserProgress(mockProgress);

      expect(indexedDBService.updateUserProgress).toHaveBeenCalledWith(mockProgress);
    });

    it('应该能够批量更新用户进度', async () => {
      const progressList = [mockProgress];
      vi.mocked(indexedDBService.batch).mockResolvedValue(undefined);

      await storageService.updateUserProgressBatch(progressList);

      expect(indexedDBService.batch).toHaveBeenCalledWith([
        {
          type: 'put',
          storeName: 'userProgress',
          value: mockProgress
        }
      ]);
    });
  });

  describe('用户设置相关方法', () => {
    const mockSettings = {
      id: 'settings-1',
      userId: 'user-1',
      theme: 'light' as const,
      language: 'zh-CN' as const,
      audioEnabled: true,
      voiceType: 'us' as const,
      playbackSpeed: 1.0,
      dailyGoal: 20,
      reminderEnabled: true,
      reminderTime: '09:00',
      autoPlayAudio: false,
      showTranslation: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    it('应该能够获取用户设置（从IndexedDB）', async () => {
      vi.mocked(indexedDBService.getUserSettings).mockResolvedValue(mockSettings);
      vi.mocked(localStorageService.get).mockResolvedValue(null);

      const result = await storageService.getUserSettings('user-1');

      expect(indexedDBService.getUserSettings).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(mockSettings);
    });

    it('应该能够获取用户设置（从localStorage备份）', async () => {
      vi.mocked(indexedDBService.getUserSettings).mockResolvedValue(null);
      vi.mocked(localStorageService.get).mockResolvedValue(mockSettings);
      vi.mocked(indexedDBService.updateUserSettings).mockResolvedValue(undefined);

      const result = await storageService.getUserSettings('user-1');

      expect(indexedDBService.getUserSettings).toHaveBeenCalledWith('user-1');
      expect(localStorageService.get).toHaveBeenCalledWith('user_settings');
      expect(indexedDBService.updateUserSettings).toHaveBeenCalledWith(mockSettings);
      expect(result).toEqual(mockSettings);
    });

    it('应该能够更新用户设置', async () => {
      vi.mocked(indexedDBService.updateUserSettings).mockResolvedValue(undefined);
      vi.mocked(localStorageService.set).mockResolvedValue(undefined);

      await storageService.updateUserSettings(mockSettings);

      expect(indexedDBService.updateUserSettings).toHaveBeenCalledWith(mockSettings);
      expect(localStorageService.set).toHaveBeenCalledWith('user_settings', mockSettings);
    });
  });

  describe('存储信息', () => {
    it('应该能够获取存储使用情况', () => {
      const info = storageService.getStorageInfo();

      expect(info).toEqual({
        localStorage: {
          size: 1024,
          remainingSpace: 4096,
          isAvailable: true
        },
        indexedDB: {
          version: 1
        }
      });
    });
  });

  describe('错误处理', () => {
    it('应该处理获取数据时的错误', async () => {
      vi.mocked(indexedDBService.get).mockRejectedValue(new Error('Database error'));

      const result = await storageService.get('test-key');

      expect(result).toBeNull();
    });

    it('应该处理设置数据时的错误', async () => {
      vi.mocked(indexedDBService.set).mockRejectedValue(new Error('Database error'));

      await expect(storageService.set('test-key', 'test-value')).rejects.toThrow();
    });

    it('应该处理获取词汇时的错误', async () => {
      vi.mocked(indexedDBService.getVocabularies).mockRejectedValue(new Error('Database error'));

      await expect(storageService.getVocabularies()).rejects.toThrow();
    });
  });
});