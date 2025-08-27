import {
  Vocabulary,
  UserProgress,
  Collection,
  LearningStats,
  UserSettings
} from '../types';
import {
  IndexedDBService,
  BatchOperation
} from '../types/services';

// IndexedDB数据库配置
const DB_NAME = 'FinancialEnglishLearning';
const DB_VERSION = 1;

// 对象存储名称
const STORES = {
  VOCABULARIES: 'vocabularies',
  USER_PROGRESS: 'userProgress',
  COLLECTIONS: 'collections',
  LEARNING_STATS: 'learningStats',
  USER_SETTINGS: 'userSettings'
} as const;

export class IndexedDBServiceImpl implements IndexedDBService {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.initPromise = this.init();
  }

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error(`Failed to open database: ${request.error?.message}`));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        this.createObjectStores(db);
      };
    });
  }

  private createObjectStores(db: IDBDatabase): void {
    // 词汇表
    if (!db.objectStoreNames.contains(STORES.VOCABULARIES)) {
      const vocabularyStore = db.createObjectStore(STORES.VOCABULARIES, { keyPath: 'id' });
      vocabularyStore.createIndex('word', 'word', { unique: false });
      vocabularyStore.createIndex('level', 'level', { unique: false });
      vocabularyStore.createIndex('category', 'category', { unique: false });
      vocabularyStore.createIndex('tags', 'tags', { unique: false, multiEntry: true });
    }

    // 用户进度表
    if (!db.objectStoreNames.contains(STORES.USER_PROGRESS)) {
      const progressStore = db.createObjectStore(STORES.USER_PROGRESS, { keyPath: 'id' });
      progressStore.createIndex('vocabularyId', 'vocabularyId', { unique: false });
      progressStore.createIndex('userId', 'userId', { unique: false });
      progressStore.createIndex('status', 'status', { unique: false });
      progressStore.createIndex('nextReviewAt', 'nextReviewAt', { unique: false });
    }

    // 收藏夹表
    if (!db.objectStoreNames.contains(STORES.COLLECTIONS)) {
      const collectionStore = db.createObjectStore(STORES.COLLECTIONS, { keyPath: 'id' });
      collectionStore.createIndex('userId', 'userId', { unique: false });
      collectionStore.createIndex('type', 'type', { unique: false });
    }

    // 学习统计表
      if (!db.objectStoreNames.contains(STORES.LEARNING_STATS)) {
        db.createObjectStore(STORES.LEARNING_STATS, { keyPath: 'userId' });
      }

    // 用户设置表
      if (!db.objectStoreNames.contains(STORES.USER_SETTINGS)) {
        db.createObjectStore(STORES.USER_SETTINGS, { keyPath: 'userId' });
      }
  }

  private async ensureInitialized(): Promise<void> {
    if (this.initPromise) {
      await this.initPromise;
    }
    if (!this.db) {
      throw new Error('Database not initialized');
    }
  }

  async get<T>(key: string): Promise<T | null> {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.VOCABULARIES], 'readonly');
      const store = transaction.objectStore(STORES.VOCABULARIES);
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => {
        reject(new Error(`Failed to get item: ${request.error?.message}`));
      };
    });
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.VOCABULARIES], 'readwrite');
      const store = transaction.objectStore(STORES.VOCABULARIES);
      const request = store.put({ ...value, id: key });

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error(`Failed to set item: ${request.error?.message}`));
      };
    });
  }

  async remove(key: string): Promise<void> {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.VOCABULARIES], 'readwrite');
      const store = transaction.objectStore(STORES.VOCABULARIES);
      const request = store.delete(key);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error(`Failed to remove item: ${request.error?.message}`));
      };
    });
  }

  async clear(): Promise<void> {
    await this.ensureInitialized();
    
    const storeNames = Object.values(STORES);
    const transaction = this.db!.transaction(storeNames, 'readwrite');
    
    const promises = storeNames.map(storeName => {
      return new Promise<void>((resolve, reject) => {
        const store = transaction.objectStore(storeName);
        const request = store.clear();
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(new Error(`Failed to clear store ${storeName}`));
      });
    });
    
    await Promise.all(promises);
  }

  async keys(): Promise<string[]> {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.VOCABULARIES], 'readonly');
      const store = transaction.objectStore(STORES.VOCABULARIES);
      const request = store.getAllKeys();

      request.onsuccess = () => {
        resolve(request.result.map(key => String(key)));
      };

      request.onerror = () => {
        reject(new Error(`Failed to get keys: ${request.error?.message}`));
      };
    });
  }

  async has(key: string): Promise<boolean> {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.VOCABULARIES], 'readonly');
      const store = transaction.objectStore(STORES.VOCABULARIES);
      const request = store.count(key);

      request.onsuccess = () => {
        resolve(request.result > 0);
      };

      request.onerror = () => {
        reject(new Error(`Failed to check key existence: ${request.error?.message}`));
      };
    });
  }

  getVersion(): number {
    return DB_VERSION;
  }

  async upgrade(newVersion: number): Promise<void> {
    if (this.db) {
      this.db.close();
    }
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, newVersion);
      
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onerror = () => {
        reject(new Error(`Failed to upgrade database: ${request.error?.message}`));
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        this.createObjectStores(db);
      };
    });
  }

  async batch(operations: BatchOperation[]): Promise<void> {
    await this.ensureInitialized();
    
    const storeNames = [...new Set(operations.map(op => op.storeName))];
    const transaction = this.db!.transaction(storeNames, 'readwrite');
    
    const promises = operations.map(operation => {
      return new Promise<void>((resolve, reject) => {
        const store = transaction.objectStore(operation.storeName);
        let request: IDBRequest;
        
        switch (operation.type) {
          case 'add':
            request = store.add(operation.value);
            break;
          case 'put':
            request = store.put(operation.value);
            break;
          case 'delete':
            request = store.delete(operation.key!);
            break;
          default:
            reject(new Error(`Unknown operation type: ${operation.type}`));
            return;
        }
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(new Error(`Batch operation failed: ${request.error?.message}`));
      });
    });
    
    await Promise.all(promises);
  }

  async query<T>(storeName: string, query?: IDBKeyRange | IDBValidKey): Promise<T[]> {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = query ? store.getAll(query) : store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error(`Failed to query store: ${request.error?.message}`));
      };
    });
  }

  async count(storeName: string, query?: IDBKeyRange | IDBValidKey): Promise<number> {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = query ? store.count(query) : store.count();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error(`Failed to count items: ${request.error?.message}`));
      };
    });
  }

  // 专用方法：词汇相关
  async getVocabularies(): Promise<Vocabulary[]> {
    return this.query<Vocabulary>(STORES.VOCABULARIES);
  }

  async addVocabulary(vocabulary: Vocabulary): Promise<void> {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.VOCABULARIES], 'readwrite');
      const store = transaction.objectStore(STORES.VOCABULARIES);
      const request = store.add(vocabulary);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to add vocabulary: ${request.error?.message}`));
    });
  }

  async updateVocabulary(vocabulary: Vocabulary): Promise<void> {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.VOCABULARIES], 'readwrite');
      const store = transaction.objectStore(STORES.VOCABULARIES);
      const request = store.put(vocabulary);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to update vocabulary: ${request.error?.message}`));
    });
  }

  async deleteVocabulary(id: string): Promise<void> {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.VOCABULARIES], 'readwrite');
      const store = transaction.objectStore(STORES.VOCABULARIES);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to delete vocabulary: ${request.error?.message}`));
    });
  }

  // 专用方法：用户进度相关
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.USER_PROGRESS], 'readonly');
      const store = transaction.objectStore(STORES.USER_PROGRESS);
      const index = store.index('userId');
      const request = index.getAll(userId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error(`Failed to get user progress: ${request.error?.message}`));
    });
  }

  async updateUserProgress(progress: UserProgress): Promise<void> {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.USER_PROGRESS], 'readwrite');
      const store = transaction.objectStore(STORES.USER_PROGRESS);
      const request = store.put(progress);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to update progress: ${request.error?.message}`));
    });
  }

  // 专用方法：收藏夹相关
  async getCollections(userId: string): Promise<Collection[]> {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.COLLECTIONS], 'readonly');
      const store = transaction.objectStore(STORES.COLLECTIONS);
      const index = store.index('userId');
      const request = index.getAll(userId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error(`Failed to get collections: ${request.error?.message}`));
    });
  }

  async updateCollection(collection: Collection): Promise<void> {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.COLLECTIONS], 'readwrite');
      const store = transaction.objectStore(STORES.COLLECTIONS);
      const request = store.put(collection);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to update collection: ${request.error?.message}`));
    });
  }

  // 专用方法：学习统计相关
  async getLearningStats(userId: string): Promise<LearningStats | null> {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.LEARNING_STATS], 'readonly');
      const store = transaction.objectStore(STORES.LEARNING_STATS);
      const request = store.get(userId);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(new Error(`Failed to get learning stats: ${request.error?.message}`));
    });
  }

  async updateLearningStats(userId: string, stats: LearningStats): Promise<void> {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.LEARNING_STATS], 'readwrite');
      const store = transaction.objectStore(STORES.LEARNING_STATS);
      const request = store.put({ ...stats, userId });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to update learning stats: ${request.error?.message}`));
    });
  }

  // 专用方法：用户设置相关
  async getUserSettings(userId: string): Promise<UserSettings | null> {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.USER_SETTINGS], 'readonly');
      const store = transaction.objectStore(STORES.USER_SETTINGS);
      const request = store.get(userId);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(new Error(`Failed to get user settings: ${request.error?.message}`));
    });
  }

  async updateUserSettings(settings: UserSettings): Promise<void> {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.USER_SETTINGS], 'readwrite');
      const store = transaction.objectStore(STORES.USER_SETTINGS);
      const request = store.put(settings);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to update user settings: ${request.error?.message}`));
    });
  }
}

// 导出单例实例
export const indexedDBService = new IndexedDBServiceImpl();