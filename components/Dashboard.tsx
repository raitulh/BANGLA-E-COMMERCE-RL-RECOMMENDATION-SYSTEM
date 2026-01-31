
import React, { useMemo } from 'react';
import { Users, ClickEvent, ShoppingCart, DollarSign, BarChart } from 'lucide-react';
import { Metrics, AlgorithmType, Interaction } from '../types';
import MetricCard from './MetricCard';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface DashboardProps {
  metrics: Metrics;
  interactions: Interaction[];
  selectedAlgo: AlgorithmType;
  setSelectedAlgo: (algo: AlgorithmType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ metrics, interactions, selectedAlgo, setSelectedAlgo }) => {
  const algoMetrics = useMemo(() => {
    return Object.values(AlgorithmType).map(algo => {
      const filtered = interactions.filter(i => i.algorithm === algo);
      const impressions = filtered.length;
      const clicks = filtered.filter(i => i.type !== 'impression').length;
      return {
        name: algo,
        ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
        revenue: filtered.reduce((sum, i) => sum + i.revenue, 0)
      };
    });
  }, [interactions]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-slate-800">Current Algorithm Performance</h3>
        <select 
          value={selectedAlgo} 
          onChange={(e) => setSelectedAlgo(e.target.value as AlgorithmType)}
          className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
        >
          {Object.values(AlgorithmType).map(algo => (
            <option key={algo} value={algo}>{algo}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          label="Total Impressions" bnLabel="মোট ইম্প্রেশন" 
          value={metrics.impressions.toLocaleString()} 
          icon={Users} color="bg-blue-500" 
        />
        <MetricCard 
          label="Avg Click Through Rate" bnLabel="গড় সিটিআর (CTR)" 
          value={`${metrics.ctr.toFixed(2)}%`} 
          icon={Users} color="bg-indigo-500" 
          trend={metrics.ctr > 40 ? '+12.5%' : ''}
        />
        <MetricCard 
          label="Conversion Rate" bnLabel="কনভার্সন রেট" 
          value={`${metrics.conversionRate.toFixed(2)}%`} 
          icon={ShoppingCart} color="bg-purple-500" 
        />
        <MetricCard 
          label="Total Revenue" bnLabel="মোট রাজস্ব" 
          value={`৳${(metrics.revenue / 1000).toFixed(1)}k`} 
          icon={DollarSign} color="bg-green-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">CTR Comparison by Algorithm</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={algoMetrics}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={10} interval={0} />
                <YAxis unit="%" />
                <Tooltip />
                <Bar dataKey="ctr" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue Performance (BDT)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={algoMetrics}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={10} interval={0} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
