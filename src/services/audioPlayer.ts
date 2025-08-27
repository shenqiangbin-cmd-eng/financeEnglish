import { AudioPlayer, AudioPlayerState, AudioPlayerConfig } from '../types/audio';

/**
 * 音频播放器实现
 */
export class AudioPlayerImpl implements AudioPlayer {
  private audio: HTMLAudioElement | null = null;
  private state: AudioPlayerState;
  private listeners: ((state: AudioPlayerState) => void)[] = [];

  constructor(config?: Partial<AudioPlayerConfig>) {
    this.state = {
      state: 'idle',
      currentUrl: null,
      progress: 0,
      duration: 0,
      currentTime: 0,
      error: null,
      config: {
        volume: 1,
        playbackRate: 1,
        autoplay: false,
        loop: false,
        ...config
      }
    };
  }

  /**
   * 播放音频
   */
  async play(url: string): Promise<void> {
    try {
      // 如果是新的URL，创建新的音频元素
      if (this.state.currentUrl !== url) {
        this.cleanup();
        this.createAudioElement(url);
      }

      if (!this.audio) {
        throw new Error('音频元素创建失败');
      }

      this.updateState({ state: 'loading' });

      // 等待音频加载完成
      await this.waitForLoad();

      // 开始播放
      await this.audio.play();
      this.updateState({ state: 'playing' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '播放失败';
      this.updateState({ 
        state: 'error', 
        error: errorMessage 
      });
      throw error;
    }
  }

  /**
   * 暂停播放
   */
  pause(): void {
    if (this.audio && this.state.state === 'playing') {
      this.audio.pause();
      this.updateState({ state: 'paused' });
    }
  }

  /**
   * 停止播放
   */
  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.updateState({ 
        state: 'idle',
        progress: 0,
        currentTime: 0
      });
    }
  }

  /**
   * 设置音量
   */
  setVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    if (this.audio) {
      this.audio.volume = clampedVolume;
    }
    this.updateState({
      config: { ...this.state.config, volume: clampedVolume }
    });
  }

  /**
   * 设置播放速度
   */
  setPlaybackRate(rate: number): void {
    const clampedRate = Math.max(0.5, Math.min(2, rate));
    if (this.audio) {
      this.audio.playbackRate = clampedRate;
    }
    this.updateState({
      config: { ...this.state.config, playbackRate: clampedRate }
    });
  }

  /**
   * 跳转到指定时间
   */
  seekTo(time: number): void {
    if (this.audio && this.state.duration > 0) {
      const clampedTime = Math.max(0, Math.min(this.state.duration, time));
      this.audio.currentTime = clampedTime;
      this.updateState({
        currentTime: clampedTime,
        progress: clampedTime / this.state.duration
      });
    }
  }

  /**
   * 获取当前状态
   */
  getState(): AudioPlayerState {
    return { ...this.state };
  }

  /**
   * 监听状态变化
   */
  onStateChange(callback: (state: AudioPlayerState) => void): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * 创建音频元素
   */
  private createAudioElement(url: string): void {
    this.audio = new Audio(url);
    this.audio.volume = this.state.config.volume;
    this.audio.playbackRate = this.state.config.playbackRate;
    this.audio.loop = this.state.config.loop;

    // 绑定事件监听器
    this.bindEventListeners();

    this.updateState({ currentUrl: url });
  }

  /**
   * 绑定音频事件监听器
   */
  private bindEventListeners(): void {
    if (!this.audio) return;

    this.audio.addEventListener('loadedmetadata', () => {
      if (this.audio) {
        this.updateState({ duration: this.audio.duration });
      }
    });

    this.audio.addEventListener('timeupdate', () => {
      if (this.audio && this.state.duration > 0) {
        const currentTime = this.audio.currentTime;
        const progress = currentTime / this.state.duration;
        this.updateState({ currentTime, progress });
      }
    });

    this.audio.addEventListener('ended', () => {
      this.updateState({ 
        state: 'idle',
        progress: 0,
        currentTime: 0
      });
    });

    this.audio.addEventListener('error', (_event) => {
      const error = this.audio?.error;
      let errorMessage = '播放出错';
      
      if (error) {
        switch (error.code) {
          case error.MEDIA_ERR_ABORTED:
            errorMessage = '播放被中止';
            break;
          case error.MEDIA_ERR_NETWORK:
            errorMessage = '网络错误';
            break;
          case error.MEDIA_ERR_DECODE:
            errorMessage = '解码错误';
            break;
          case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = '不支持的音频格式';
            break;
        }
      }

      this.updateState({ 
        state: 'error', 
        error: errorMessage 
      });
    });

    this.audio.addEventListener('canplaythrough', () => {
      if (this.state.config.autoplay && this.state.state === 'loading') {
        this.audio?.play().catch(_error => {
          this.updateState({ 
            state: 'error', 
            error: '自动播放失败' 
          });
        });
      }
    });
  }

  /**
   * 等待音频加载完成
   */
  private waitForLoad(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.audio) {
        reject(new Error('音频元素不存在'));
        return;
      }

      if (this.audio.readyState >= 3) {
        resolve();
        return;
      }

      const onCanPlay = () => {
        cleanup();
        resolve();
      };

      const onError = () => {
        cleanup();
        reject(new Error('音频加载失败'));
      };

      const cleanup = () => {
        this.audio?.removeEventListener('canplaythrough', onCanPlay);
        this.audio?.removeEventListener('error', onError);
      };

      this.audio.addEventListener('canplaythrough', onCanPlay);
      this.audio.addEventListener('error', onError);

      // 设置超时
      setTimeout(() => {
        cleanup();
        reject(new Error('音频加载超时'));
      }, 10000);
    });
  }

  /**
   * 更新状态并通知监听器
   */
  private updateState(updates: Partial<AudioPlayerState>): void {
    this.state = { ...this.state, ...updates };
    this.listeners.forEach(listener => listener(this.state));
  }

  /**
   * 清理资源
   */
  private cleanup(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio.load();
      this.audio = null;
    }
    this.updateState({ 
      state: 'idle',
      currentUrl: null,
      progress: 0,
      duration: 0,
      currentTime: 0,
      error: null
    });
  }

  /**
   * 销毁播放器
   */
  destroy(): void {
    this.cleanup();
    this.listeners = [];
  }
}