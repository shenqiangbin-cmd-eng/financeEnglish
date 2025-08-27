# 需求锁定纪要 (Requirements Locked Document)

## 核心目标 (Mission)
构建一个专业的财经英语学习网页应用，帮助港美股资讯公司职场人士快速掌握财经英语词汇和表达，使英语成为有效的工作语言。

## 用户画像 (Persona)
**目标用户：** 港美股资讯公司的职场人士
**主要痛点：**
- 财经英语词汇量不足，影响工作效率
- 不认识且不会读专业财经术语
- 缺乏系统性的财经英语学习工具
- 需要快速提升英语作为工作语言的能力

## 功能范围清单 (Scope Checklist)

### ✅ 包含功能
**核心学习功能：**
- 分级财经词汇学习（初级500词、中级800词、高级1200词）
- 涵盖股票、债券、外汇、商品、宏观经济、公司财报全领域
- 财经缩写词专项学习（GDP、IPO、M&A等）
- 多类型句子学习（新闻标题、分析师评论、交易术语、会议发言）

**朗读与发音功能：**
- 美式/英式发音切换
- 慢速朗读功能
- 音标显示
- 单词和句子朗读

**记忆与复习功能：**
- 基于答题正确率的智能记忆系统
- 间隔重复算法自动安排复习
- 认识/不认识二元熟练度标记
- 个性化复习计划

**收藏与管理功能：**
- 单词收藏
- 句子收藏
- 自定义词汇表创建
- 收藏夹分类管理
- 导入/导出功能

**学习统计与目标：**
- 学习时长统计
- 掌握词汇数量追踪
- 学习正确率分析
- 每日/周期学习目标设定
- 学习进度可视化

**用户界面：**
- 简洁美观的苹果风格设计
- 响应式布局（桌面+移动端）
- 直觉化交互设计
- 深色/浅色模式切换

### ❌ 不包含功能
- 云端数据同步
- 社交功能（分享、排行榜等）
- 语法学习模块
- 写作练习功能
- 多人协作功能
- 付费订阅系统
- 离线下载功能
- 语音识别评分

## 关键业务逻辑 (Business Rules)

**学习流程逻辑：**
- 如果用户首次使用，那么引导选择学习级别（初级/中级/高级）
- 如果用户开始学习新词汇，那么系统按顺序展示该级别词汇
- 如果用户完成词汇学习，那么进入测试环节验证掌握程度
- 如果用户测试正确率低于70%，那么该词汇标记为"需要复习"
- 如果用户测试正确率高于90%，那么该词汇标记为"已掌握"

**复习算法逻辑：**
- 如果词汇首次答错，那么1小时后安排复习
- 如果词汇连续答对2次，那么复习间隔延长至1天
- 如果词汇连续答对4次，那么复习间隔延长至3天
- 如果词汇连续答对6次，那么复习间隔延长至7天
- 如果词汇连续答对8次，那么标记为"完全掌握"，不再主动复习

**收藏功能逻辑：**
- 如果用户收藏词汇，那么自动加入"我的收藏"分类
- 如果用户创建自定义词汇表，那么可以添加任意词汇到该表
- 如果用户导出词汇表，那么生成JSON格式文件
- 如果用户导入词汇表，那么验证格式后合并到现有数据

**学习目标逻辑：**
- 如果用户设定每日学习目标，那么系统每日重置进度计数
- 如果用户完成每日目标，那么显示完成提示和鼓励信息
- 如果用户连续7天完成目标，那么显示周成就徽章

## 数据契约 (Data Contract)

**词汇数据结构：**
```json
{
  "id": "string",
  "word": "string",
  "phonetic_us": "string",
  "phonetic_uk": "string",
  "definition_cn": "string",
  "definition_en": "string",
  "category": "stocks|bonds|forex|commodities|macro|financial_reports",
  "level": "beginner|intermediate|advanced",
  "examples": ["string"],
  "audio_us": "string",
  "audio_uk": "string"
}
```

**用户学习记录：**
```json
{
  "word_id": "string",
  "correct_count": "number",
  "total_attempts": "number",
  "last_review": "timestamp",
  "next_review": "timestamp",
  "mastery_level": "learning|reviewing|mastered",
  "is_favorite": "boolean"
}
```

**收藏数据：**
```json
{
  "collections": [
    {
      "id": "string",
      "name": "string",
      "type": "words|sentences|custom",
      "items": ["string"],
      "created_at": "timestamp"
    }
  ]
}
```

**学习统计：**
```json
{
  "daily_stats": {
    "date": "string",
    "words_learned": "number",
    "time_spent": "number",
    "accuracy_rate": "number"
  },
  "overall_stats": {
    "total_words_mastered": "number",
    "total_time_spent": "number",
    "average_accuracy": "number",
    "current_streak": "number"
  }
}
```

**技术实现规范：**
- 前端框架：React 18 + TypeScript
- 状态管理：React Context + useReducer
- 样式方案：Tailwind CSS + CSS Modules
- 音频处理：Web Audio API + 预录制音频文件
- 数据存储：LocalStorage + IndexedDB
- 构建工具：Vite
- 代码规范：ESLint + Prettier

---

**📋 此需求文档一经确认，将作为后续开发的唯一标准，不再变更。**
**🚀 确认无误后，即可进入技术架构设计和开发实施阶段。**