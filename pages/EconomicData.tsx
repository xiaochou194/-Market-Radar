
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { MiniChart } from '../components/MiniChart';
import { MOCK_ECON_DATA } from '../constants';
import { EconomicIndicator } from '../types';
import { getCurrentDateTime } from '../services/mockService';
import { Calendar, HelpCircle, ChevronRight, Globe, Flag } from 'lucide-react';

export const EconomicData = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<EconomicIndicator[]>(MOCK_ECON_DATA);

  const renderGroup = (title: string, items: EconomicIndicator[], icon: React.ReactNode) => (
    <div className="mb-6">
      <h2 className="text-lg font-bold mb-3 text-slate-800 dark:text-slate-100 flex items-center gap-2">
        {icon} {title}
      </h2>
      <div className="space-y-3">
        {items.map(item => (
          <Card key={item.id} className="relative overflow-hidden" onClick={() => navigate(`/macro/${item.id}`)}>
            <div className="flex justify-between items-start mb-2">
              <div>
                 <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {item.name}
                    {item.impact === 'High' && <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">重要</span>}
                 </h3>
                 <div className="flex items-center gap-2 mt-2">
                    <span className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">{item.value}</span>
                    <Badge variant="neutral">{item.comparison}</Badge>
                 </div>
              </div>
              <div className="w-24 opacity-80">
                 <MiniChart data={item.history.map(h => h.value)} color="#64748b" />
                 <div className="text-[10px] text-center text-slate-400 mt-1">历史趋势</div>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono border-t border-slate-100 dark:border-slate-700 pt-2 mt-2">
               <span className="flex items-center gap-1">
                 <Calendar size={10} />
                 公布: {item.lastUpdated.split(' ')[0]}
               </span>
               <div className="flex items-center text-blue-500 font-medium">
                  详情 <ChevronRight size={10} />
               </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-4">
       <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">宏观经济数据</h1>
        <p className="text-sm text-slate-500">全球经济晴雨表</p>
      </header>

      {renderGroup('美国核心数据', data.filter(i => i.category === 'US'), <span className="text-xl">🇺🇸</span>)}
      {renderGroup('中国关键指标', data.filter(i => i.category === 'CN'), <span className="text-xl">🇨🇳</span>)}
      {renderGroup('全球前瞻', data.filter(i => i.category === 'Global'), <Globe size={20} className="text-blue-500"/>)}
    </div>
  );
};
