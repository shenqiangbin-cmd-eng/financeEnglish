import { ReactNode } from 'react';
import { Vocabulary, LearningResult, Collection, UserProgress, LearningStats } from './index';

// 基础组件Props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

// 词汇卡片组件Props
export interface VocabularyCardProps extends BaseComponentProps {
  vocabulary: Vocabulary;
  progress?: UserProgress;
  showTranslation?: boolean;
  showProgress?: boolean;
  onAnswer?: (isCorrect: boolean) => void;
  onPlayAudio?: () => void;
  onAddToCollection?: (collectionId: string) => void;
}

// 音频播放器组件Props
export interface AudioPlayerProps extends BaseComponentProps {
  text: string;
  autoPlay?: boolean;
  playbackSpeed?: number;
  voiceType?: 'us' | 'uk';
  onPlay?: () => void;
  onPause?: () => void;
  onEnd?: () => void;
}

// 进度图表组件Props
export interface ProgressChartProps extends BaseComponentProps {
  stats: LearningStats;
  type: 'daily' | 'level' | 'overall';
  timeRange?: 'week' | 'month' | 'year';
}

// 收藏夹管理组件Props
export interface CollectionManagerProps extends BaseComponentProps {
  collections: Collection[];
  selectedCollectionId?: string;
  onCreateCollection?: (name: string, description?: string) => void;
  onUpdateCollection?: (collection: Collection) => void;
  onDeleteCollection?: (collectionId: string) => void;
  onSelectCollection?: (collectionId: string) => void;
}

// 词汇列表组件Props
export interface VocabularyListProps extends BaseComponentProps {
  vocabularies: Vocabulary[];
  userProgress?: UserProgress[];
  selectedIds?: string[];
  onSelect?: (vocabularyIds: string[]) => void;
  onEdit?: (vocabulary: Vocabulary) => void;
  onDelete?: (vocabularyId: string) => void;
  onPlayAudio?: (vocabularyId: string) => void;
}

// 学习会话组件Props
export interface LearningSessionProps extends BaseComponentProps {
  vocabularies: Vocabulary[];
  sessionType: 'learn' | 'review' | 'test';
  onComplete?: (results: LearningResult[]) => void;
  onExit?: () => void;
}

// 搜索过滤组件Props
export interface SearchFilterProps extends BaseComponentProps {
  onSearch?: (query: string) => void;
  onFilter?: (filters: any) => void;
  placeholder?: string;
  showFilters?: boolean;
}

// 统计卡片组件Props
export interface StatsCardProps extends BaseComponentProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

// 设置面板组件Props
export interface SettingsPanelProps extends BaseComponentProps {
  settings: any;
  onUpdate?: (settings: any) => void;
  onReset?: () => void;
}

// 导航组件Props
export interface NavigationProps extends BaseComponentProps {
  currentPath: string;
  onNavigate?: (path: string) => void;
}

// 模态框组件Props
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  title?: string;
  onClose?: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

// 表单字段Props
export interface FormFieldProps extends BaseComponentProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea';
  value?: any;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  options?: { label: string; value: any }[];
  onChange?: (value: any) => void;
}

// 按钮组件Props
export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

// 输入框组件Props
export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'search';
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  icon?: ReactNode;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

// 选择器组件Props
export interface SelectProps extends BaseComponentProps {
  value?: any;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  options: { label: string; value: any }[];
  onChange?: (value: any) => void;
}

// 复选框组件Props
export interface CheckboxProps extends BaseComponentProps {
  checked?: boolean;
  disabled?: boolean;
  label?: string;
  onChange?: (checked: boolean) => void;
}

// 开关组件Props
export interface SwitchProps extends BaseComponentProps {
  checked?: boolean;
  disabled?: boolean;
  label?: string;
  onChange?: (checked: boolean) => void;
}

// 标签页组件Props
export interface TabsProps extends BaseComponentProps {
  activeTab: string;
  tabs: { id: string; label: string; content: ReactNode }[];
  onTabChange?: (tabId: string) => void;
}

// 分页组件Props
export interface PaginationProps extends BaseComponentProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  total: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

// 加载组件Props
export interface LoadingProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

// 空状态组件Props
export interface EmptyStateProps extends BaseComponentProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

// 错误边界组件Props
export interface ErrorBoundaryProps extends BaseComponentProps {
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}