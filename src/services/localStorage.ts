import { LocalStorageService } from '../types/services';

/**
 * LocalStorage服务实现类
 * 提供类型安全的localStorage操作接口
 */
export class LocalStorageServiceImpl implements LocalStorageService {
  /**
   * 获取存储的值
   * @param key 存储键
   * @returns 解析后的值或null
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Failed to get item from localStorage: ${key}`, error);
      return null;
    }
  }

  /**
   * 设置存储值
   * @param key 存储键
   * @param value 要存储的值
   */
  async set<T>(key: string, value: T): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Failed to set item in localStorage: ${key}`, error);
      throw new Error(`Failed to store item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 删除存储的值
   * @param key 存储键
   */
  async remove(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove item from localStorage: ${key}`, error);
      throw new Error(`Failed to remove item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 清空所有存储
   */
  async clear(): Promise<void> {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage', error);
      throw new Error(`Failed to clear storage: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 获取所有存储键
   * @returns 所有键的数组
   */
  async keys(): Promise<string[]> {
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key !== null) {
          keys.push(key);
        }
      }
      return keys;
    } catch (error) {
      console.error('Failed to get keys from localStorage', error);
      return [];
    }
  }

  /**
   * 检查键是否存在
   * @param key 存储键
   * @returns 是否存在
   */
  async has(key: string): Promise<boolean> {
    try {
      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.error(`Failed to check key existence in localStorage: ${key}`, error);
      return false;
    }
  }

  /**
   * 获取存储大小（估算）
   * @returns 存储大小（字节）
   */
  getSize(): number {
    try {
      let totalSize = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key !== null) {
          const value = localStorage.getItem(key);
          if (value !== null) {
            // 估算大小：键长度 + 值长度（UTF-16编码，每字符2字节）
            totalSize += (key.length + value.length) * 2;
          }
        }
      }
      return totalSize;
    } catch (error) {
      console.error('Failed to calculate localStorage size', error);
      return 0;
    }
  }

  /**
   * 获取剩余存储空间（估算）
   * @returns 剩余空间（字节）
   */
  getRemainingSpace(): number {
    try {
      // 大多数浏览器localStorage限制为5-10MB
      const STORAGE_LIMIT = 5 * 1024 * 1024; // 5MB
      const currentSize = this.getSize();
      return Math.max(0, STORAGE_LIMIT - currentSize);
    } catch (error) {
      console.error('Failed to calculate remaining localStorage space', error);
      return 0;
    }
  }

  /**
   * 检查localStorage是否可用
   * @returns 是否可用
   */
  isAvailable(): boolean {
    try {
      const testKey = '__localStorage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      console.warn('localStorage is not available', error);
      return false;
    }
  }

  /**
   * 批量获取多个键的值
   * @param keys 键数组
   * @returns 键值对映射
   */
  async getMultiple<T>(keys: string[]): Promise<Record<string, T | null>> {
    const result: Record<string, T | null> = {};
    
    for (const key of keys) {
      result[key] = await this.get<T>(key);
    }
    
    return result;
  }

  /**
   * 批量设置多个键值对
   * @param items 键值对映射
   */
  async setMultiple<T>(items: Record<string, T>): Promise<void> {
    const promises = Object.entries(items).map(([key, value]) => 
      this.set(key, value)
    );
    
    await Promise.all(promises);
  }

  /**
   * 批量删除多个键
   * @param keys 键数组
   */
  async removeMultiple(keys: string[]): Promise<void> {
    const promises = keys.map(key => this.remove(key));
    await Promise.all(promises);
  }

  /**
   * 根据前缀获取所有匹配的键值对
   * @param prefix 键前缀
   * @returns 匹配的键值对
   */
  async getByPrefix<T>(prefix: string): Promise<Record<string, T>> {
    const result: Record<string, T> = {};
    const allKeys = await this.keys();
    
    for (const key of allKeys) {
      if (key.startsWith(prefix)) {
        const value = await this.get<T>(key);
        if (value !== null) {
          result[key] = value;
        }
      }
    }
    
    return result;
  }

  /**
   * 根据前缀删除所有匹配的键
   * @param prefix 键前缀
   */
  async removeByPrefix(prefix: string): Promise<void> {
    const allKeys = await this.keys();
    const keysToRemove = allKeys.filter(key => key.startsWith(prefix));
    await this.removeMultiple(keysToRemove);
  }

  /**
   * 监听存储变化事件
   * @param callback 回调函数
   * @returns 取消监听的函数
   */
  onStorageChange(callback: (event: StorageEvent) => void): () => void {
    const handleStorageChange = (event: StorageEvent) => {
      // 只处理localStorage事件
      if (event.storageArea === localStorage) {
        callback(event);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // 返回取消监听的函数
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }

  /**
   * 导出所有数据
   * @returns 所有存储的数据
   */
  async exportData(): Promise<Record<string, any>> {
    const allKeys = await this.keys();
    const data: Record<string, any> = {};
    
    for (const key of allKeys) {
      data[key] = await this.get(key);
    }
    
    return data;
  }

  /**
   * 导入数据
   * @param data 要导入的数据
   * @param overwrite 是否覆盖现有数据
   */
  async importData(data: Record<string, any>, overwrite = false): Promise<void> {
    for (const [key, value] of Object.entries(data)) {
      if (overwrite || !(await this.has(key))) {
        await this.set(key, value);
      }
    }
  }
}

// 导出单例实例
export const localStorageService = new LocalStorageServiceImpl();

// 存储键常量
export const STORAGE_KEYS = {
  USER_SETTINGS: 'user_settings',
  THEME_PREFERENCE: 'theme_preference',
  LANGUAGE_PREFERENCE: 'language_preference',
  AUDIO_SETTINGS: 'audio_settings',
  LEARNING_PREFERENCES: 'learning_preferences',
  LAST_SESSION: 'last_session',
  CACHE_TIMESTAMP: 'cache_timestamp',
  OFFLINE_DATA: 'offline_data',
  SYNC_STATUS: 'sync_status'
} as const;