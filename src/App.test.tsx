import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

// Mock IndexedDB
vi.mock('./services/indexedDB', () => ({
  indexedDBService: {
    init: vi.fn().mockResolvedValue(undefined),
    getUserSettings: vi.fn().mockResolvedValue(null),
    getVocabularies: vi.fn().mockResolvedValue([]),
    getUserProgress: vi.fn().mockResolvedValue([]),
    getCollections: vi.fn().mockResolvedValue([]),
    getLearningStats: vi.fn().mockResolvedValue({
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
    }),
    updateUserSettings: vi.fn().mockResolvedValue(undefined)
  }
}));

// Mock the storage service
vi.mock('./services/storage', () => ({
  storageService: {
    init: vi.fn().mockResolvedValue(undefined),
    getUserSettings: vi.fn().mockResolvedValue(null),
    getVocabularies: vi.fn().mockResolvedValue([]),
    getUserProgress: vi.fn().mockResolvedValue([]),
    getCollections: vi.fn().mockResolvedValue([]),
    getLearningStats: vi.fn().mockResolvedValue({
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
    }),
    updateUserSettings: vi.fn().mockResolvedValue(undefined)
  }
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', async () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });

  it('displays main content after loading', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('欢迎来到财经英语学习平台')).toBeInTheDocument();
    }, { timeout: 5000 });
  });
});