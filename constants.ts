
import { Product, UserProfile } from './types';

export const CATEGORIES = [
  { bn: 'ইলেকট্রনিক্স', en: 'Electronics' },
  { bn: 'ফ্যাশন', en: 'Fashion' },
  { bn: 'হোম অ্যান্ড কিচেন', en: 'Home & Kitchen' },
  { bn: 'বই', en: 'Books' },
  { bn: 'হেলথ অ্যান্ড বিউটি', en: 'Health & Beauty' }
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    nameBn: 'স্মার্টফোন এক্স প্রো',
    nameEn: 'Smartphone X Pro',
    category: 'Electronics',
    price: 45000,
    brand: 'TechMaster',
    rating: 4.8,
    stock: 50,
    description: 'সর্বাধুনিক ফিচার সমৃদ্ধ স্মার্টফোন।',
    image: 'https://picsum.photos/seed/p1/400/400'
  },
  {
    id: 'p2',
    nameBn: 'সুতির পাঞ্জাবি',
    nameEn: 'Cotton Panjabi',
    category: 'Fashion',
    price: 2500,
    brand: 'Aarong',
    rating: 4.5,
    stock: 120,
    description: 'আরামদায়ক এবং স্টাইলিশ সুতির পাঞ্জাবি।',
    image: 'https://picsum.photos/seed/p2/400/400'
  },
  {
    id: 'p3',
    nameBn: 'নন-স্টিক ফ্রাইপ্যান',
    nameEn: 'Non-stick Frypan',
    category: 'Home & Kitchen',
    price: 1800,
    brand: 'Kiam',
    rating: 4.2,
    stock: 80,
    description: 'সহজ রান্নার জন্য উন্নতমানের নন-স্টিক প্যান।',
    image: 'https://picsum.photos/seed/p3/400/400'
  },
  {
    id: 'p4',
    nameBn: 'হিমু সমগ্র',
    nameEn: 'Himu Somogro',
    category: 'Books',
    price: 850,
    brand: 'Anyaprakash',
    rating: 4.9,
    stock: 200,
    description: 'হুমায়ূন আহমেদের কালজয়ী হিমু সিরিজের সংগ্রহ।',
    image: 'https://picsum.photos/seed/p4/400/400'
  },
  {
    id: 'p5',
    nameBn: 'অ্যালোভেরা ফেসওয়াশ',
    nameEn: 'Aloe Vera Facewash',
    category: 'Health & Beauty',
    price: 350,
    brand: 'Himalaya',
    rating: 4.4,
    stock: 150,
    description: 'প্রাকৃতিক উজ্জ্বলতার জন্য অ্যালোভেরা ফেসওয়াশ।',
    image: 'https://picsum.photos/seed/p5/400/400'
  },
  // Adding more products to fulfill the 25+ requirement
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `p${i + 6}`,
    nameBn: `পণ্য ${i + 6}`,
    nameEn: `Product ${i + 6}`,
    category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)].en,
    price: Math.floor(Math.random() * 20000) + 500,
    brand: 'LocalBrand',
    rating: 3.5 + Math.random() * 1.5,
    stock: Math.floor(Math.random() * 100),
    description: 'একটি চমৎকার পণ্য যা আপনার জীবনকে সহজ করবে।',
    image: `https://picsum.photos/seed/p${i + 6}/400/400`
  }))
];

export const REWARD_STRUCTURE = {
  IMPRESSION: 0,
  CLICK: 1,
  ADD_TO_CART: 3,
  PURCHASE: 10
};
