
import { MarketData, NewsItem, EconomicIndicator } from './types';

// Helper to create empty OHLC
const emptyOHLC = () => [];

export const INITIAL_INDICES: MarketData[] = [
  { 
    id: 'sp500', name: '标普500', code: 'SPX', price: 4783.45, change: 12.3, changePercent: 0.26, 
    direction: 'up', history: [], ohlc: [], lastUpdated: '', source: 'CBOE', category: 'index', 
    region: 'US', status: 'closed', openTime: '09:30', closeTime: '16:00' 
  },
  { 
    id: 'nasdaq', name: '纳斯达克', code: 'NDX', price: 15123.20, change: -45.6, changePercent: -0.30, 
    direction: 'down', history: [], ohlc: [], lastUpdated: '', source: 'NASDAQ', category: 'index', 
    region: 'US', status: 'closed', openTime: '09:30', closeTime: '16:00' 
  },
  { 
    id: 'dji', name: '道琼斯', code: 'DJI', price: 37400.10, change: 89.2, changePercent: 0.24, 
    direction: 'up', history: [], ohlc: [], lastUpdated: '', source: 'DJI', category: 'index', 
    region: 'US', status: 'closed', openTime: '09:30', closeTime: '16:00' 
  },
  { 
    id: 'shcomp', name: '上证指数', code: '000001.SS', price: 3089.50, change: 15.4, changePercent: 0.47, 
    direction: 'up', history: [], ohlc: [], lastUpdated: '', source: 'SSE', category: 'index', 
    region: 'CN', status: 'closed', openTime: '09:30', closeTime: '15:00' 
  },
  { 
    id: 'hsi', name: '恒生指数', code: 'HSI', price: 16500.80, change: -120.5, changePercent: -0.73, 
    direction: 'down', history: [], ohlc: [], lastUpdated: '', source: 'HKEX', category: 'index', 
    region: 'HK', status: 'closed', openTime: '09:30', closeTime: '16:00' 
  },
  { 
    id: 'vix', name: 'VIX恐慌指数', code: 'VIX', price: 13.45, change: 0.2, changePercent: 1.5, 
    direction: 'up', history: [], ohlc: [], lastUpdated: '', source: 'CBOE', category: 'index', 
    region: 'US', status: 'closed', openTime: '09:30', closeTime: '16:00' 
  },
  { 
    id: 'dxy', name: '美元指数', code: 'DXY', price: 102.30, change: -0.1, changePercent: -0.09, 
    direction: 'down', history: [], ohlc: [], lastUpdated: '', source: 'ICE', category: 'currency', 
    region: 'Global', status: 'open', openTime: '00:00', closeTime: '23:59' 
  },
];

export const INITIAL_COMMODITIES: MarketData[] = [
  { 
    id: 'wti', name: '原油 WTI', code: 'CL=F', price: 72.40, change: 0.5, changePercent: 0.70, 
    direction: 'up', history: [], ohlc: [], lastUpdated: '', source: 'NYMEX', category: 'commodity', 
    region: 'Global', status: 'open', openTime: '00:00', closeTime: '23:00' 
  },
  { 
    id: 'brent', name: '布伦特原油', code: 'BZ=F', price: 77.80, change: 0.6, changePercent: 0.78, 
    direction: 'up', history: [], ohlc: [], lastUpdated: '', source: 'ICE', category: 'commodity', 
    region: 'Global', status: 'open', openTime: '00:00', closeTime: '23:00' 
  },
  { 
    id: 'gold', name: '伦敦金现货', code: 'XAU/USD', price: 2658.40, change: 12.5, changePercent: 0.47, 
    direction: 'up', history: [], ohlc: [], lastUpdated: '', source: 'LBMA', category: 'commodity', 
    region: 'Global', status: 'open', openTime: '00:00', closeTime: '23:00' 
  },
  { 
    id: 'copper', name: '伦敦铜', code: 'LME-CU', price: 8450.00, change: 30.0, changePercent: 0.36, 
    direction: 'up', history: [], ohlc: [], lastUpdated: '', source: 'LME', category: 'commodity', 
    region: 'Global', status: 'open', openTime: '09:00', closeTime: '17:00' 
  },
];

export const INITIAL_BONDS: MarketData[] = [
  { 
    id: 'us10y', name: '美10年期国债', code: 'US10Y', price: 3.95, change: 0.02, changePercent: 0.51, 
    direction: 'up', history: [], ohlc: [], lastUpdated: '', source: 'US Treasury', category: 'bond', 
    region: 'US', status: 'closed', openTime: '08:00', closeTime: '17:00' 
  },
  { 
    id: 'us2y', name: '美2年期国债', code: 'US02Y', price: 4.25, change: 0.01, changePercent: 0.24, 
    direction: 'up', history: [], ohlc: [], lastUpdated: '', source: 'US Treasury', category: 'bond', 
    region: 'US', status: 'closed', openTime: '08:00', closeTime: '17:00' 
  },
];

// --- MOCK NEWS GENERATOR (100+ Items) ---

