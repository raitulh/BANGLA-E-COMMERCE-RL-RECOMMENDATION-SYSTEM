
import React from 'react';
import { LayoutDashboard, Play, BarChart3, Settings, Zap } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview', bn: 'এক নজরে' },
    { id: 'tester', icon: Play, label: 'Live Test', bn: 'লাইভ টেস্ট' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', bn: 'বিশ্লেষণ' },
    { id: 'simulator', icon: Zap, label: 'Simulator', bn: 'সিমুলেটর' },
    { id: 'settings', icon: Settings, label: 'Settings', bn: 'সেটিংস' },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-full hidden md:flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Zap size={24} fill="white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">AmarRec</h1>
        </div>
        
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <div className="text-left">
                <p className="text-sm font-medium leading-none">{item.label}</p>
                <p className="text-[10px] opacity-70 mt-1">{item.bn}</p>
              </div>
            </button>
          ))}
        </nav>
      </div>
      
      <div className="mt-auto p-6 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
            <span className="text-xs font-bold text-slate-300">AD</span>
          </div>
          <div>
            <p className="text-sm font-medium">Admin Dashboard</p>
            <p className="text-xs text-slate-400">Bangla E-commerce</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
