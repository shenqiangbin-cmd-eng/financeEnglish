import React, { useState, useEffect } from 'react';
import { audioService } from '../../services';
import { AudioPlayerState } from '../../types/audio';
import Button from './Button';
import Card from './Card';
import './AudioPlayer.css';

interface AudioPlayerProps {
  /** 音频URL */
  audioUrl?: string;
  /** 要播放的文本 */
  text?: string;
  /** 语言 */
  language?: string;
  /** 显示模式 */
  mode?: 'button' | 'full';
  /** 按钮文本 */
  buttonText?: string;
  /** 按钮图标 */
  icon?: React.ReactNode;
  /** 按钮变体 */
  variant?: 'primary' | 'outline' | 'ghost';
  /** 按钮大小 */
  size?: 'small' | 'medium' | 'large';
  /** 是否禁用 */
  disabled?: boolean;
  /** 播放开始回调 */
  onPlayStart?: () => void;
  /** 播放结束回调 */
  onPlayEnd?: () => void;
  /** 播放错误回调 */
  onError?: (error: string) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  text,
  language = 'en-US',
  mode = 'button',
  buttonText,
  icon,
  variant = 'outline',
  size = 'medium',
  disabled = false,
  onPlayStart,
  onPlayEnd,
  onError
}) => {
  const [playerState, setPlayerState] = useState<AudioPlayerState | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 监听播放器状态变化
    const unsubscribe = audioService.player.onStateChange((state) => {
      setPlayerState(state);
      setIsPlaying(state.state === 'playing');
      
      if (state.state === 'playing' && onPlayStart) {
        onPlayStart();
      }
      
      if (state.state === 'idle' && isPlaying && onPlayEnd) {
        onPlayEnd();
      }
      
      if (state.state === 'error') {
        setError(state.error);
        if (onError && state.error) {
          onError(state.error);
        }
      }
    });

    return unsubscribe;
  }, [isPlaying, onPlayStart, onPlayEnd, onError]);

  const handlePlay = async () => {
    try {
      setError(null);
      
      if (audioUrl) {
        // 播放音频文件
        await audioService.player.play(audioUrl);
      } else if (text) {
        // 播放文本语音
        await audioService.speakText(text, language);
      } else {
        throw new Error('没有可播放的内容');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '播放失败';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  const handlePause = () => {
    if (audioUrl) {
      audioService.player.pause();
    } else {
      audioService.synthesizer.pause();
    }
  };

  const handleStop = () => {
    if (audioUrl) {
      audioService.player.stop();
    } else {
      audioService.synthesizer.stop();
    }
  };

  const getButtonText = () => {
    if (buttonText) return buttonText;
    if (isPlaying) return '暂停';
    return '播放';
  };

  const getButtonIcon = () => {
    if (icon) return icon;
    if (isPlaying) return '⏸️';
    return '▶️';
  };

  if (mode === 'button') {
    return (
      <div style={{ display: 'inline-block' }}>
        <Button
          variant={variant}
          size={size}
          disabled={disabled || playerState?.state === 'loading'}
          onClick={isPlaying ? handlePause : handlePlay}
          className="audio-play-button"
        >
          <span>{getButtonIcon()}</span>
          {buttonText !== '' && <span>{getButtonText()}</span>}
        </Button>
        {error && (
          <div style={{
            marginTop: '4px',
            fontSize: '12px',
            color: '#d32f2f'
          }}>
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card variant="outlined" padding="medium">
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* 播放控制 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Button
            variant="primary"
            size="medium"
            disabled={disabled || playerState?.state === 'loading'}
            onClick={isPlaying ? handlePause : handlePlay}
            className="audio-control-button"
          >
            <span>{getButtonIcon()}</span>
            <span>{getButtonText()}</span>
          </Button>
          
          {isPlaying && (
            <Button
              variant="outline"
              size="medium"
              onClick={handleStop}
              className="audio-control-button"
            >
              <span>⏹️</span>
              <span>停止</span>
            </Button>
          )}
        </div>

        {/* 播放进度 */}
        {playerState && audioUrl && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{
              width: '100%',
              height: '4px',
              backgroundColor: '#e0e0e0',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${playerState.progress * 100}%`,
                height: '100%',
                backgroundColor: '#1976d2',
                transition: 'width 0.1s ease'
              }} />
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: '#666'
            }}>
              <span>{formatTime(playerState.currentTime)}</span>
              <span>{formatTime(playerState.duration)}</span>
            </div>
          </div>
        )}

        {/* 播放状态 */}
        {playerState?.state === 'loading' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: '#666'
          }}>
            <span>🔄</span>
            <span>加载中...</span>
          </div>
        )}

        {/* 错误信息 */}
        {error && (
          <div style={{
            padding: '8px 12px',
            backgroundColor: '#ffebee',
            border: '1px solid #ffcdd2',
            borderRadius: '4px',
            fontSize: '14px',
            color: '#d32f2f'
          }}>
            ⚠️ {error}
          </div>
        )}
      </div>
    </Card>
  );
};

/**
 * 格式化时间显示
 */
function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) {
    return '0:00';
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default AudioPlayer;