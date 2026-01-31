
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  bnLabel: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  trend?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, bnLabel, value, icon: Icon, color, trend }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
        <Icon className={color.replace('bg-', 'text-')} size={24} />
      </div>
      {trend && (
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {trend}
        </span>
      )}
    </div>
    <div className="space-y-1">
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="text-[10px] text-slate-400 font-medium">{bnLabel}</p>
    </div>
  </div>
);

export default MetricCard;
