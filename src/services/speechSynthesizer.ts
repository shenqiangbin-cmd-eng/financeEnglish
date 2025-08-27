import { SpeechSynthesizer, SpeechSynthesisState, SpeechSynthesisConfig } from '../types/audio';

/**
 * 语音合成器实现
 */
export class SpeechSynthesizerImpl implements SpeechSynthesizer {
  private state: SpeechSynthesisState;
  private listeners: ((state: SpeechSynthesisState) => void)[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor(config?: Partial<SpeechSynthesisConfig>) {
    this.state = {
      speaking: false,
      paused: false,
      voices: [],
      config: {
        lang: 'en-US',
        voice: null,
        volume: 1,
        rate: 1,
        pitch: 1,
        ...config
      },
      error: null
    };

    this.initialize();
  }

  /**
   * 初始化语音合成器
   */
  private initialize(): void {
    if (!('speechSynthesis' in window)) {
      this.updateState({ error: '浏览器不支持语音合成功能' });
      return;
    }

    // 加载可用语音
    this.loadVoices();

    // 监听语音列表变化
    speechSynthesis.addEventListener('voiceschanged', () => {
      this.loadVoices();
    });
  }

  /**
   * 加载可用语音
   */
  private loadVoices(): void {
    const voices = speechSynthesis.getVoices();
    this.updateState({ voices });

    // 如果没有设置语音，尝试设置默认语音
    if (!this.state.config.voice && voices.length > 0) {
      // 优先选择英语语音
      const englishVoice = voices.find(voice => 
        voice.lang.startsWith('en') && voice.localService
      ) || voices.find(voice => voice.lang.startsWith('en'));
      
      if (englishVoice) {
        this.updateState({
          config: { ...this.state.config, voice: englishVoice }
        });
      }
    }
  }

  /**
   * 播放文本
   */
  async speak(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        const error = '浏览器不支持语音合成功能';
        this.updateState({ error });
        reject(new Error(error));
        return;
      }

      if (!text.trim()) {
        reject(new Error('文本内容不能为空'));
        return;
      }

      // 停止当前播放
      this.stop();

      try {
        // 创建语音合成实例
        this.currentUtterance = new SpeechSynthesisUtterance(text);
        
        // 设置语音参数
        this.currentUtterance.lang = this.state.config.lang;
        this.currentUtterance.volume = this.state.config.volume;
        this.currentUtterance.rate = this.state.config.rate;
        this.currentUtterance.pitch = this.state.config.pitch;
        
        if (this.state.config.voice) {
          this.currentUtterance.voice = this.state.config.voice;
        }

        // 绑定事件监听器
        this.currentUtterance.onstart = () => {
          this.updateState({ speaking: true, paused: false, error: null });
        };

        this.currentUtterance.onend = () => {
          this.updateState({ speaking: false, paused: false });
          this.currentUtterance = null;
          resolve();
        };

        this.currentUtterance.onerror = (event) => {
          const errorMessage = this.getErrorMessage(event.error);
          this.updateState({ 
            speaking: false, 
            paused: false, 
            error: errorMessage 
          });
          this.currentUtterance = null;
          reject(new Error(errorMessage));
        };

        this.currentUtterance.onpause = () => {
          this.updateState({ paused: true });
        };

        this.currentUtterance.onresume = () => {
          this.updateState({ paused: false });
        };

        // 开始播放
        speechSynthesis.speak(this.currentUtterance);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '语音合成失败';
        this.updateState({ error: errorMessage });
        reject(new Error(errorMessage));
      }
    });
  }

  /**
   * 暂停播放
   */
  pause(): void {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
    }
  }

  /**
   * 恢复播放
   */
  resume(): void {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
    }
  }

  /**
   * 停止播放
   */
  stop(): void {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    this.updateState({ speaking: false, paused: false });
    this.currentUtterance = null;
  }

  /**
   * 设置语音
   */
  setVoice(voice: SpeechSynthesisVoice): void {
    this.updateState({
      config: { ...this.state.config, voice }
    });
  }

  /**
   * 设置语言
   */
  setLanguage(lang: string): void {
    this.updateState({
      config: { ...this.state.config, lang }
    });

    // 尝试找到匹配语言的语音
    const matchingVoice = this.state.voices.find(voice => 
      voice.lang.startsWith(lang.split('-')[0])
    );
    
    if (matchingVoice) {
      this.setVoice(matchingVoice);
    }
  }

  /**
   * 设置语速
   */
  setRate(rate: number): void {
    const clampedRate = Math.max(0.1, Math.min(10, rate));
    this.updateState({
      config: { ...this.state.config, rate: clampedRate }
    });
  }

  /**
   * 设置音量
   */
  setVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.updateState({
      config: { ...this.state.config, volume: clampedVolume }
    });
  }

  /**
   * 设置音调
   */
  setPitch(pitch: number): void {
    const clampedPitch = Math.max(0, Math.min(2, pitch));
    this.updateState({
      config: { ...this.state.config, pitch: clampedPitch }
    });
  }

  /**
   * 获取可用语音
   */
  getVoices(): SpeechSynthesisVoice[] {
    return [...this.state.voices];
  }

  /**
   * 获取当前状态
   */
  getState(): SpeechSynthesisState {
    return { ...this.state };
  }

  /**
   * 监听状态变化
   */
  onStateChange(callback: (state: SpeechSynthesisState) => void): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * 获取错误信息
   */
  private getErrorMessage(error: string): string {
    switch (error) {
      case 'network':
        return '网络错误';
      case 'synthesis-failed':
        return '语音合成失败';
      case 'synthesis-unavailable':
        return '语音合成服务不可用';
      case 'audio-busy':
        return '音频设备忙碌';
      case 'audio-hardware':
        return '音频硬件错误';
      case 'language-unavailable':
        return '语言不支持';
      case 'voice-unavailable':
        return '语音不可用';
      case 'text-too-long':
        return '文本过长';
      case 'invalid-argument':
        return '参数无效';
      default:
        return `语音合成错误: ${error}`;
    }
  }

  /**
   * 更新状态并通知监听器
   */
  private updateState(updates: Partial<SpeechSynthesisState>): void {
    this.state = { ...this.state, ...updates };
    this.listeners.forEach(listener => listener(this.state));
  }

  /**
   * 销毁合成器
   */
  destroy(): void {
    this.stop();
    this.listeners = [];
  }
}