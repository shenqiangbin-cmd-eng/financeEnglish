import {
  Vocabulary,
  UserProgress,
  Collection,
  LearningStats,
  UserSettings
} from '../types';
import { StorageService } from '../types/services';
import { indexedDBService } from './indexedDB';
import { localStorageService, STORAGE_KEYS } from './localStorage';

/**
 * 统一存储服务实现类
 * 整合IndexedDB和LocalStorage，提供统一的数据访问接口
 */
export class StorageServiceImpl implements StorageService {
  private readonly indexedDB = indexedDBService;
  private readonly localStorage = localStorageService;

  constructor() {
    this.init();
  }

  /**
   * 初始化存储服务
   */
  private async init(): Promise<void> {
    try {
      await this.indexedDB.init();
      console.log('Storage service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize storage service:', error);
      throw error;
    }
  }

  // ==================== 基础存储接口实现 ====================

  /**
   * 通用获取方法
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      return await this.indexedDB.get<T>(key);
    } catch (error) {
      console.error(`Failed to get item ${key}:`, error);
      return null;
    }
  }

  /**
   * 通用设置方法
   */
  async set<T>(key: string, value: T): Promise<void> {
    try {
      await this.indexedDB.set(key, value);
    } catch (error) {
      console.error(`Failed to set item ${key}:`, error);
      throw error;
    }
  }

  /**
   * 通用删除方法
   */
  async remove(key: string): Promise<void> {
    try {
      await this.indexedDB.remove(key);
    } catch (error) {
      console.error(`Failed to remove item ${key}:`, error);
      throw error;
    }
  }

  /**
   * 清空所有数据
   */
  async clear(): Promise<void> {
    try {
      await this.indexedDB.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
      throw error;
    }
  }

  /**
   * 获取所有键
   */
  async keys(): Promise<string[]> {
    try {
      return await this.indexedDB.keys();
    } catch (error) {
      console.error('Failed to get keys:', error);
      return [];
    }
  }

  /**
   * 检查键是否存在
   */
  async has(key: string): Promise<boolean> {
    try {
      return await this.indexedDB.has(key);
    } catch (error) {
      console.error(`Failed to check key existence ${key}:`, error);
      return false;
    }
  }

  // ==================== 词汇相关方法 ====================

  /**
   * 获取所有词汇
   */
  async getVocabularies(): Promise<Vocabulary[]> {
    try {
      return await this.indexedDB.getVocabularies();
    } catch (error) {
      console.error('Failed to get vocabularies:', error);
      throw error;
    }
  }

  /**
   * 根据ID获取词汇
   */
  async getVocabulary(id: string): Promise<Vocabulary | null> {
    try {
      return await this.indexedDB.get<Vocabulary>(id);
    } catch (error) {
      console.error(`Failed to get vocabulary ${id}:`, error);
      return null;
    }
  }

  /**
   * 添加词汇
   */
  async addVocabulary(vocabulary: Vocabulary): Promise<void> {
    try {
      await this.indexedDB.addVocabulary(vocabulary);
    } catch (error) {
      console.error('Failed to add vocabulary:', error);
      throw error;
    }
  }

  /**
   * 更新词汇
   */
  async updateVocabulary(vocabulary: Vocabulary): Promise<void> {
    try {
      await this.indexedDB.updateVocabulary(vocabulary);
    } catch (error) {
      console.error('Failed to update vocabulary:', error);
      throw error;
    }
  }

  /**
   * 删除词汇
   */
  async deleteVocabulary(id: string): Promise<void> {
    try {
      await this.indexedDB.deleteVocabulary(id);
    } catch (error) {
      console.error(`Failed to delete vocabulary ${id}:`, error);
      throw error;
    }
  }

  /**
   * 批量添加词汇
   */
  async addVocabularies(vocabularies: Vocabulary[]): Promise<void> {
    try {
      const operations = vocabularies.map(vocab => ({
        type: 'add' as const,
        storeName: 'vocabularies',
        value: vocab
      }));
      await this.indexedDB.batch(operations);
    } catch (error) {
      console.error('Failed to add vocabularies in batch:', error);
      throw error;
    }
  }

  // ==================== 用户进度相关方法 ====================

