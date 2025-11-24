
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, BarChart2, Globe, Newspaper, Settings, Zap } from 'lucide-react';
import { MOCK_NEWS } from '../constants';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Activity, label: '看板' },
    { path: '/economic', icon: BarChart2, label: '宏观' },
    { path: '/news', icon: Newspaper, label: '新闻' },
    { path: '/settings', icon: Settings, label: '设置' },
  ];

  return (
    <div className="min-h-screen pb-20 font-sans bg-slate-50 dark:bg-slate-900">
      <main className="max-w-md mx-auto min-h-screen relative shadow-2xl bg-white dark:bg-slate-900">
         {/* News Ticker - Static/Scrollable */}
        <div className="bg-blue-600 text-white text-[10px] py-1 overflow-x-auto no-scrollbar relative whitespace-nowrap">
           <div className="inline-block pl-4 pr-4">
              <span className="font-bold mr-2">⚡ 突发:</span>
              {MOCK_NEWS.map(n => (
                <span key={n.id} className="mr-8">{n.title}</span>
              ))}
           </div>
        </div>

        {children}

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 z-40 w-full max-w-md bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 pb-safe">
          <div className="flex justify-around items-center h-16">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                    isActive 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
                  }`}
                >
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </main>
    </div>
  );
};
