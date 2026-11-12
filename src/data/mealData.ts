import type { Meal } from '../types';

export const MEALS: Meal[] = [
  { id: 'none', name: 'No meal', description: 'Skip in-flight meal service', price: 0 },
  { id: 'veg', name: 'Veg Delight', description: 'Seasonal vegetable curry with rice', price: 0 },
  { id: 'non-veg', name: 'Chicken Tikka', description: 'Grilled chicken tikka with naan', price: 150 },
  { id: 'vegan', name: 'Vegan Bowl', description: 'Quinoa, chickpeas and roasted vegetables', price: 180 },
  { id: 'jain', name: 'Jain Thali', description: 'No onion, no garlic thali', price: 120 },
];
