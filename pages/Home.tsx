
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, TrendingUp, TrendingDown, Info, Lock, Clock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { MiniChart } from '../components/MiniChart';
import { INITIAL_INDICES, INITIAL_COMMODITIES, INITIAL_BONDS } from '../constants';
import { initAssetData, tickPrice } from '../services/mockService';
import { MarketData, MarketStatus } from '../types';

export const Home = () => {
  const navigate = useNavigate();
  const [indices, setIndices] = useState<MarketData[]>([]);
  const [commodities, setCommodities] = useState<MarketData[]>([]);
  const [bonds, setBonds] = useState<MarketData[]>([]);
  const [fearGreed, setFearGreed] = useState(32);
  const [secTick, setSecTick] = useState(0);

  // Initialize Data
  useEffect(() => {
    setIndices(initAssetData(INITIAL_INDICES));
    setCommodities(initAssetData(INITIAL_COMMODITIES));
    setBonds(initAssetData(INITIAL_BONDS));
  }, []);

  // Universal Ticker (Runs every second)
  // Logic: 
  // IF asset.status === 'open' -> Update price & time.
  // IF asset.status === 'closed' -> Update only time (every 20 mins logic simulated here).
  useEffect(() => {
    const interval = setInterval(() => {
      setSecTick(prev => prev + 1);

      const updateLogic = (asset: MarketData) => {
        // If closed, only update visually occasionally (simulated in tickPrice)
        // tickPrice handles the logic: if closed, price stays same, time updates.
        return tickPrice(asset);
      };

      setIndices(prev => prev.map(updateLogic));
      setCommodities(prev => prev.map(updateLogic));
      setBonds(prev => prev.map(updateLogic));

      // Sentiment updates only if random chance
      if (Math.random() > 0.8) {
        setFearGreed(prev => {
          const move = Math.floor(Math.random() * 3) - 1;
          return Math.max(0, Math.min(100, prev + move));
        });
      }

    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const StatusBadge = ({ status, time }: { status: MarketStatus, time: string }) => {
    const isOpen = status === 'open';
    return (
      <div className={`flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full ${
        isOpen 
          ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></span>
        <span>{isOpen ? `实时 · ${time}` : `休市 · ${time}`}</span>
      </div>
    );
  };

  const renderMarketCard = (asset: MarketData) => {
    const isUp = asset.change >= 0;
    const colorClass = isUp ? 'text-up' : 'text-down';
    const chartColor = isUp ? '#ef4444' : '#22c55e';
    const isOpen = asset.status === 'open';

    return (
      <Card 
        key={asset.id} 
        className="flex flex-col justify-between active:scale-[0.98] transition-transform"
        onClick={() => navigate(`/asset/${asset.id}`)}
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{asset.name}</h3>
            <span className="text-[10px] text-slate-400">{asset.source}</span>
          </div>
          <MiniChart data={asset.history} color={chartColor} />
        </div>
        
        <div className="mt-1">
          <div className="flex items-baseline gap-2">
             <div className="text-lg font-mono font-bold tracking-tight text-slate-900 dark:text-white">
              {asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            {isOpen ? (
               <div className={`flex items-center text-xs font-mono font-medium ${colorClass}`}>
                  {isUp ? <TrendingUp size={10} className="mr-0.5"/> : <TrendingDown size={10} className="mr-0.5"/>}
                  {asset.changePercent.toFixed(2)}%
               </div>
            ) : (
               <div className="text-[10px] text-slate-400 font-mono">--%</div>
            )}
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
            <StatusBadge status={asset.status} time={asset.lastUpdated} />
        </div>
      </Card>
    );
  };

  return (
    <div className="p-4 space-y-6">
      <header className="flex justify-between items-center mb-2">
        <div>
           <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">市场雷达</h1>
           <p className="text-xs text-slate-500">全球行情秒级直达</p>
        </div>
        <div className="text-right">
           <div className="text-xs font-mono text-slate-400">{new Date().toLocaleDateString('zh-CN')}</div>
        </div>
      </header>

      {/* Market Sentiment */}
      <Card className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
        <div className="flex items-center justify-between mb-2">
           <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
             <Zap size={16} className="text-yellow-500" /> 市场情绪
           </h2>
           <span className={`text-xs font-bold ${fearGreed < 40 ? 'text-green-600' : fearGreed > 60 ? 'text-red-600' : 'text-slate-600'}`}>
             {fearGreed < 40 ? '偏恐惧' : fearGreed > 60 ? '偏贪婪' : '中性'} ({fearGreed}/100)
           </span>
        </div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative">
          <div 
            className="h-full transition-all duration-1000 ease-out bg-gradient-to-r from-green-500 via-yellow-400 to-red-500"
            style={{ width: `${fearGreed}%` }}
          ></div>
          <div 
            className="absolute top-0 w-1 h-full bg-slate-900 dark:bg-white"
            style={{ left: `${fearGreed}%` }}
          ></div>
        </div>
        <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
           <Info size={10} /> 实时更新 · 资金流向与波动率综合计算
        </p>
      </Card>

      {/* Global Indices */}
      <section>
        <div className="flex items-center justify-between mb-3">
           <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-l-4 border-blue-500 pl-2">全球指数</h2>
           <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">含A股/美股/港股</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {indices.map(idx => renderMarketCard(idx))}
        </div>
      </section>

      {/* Commodities */}
      <section>
        <h2 className="text-lg font-bold mb-3 text-slate-800 dark:text-slate-100 border-l-4 border-yellow-500 pl-2">大宗商品</h2>
        <div className="grid grid-cols-2 gap-3">
          {commodities.map(item => renderMarketCard(item))}
        </div>
      </section>

      {/* Bonds */}
      <section>
        <h2 className="text-lg font-bold mb-3 text-slate-800 dark:text-slate-100 border-l-4 border-purple-500 pl-2">利率与债券</h2>
        <Card className="p-0 overflow-hidden">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
             <span className="text-xs font-bold text-slate-600 dark:text-slate-300">收益率曲线状态</span>
             <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded">已倒挂 · 衰退警示</span>
          </div>
          <div className="p-3 space-y-4">
             {bonds.map(bond => (
               <div key={bond.id} onClick={() => navigate(`/asset/${bond.id}`)} className="flex justify-between items-center active:opacity-70">
                 <div>
                   <div className="font-bold text-sm dark:text-slate-200">{bond.name}</div>
                   <StatusBadge status={bond.status} time={bond.lastUpdated} />
                 </div>
                 <div className="text-right">
                   <div className="font-mono font-bold text-lg text-slate-900 dark:text-white">{bond.price.toFixed(2)}%</div>
                   <div className={`text-xs font-mono ${bond.change >= 0 ? 'text-up' : 'text-down'}`}>
                     {bond.change >= 0 ? '+' : ''}{bond.change.toFixed(2)}
                   </div>
                 </div>
               </div>
             ))}
          </div>
        </Card>
      </section>
      
      <div className="h-10"></div>
    </div>
  );
};
