
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Clock, BookOpen, Activity, Zap } from 'lucide-react';
import { AreaChart, Area, Tooltip as AreaTooltip, ResponsiveContainer } from 'recharts';
import { CandleChart } from '../components/CandleChart';
import { Card } from '../components/ui/Card';
import { INITIAL_INDICES, INITIAL_COMMODITIES, INITIAL_BONDS, MOCK_ECON_DATA } from '../constants';
import { tickPrice, initAssetData } from '../services/mockService';
import { MarketData } from '../types';

export const AssetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState<MarketData | null>(null);
  const [timeRange, setTimeRange] = useState<'1D' | '1W' | '1M' | '1Y'>('1D');

  // Find initial asset data
  useEffect(() => {
    const allAssets = [...INITIAL_INDICES, ...INITIAL_COMMODITIES, ...INITIAL_BONDS];
    const found = allAssets.find(a => a.id === id);
    if (found) {
      setAsset(initAssetData([found])[0]);
    }
  }, [id]);

  // Tick simulation
  useEffect(() => {
    if (!asset) return;
    const interval = setInterval(() => {
      setAsset(prev => prev ? tickPrice(prev) : null);
    }, 1000);
    return () => clearInterval(interval);
  }, [asset?.id]);

  if (!asset) return <div className="p-4 text-center">Loading...</div>;

  const isUp = asset.change >= 0;
  const color = isUp ? '#ef4444' : '#22c55e'; 
  const isOpen = asset.status === 'open';

  // Chart Data Preparation
  // 1D = Sparkline history (Area Chart)
  // Others = OHLC data (Candle Chart)
  const isLineChart = timeRange === '1D';
  const lineData = asset.history.map((val, i) => ({ time: i, price: val }));
  
  // Slicing logic for OHLC
  const fullOHLC = asset.ohlc;
  let displayData: typeof fullOHLC = [];
  
  if (timeRange === '1W') {
    displayData = fullOHLC.slice(-7); // Last 7 days
  } else if (timeRange === '1M') {
    displayData = fullOHLC.slice(-30); // Last 30 days
  } else if (timeRange === '1Y') {
    displayData = fullOHLC; // Full 365 days
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800 z-10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            <ArrowLeft size={22} className="text-slate-600 dark:text-slate-300"/>
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight">{asset.name}</h1>
            <span className="text-[10px] text-slate-500 font-mono">CODE: {asset.code} · {asset.source}</span>
          </div>
        </div>
        <div className="text-right">
           <div className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${isOpen ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
             {isOpen ? '已开盘' : '已休市'}
           </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Main Price */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-end">
             <div>
                <div className={`text-4xl font-mono font-bold tracking-tighter ${isUp ? 'text-up' : 'text-down'}`}>
                  {asset.price.toFixed(2)}
                </div>
                <div className={`flex items-center gap-2 mt-1 font-mono font-medium text-sm ${isUp ? 'text-up' : 'text-down'}`}>
                  {isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span>{asset.change > 0 ? '+' : ''}{asset.change.toFixed(2)}</span>
                  <span>({asset.changePercent > 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%)</span>
                </div>
             </div>
             <div className="text-right">
                <div className="text-xs text-slate-400 mb-1">数据刷新频率</div>
                <div className="flex items-center justify-end gap-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isOpen ? <Zap size={12} className="text-green-500 fill-current" /> : <Clock size={12} />}
                  {isOpen ? '每秒更新' : '20分钟/次'}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">
                   {asset.lastUpdated}
                </div>
             </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
           {/* Timeframe Tabs */}
           <div className="flex space-x-4 mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">
              {['1D', '1W', '1M', '1Y'].map(t => (
                <button 
                  key={t}
                  onClick={() => setTimeRange(t as any)}
                  className={`text-sm font-medium pb-1 relative ${timeRange === t ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}
                >
                  {t}
                  {timeRange === t && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
                </button>
              ))}
           </div>

           {/* Chart Container */}
           <div className="h-64 w-full">
             {isLineChart ? (
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={lineData}>
                   <defs>
                     <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor={color} stopOpacity={0.2}/>
                       <stop offset="95%" stopColor={color} stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <AreaTooltip 
                      contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '8px', fontSize: '12px' }} 
                      formatter={(val: number) => val.toFixed(2)}
                      labelStyle={{display:'none'}}
                    />
                   <Area type="monotone" dataKey="price" stroke={color} strokeWidth={2} fill="url(#colorGradient)" isAnimationActive={false} />
                 </AreaChart>
               </ResponsiveContainer>
             ) : (
               <CandleChart data={displayData} />
             )}
           </div>
        </div>

        {/* AI Analysis */}
        <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-indigo-100 dark:border-indigo-900">
           <div className="flex items-center gap-2 mb-2">
             <div className="p-1.5 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-200 dark:shadow-none"><BookOpen size={14} /></div>
             <h3 className="font-bold text-sm text-indigo-900 dark:text-indigo-200">今日AI走势解读</h3>
           </div>
           <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
             受{asset.region === 'US' ? '美联储利率决议' : '最新PMI数据'}预期影响，{asset.name}今日{isUp ? '震荡上行，突破关键阻力位' : '承压回调，测试下方支撑'}。
             市场情绪{isUp ? '偏向乐观' : '趋于谨慎'}，建议关注成交量配合情况。短期波动率可能维持在高位，需警惕尾盘变盘风险。
           </p>
        </Card>

        {/* Historical Data Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 font-bold text-sm">
            历史数据 (近5日)
          </div>
          <table className="w-full text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500">
              <tr>
                <th className="px-4 py-2 text-left font-normal">日期</th>
                <th className="px-4 py-2 text-right font-normal">收盘</th>
                <th className="px-4 py-2 text-right font-normal">涨跌</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {asset.ohlc.slice(-5).reverse().map((row, i) => { // Show last 5 reverse order
                const prev = asset.ohlc[asset.ohlc.length - 1 - i - 1]; // Previous day
                const change = prev ? row.close - prev.close : 0;
                const changeP = prev ? (change / prev.close) * 100 : 0;
                
                return (
                  <tr key={i}>
                    <td className="px-4 py-2.5 font-mono text-slate-600 dark:text-slate-300">{row.time.slice(5)}</td>
                    <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-900 dark:text-white">{row.close.toFixed(2)}</td>
                    <td className={`px-4 py-2.5 text-right font-mono ${change >= 0 ? 'text-up' : 'text-down'}`}>
                      {change >= 0 ? '+' : ''}{changeP.toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Related Macro & News */}
        <div className="grid grid-cols-1 gap-4">
           <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
              <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                <Activity size={16} className="text-blue-500" /> 关联宏观指标
              </h3>
              <div className="space-y-2">
                {MOCK_ECON_DATA.slice(0, 2).map(econ => (
                  <div key={econ.id} onClick={() => navigate('/economic')} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded active:bg-slate-100">
                     <span className="text-xs font-medium">{econ.name}</span>
                     <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">{econ.value}</span>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
