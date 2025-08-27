// 工具函数相关类型定义

// 间隔重复算法参数
export interface SpacedRepetitionParams {
  easeFactor: number;
  interval: number;
  repetitions: number;
  quality: number; // 0-5, 用户回答质量评分
}

// 间隔重复算法结果
export interface SpacedRepetitionResult {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: Date;
}

// 学习算法配置
export interface LearningAlgorithmConfig {
  initialInterval: number; // 初始间隔（天）
  easeFactorMin: number; // 最小难度系数
  easeFactorMax: number; // 最大难度系数
  easeFactorDefault: number; // 默认难度系数
  intervalMultiplier: number; // 间隔倍数
  failureResetInterval: number; // 失败重置间隔
}

// 数据验证规则
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

// 验证结果
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// 表单验证配置
export interface FormValidationConfig {
  [fieldName: string]: ValidationRule;
}

// 排序配置
export interface SortConfig<T> {
  key: keyof T;
  direction: 'asc' | 'desc';
  compareFn?: (a: T, b: T) => number;
}

// 过滤配置
export interface FilterConfig<T> {
  key: keyof T;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith' | 'in' | 'notIn';
  value: any;
}

// 搜索配置
export interface SearchConfig<T> {
  fields: (keyof T)[];
  caseSensitive?: boolean;
  exactMatch?: boolean;
  highlightMatches?: boolean;
}

// 分组配置
export interface GroupConfig<T> {
  key: keyof T;
  labelFn?: (value: any) => string;
  sortFn?: (a: any, b: any) => number;
}

// 聚合函数类型
export type AggregateFunction = 'sum' | 'avg' | 'min' | 'max' | 'count';

// 聚合配置
export interface AggregateConfig<T> {
  key: keyof T;
  function: AggregateFunction;
  label?: string;
}

// 数据转换配置
export interface TransformConfig<T, R> {
  mapFn: (item: T) => R;
  filterFn?: (item: T) => boolean;
  sortFn?: (a: R, b: R) => number;
}

// 缓存配置
export interface CacheConfig {
  ttl: number; // 生存时间（毫秒）
  maxSize: number; // 最大缓存项数
  strategy: 'lru' | 'fifo' | 'lfu'; // 缓存策略
}

// 缓存项
export interface CacheItem<T> {
  key: string;
  value: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
}

// 防抖配置
export interface DebounceConfig {
  delay: number;
  immediate?: boolean;
  maxWait?: number;
}

// 节流配置
export interface ThrottleConfig {
  delay: number;
  leading?: boolean;
  trailing?: boolean;
}

// 重试配置
export interface RetryConfig {
  maxAttempts: number;
  delay: number;
  backoff?: 'linear' | 'exponential';
  maxDelay?: number;
  retryCondition?: (error: any) => boolean;
}

// 日期格式化选项
export interface DateFormatOptions {
  format: string;
  locale?: string;
  timezone?: string;
}

// 数字格式化选项
export interface NumberFormatOptions {
  decimals?: number;
  thousandsSeparator?: string;
  decimalSeparator?: string;
  prefix?: string;
  suffix?: string;
}

// 文件处理选项
export interface FileProcessOptions {
  maxSize?: number; // 最大文件大小（字节）
  allowedTypes?: string[]; // 允许的文件类型
  encoding?: string; // 文件编码
}

// 文件读取结果
export interface FileReadResult {
  content: string | ArrayBuffer;
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

// URL参数
export interface URLParams {
  [key: string]: string | number | boolean | undefined;
}

// HTTP请求配置
export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  cache?: boolean;
}

// HTTP响应
export interface HttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

// 事件监听器配置
export interface EventListenerConfig {
  once?: boolean;
  passive?: boolean;
  capture?: boolean;
}

// 键盘快捷键配置
export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  preventDefault?: boolean;
  handler: (event: KeyboardEvent) => void;
}

// 本地化配置
export interface LocalizationConfig {
  defaultLocale: string;
  supportedLocales: string[];
  fallbackLocale: string;
  loadPath: string;
}

// 翻译键值对
export interface TranslationMap {
  [key: string]: string | TranslationMap;
}

// 主题配置
export interface ThemeConfig {
  name: string;
  colors: Record<string, string>;
  fonts: Record<string, string>;
  spacing: Record<string, string>;
  breakpoints: Record<string, string>;
}

// 动画配置
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
  iterations?: number;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

// 性能监控配置
export interface PerformanceConfig {
  enableMetrics: boolean;
  sampleRate: number;
  thresholds: {
    loadTime: number;
    renderTime: number;
    memoryUsage: number;
  };
}

// 性能指标
export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  timestamp: number;
}

// 错误报告配置
export interface ErrorReportConfig {
  enableReporting: boolean;
  endpoint?: string;
  includeStackTrace: boolean;
  includeUserAgent: boolean;
  maxReports: number;
}

// 错误信息
export interface ErrorInfo {
  message: string;
  stack?: string;
  timestamp: number;
  userAgent?: string;
  url?: string;
  userId?: string;
}

// 工具函数类型
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

export type Nullable<T> = T | null;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

export type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

export type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

export type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};