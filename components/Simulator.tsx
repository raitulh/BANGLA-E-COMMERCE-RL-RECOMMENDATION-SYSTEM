
import React, { useState } from 'react';
import { Play, Pause, RefreshCw, Zap } from 'lucide-react';
import { PRODUCTS } from '../constants';

interface Props {
  simulator: any;
  rlEngine: any;
  handleInteraction: any;
}

const Simulator: React.FC<Props> = ({ simulator, rlEngine, handleInteraction }) => {
  const [iterations, setIterations] = useState(100);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const runSimulation = async () => {
    setIsRunning(true);
    setProgress(0);
    
    for (let i = 1; i <= iterations; i++) {
      if (!isRunning && i > 1) break; // Allow manual stop logic? Hook state is tricky in loops.
      
      const user = simulator.getRandomUser();
      const context = simulator.getContextVector(user);
      
      // Recommend using current engine state
      const recs = rlEngine.recommend(rlEngine.selectedAlgo || 'LinUCB (Contextual)', PRODUCTS, context, 5);
      
      // Simulate user response for each recommended product
      recs.forEach((r: any) => {
        handleInteraction(user, r.product, 'impression');
        const outcome = simulator.simulateInteraction(user, r.product);
        if (outcome.type !== 'none') {
          handleInteraction(user, r.product, outcome.type);
        }
      });
      
      if (i % 10 === 0) {
        setProgress(Math.floor((i / iterations) * 100));
        // Give UI a chance to breathe
        await new Promise(r => setTimeout(r, 10));
      }
    }
    
    setIsRunning(false);
    setProgress(100);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="text-yellow-500 fill-yellow-500" size={24} />
        <h3 className="text-2xl font-bold text-slate-800">Batch Simulation Engine</h3>
      </div>
      
      <p className="text-slate-600 mb-8 max-w-2xl">
        Run thousands of simulated user sessions to train the Reinforcement Learning models instantly. 
        The system uses realistic behavior profiles based on Bangladesh e-commerce data patterns.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-700">Iteration Count (Number of users to simulate)</label>
          <div className="flex gap-4">
            <input 
              type="number" 
              value={iterations} 
              onChange={(e) => setIterations(Number(e.target.value))}
              className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              min="10"
              max="5000"
            />
            <button 
              onClick={runSimulation}
              disabled={isRunning}
              className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${
                isRunning ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isRunning ? <RefreshCw className="animate-spin" size={18} /> : <Play size={18} />}
              {isRunning ? 'Running...' : 'Start Simulation'}
            </button>
          </div>
        </div>
        
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-slate-700">Simulation Progress</span>
            <span className="text-sm font-bold text-indigo-600">{progress}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-indigo-600 h-3 transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-wider font-bold">
            Simulating clicks, purchases and revenue for real-time model updates
          </p>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <h4 className="text-xs font-bold text-blue-800 uppercase mb-1">Scenario</h4>
          <p className="text-sm text-blue-700">Holiday Weekend Shopping Spree (High Traffic)</p>
        </div>
        <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
          <h4 className="text-xs font-bold text-green-800 uppercase mb-1">Contextual Vector</h4>
          <p className="text-sm text-green-700">11 Dimensions Active (Demographics + Temporal)</p>
        </div>
        <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg">
          <h4 className="text-xs font-bold text-purple-800 uppercase mb-1">Reward Distribution</h4>
          <p className="text-sm text-purple-700">Weight: 1 (Click) | 3 (Cart) | 10 (Sale)</p>
        </div>
      </div>
    </div>
  );
};

export default Simulator;
