
import React from 'react';
import { Product } from '../types';
import { ShoppingCart, Star, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  score?: number;
  onInteraction: (type: 'click' | 'purchase') => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, score, onInteraction }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm group hover:border-indigo-300 transition-colors">
      <div className="relative h-40 overflow-hidden bg-slate-100">
        <img 
          src={product.image} 
          alt={product.nameEn} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {score !== undefined && (
          <div className="absolute top-2 right-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
            Score: {score.toFixed(3)}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase">
            {product.category}
          </span>
          <div className="flex items-center gap-0.5 text-yellow-500">
            <Star size={10} fill="currentColor" />
            <span className="text-[10px] font-bold">{product.rating}</span>
          </div>
        </div>
        
        <h4 className="font-bold text-slate-800 text-sm mb-0.5">{product.nameEn}</h4>
        <h4 className="font-medium text-slate-500 text-[13px] mb-2">{product.nameBn}</h4>
        
        <p className="text-xs text-slate-500 mb-4 line-clamp-1">{product.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-slate-900">৳{product.price.toLocaleString()}</span>
          <div className="flex gap-2">
            <button 
              onClick={() => onInteraction('click')}
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Click/Interested"
            >
              <Heart size={18} />
            </button>
            <button 
              onClick={() => onInteraction('purchase')}
              className="p-2 bg-slate-900 text-white hover:bg-indigo-600 rounded-lg transition-colors"
              title="Buy Now"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
