import { describe, it, expect } from 'vitest';
import {
  VocabularyLevel,
  LearningStatus,
  CollectionType,
  Vocabulary,
  UserProgress,
  Collection,
  DailyStats,
  OverallStats,
  LevelProgress,
  LearningStats,
  UserSettings,
  AppState,
  AppAction
} from './index';

describe('Core Types', () => {
  it('should define VocabularyLevel enum correctly', () => {
    expect(VocabularyLevel.BEGINNER).toBe('beginner');
    expect(VocabularyLevel.INTERMEDIATE).toBe('intermediate');
    expect(VocabularyLevel.ADVANCED).toBe('advanced');
  });

  it('should define LearningStatus enum correctly', () => {
    expect(LearningStatus.NEW).toBe('new');
    expect(LearningStatus.LEARNING).toBe('learning');
    expect(LearningStatus.REVIEWING).toBe('reviewing');
    expect(LearningStatus.MASTERED).toBe('mastered');
  });

  it('should define CollectionType enum correctly', () => {
    expect(CollectionType.FAVORITES).toBe('favorites');
    expect(CollectionType.DIFFICULT).toBe('difficult');
    expect(CollectionType.CUSTOM).toBe('custom');
  });

  it('should create valid Vocabulary object', () => {
    const vocabulary: Vocabulary = {
      id: 'test-id',
      word: 'portfolio',
      pronunciation: '/pɔːrtˈfoʊlioʊ/',
      definition: 'A collection of investments',
      example: 'My investment portfolio includes stocks and bonds.',
      translation: '投资组合',
      level: VocabularyLevel.INTERMEDIATE,
      category: 'investment',
      tags: ['finance', 'investment'],
      audioUrl: 'https://example.com/audio.mp3',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    expect(vocabulary.word).toBe('portfolio');
    expect(vocabulary.level).toBe(VocabularyLevel.INTERMEDIATE);
    expect(vocabulary.tags).toContain('finance');
  });

  it('should create valid UserProgress object', () => {
    const progress: UserProgress = {
      id: 'progress-id',
      vocabularyId: 'vocab-id',
      userId: 'user-id',
      status: LearningStatus.LEARNING,
      correctCount: 3,
      incorrectCount: 1,
      lastReviewedAt: new Date(),
      nextReviewAt: new Date(Date.now() + 86400000), // tomorrow
      easeFactor: 2.5,
      interval: 1,
      repetitions: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    expect(progress.status).toBe(LearningStatus.LEARNING);
    expect(progress.correctCount).toBe(3);
    expect(progress.easeFactor).toBe(2.5);
  });

  it('should create valid Collection object', () => {
    const collection: Collection = {
      id: 'collection-id',
      name: 'My Favorites',
      type: CollectionType.FAVORITES,
      description: 'My favorite financial terms',
      vocabularyIds: ['vocab1', 'vocab2'],
      userId: 'user-id',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    expect(collection.type).toBe(CollectionType.FAVORITES);
    expect(collection.vocabularyIds).toHaveLength(2);
  });

  it('should create valid DailyStats object', () => {
    const dailyStats: DailyStats = {
      date: '2024-01-15',
      newWordsLearned: 5,
      wordsReviewed: 10,
      correctAnswers: 8,
      totalAnswers: 10,
      studyTimeMinutes: 30
    };

    expect(dailyStats.date).toBe('2024-01-15');
    expect(dailyStats.newWordsLearned).toBe(5);
    expect(dailyStats.correctAnswers / dailyStats.totalAnswers).toBe(0.8);
  });

  it('should create valid OverallStats object', () => {
    const overallStats: OverallStats = {
      totalWordsLearned: 100,
      totalWordsReviewed: 500,
      totalStudyTimeMinutes: 1200,
      currentStreak: 7,
      longestStreak: 15,
      averageAccuracy: 0.85,
      lastStudyDate: new Date()
    };

    expect(overallStats.totalWordsLearned).toBe(100);
    expect(overallStats.averageAccuracy).toBe(0.85);
  });

  it('should create valid LevelProgress object', () => {
    const levelProgress: LevelProgress = {
      level: VocabularyLevel.BEGINNER,
      totalWords: 50,
      learnedWords: 30,
      masteredWords: 20,
      accuracy: 0.8
    };

    expect(levelProgress.level).toBe(VocabularyLevel.BEGINNER);
    expect(levelProgress.learnedWords).toBeLessThanOrEqual(levelProgress.totalWords);
    expect(levelProgress.masteredWords).toBeLessThanOrEqual(levelProgress.learnedWords);
  });

  it('should create valid UserSettings object', () => {
    const settings: UserSettings = {
      id: 'settings-id',
      userId: 'user-id',
      language: 'zh-CN',
      theme: 'light',
      audioEnabled: true,
      voiceType: 'us',
      playbackSpeed: 1.0,
      dailyGoal: 20,
      reminderEnabled: true,
      reminderTime: '09:00',
      autoPlayAudio: false,
      showTranslation: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    expect(settings.language).toBe('zh-CN');
    expect(settings.theme).toBe('light');
    expect(settings.voiceType).toBe('us');
  });

  it('should create valid AppState object', () => {
    const appState: AppState = {
      user: {
        id: 'user-id',
        settings: {
          id: 'settings-id',
          userId: 'user-id',
          language: 'zh-CN',
          theme: 'dark',
          audioEnabled: true,
          voiceType: 'uk',
          playbackSpeed: 1.2,
          dailyGoal: 15,
          reminderEnabled: false,
          reminderTime: '18:00',
          autoPlayAudio: true,
          showTranslation: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      },
      vocabularies: [],
      userProgress: [],
      collections: [],
      learningStats: {
        daily: [],
        overall: {
          totalWordsLearned: 0,
          totalWordsReviewed: 0,
          totalStudyTimeMinutes: 0,
          currentStreak: 0,
          longestStreak: 0,
          averageAccuracy: 0,
          lastStudyDate: new Date()
        },
        levelProgress: [],
        updatedAt: new Date()
      },
      currentSession: null,
      audioState: {
        isPlaying: false,
        playbackSpeed: 1.0,
        volume: 1.0
      },
      loading: false,
      error: null
    };

    expect(appState.user).toBeDefined();
    expect(appState.vocabularies).toEqual([]);
    expect(appState.loading).toBe(false);
  });

  it('should validate AppAction types', () => {
    const setLoadingAction: AppAction = {
      type: 'SET_LOADING',
      payload: true
    };

    const setErrorAction: AppAction = {
      type: 'SET_ERROR',
      payload: 'Something went wrong'
    };

    const setVocabulariesAction: AppAction = {
      type: 'SET_VOCABULARIES',
      payload: []
    };

    expect(setLoadingAction.type).toBe('SET_LOADING');
    expect(setErrorAction.payload).toBe('Something went wrong');
    expect(Array.isArray(setVocabulariesAction.payload)).toBe(true);
  });
});