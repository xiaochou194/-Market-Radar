
import React, { useState, useEffect } from 'react';
import { ExternalLink, Tag, RefreshCcw } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { MOCK_NEWS } from '../constants';
import { NewsItem } from '../types';

export const News = () => {
  const [filter, setFilter] = useState<'all' | 'central_bank' | 'earnings' | 'macro'>('all');
  const [displayNews, setDisplayNews] = useState<NewsItem[]>(MOCK_NEWS);
  const [loading, setLoading] = useState(false);

  // Simulate pulling new news
  const refreshNews = () => {
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
    }, 800);
  };

  const filteredNews = filter === 'all' 
    ? displayNews 
    : displayNews.filter(n => n.category === filter);

  const openNews = (url: string) => {
    const confirm = window.confirm('即将跳转至第三方媒体页面阅读原文');
    if (confirm) window.open(url, '_blank');
  };

  const tabs = [
    { id: 'all', label: '全部' },
    { id: 'central_bank', label: '央行/利率' },
    { id: 'earnings', label: '财报/科技' },
    { id: 'macro', label: '宏观/事件' },
  ];

  return (
    <div className="p-4">
      <header className="mb-4 flex justify-between items-end">
        <div>
           <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">重点新闻流</h1>
           <p className="text-xs text-slate-500 mt-1">
             <span className="font-bold">路透社</span> (Global/US) & <span className="font-bold">财联社</span> (China) 实时快讯
           </p>
        </div>
        <button onClick={refreshNews} className={`p-2 rounded-full bg-slate-100 dark:bg-slate-800 ${loading ? 'animate-spin' : ''}`}>
           <RefreshCcw size={16} className="text-slate-600 dark:text-slate-400"/>
        </button>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === tab.id 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredNews.map((news) => {
           const isReuters = news.source.includes('路透');
           const sourceColor = isReuters ? 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' : 'text-red-600 bg-red-50 dark:bg-red-900/20';
           
           return (
            <Card key={news.id} onClick={() => openNews(news.url)}>
              <div className="flex justify-between items-start mb-2">
                 <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug flex-1 mr-2">
                   {news.title}
                 </h3>
              </div>
              <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                {news.summary}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {news.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                    <Tag size={10} className="mr-1" /> {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                  <span className={`font-bold px-1.5 py-0.5 rounded ${sourceColor}`}>{news.source}</span>
                  <span>{news.timestamp.split(' ')[1]}</span>
                </div>
                <button 
                  className="flex items-center text-xs font-bold text-blue-600 dark:text-blue-400"
                >
                  查看原文 <ExternalLink size={12} className="ml-1" />
                </button>
              </div>
            </Card>
           );
        })}
        
        {filteredNews.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-sm">
             暂无该分类新闻
          </div>
        )}

        <div className="text-center py-4 text-xs text-slate-400">
           - 实时滚动中 -
        </div>
      </div>
    </div>
  );
};
