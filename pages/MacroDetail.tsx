
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Info } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { MOCK_ECON_DATA } from '../constants';

export const MacroDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = MOCK_ECON_DATA.find(i => i.id === id);

  if (!item) return <div>Data not found</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pb-20">
      <div className="sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800 z-10 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <ArrowLeft size={22} className="text-slate-600 dark:text-slate-300"/>
        </button>
        <h1 className="text-base font-bold text-slate-900 dark:text-white">{item.name}</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Main Value */}
        <div className="text-center py-4">
           <div className="text-sm text-slate-500 mb-1">最新公布值 ({item.lastUpdated.split(' ')[0]})</div>
           <div className="text-4xl font-mono font-bold text-blue-600 dark:text-blue-400">{item.value}</div>
           <div className="mt-2 inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs text-slate-600 dark:text-slate-300 font-medium">
              {item.comparison}
           </div>
        </div>

        {/* Chart */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
           <h3 className="text-xs font-bold text-slate-500 mb-4 uppercase">历史走势</h3>
           <div className="h-56 w-full -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={item.history}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                    <YAxis domain={['auto', 'auto']} tick={{fontSize: 10}} axisLine={false} tickLine={false} width={30}/>
                    <Tooltip 
                      contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                      labelStyle={{color: '#64748b', fontSize: '10px'}}
                    />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6'}} />
                 </LineChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Explanation */}
        <div className="space-y-4">
           <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl">
              <h3 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                 <Info size={16} /> 指标解读
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                 {item.description}
              </p>
           </div>

           <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 font-bold text-sm">
                 公布日程
              </div>
              <div className="p-4 space-y-3 text-sm">
                 <div className="flex justify-between">
                    <span className="text-slate-500">数据来源</span>
                    <span className="font-medium">{item.source}</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-slate-500">最近更新</span>
                    <span className="font-mono">{item.lastUpdated}</span>
                 </div>
                 <div className="flex justify-between text-blue-600 dark:text-blue-400 font-bold">
                    <span className="flex items-center gap-1"><Calendar size={14}/> 下次公布</span>
                    <span className="font-mono">{item.nextRelease}</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
