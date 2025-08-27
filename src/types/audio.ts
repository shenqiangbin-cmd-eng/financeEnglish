// 音频播放相关类型定义

/**
 * 音频播放状态
 */
export type AudioPlayState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

/**
 * 音频播放器配置
 */
export interface AudioPlayerConfig {
  /** 音量 (0-1) */
  volume: number;
  /** 播放速度 (0.5-2.0) */
  playbackRate: number;
  /** 是否自动播放 */
  autoplay: boolean;
  /** 是否循环播放 */
  loop: boolean;
}

/**
 * 音频播放器状态
 */
export interface AudioPlayerState {
  /** 当前播放状态 */
  state: AudioPlayState;
  /** 当前播放的音频URL */
  currentUrl: string | null;
  /** 播放进度 (0-1) */
  progress: number;
  /** 音频总时长（秒） */
  duration: number;
  /** 当前播放时间（秒） */
  currentTime: number;
  /** 错误信息 */
  error: string | null;
  /** 播放器配置 */
  config: AudioPlayerConfig;
}

/**
 * 语音合成配置
 */
export interface SpeechSynthesisConfig {
  /** 语言 */
  lang: string;
  /** 语音 */
  voice: SpeechSynthesisVoice | null;
  /** 音量 (0-1) */
  volume: number;
  /** 语速 (0.1-10) */
  rate: number;
  /** 音调 (0-2) */
  pitch: number;
}

/**
 * 语音合成状态
 */
export interface SpeechSynthesisState {
  /** 是否正在播放 */
  speaking: boolean;
  /** 是否暂停 */
  paused: boolean;
  /** 可用的语音列表 */
  voices: SpeechSynthesisVoice[];
  /** 当前配置 */
  config: SpeechSynthesisConfig;
  /** 错误信息 */
  error: string | null;
}

/**
 * 音频播放器接口
 */
export interface AudioPlayer {
  /** 播放音频 */
  play(url: string): Promise<void>;
  /** 暂停播放 */
  pause(): void;
  /** 停止播放 */
  stop(): void;
  /** 设置音量 */
  setVolume(volume: number): void;
  /** 设置播放速度 */
  setPlaybackRate(rate: number): void;
  /** 跳转到指定时间 */
  seekTo(time: number): void;
  /** 获取当前状态 */
  getState(): AudioPlayerState;
  /** 监听状态变化 */
  onStateChange(callback: (state: AudioPlayerState) => void): () => void;
}

/**
 * 语音合成器接口
 */
export interface SpeechSynthesizer {
  /** 播放文本 */
  speak(text: string): Promise<void>;
  /** 暂停播放 */
  pause(): void;
  /** 恢复播放 */
  resume(): void;
  /** 停止播放 */
  stop(): void;
  /** 设置语音 */
  setVoice(voice: SpeechSynthesisVoice): void;
  /** 设置语言 */
  setLanguage(lang: string): void;
  /** 设置语速 */
  setRate(rate: number): void;
  /** 设置音量 */
  setVolume(volume: number): void;
  /** 设置音调 */
  setPitch(pitch: number): void;
  /** 获取可用语音 */
  getVoices(): SpeechSynthesisVoice[];
  /** 获取当前状态 */
  getState(): SpeechSynthesisState;
  /** 监听状态变化 */
  onStateChange(callback: (state: SpeechSynthesisState) => void): () => void;
}

/**
 * 音频服务接口
 */
export interface AudioService {
  /** 音频播放器 */
  player: AudioPlayer;
  /** 语音合成器 */
  synthesizer: SpeechSynthesizer;
  /** 播放词汇发音 */
  playVocabularyAudio(vocabularyId: string): Promise<void>;
  /** 播放文本语音 */
  speakText(text: string, lang?: string): Promise<void>;
  /** 初始化服务 */
  initialize(): Promise<void>;
  /** 清理资源 */
  cleanup(): void;
}