  /**
   * 获取用户进度
   */
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    try {
      return await this.indexedDB.getUserProgress(userId);
    } catch (error) {
      console.error(`Failed to get user progress for ${userId}:`, error);
      return [];
    }
  }

  /**
   * 获取特定词汇的用户进度
   */
  async getVocabularyProgress(userId: string, vocabularyId: string): Promise<UserProgress | null> {
    try {
      const allProgress = await this.getUserProgress(userId);
      return allProgress.find(p => p.vocabularyId === vocabularyId) || null;
    } catch (error) {
      console.error(`Failed to get vocabulary progress for ${vocabularyId}:`, error);
      return null;
    }
  }

  /**
   * 更新用户进度
   */
  async updateUserProgress(progress: UserProgress): Promise<void> {
    try {
      await this.indexedDB.updateUserProgress(progress);
    } catch (error) {
      console.error('Failed to update user progress:', error);
      throw error;
    }
  }

  /**
   * 批量更新用户进度
   */
  async updateUserProgressBatch(progressList: UserProgress[]): Promise<void> {
    try {
      const operations = progressList.map(progress => ({
        type: 'put' as const,
        storeName: 'userProgress',
        value: progress
      }));
      await this.indexedDB.batch(operations);
    } catch (error) {
      console.error('Failed to update user progress in batch:', error);
      throw error;
    }
  }

  // ==================== 收藏夹相关方法 ====================

  /**
   * 获取用户收藏夹
   */
  async getCollections(userId: string): Promise<Collection[]> {
    try {
      return await this.indexedDB.getCollections(userId);
    } catch (error) {
      console.error(`Failed to get collections for ${userId}:`, error);
      return [];
    }
  }

  /**
   * 添加收藏夹
   */
  async addCollection(collection: Collection): Promise<void> {
    try {
      await this.indexedDB.updateCollection(collection);
    } catch (error) {
      console.error('Failed to add collection:', error);
      throw error;
    }
  }

  /**
   * 更新收藏夹
   */
  async updateCollection(collection: Collection): Promise<void> {
    try {
      await this.indexedDB.updateCollection(collection);
    } catch (error) {
      console.error('Failed to update collection:', error);
      throw error;
    }
  }

  /**
   * 删除收藏夹
   */
  async deleteCollection(id: string): Promise<void> {
    try {
      await this.indexedDB.remove(id);
    } catch (error) {
      console.error(`Failed to delete collection ${id}:`, error);
      throw error;
    }
  }

  // ==================== 学习统计相关方法 ====================

  /**
   * 获取学习统计
   */
  async getLearningStats(userId: string): Promise<LearningStats | null> {
    try {
      return await this.indexedDB.getLearningStats(userId);
    } catch (error) {
      console.error(`Failed to get learning stats for ${userId}:`, error);
      return null;
    }
  }

  /**
   * 更新学习统计
   */
  async updateLearningStats(userId: string, stats: LearningStats): Promise<void> {
    try {
      await this.indexedDB.updateLearningStats(userId, stats);
    } catch (error) {
      console.error('Failed to update learning stats:', error);
      throw error;
    }
  }

  // ==================== 用户设置相关方法 ====================

  /**
   * 获取用户设置
   */
  async getUserSettings(userId: string): Promise<UserSettings | null> {
    try {
      // 优先从IndexedDB获取
      let settings = await this.indexedDB.getUserSettings(userId);
      
      // 如果IndexedDB中没有，尝试从localStorage获取
      if (!settings) {
        settings = await this.localStorage.get<UserSettings>(STORAGE_KEYS.USER_SETTINGS);
        
        // 如果localStorage中有设置，同步到IndexedDB
        if (settings) {
          await this.indexedDB.updateUserSettings(settings);
        }
      }
      
      return settings;
    } catch (error) {
      console.error(`Failed to get user settings for ${userId}:`, error);
      return null;
    }
  }

  /**
   * 更新用户设置
   */
  async updateUserSettings(settings: UserSettings): Promise<void> {
    try {
      // 同时更新IndexedDB和localStorage
      await Promise.all([
        this.indexedDB.updateUserSettings(settings),
        this.localStorage.set(STORAGE_KEYS.USER_SETTINGS, settings)
      ]);
    } catch (error) {
      console.error('Failed to update user settings:', error);
      throw error;
    }
  }

  // ==================== 缓存和同步相关方法 ====================

  /**
   * 获取缓存数据
   */
  async getCacheData<T>(key: string): Promise<T | null> {
    try {
      return await this.localStorage.get<T>(key);
    } catch (error) {
      console.error(`Failed to get cache data for ${key}:`, error);
      return null;
    }
  }

  /**
   * 设置缓存数据
   */
  async setCacheData<T>(key: string, data: T, ttl?: number): Promise<void> {
    try {
      const cacheItem = {
        data,
        timestamp: Date.now(),
        ttl
      };
      await this.localStorage.set(key, cacheItem);
    } catch (error) {
      console.error(`Failed to set cache data for ${key}:`, error);
      throw error;
    }
  }

  /**
   * 检查缓存是否有效
   */
  async isCacheValid(key: string): Promise<boolean> {
    try {
      const cacheItem = await this.localStorage.get<{
        data: any;
        timestamp: number;
        ttl?: number;
      }>(key);
      
      if (!cacheItem) {
        return false;
      }
      
      if (cacheItem.ttl) {
        const isExpired = Date.now() - cacheItem.timestamp > cacheItem.ttl;
        return !isExpired;
      }
      
      return true;
    } catch (error) {
      console.error(`Failed to check cache validity for ${key}:`, error);
      return false;
    }
  }

  /**
   * 清除过期缓存
   */
  async clearExpiredCache(): Promise<void> {
    try {
      const allKeys = await this.localStorage.keys();
      const expiredKeys: string[] = [];
      
      for (const key of allKeys) {
        if (!(await this.isCacheValid(key))) {
          expiredKeys.push(key);
        }
      }
      
      await this.localStorage.removeMultiple(expiredKeys);
    } catch (error) {
      console.error('Failed to clear expired cache:', error);
    }
  }

  // ==================== 数据导入导出相关方法 ====================

  /**
   * 导出所有数据
   */
  async exportAllData(): Promise<{
    vocabularies: Vocabulary[];
    userProgress: UserProgress[];
    collections: Collection[];
    learningStats: LearningStats | null;
    userSettings: UserSettings | null;
    localStorage: Record<string, any>;
  }> {
    try {
      const [vocabularies, localStorage] = await Promise.all([
        this.indexedDB.getVocabularies(),
        this.localStorage.exportData()
      ]);
      
      // 假设当前用户ID为 'default'
      const userId = 'default';
      const [userProgress, collections, learningStats, userSettings] = await Promise.all([
        this.getUserProgress(userId),
        this.getCollections(userId),
        this.getLearningStats(userId),
        this.getUserSettings(userId)
      ]);
      
      return {
        vocabularies,
        userProgress,
        collections,
        learningStats,
        userSettings,
        localStorage
      };
    } catch (error) {
      console.error('Failed to export all data:', error);
      throw error;
    }
  }

  /**
   * 导入所有数据
   */
  async importAllData(data: {
    vocabularies?: Vocabulary[];
    userProgress?: UserProgress[];
    collections?: Collection[];
    learningStats?: LearningStats;
    userSettings?: UserSettings;
    localStorage?: Record<string, any>;
  }): Promise<void> {
    try {
      // 导入词汇数据
      if (data.vocabularies) {
        await this.addVocabularies(data.vocabularies);
      }
      
      // 导入用户进度
      if (data.userProgress) {
        await this.updateUserProgressBatch(data.userProgress);
      }
      
      // 导入收藏夹
      if (data.collections) {
        for (const collection of data.collections) {
          await this.updateCollection(collection);
        }
      }
      
      // 导入学习统计
      if (data.learningStats) {
        const userId = 'default';
        await this.updateLearningStats(userId, data.learningStats);
      }
      
      // 导入用户设置
      if (data.userSettings) {
        await this.updateUserSettings(data.userSettings);
      }
      
      // 导入localStorage数据
      if (data.localStorage) {
        await this.localStorage.importData(data.localStorage, true);
      }
    } catch (error) {
      console.error('Failed to import all data:', error);
      throw error;
    }
  }

  /**
   * 清除所有数据
   */
  async clearAllData(): Promise<void> {
    try {
      await Promise.all([
        this.indexedDB.clear(),
        this.localStorage.clear()
      ]);
    } catch (error) {
      console.error('Failed to clear all data:', error);
      throw error;
    }
  }

  /**
   * 获取存储使用情况
   */
  getStorageInfo(): {
    localStorage: {
      size: number;
      remainingSpace: number;
      isAvailable: boolean;
    };
    indexedDB: {
      version: number;
    };
  } {
    return {
      localStorage: {
        size: this.localStorage.getSize(),
        remainingSpace: this.localStorage.getRemainingSpace(),
        isAvailable: this.localStorage.isAvailable()
      },
      indexedDB: {
        version: this.indexedDB.getVersion()
      }
    };
  }
}

// 导出单例实例
export const storageService = new StorageServiceImpl();