const generateMockNews = (): NewsItem[] => {
  const items: NewsItem[] = [];
  const now = new Date();

  // Templates for specific categories
  const TEMPLATES = [
    // US / Global - Reuters
    { type: 'US', cat: 'earnings', source: '路透社', title: '英伟达Q3营收同比增长{num}%，AI芯片需求仍供不应求', tags: ['美股', 'AI', '财报'] },
    { type: 'US', cat: 'earnings', source: '路透社', title: '微软Copilot用户数突破新高，云服务收入超预期', tags: ['美股', 'AI', '微软'] },
    { type: 'US', cat: 'earnings', source: '路透社', title: '特斯拉Cybertruck产量爬坡顺利，毛利率有望回升', tags: ['美股', '新能源', '特斯拉'] },
    { type: 'US', cat: 'macro', source: '路透社', title: '美联储会议纪要：通胀仍具粘性，降息需更多数据支持', tags: ['宏观', '美联储', '美元'] },
    { type: 'US', cat: 'macro', source: '路透社', title: '美国{month}月非农就业人口增加{num}万人，远超预期', tags: ['宏观', '非农', '美债'] },
    { type: 'US', cat: 'tech', source: '路透社', title: 'OpenAI发布GPT-5预览版，推理能力大幅提升', tags: ['科技', 'AI', '美股'] },
    
    // CN - Cailian Press
    { type: 'CN', cat: 'central_bank', source: '财联社', title: '央行：将灵活运用多种货币政策工具，保持流动性合理充裕', tags: ['央行', '宏观', 'A股'] },
    { type: 'CN', cat: 'central_bank', source: '财联社', title: '银河证券：LPR下调空间打开，利好地产与实体经济', tags: ['利率', '地产', '观点'] },
    { type: 'CN', cat: 'macro', source: '财联社', title: '发改委：加快推进数字基础设施建设，做强做优做大数字经济', tags: ['政策', '科技', 'A股'] },
    { type: 'CN', cat: 'earnings', source: '财联社', title: '宁德时代发布神行电池Plus，续航里程突破1000公里', tags: ['A股', '新能源', '科技'] },
    { type: 'CN', cat: 'tech', source: '财联社', title: '华为Mate 70系列预约量破百万，产业链个股集体走强', tags: ['科技', '华为', 'A股'] },
    { type: 'CN', cat: 'macro', source: '财联社', title: '财政部：将实施更积极的财政政策，支持科技创新和制造业发展', tags: ['政策', '宏观', 'A股'] }
  ];

  const generateRandomTime = (index: number) => {
    const t = new Date(now.getTime() - index * 10 * 60 * 1000); // Backwards in 10 min steps roughly
    return `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-${String(t.getDate()).padStart(2,'0')} ${String(t.getHours()).padStart(2,'0')}:${String(t.getMinutes()).padStart(2,'0')}:${String(t.getSeconds()).padStart(2,'0')}`;
  };

  for (let i = 0; i < 100; i++) {
    const template = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
    const num = Math.floor(Math.random() * 50) + 10;
    const month = Math.floor(Math.random() * 12) + 1;
    
    let finalTitle = template.title.replace('{num}', num.toString()).replace('{month}', month.toString());
    
    items.push({
      id: `news-${i}`,
      title: finalTitle,
      summary: template.type === 'US' 
        ? `据路透社报道，${finalTitle}。分析师指出，这将对市场产生重要影响，建议投资者密切关注后续动态。`
        : `财联社消息，${finalTitle}。业内人士分析认为，此举释放了积极信号，有望提振相关板块信心。`,
      source: template.source,
      timestamp: generateRandomTime(i),
      tags: template.tags,
      url: template.type === 'US' ? 'https://www.reuters.com' : 'https://www.cls.cn',
      category: template.cat as any
    });
  }

  return items;
};

export const MOCK_NEWS = generateMockNews();

export const MOCK_ECON_DATA: EconomicIndicator[] = [
  { 
    id: 'us_cpi', name: '美国 CPI', value: '3.4%', comparison: '同比 +3.4%', 
    description: '消费者价格指数，衡量通胀的关键指标。CPI 上升通常意味着通胀加剧，可能影响美联储降息预期。', 
    impact: 'High', nextRelease: '2025-12-12 20:30', lastUpdated: '2025-11-12 20:30:00', 
    history: [{date: '2025-06', value: 3.0}, {date: '2025-07', value: 3.2}, {date: '2025-08', value: 3.7}, {date: '2025-09', value: 3.4}, {date: '2025-10', value: 3.4}], 
    category: 'US', source: 'BLS' 
  },
  { 
    id: 'us_nfp', name: '非农就业人数', value: '21.6万', comparison: '预期 17万', 
    description: '非农业部门新增就业人数。就业强劲意味着经济有韧性，利好美元，利空美债。', 
    impact: 'High', nextRelease: '2025-12-05 20:30', lastUpdated: '2025-11-03 20:30:00', 
    history: [{date: '2025-07', value: 18.5}, {date: '2025-08', value: 19.0}, {date: '2025-09', value: 15.0}, {date: '2025-10', value: 21.6}], 
    category: 'US', source: 'DOL' 
  },
  { 
    id: 'cn_pmi', name: '中国制造业 PMI', value: '49.0', comparison: '前值 49.4', 
    description: '采购经理人指数，低于50表明制造业处于收缩区间。', 
    impact: 'Medium', nextRelease: '2025-12-31 09:30', lastUpdated: '2025-11-30 09:30:00', 
    history: [{date: '2025-07', value: 49.3}, {date: '2025-08', value: 49.7}, {date: '2025-09', value: 50.2}, {date: '2025-10', value: 49.0}], 
    category: 'CN', source: 'NBS' 
  },
  { 
    id: 'kr_exp', name: '韩国出口', value: '+5.1%', comparison: '同比', 
    description: '全球经济的金丝雀，反映全球贸易活跃度。', 
    impact: 'Medium', nextRelease: '2025-12-01 08:00', lastUpdated: '2025-11-01 08:00:00', 
    history: [{date: '2025-07', value: -1.2}, {date: '2025-08', value: 2.1}, {date: '2025-09', value: 4.5}, {date: '2025-10', value: 5.1}], 
    category: 'Global', source: 'MOTIE' 
  },
];
