import { Vocabulary } from '../types';
import extendedVocabulary from './vocabulary_extended';
import extendedVocabulary2 from './vocabulary_extended2';
import extendedVocabulary3 from './vocabulary_extended3';
import extendedVocabulary4 from './vocabulary_extended4';
import extendedVocabulary5 from './vocabulary_extended5';
import extendedVocabulary6 from './vocabulary_extended6';
import extendedVocabulary7 from './vocabulary_extended7';
import extendedVocabulary8 from './vocabulary_extended8';
import extendedVocabulary9 from './vocabulary_extended9';
import extendedVocabulary10 from './vocabulary_extended10';
import extendedVocabulary11 from './vocabulary_extended11';
import extendedVocabulary12 from './vocabulary_extended12';
import extendedVocabulary13 from './vocabulary_extended13';
import extendedVocabulary14 from './vocabulary_extended14';
import extendedVocabulary15 from './vocabulary_extended15';
import extendedVocabulary16 from './vocabulary_extended16';
import extendedVocabulary17 from './vocabulary_extended17';
import extendedVocabulary18 from './vocabulary_extended18';
import extendedVocabulary19 from './vocabulary_extended19';
import extendedVocabulary20 from './vocabulary_extended20';
import extendedVocabulary21 from './vocabulary_extended21';
import extendedVocabulary22 from './vocabulary_extended22';
import extendedVocabulary23 from './vocabulary_extended23';
import extendedVocabulary24 from './vocabulary_extended24';
import extendedVocabulary25 from './vocabulary_extended25';

