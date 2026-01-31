
import React from 'react';

interface HeaderProps {
  activeTab: string;
}

const Header: React.FC<HeaderProps> = ({ activeTab }) => {
  const titles: Record<string, string> = {
    overview: 'Overview Dashboard',
    tester: 'Live Recommendation Testing',
    analytics: 'Performance Analytics',
    simulator: 'Batch User Simulation',
    settings: 'Model Configuration'
  };

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
      <div>
        <h2 className="text-xl font-bold text-slate-800">{titles[activeTab]}</h2>
        <p className="text-sm text-slate-500">Managing real-time RL personalized experiences</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-medium text-slate-600 uppercase tracking-wider">Engine Active</span>
        </div>
        <div className="h-6 w-[1px] bg-slate-200"></div>
        <span className="text-sm font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded-full">v1.2.0-beta</span>
      </div>
    </header>
  );
};

export default Header;
