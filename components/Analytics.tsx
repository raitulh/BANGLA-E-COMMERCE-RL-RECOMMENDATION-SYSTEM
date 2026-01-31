
import React, { useMemo } from 'react';
import { Interaction, AlgorithmType } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid } from 'recharts';

interface Props {
  interactions: Interaction[];
}

const Analytics: React.FC<Props> = ({ interactions }) => {
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

  const typeData = useMemo(() => {
    const clicks = interactions.filter(i => i.type === 'click').length;
    const purchases = interactions.filter(i => i.type === 'purchase').length;
    const impressions = interactions.filter(i => i.type === 'impression').length;
    
    return [
      { name: 'Impressions', value: impressions },
      { name: 'Clicks', value: clicks },
      { name: 'Purchases', value: purchases }
    ];
  }, [interactions]);

  const regretData = useMemo(() => {
    // Cumulative reward per algorithm over interaction count
    const algos = Object.values(AlgorithmType);
    return algos.map(algo => {
      let cumulativeReward = 0;
      const filtered = interactions.filter(i => i.algorithm === algo);
      return filtered.map((inter, idx) => {
        cumulativeReward += inter.reward;
        return { x: idx, y: cumulativeReward, algo };
      });
    });
  }, [interactions]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Interaction Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Cumulative Reward (Learning Speed)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid />
                <XAxis type="number" dataKey="x" name="Interactions" />
                <YAxis type="number" dataKey="y" name="Total Reward" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Legend />
                {regretData.map((data, idx) => (
                  <Scatter 
                    key={idx} 
                    name={Object.values(AlgorithmType)[idx]} 
                    data={data} 
                    fill={COLORS[idx % COLORS.length]} 
                    line={{ strokeWidth: 2 }}
                    shape={() => null} // Only show the line
                  />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
