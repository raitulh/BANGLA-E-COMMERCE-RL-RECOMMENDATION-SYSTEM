
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  LayoutDashboard, 
  Play, 
  BarChart3, 
  Settings as SettingsIcon, 
  Search, 
  ShoppingCart, 
  UserCircle2,
  TrendingUp,
  Package,
  Users
} from 'lucide-react';
import { AlgorithmType, Product, UserProfile, Interaction, Metrics } from './types';
import { PRODUCTS, REWARD_STRUCTURE } from './constants';
import { RLEngine } from './services/rlEngine';
import { UserSimulator } from './services/userSimulator';
import { GeminiService } from './services/geminiService';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import RecommendationTester from './components/RecommendationTester';
import Analytics from './components/Analytics';
import Simulator from './components/Simulator';
import Settings from './components/Settings';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tester' | 'analytics' | 'simulator' | 'settings'>('overview');
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmType>(AlgorithmType.LINUCB);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  
  // Singletons
  const rlEngine = useMemo(() => new RLEngine(PRODUCTS), []);
  const simulator = useMemo(() => new UserSimulator(1000), []);
  const gemini = useMemo(() => new GeminiService(), []);

  const metrics = useMemo<Metrics>(() => {
    const algInteractions = interactions.filter(i => i.algorithm === selectedAlgo);
    const impressions = algInteractions.length;
    const clicks = algInteractions.filter(i => i.type !== 'impression').length;
    const purchases = algInteractions.filter(i => i.type === 'purchase').length;
    const revenue = algInteractions.reduce((sum, i) => sum + i.revenue, 0);

    return {
      impressions,
      clicks,
      purchases,
      revenue,
      ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
      conversionRate: impressions > 0 ? (purchases / impressions) * 100 : 0,
      aov: purchases > 0 ? revenue / purchases : 0
    };
  }, [interactions, selectedAlgo]);

  const handleInteraction = useCallback((user: UserProfile, product: Product, type: 'click' | 'purchase' | 'impression') => {
    const reward = type === 'purchase' ? REWARD_STRUCTURE.PURCHASE : (type === 'click' ? REWARD_STRUCTURE.CLICK : 0);
    const revenue = type === 'purchase' ? product.price : 0;
    
    const context = simulator.getContextVector(user);
    rlEngine.update(selectedAlgo, product.id, reward, context);

    setInteractions(prev => [...prev, {
      timestamp: Date.now(),
      userId: user.id,
      productId: product.id,
      algorithm: selectedAlgo,
      type,
      reward,
      revenue
    }]);
  }, [rlEngine, selectedAlgo, simulator]);

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeTab={activeTab} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'overview' && (
              <Dashboard 
                metrics={metrics} 
                interactions={interactions} 
                selectedAlgo={selectedAlgo} 
                setSelectedAlgo={setSelectedAlgo}
              />
            )}
            {activeTab === 'tester' && (
              <RecommendationTester 
                rlEngine={rlEngine}
                simulator={simulator}
                gemini={gemini}
                selectedAlgo={selectedAlgo}
                handleInteraction={handleInteraction}
              />
            )}
            {activeTab === 'analytics' && (
              <Analytics interactions={interactions} />
            )}
            {activeTab === 'simulator' && (
              <Simulator 
                simulator={simulator}
                rlEngine={rlEngine}
                handleInteraction={handleInteraction}
              />
            )}
            {activeTab === 'settings' && (
              <Settings 
                selectedAlgo={selectedAlgo}
                setSelectedAlgo={setSelectedAlgo}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
