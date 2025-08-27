import { indexedDBService } from './indexedDB';
import { financialVocabulary } from '../data/vocabulary';
import { Vocabulary } from '../types';

/**
 * 数据导入服务
 * 负责将初始词汇数据导入到IndexedDB中
 */
export class DataImportService {
  /**
   * 检查是否已经导入过数据
   */
  async isDataImported(): Promise<boolean> {
    try {
      const vocabularies = await indexedDBService.getVocabularies();
      return vocabularies.length > 0;
    } catch (error) {
      console.error('检查数据导入状态失败:', error);
      return false;
    }
  }

  /**
   * 导入初始词汇数据
   */
  async importInitialData(): Promise<void> {
    try {
      console.log('开始导入初始词汇数据...');
      
      // 检查是否已经导入过数据
      const isImported = await this.isDataImported();
      if (isImported) {
        console.log('数据已存在，跳过导入');
        return;
      }

      // 批量导入词汇数据
      for (const vocabulary of financialVocabulary) {
        await indexedDBService.addVocabulary(vocabulary);
      }

      console.log(`成功导入 ${financialVocabulary.length} 个词汇`);
    } catch (error) {
      console.error('导入初始数据失败:', error);
      throw new Error('数据导入失败');
    }
  }

  /**
   * 重新导入数据（清空现有数据后重新导入）
   */
  async reimportData(): Promise<void> {
    try {
      console.log('开始重新导入数据...');
      
      // 清空现有词汇数据
      await this.clearAllData();
      
      // 重新导入
      await this.importInitialData();
      
      console.log('数据重新导入完成');
    } catch (error) {
      console.error('重新导入数据失败:', error);
      throw new Error('数据重新导入失败');
    }
  }

  /**
   * 清空所有数据
   */
  async clearAllData(): Promise<void> {
    try {
      const vocabularies = await indexedDBService.getVocabularies();
      
      for (const vocabulary of vocabularies) {
        await indexedDBService.deleteVocabulary(vocabulary.id);
      }
      
      console.log('已清空所有词汇数据');
    } catch (error) {
      console.error('清空数据失败:', error);
      throw new Error('清空数据失败');
    }
  }

  /**
   * 获取单个词汇
   */
  async getVocabulary(id: string): Promise<Vocabulary | null> {
    try {
      const vocabularies = await indexedDBService.getVocabularies();
      return vocabularies.find(v => v.id === id) || null;
    } catch (error) {
      console.error('获取词汇失败:', error);
      return null;
    }
  }

  /**
   * 导入自定义词汇数据
   */
  async importCustomVocabularies(vocabularies: Vocabulary[]): Promise<void> {
    try {
      console.log(`开始导入 ${vocabularies.length} 个自定义词汇...`);
      
      for (const vocabulary of vocabularies) {
        // 检查词汇是否已存在
        const existing = await this.getVocabulary(vocabulary.id);
        if (existing) {
          // 更新现有词汇
          await indexedDBService.updateVocabulary(vocabulary);
        } else {
          // 添加新词汇
          await indexedDBService.addVocabulary(vocabulary);
        }
      }
      
      console.log('自定义词汇导入完成');
    } catch (error) {
      console.error('导入自定义词汇失败:', error);
      throw new Error('导入自定义词汇失败');
    }
  }

  /**
   * 导出所有词汇数据
   */
  async exportAllData(): Promise<Vocabulary[]> {
    try {
      const vocabularies = await indexedDBService.getVocabularies();
      console.log(`导出了 ${vocabularies.length} 个词汇`);
      return vocabularies;
    } catch (error) {
      console.error('导出数据失败:', error);
      throw new Error('导出数据失败');
    }
  }

  /**
   * 获取数据统计信息
   */
  async getDataStats(): Promise<{
    totalVocabularies: number;
    categoryCounts: Record<string, number>;
    difficultyCounts: Record<string, number>;
  }> {
    try {
      const vocabularies = await indexedDBService.getVocabularies();
      
      const categoryCounts: Record<string, number> = {};
      const difficultyCounts: Record<string, number> = {};
      
      vocabularies.forEach((vocab: Vocabulary) => {
        // 统计类别
        categoryCounts[vocab.category] = (categoryCounts[vocab.category] || 0) + 1;
        
        // 统计难度
        difficultyCounts[vocab.difficulty] = (difficultyCounts[vocab.difficulty] || 0) + 1;
      });
      
      return {
        totalVocabularies: vocabularies.length,
        categoryCounts,
        difficultyCounts
      };
    } catch (error) {
      console.error('获取数据统计失败:', error);
      throw new Error('获取数据统计失败');
    }
  }

  /**
   * 验证数据完整性
   */
  async validateData(): Promise<{
    isValid: boolean;
    errors: string[];
  }> {
    try {
      const vocabularies = await indexedDBService.getVocabularies();
      const errors: string[] = [];
      
      vocabularies.forEach((vocab: Vocabulary, index: number) => {
        // 检查必填字段
        if (!vocab.id) errors.push(`词汇 ${index + 1}: 缺少ID`);
        if (!vocab.word) errors.push(`词汇 ${index + 1}: 缺少单词`);
        if (!vocab.definition) errors.push(`词汇 ${index + 1}: 缺少定义`);
        if (!vocab.example) errors.push(`词汇 ${index + 1}: 缺少例句`);
        if (!vocab.exampleTranslation) errors.push(`词汇 ${index + 1}: 缺少例句翻译`);
        
        // 检查数据格式
        if (vocab.difficulty && !['beginner', 'intermediate', 'advanced'].includes(vocab.difficulty)) {
          errors.push(`词汇 ${index + 1}: 无效的难度级别`);
        }
        
        if (!Array.isArray(vocab.tags)) {
          errors.push(`词汇 ${index + 1}: 标签必须是数组`);
        }
      });
      
      return {
        isValid: errors.length === 0,
        errors
      };
    } catch (error) {
      console.error('验证数据失败:', error);
      return {
        isValid: false,
        errors: ['数据验证过程中发生错误']
      };
    }
  }
}

// 导出单例实例
export const dataImportService = new DataImportService();