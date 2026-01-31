
import React from 'react';
import { AlgorithmType } from '../types';
import { Settings as SettingsIcon, Save, Database, Trash2 } from 'lucide-react';

interface Props {
  selectedAlgo: AlgorithmType;
  setSelectedAlgo: (algo: AlgorithmType) => void;
}

const Settings: React.FC<Props> = ({ selectedAlgo, setSelectedAlgo }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SettingsIcon className="text-slate-500" size={24} />
          <h3 className="text-xl font-bold text-slate-800">Recommendation Engine Settings</h3>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700">
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div className="p-8 space-y-8">
        <section>
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Core Model</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Primary Algorithm</label>
              <select 
                value={selectedAlgo} 
                onChange={(e) => setSelectedAlgo(e.target.value as AlgorithmType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {Object.values(AlgorithmType).map(algo => (
                  <option key={algo} value={algo}>{algo}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Exploration Factor (Alpha)</label>
              <input 
                type="range" min="0.1" max="5.0" step="0.1" defaultValue="1.5"
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0.1 (Exploit)</span>
                <span>1.5 (Default)</span>
                <span>5.0 (Explore)</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Data Management</h4>
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50">
              <Database size={16} /> Export Interaction Logs
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50">
              <Trash2 size={16} /> Reset Model Parameters
            </button>
          </div>
        </section>

        <section className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h4 className="text-sm font-bold text-slate-800 mb-2">Engine Architecture Note</h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            AmarRec current deployment uses a <strong>LinUCB</strong> implementation for contextual multi-armed bandits. 
            User context vectors are 11-dimensional, incorporating real-time temporal data (hour, weekend status) 
            paired with demographic signals (age, gender, budget) and behavioral historical data. 
            The system performs matrix inversion every 10 updates for high performance stability.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Settings;
