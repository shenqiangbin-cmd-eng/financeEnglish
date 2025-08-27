import { AudioService, AudioPlayer, SpeechSynthesizer } from '../types/audio';
import { AudioPlayerImpl } from './audioPlayer';
import { SpeechSynthesizerImpl } from './speechSynthesizer';
import { indexedDBService } from './indexedDB';
import { Vocabulary } from '../types';

/**
 * 音频服务实现
 */
export class AudioServiceImpl implements AudioService {
  public readonly player: AudioPlayer;
  public readonly synthesizer: SpeechSynthesizer;
  private initialized = false;

  constructor() {
    this.player = new AudioPlayerImpl({
      volume: 0.8,
      playbackRate: 1,
      autoplay: false,
      loop: false
    });

    this.synthesizer = new SpeechSynthesizerImpl({
      lang: 'en-US',
      volume: 0.8,
      rate: 1,
      pitch: 1
    });
  }

  /**
   * 初始化服务
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // 检查浏览器支持
      this.checkBrowserSupport();

      // 等待语音列表加载
      await this.waitForVoices();

      this.initialized = true;
    } catch (error) {
      console.error('音频服务初始化失败:', error);
      throw error;
    }
  }

  /**
   * 播放词汇发音
   */
  async playVocabularyAudio(vocabularyId: string): Promise<void> {
    try {
      // 从数据库获取词汇信息
      const vocabularies = await indexedDBService.getVocabularies();
      const vocabulary = vocabularies.find(v => v.id === vocabularyId);
      
      if (!vocabulary) {
        throw new Error('词汇不存在');
      }

      // 如果有音频URL，优先播放音频文件
      if (vocabulary.audioUrl) {
        await this.player.play(vocabulary.audioUrl);
      } else {
        // 否则使用语音合成
        await this.speakText(vocabulary.word, 'en-US');
      }
    } catch (error) {
      console.error('播放词汇发音失败:', error);
      throw error;
    }
  }

  /**
   * 播放文本语音
   */
  async speakText(text: string, lang: string = 'en-US'): Promise<void> {
    try {
      // 设置语言
      this.synthesizer.setLanguage(lang);
      
      // 播放文本
      await this.synthesizer.speak(text);
    } catch (error) {
      console.error('文本语音播放失败:', error);
      throw error;
    }
  }

  /**
   * 播放词汇示例句子
   */
  async playVocabularyExample(vocabularyId: string): Promise<void> {
    try {
      const vocabularies = await indexedDBService.getVocabularies();
      const vocabulary = vocabularies.find(v => v.id === vocabularyId);
      
      if (!vocabulary) {
        throw new Error('词汇不存在');
      }

      if (!vocabulary.example) {
        throw new Error('该词汇没有示例句子');
      }

      await this.speakText(vocabulary.example, 'en-US');
    } catch (error) {
      console.error('播放示例句子失败:', error);
      throw error;
    }
  }

  /**
   * 播放词汇定义
   */
  async playVocabularyDefinition(vocabularyId: string): Promise<void> {
    try {
      const vocabularies = await indexedDBService.getVocabularies();
      const vocabulary = vocabularies.find(v => v.id === vocabularyId);
      
      if (!vocabulary) {
        throw new Error('词汇不存在');
      }

      await this.speakText(vocabulary.definition, 'en-US');
    } catch (error) {
      console.error('播放词汇定义失败:', error);
      throw error;
    }
  }

  /**
   * 设置播放速度
   */
  setPlaybackSpeed(speed: number): void {
    // 设置音频播放器速度
    this.player.setPlaybackRate(speed);
    
    // 设置语音合成速度
    this.synthesizer.setRate(speed);
  }

  /**
   * 设置音量
   */
  setVolume(volume: number): void {
    this.player.setVolume(volume);
    this.synthesizer.setVolume(volume);
  }

  /**
   * 停止所有播放
   */
  stopAll(): void {
    this.player.stop();
    this.synthesizer.stop();
  }

  /**
   * 暂停所有播放
   */
  pauseAll(): void {
    this.player.pause();
    this.synthesizer.pause();
  }

  /**
   * 恢复播放
   */
  resumeAll(): void {
    // 音频播放器需要重新调用play
    const playerState = this.player.getState();
    if (playerState.state === 'paused' && playerState.currentUrl) {
      this.player.play(playerState.currentUrl);
    }
    
    // 语音合成器可以直接恢复
    this.synthesizer.resume();
  }

  /**
   * 获取可用语音列表
   */
  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synthesizer.getVoices();
  }

  /**
   * 设置语音
   */
  setVoice(voice: SpeechSynthesisVoice): void {
    this.synthesizer.setVoice(voice);
  }

  /**
   * 获取英语语音列表
   */
  getEnglishVoices(): SpeechSynthesisVoice[] {
    return this.synthesizer.getVoices().filter(voice => 
      voice.lang.startsWith('en')
    );
  }

  /**
   * 获取中文语音列表
   */
  getChineseVoices(): SpeechSynthesisVoice[] {
    return this.synthesizer.getVoices().filter(voice => 
      voice.lang.startsWith('zh') || voice.lang.startsWith('cmn')
    );
  }

  /**
   * 检查浏览器支持
   */
  private checkBrowserSupport(): void {
    if (!('speechSynthesis' in window)) {
      throw new Error('浏览器不支持语音合成功能');
    }

    if (!('Audio' in window)) {
      throw new Error('浏览器不支持音频播放功能');
    }
  }

  /**
   * 等待语音列表加载
   */
  private waitForVoices(): Promise<void> {
    return new Promise((resolve) => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        resolve();
        return;
      }

      const onVoicesChanged = () => {
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
          speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
          resolve();
        }
      };

      speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
      
      // 设置超时，避免无限等待
      setTimeout(() => {
        speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
        resolve();
      }, 3000);
    });
  }

  /**
   * 清理资源
   */
  cleanup(): void {
    this.stopAll();
    
    if (this.player instanceof AudioPlayerImpl) {
      this.player.destroy();
    }
    
    if (this.synthesizer instanceof SpeechSynthesizerImpl) {
      this.synthesizer.destroy();
    }
    
    this.initialized = false;
  }
}

// 创建单例实例
export const audioService = new AudioServiceImpl();