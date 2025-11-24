import React, { useState } from 'react';
import { Moon, Bell, RefreshCw, HelpCircle, Globe, ChevronRight } from 'lucide-react';
import { Card } from '../components/ui/Card';

export const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [refreshRate, setRefreshRate] = useState('1s');
  const [beginnerMode, setBeginnerMode] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const SettingItem = ({ icon: Icon, label, value, onClick, toggle }: any) => (
    <div 
      onClick={onClick}
      className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800 last:border-0 cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400">
          <Icon size={18} />
        </div>
        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</span>
      </div>
      
      {toggle !== undefined ? (
        <button 
          className={`w-11 h-6 rounded-full transition-colors relative ${toggle ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'}`}
        >
          <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${toggle ? 'translate-x-5' : ''}`} />
        </button>
      ) : (
        <div className="flex items-center gap-2 text-slate-500 text-sm">
           <span>{value}</span>
           <ChevronRight size={16} />
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">个性化与设置</h1>
      </header>

      <Card className="mb-6">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">显示</h2>
        <SettingItem 
          icon={Moon} 
          label="暗色模式" 
          toggle={darkMode} 
          onClick={toggleDarkMode}
        />
        <SettingItem 
          icon={RefreshCw} 
          label="数据刷新频率" 
          value={refreshRate === '1s' ? '每秒 (实时)' : '每5秒 (省流)'}
          onClick={() => setRefreshRate(prev => prev === '1s' ? '5s' : '1s')}
        />
      </Card>

      <Card className="mb-6">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">偏好</h2>
        <SettingItem 
          icon={Globe} 
          label="市场偏好" 
          value="全球市场" 
        />
        <SettingItem 
          icon={HelpCircle} 
          label="新手模式" 
          toggle={beginnerMode} 
          onClick={() => setBeginnerMode(!beginnerMode)}
        />
      </Card>

      <Card>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">通知</h2>
        <SettingItem 
          icon={Bell} 
          label="重大行情预警" 
          toggle={true} 
          onClick={() => {}}
        />
      </Card>

      <div className="mt-8 text-center text-xs text-slate-400">
        <p>市场雷达 v1.0.0</p>
        <p className="mt-1">Designed for Demo</p>
      </div>
    </div>
  );
};
