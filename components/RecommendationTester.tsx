
import React, { useState, useEffect } from 'react';
import { Search, User, Sliders, Sparkles } from 'lucide-react';
import { AlgorithmType, Product, UserProfile } from '../types';
import { PRODUCTS } from '../constants';
import ProductCard from './ProductCard';

interface Props {
  rlEngine: any;
  simulator: any;
  gemini: any;
  selectedAlgo: AlgorithmType;
  handleInteraction: (user: UserProfile, product: Product, type: 'click' | 'purchase' | 'impression') => void;
}

const RecommendationTester: React.FC<Props> = ({ rlEngine, simulator, gemini, selectedAlgo, handleInteraction }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(simulator.getRandomUser());
  const [recommendations, setRecommendations] = useState<{product: Product, score: number}[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiInsight, setAiInsight] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateRecs = () => {
    setIsLoading(true);
    const context = simulator.getContextVector(currentUser);
    let recs = rlEngine.recommend(selectedAlgo, PRODUCTS, context, 6);
    setRecommendations(recs);
    
    // Log impressions
    recs.forEach((r: any) => handleInteraction(currentUser, r.product, 'impression'));
    
    // Get AI insight
    gemini.getAIPersonalizationInsight(currentUser, recs.map((r: any) => r.product))
      .then(setAiInsight)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    generateRecs();
  }, [currentUser, selectedAlgo]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    const resultIds = await gemini.getSemanticSearch(searchQuery, PRODUCTS);
    const searchRecs = resultIds
      .map(id => PRODUCTS.find(p => p.id === id))
      .filter(p => p !== undefined)
      .map(p => ({ product: p!, score: 1.0 }))
      .slice(0, 6);
    
    if (searchRecs.length > 0) {
      setRecommendations(searchRecs);
      setAiInsight(`Search result for "${searchQuery}" in ${currentUser.language} context.`);
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile Config */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm h-fit">
          <div className="flex items-center gap-2 mb-4">
            <User className="text-indigo-600" size={20} />
            <h3 className="font-bold text-slate-800">Mock User Profile</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Demographics</label>
              <div className="mt-2 p-3 bg-slate-50 rounded-lg text-sm border border-slate-200">
                <p><strong>Age:</strong> {currentUser.age}</p>
                <p><strong>Gender:</strong> {currentUser.gender}</p>
                <p><strong>Budget:</strong> {currentUser.budget}</p>
                <p><strong>Locale:</strong> {currentUser.location}</p>
              </div>
            </div>
            
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Behavioral Vector</label>
              <div className="mt-2 space-y-3">
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span>Price Sensitivity</span>
                    <span>{(currentUser.priceSensitivity * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${currentUser.priceSensitivity * 100}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span>Brand Loyalty</span>
                    <span>{(currentUser.brandLoyalty * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${currentUser.brandLoyalty * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setCurrentUser(simulator.getRandomUser())}
              className="w-full py-2 bg-slate-800 text-white text-sm font-bold rounded-lg hover:bg-slate-700 transition-colors"
            >
              Shuffle New User
            </button>
          </div>
        </div>

        {/* Main Interface */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="text" 
                placeholder="Search products in Bangla or English... (e.g. স্মার্টফোন কিনবো)" 
                className="w-full pl-12 pr-24 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-indigo-700"
              >
                Search
              </button>
            </form>
          </div>

          <div className="bg-indigo-600 bg-opacity-5 border border-indigo-100 p-4 rounded-xl flex items-start gap-3">
            <Sparkles className="text-indigo-600 mt-1 shrink-0" size={18} />
            <div>
              <h4 className="text-sm font-bold text-indigo-900 mb-1">AI Recommendation Insight</h4>
              <p className="text-sm text-indigo-700 italic">
                {isLoading ? "Generating insights..." : aiInsight}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec, idx) => (
              <ProductCard 
                key={`${rec.product.id}-${idx}`}
                product={rec.product}
                score={rec.score}
                onInteraction={(type) => handleInteraction(currentUser, rec.product, type)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationTester;
