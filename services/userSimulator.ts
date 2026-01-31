
import { UserProfile, ContextVector, Product, Interaction } from '../types';
import { PRODUCTS, CATEGORIES } from '../constants';

export class UserSimulator {
  private users: UserProfile[] = [];

  constructor(count: number = 1000) {
    this.generateUsers(count);
  }

  private generateUsers(count: number) {
    const locations = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna'];
    const languages: ('Bangla' | 'English' | 'Bilingual')[] = ['Bangla', 'English', 'Bilingual'];
    const budgets: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];

    for (let i = 0; i < count; i++) {
      const langProb = Math.random();
      let language: 'Bangla' | 'English' | 'Bilingual' = 'Bangla';
      if (langProb > 0.6 && langProb <= 0.8) language = 'English';
      else if (langProb > 0.8) language = 'Bilingual';

      this.users.push({
        id: `u${i}`,
        age: 18 + Math.floor(Math.random() * 47),
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        location: locations[Math.floor(Math.random() * locations.length)],
        language,
        budget: budgets[Math.floor(Math.random() * budgets.length)],
        priceSensitivity: Math.random(),
        brandLoyalty: Math.random(),
        preferredCategories: [CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)].en],
        totalPurchases: Math.floor(Math.random() * 50),
        avgRatingPreference: 3 + Math.random() * 2,
      });
    }
  }

  public getRandomUser(): UserProfile {
    return this.users[Math.floor(Math.random() * this.users.length)];
  }

  public getContextVector(user: UserProfile): ContextVector {
    const isWeekend = [0, 6].includes(new Date().getDay()) ? 1 : 0;
    const hour = new Date().getHours() / 24;

    return [
      user.age / 100,
      user.gender === 'Male' ? 1 : 0,
      user.budget === 'Low' ? 1 : 0,
      user.budget === 'Medium' ? 1 : 0,
      user.budget === 'High' ? 1 : 0,
      user.priceSensitivity,
      user.brandLoyalty,
      hour,
      isWeekend,
      user.totalPurchases / 100,
      user.avgRatingPreference / 5
    ];
  }

  public simulateInteraction(user: UserProfile, product: Product): { type: 'click' | 'purchase' | 'none'; reward: number } {
    // 1. Calculate Base Probability
    let clickProb = 0.05; // Baseline click prob

    // Category match bonus
    if (user.preferredCategories.includes(product.category)) clickProb += 0.3;

    // Price sensitivity
    if (user.budget === 'Low' && product.price > 10000) clickProb -= 0.1;
    if (user.budget === 'High' && product.price > 30000) clickProb += 0.05;

    // Rating match
    if (product.rating >= user.avgRatingPreference) clickProb += 0.1;

    // Random noise
    clickProb += (Math.random() - 0.5) * 0.1;

    // Final decision
    if (Math.random() < clickProb) {
      // It's a click! Now check for purchase.
      let purchaseProb = 0.1 + (user.brandLoyalty * 0.2);
      if (user.budget === 'Low' && product.price < 2000) purchaseProb += 0.2;
      
      if (Math.random() < purchaseProb) {
        return { type: 'purchase', reward: 10 };
      }
      return { type: 'click', reward: 1 };
    }

    return { type: 'none', reward: 0 };
  }
}
