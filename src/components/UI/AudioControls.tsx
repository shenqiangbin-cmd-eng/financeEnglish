import React, { useState, useEffect } from 'react';
import { audioService } from '../../services';
import Button from './Button';
import './AudioControls.css';

interface AudioControlsProps {
  className?: string;
  showVolumeControl?: boolean;
  showSpeedControl?: boolean;
  showVoiceSelector?: boolean;
}

const AudioControls: React.FC<AudioControlsProps> = ({
  className = '',
  showVolumeControl = true,
  showSpeedControl = true,
  showVoiceSelector = true
}) => {
  const [volume, setVolume] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // 初始化音量和速度
    const initializeControls = async () => {
      try {
        // 从播放器状态获取当前音量和速度
        const playerState = audioService.player.getState();
        setVolume(playerState.config.volume);
        setSpeed(playerState.config.playbackRate);
      } catch (error) {
        console.error('Failed to initialize audio controls:', error);
      }
    };

    initializeControls();
  }, []);

  useEffect(() => {
    // 获取可用语音
    const loadVoices = async () => {
      try {
        const availableVoices = await audioService.getAvailableVoices();
        setVoices(availableVoices);
        
        // 设置默认语音（优先选择中文语音）
        const chineseVoice = availableVoices.find(voice => 
          voice.lang.includes('zh') || voice.lang.includes('cn')
        );
        if (chineseVoice) {
          setSelectedVoice(chineseVoice.name);
          audioService.setVoice(chineseVoice);
        } else if (availableVoices.length > 0) {
          setSelectedVoice(availableVoices[0].name);
          audioService.setVoice(availableVoices[0]);
        }
      } catch (error) {
        console.error('Failed to load voices:', error);
      }
    };

    if (showVoiceSelector) {
      loadVoices();
    }
  }, [showVoiceSelector]);

  const handleVolumeChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    try {
      await audioService.setVolume(newVolume);
    } catch (error) {
      console.error('Failed to set volume:', error);
    }
  };

  const handleSpeedChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = parseFloat(event.target.value);
    setSpeed(newSpeed);
    try {
      audioService.setPlaybackSpeed(newSpeed);
    } catch (error) {
      console.error('Failed to set playback speed:', error);
    }
  };

  const handleVoiceChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const voiceName = event.target.value;
    setSelectedVoice(voiceName);
    try {
      const voice = voices.find(v => v.name === voiceName);
      if (voice) {
        audioService.setVoice(voice);
      }
    } catch (error) {
      console.error('Failed to set voice:', error);
    }
  };

  const handleStopAll = async () => {
    try {
      audioService.stopAll();
      setIsPlaying(false);
    } catch (error) {
      console.error('Failed to stop all audio:', error);
    }
  };

  const handlePauseAll = async () => {
    try {
      audioService.pauseAll();
      setIsPlaying(false);
    } catch (error) {
      console.error('Failed to pause all audio:', error);
    }
  };

  const handleResumeAll = async () => {
    try {
      audioService.resumeAll();
      setIsPlaying(true);
    } catch (error) {
      console.error('Failed to resume all audio:', error);
    }
  };

  return (
    <div className={`audio-controls ${className}`}>
      {/* 全局控制按钮 */}
      <div className="audio-controls-section">
        <h4>音频控制</h4>
        <div className="audio-controls-buttons">
          <Button
            variant="outline"
            size="small"
            onClick={handlePauseAll}
            className="audio-control-btn"
          >
            ⏸️ 暂停全部
          </Button>
          <Button
            variant="outline"
            size="small"
            onClick={handleResumeAll}
            className="audio-control-btn"
          >
            ▶️ 继续全部
          </Button>
          <Button
            variant="outline"
            size="small"
            onClick={handleStopAll}
            className="audio-control-btn"
          >
            ⏹️ 停止全部
          </Button>
        </div>
      </div>

      {/* 音量控制 */}
      {showVolumeControl && (
        <div className="audio-controls-section">
          <label className="audio-control-label">
            音量: {Math.round(volume * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="audio-control-slider"
          />
        </div>
      )}

      {/* 播放速度控制 */}
      {showSpeedControl && (
        <div className="audio-controls-section">
          <label className="audio-control-label">
            播放速度: {speed}x
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={speed}
            onChange={handleSpeedChange}
            className="audio-control-slider"
          />
        </div>
      )}

      {/* 语音选择 */}
      {showVoiceSelector && voices.length > 0 && (
        <div className="audio-controls-section">
          <label className="audio-control-label">
            语音选择:
          </label>
          <select
            value={selectedVoice}
            onChange={handleVoiceChange}
            className="audio-control-select"
          >
            {voices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default AudioControls;