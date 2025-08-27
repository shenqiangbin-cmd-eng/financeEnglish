import React, { useState } from 'react';
import { audioService } from '../../services';
import { Vocabulary } from '../../types';
import Button from './Button';
import './VocabularyAudio.css';

interface VocabularyAudioProps {
  vocabulary: Vocabulary;
  variant?: 'compact' | 'full';
  showDefinitionAudio?: boolean;
  showExampleAudio?: boolean;
  className?: string;
}

const VocabularyAudio: React.FC<VocabularyAudioProps> = ({
  vocabulary,
  variant = 'compact',
  showDefinitionAudio = true,
  showExampleAudio = true,
  className = ''
}) => {
  const [isPlayingWord, setIsPlayingWord] = useState(false);
  const [isPlayingDefinition, setIsPlayingDefinition] = useState(false);
  const [isPlayingExample, setIsPlayingExample] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlayWord = async () => {
    if (isPlayingWord) {
      return;
    }

    setIsPlayingWord(true);
    setError(null);

    try {
      await audioService.playVocabularyAudio(vocabulary.id);
    } catch (err) {
      setError('播放单词发音失败');
      console.error('Failed to play vocabulary audio:', err);
    } finally {
      setIsPlayingWord(false);
    }
  };

  const handlePlayDefinition = async () => {
    if (isPlayingDefinition) {
      return;
    }

    setIsPlayingDefinition(true);
    setError(null);

    try {
      await audioService.playVocabularyDefinition(vocabulary.id);
    } catch (err) {
      setError('播放释义失败');
      console.error('Failed to play vocabulary definition:', err);
    } finally {
      setIsPlayingDefinition(false);
    }
  };

  const handlePlayExample = async () => {
    if (isPlayingExample) {
      return;
    }

    setIsPlayingExample(true);
    setError(null);

    try {
      await audioService.playVocabularyExample(vocabulary.id);
    } catch (err) {
      setError('播放例句失败');
      console.error('Failed to play vocabulary example:', err);
    } finally {
      setIsPlayingExample(false);
    }
  };

  if (variant === 'compact') {
    return (
      <div className={`vocabulary-audio-compact ${className}`}>
        <Button
          variant="ghost"
          size="small"
          onClick={handlePlayWord}
          disabled={isPlayingWord}
          className="vocabulary-audio-btn"
        >
          {isPlayingWord ? '🔊' : '🔉'}
        </Button>
        {error && (
          <div className="vocabulary-audio-error">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`vocabulary-audio-full ${className}`}>
      <div className="vocabulary-audio-section">
        <h4>音频播放</h4>
        <div className="vocabulary-audio-controls">
          <Button
            variant="primary"
            size="medium"
            onClick={handlePlayWord}
            disabled={isPlayingWord}
            className="vocabulary-audio-btn"
          >
            {isPlayingWord ? '🔊 播放中...' : '🔉 播放单词'}
          </Button>

          {showDefinitionAudio && vocabulary.definition && (
            <Button
              variant="outline"
              size="medium"
              onClick={handlePlayDefinition}
              disabled={isPlayingDefinition}
              className="vocabulary-audio-btn"
            >
              {isPlayingDefinition ? '🔊 播放中...' : '📖 播放释义'}
            </Button>
          )}

          {showExampleAudio && vocabulary.example && (
            <Button
              variant="outline"
              size="medium"
              onClick={handlePlayExample}
              disabled={isPlayingExample}
              className="vocabulary-audio-btn"
            >
              {isPlayingExample ? '🔊 播放中...' : '💬 播放例句'}
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="vocabulary-audio-error">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};

export default VocabularyAudio;