// 财经英语词汇数据 (基础40个)
const baseVocabulary: Vocabulary[] = [
  {
    id: '1',
    word: 'asset',
    pronunciation: '/ˈæset/',
    definition: '资产；财产',
    example: 'The company has valuable assets including real estate and equipment.',
    exampleTranslation: '该公司拥有包括房地产和设备在内的宝贵资产。',
    category: 'finance',
    difficulty: 'beginner',
    tags: ['accounting', 'investment'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    word: 'liability',
    pronunciation: '/ˌlaɪəˈbɪləti/',
    definition: '负债；债务',
    example: 'The company reduced its liabilities by paying off loans.',
    exampleTranslation: '公司通过偿还贷款减少了负债。',
    category: 'finance',
    difficulty: 'intermediate',
    tags: ['accounting', 'debt'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    word: 'equity',
    pronunciation: '/ˈekwəti/',
    definition: '股权；净资产',
    example: 'Shareholders equity represents the owners stake in the company.',
    exampleTranslation: '股东权益代表所有者在公司中的股份。',
    category: 'finance',
    difficulty: 'intermediate',
    tags: ['investment', 'stocks'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '4',
    word: 'revenue',
    pronunciation: '/ˈrevənjuː/',
    definition: '收入；营业收入',
    example: 'The company reported a 15% increase in revenue this quarter.',
    exampleTranslation: '公司报告本季度收入增长了15%。',
    category: 'finance',
    difficulty: 'beginner',
    tags: ['accounting', 'income'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '5',
    word: 'profit',
    pronunciation: '/ˈprɒfɪt/',
    definition: '利润；盈利',
    example: 'The business generated a healthy profit margin of 20%.',
    exampleTranslation: '该企业产生了20%的健康利润率。',
    category: 'finance',
    difficulty: 'beginner',
    tags: ['accounting', 'income'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '6',
    word: 'dividend',
    pronunciation: '/ˈdɪvɪdend/',
    definition: '股息；红利',
    example: 'The company declared a quarterly dividend of $0.50 per share.',
    exampleTranslation: '公司宣布季度股息为每股0.50美元。',
    category: 'finance',
    difficulty: 'intermediate',
    tags: ['investment', 'stocks'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '7',
    word: 'portfolio',
    pronunciation: '/pɔːtˈfəʊliəʊ/',
    definition: '投资组合；资产组合',
    example: 'A diversified portfolio helps reduce investment risk.',
    exampleTranslation: '多元化的投资组合有助于降低投资风险。',
    category: 'finance',
    difficulty: 'intermediate',
    tags: ['investment', 'risk'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '8',
    word: 'volatility',
    pronunciation: '/ˌvɒləˈtɪləti/',
    definition: '波动性；不稳定性',
    example: 'High volatility in the stock market makes investors nervous.',
    exampleTranslation: '股市的高波动性让投资者感到紧张。',
    category: 'finance',
    difficulty: 'advanced',
    tags: ['investment', 'risk', 'market'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '9',
    word: 'liquidity',
    pronunciation: '/lɪˈkwɪdəti/',
    definition: '流动性；变现能力',
    example: 'Cash provides the highest liquidity among all assets.',
    exampleTranslation: '现金在所有资产中提供最高的流动性。',
    category: 'finance',
    difficulty: 'advanced',
    tags: ['investment', 'cash'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '10',
    word: 'inflation',
    pronunciation: '/ɪnˈfleɪʃn/',
    definition: '通胀；通货膨胀',
    example: 'Rising inflation erodes the purchasing power of money.',
    exampleTranslation: '通胀上升侵蚀了货币的购买力。',
    category: 'economics',
    difficulty: 'intermediate',
    tags: ['economy', 'monetary'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '11',
    word: 'recession',
    pronunciation: '/rɪˈseʃn/',
    definition: '经济衰退；萧条',
    example: 'The country entered a recession after two consecutive quarters of negative growth.',
    exampleTranslation: '该国在连续两个季度负增长后进入了经济衰退。',
    category: 'economics',
    difficulty: 'intermediate',
    tags: ['economy', 'growth'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '12',
    word: 'GDP',
    pronunciation: '/ˌdʒiː diː ˈpiː/',
    definition: '国内生产总值 (Gross Domestic Product)',
    example: 'The countrys GDP grew by 3.2% last year.',
    exampleTranslation: '该国去年的GDP增长了3.2%。',
    category: 'economics',
    difficulty: 'beginner',
    tags: ['economy', 'growth', 'statistics'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '13',
    word: 'interest rate',
    pronunciation: '/ˈɪntrəst reɪt/',
    definition: '利率',
    example: 'The central bank raised interest rates to combat inflation.',
    exampleTranslation: '央行提高利率以对抗通胀。',
    category: 'finance',
    difficulty: 'beginner',
    tags: ['banking', 'monetary'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '14',
    word: 'mortgage',
    pronunciation: '/ˈmɔːɡɪdʒ/',
    definition: '抵押贷款',
    example: 'They applied for a 30-year mortgage to buy their first home.',
    exampleTranslation: '他们申请了30年期抵押贷款来购买第一套房子。',
    category: 'banking',
    difficulty: 'intermediate',
    tags: ['loan', 'real estate'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '15',
    word: 'credit score',
    pronunciation: '/ˈkredɪt skɔːr/',
    definition: '信用评分',
    example: 'A good credit score helps you get better loan terms.',
    exampleTranslation: '良好的信用评分有助于获得更好的贷款条件。',
    category: 'banking',
    difficulty: 'intermediate',
    tags: ['credit', 'loan'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '16',
    word: 'budget',
    pronunciation: '/ˈbʌdʒɪt/',
    definition: '预算',
    example: 'Creating a monthly budget helps track your expenses.',
    exampleTranslation: '制定月度预算有助于跟踪支出。',
    category: 'personal finance',
    difficulty: 'beginner',
    tags: ['planning', 'money management'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '17',
    word: 'savings',
    pronunciation: '/ˈseɪvɪŋz/',
    definition: '储蓄；存款',
    example: 'Building an emergency savings fund is crucial for financial security.',
    exampleTranslation: '建立应急储蓄基金对财务安全至关重要。',
    category: 'personal finance',
    difficulty: 'beginner',
    tags: ['money management', 'planning'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '18',
    word: 'investment',
    pronunciation: '/ɪnˈvestmənt/',
    definition: '投资',
    example: 'Long-term investments typically offer better returns than short-term ones.',
    exampleTranslation: '长期投资通常比短期投资提供更好的回报。',
    category: 'finance',
    difficulty: 'beginner',
    tags: ['money management', 'growth'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '19',
    word: 'compound interest',
    pronunciation: '/ˈkɒmpaʊnd ˈɪntrəst/',
    definition: '复利',
    example: 'Compound interest is the eighth wonder of the world according to Einstein.',
    exampleTranslation: '据爱因斯坦说，复利是世界第八大奇迹。',
    category: 'finance',
    difficulty: 'intermediate',
    tags: ['investment', 'growth'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '20',
    word: 'diversification',
    pronunciation: '/daɪˌvɜːsɪfɪˈkeɪʃn/',
    definition: '多元化；分散投资',
    example: 'Diversification across different asset classes reduces portfolio risk.',
    exampleTranslation: '跨不同资产类别的多元化降低了投资组合风险。',
    category: 'finance',
    difficulty: 'advanced',
    tags: ['investment', 'risk', 'strategy'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  // Trading & Markets
  {
    id: '21',
    word: 'bull market',
    pronunciation: '/bʊl ˈmɑːkɪt/',
    definition: '牛市；上涨市场',
    example: 'The stock market has been in a bull market for the past five years.',
    exampleTranslation: '股市在过去五年中一直处于牛市。',
    category: 'trading',
    difficulty: 'intermediate',
    tags: ['market', 'trend'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '22',
    word: 'bear market',
    pronunciation: '/beər ˈmɑːkɪt/',
    definition: '熊市；下跌市场',
    example: 'Investors are worried about entering a bear market.',
    exampleTranslation: '投资者担心进入熊市。',
    category: 'trading',
    difficulty: 'intermediate',
    tags: ['market', 'trend'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '23',
    word: 'bid',
    pronunciation: '/bɪd/',
    definition: '买价；出价',
    example: 'The current bid price for the stock is $45.50.',
    exampleTranslation: '该股票当前的买价是45.50美元。',
    category: 'trading',
    difficulty: 'beginner',
    tags: ['price', 'order'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '24',
    word: 'ask',
    pronunciation: '/æsk/',
    definition: '卖价；要价',
    example: 'The ask price is typically higher than the bid price.',
    exampleTranslation: '卖价通常高于买价。',
    category: 'trading',
    difficulty: 'beginner',
    tags: ['price', 'order'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '25',
    word: 'spread',
    pronunciation: '/spred/',
    definition: '价差；买卖差价',
    example: 'The bid-ask spread on this stock is quite narrow.',
    exampleTranslation: '这只股票的买卖差价相当窄。',
    category: 'trading',
    difficulty: 'intermediate',
    tags: ['price', 'market'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '26',
    word: 'volume',
    pronunciation: '/ˈvɒljuːm/',
    definition: '成交量；交易量',
    example: 'High trading volume often indicates strong investor interest.',
    exampleTranslation: '高交易量通常表明投资者兴趣浓厚。',
    category: 'trading',
    difficulty: 'beginner',
    tags: ['market', 'activity'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '27',
    word: 'market cap',
    pronunciation: '/ˈmɑːkɪt kæp/',
    definition: '市值；市场资本化',
    example: 'Apple has one of the largest market caps in the world.',
    exampleTranslation: '苹果公司拥有世界上最大的市值之一。',
    category: 'trading',
    difficulty: 'intermediate',
    tags: ['valuation', 'stocks'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '28',
    word: 'IPO',
    pronunciation: '/ˌaɪ piː ˈəʊ/',
    definition: '首次公开募股 (Initial Public Offering)',
    example: 'The company is planning an IPO next year.',
    exampleTranslation: '该公司计划明年进行首次公开募股。',
    category: 'trading',
    difficulty: 'intermediate',
    tags: ['stocks', 'public offering'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '29',
    word: 'earnings',
    pronunciation: '/ˈɜːnɪŋz/',
    definition: '收益；盈利',
    example: 'The company exceeded earnings expectations this quarter.',
    exampleTranslation: '该公司本季度的收益超出了预期。',
    category: 'finance',
    difficulty: 'beginner',
    tags: ['income', 'performance'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '30',
    word: 'P/E ratio',
    pronunciation: '/piː iː ˈreɪʃiəʊ/',
    definition: '市盈率 (Price-to-Earnings ratio)',
    example: 'A high P/E ratio might indicate an overvalued stock.',
    exampleTranslation: '高市盈率可能表明股票被高估。',
    category: 'finance',
    difficulty: 'advanced',
    tags: ['valuation', 'ratio'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  // Forex & Currency
  {
    id: '31',
    word: 'forex',
    pronunciation: '/ˈfɔːreks/',
    definition: '外汇；外汇市场',
    example: 'Forex trading involves buying and selling currencies.',
    exampleTranslation: '外汇交易涉及买卖货币。',
    category: 'forex',
    difficulty: 'intermediate',
    tags: ['currency', 'trading'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '32',
    word: 'currency pair',
    pronunciation: '/ˈkʌrənsi peər/',
    definition: '货币对',
    example: 'EUR/USD is the most traded currency pair in forex.',
    exampleTranslation: 'EUR/USD是外汇市场中交易量最大的货币对。',
    category: 'forex',
    difficulty: 'intermediate',
    tags: ['currency', 'trading'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '33',
    word: 'pip',
    pronunciation: '/pɪp/',
    definition: '点；基点',
    example: 'The EUR/USD moved 50 pips higher today.',
    exampleTranslation: 'EUR/USD今天上涨了50个点。',
    category: 'forex',
    difficulty: 'advanced',
    tags: ['currency', 'measurement'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '34',
    word: 'leverage',
    pronunciation: '/ˈliːvərɪdʒ/',
    definition: '杠杆；杠杆作用',
    example: 'High leverage can amplify both profits and losses.',
    exampleTranslation: '高杠杆可以放大利润和损失。',
    category: 'forex',
    difficulty: 'advanced',
    tags: ['risk', 'trading'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '35',
    word: 'margin',
    pronunciation: '/ˈmɑːdʒɪn/',
    definition: '保证金；利润率',
    example: 'You need sufficient margin to open a leveraged position.',
    exampleTranslation: '你需要足够的保证金来开立杠杆头寸。',
    category: 'forex',
    difficulty: 'intermediate',
    tags: ['trading', 'requirement'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  // Derivatives
  {
    id: '36',
    word: 'derivative',
    pronunciation: '/dɪˈrɪvətɪv/',
    definition: '衍生品；金融衍生工具',
    example: 'Options and futures are common types of derivatives.',
    exampleTranslation: '期权和期货是常见的衍生品类型。',
    category: 'derivatives',
    difficulty: 'advanced',
    tags: ['instruments', 'complex'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '37',
    word: 'option',
    pronunciation: '/ˈɒpʃn/',
    definition: '期权',
    example: 'A call option gives you the right to buy a stock at a specific price.',
    exampleTranslation: '看涨期权给你以特定价格购买股票的权利。',
    category: 'derivatives',
    difficulty: 'advanced',
    tags: ['instruments', 'rights'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '38',
    word: 'futures',
    pronunciation: '/ˈfjuːtʃəz/',
    definition: '期货',
    example: 'Futures contracts obligate you to buy or sell at a future date.',
    exampleTranslation: '期货合约义务你在未来日期买入或卖出。',
    category: 'derivatives',
    difficulty: 'advanced',
    tags: ['contracts', 'obligations'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '39',
    word: 'swap',
    pronunciation: '/swɒp/',
    definition: '掉期；互换',
    example: 'Interest rate swaps are used to hedge against rate changes.',
    exampleTranslation: '利率掉期用于对冲利率变化。',
    category: 'derivatives',
    difficulty: 'advanced',
    tags: ['hedging', 'exchange'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '40',
    word: 'hedge',
    pronunciation: '/hedʒ/',
    definition: '对冲；套期保值',
    example: 'Companies hedge currency risk to protect against exchange rate fluctuations.',
    exampleTranslation: '公司对冲货币风险以防范汇率波动。',
    category: 'derivatives',
    difficulty: 'advanced',
    tags: ['risk management', 'protection'],
    audioUrl: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// 合并所有词汇数据
export const financialVocabulary: Vocabulary[] = [
  ...baseVocabulary,
  ...extendedVocabulary,
  ...extendedVocabulary2,
  ...extendedVocabulary3,
  ...extendedVocabulary4,
  ...extendedVocabulary5,
  ...extendedVocabulary6,
  ...extendedVocabulary7,
  ...extendedVocabulary8,
  ...extendedVocabulary9,
  ...extendedVocabulary10,
  ...extendedVocabulary11,
  ...extendedVocabulary12,
  ...extendedVocabulary13,
  ...extendedVocabulary14,
  ...extendedVocabulary15,
  ...extendedVocabulary16,
  ...extendedVocabulary17,
  ...extendedVocabulary18,
  ...extendedVocabulary19,
  ...extendedVocabulary20,
  ...extendedVocabulary21,
  ...extendedVocabulary22,
  ...extendedVocabulary23,
  ...extendedVocabulary24,
  ...extendedVocabulary25
];

// 按类别分组的词汇
export const vocabularyByCategory = {
  finance: financialVocabulary.filter(v => v.category === 'finance'),
  economics: financialVocabulary.filter(v => v.category === 'economics'),
  banking: financialVocabulary.filter(v => v.category === 'banking'),
  'personal finance': financialVocabulary.filter(v => v.category === 'personal finance')
};

// 按难度分组的词汇
export const vocabularyByDifficulty = {
  beginner: financialVocabulary.filter(v => v.difficulty === 'beginner'),
  intermediate: financialVocabulary.filter(v => v.difficulty === 'intermediate'),
  advanced: financialVocabulary.filter(v => v.difficulty === 'advanced')
};

// 获取随机词汇
export const getRandomVocabulary = (count: number = 10): Vocabulary[] => {
  const shuffled = [...financialVocabulary].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// 根据难度获取词汇
export const getVocabularyByDifficulty = (difficulty: string, count?: number): Vocabulary[] => {
  const filtered = financialVocabulary.filter(v => v.difficulty === difficulty);
  if (count) {
    return filtered.slice(0, count);
  }
  return filtered;
};

// 根据类别获取词汇
export const getVocabularyByCategory = (category: string, count?: number): Vocabulary[] => {
  const filtered = financialVocabulary.filter(v => v.category === category);
  if (count) {
    return filtered.slice(0, count);
  }
  return filtered;
};

// 搜索词汇
export const searchVocabulary = (query: string): Vocabulary[] => {
  const lowercaseQuery = query.toLowerCase();
  return financialVocabulary.filter(v => 
    v.word.toLowerCase().includes(lowercaseQuery) ||
    v.definition.toLowerCase().includes(lowercaseQuery) ||
    v.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};