import type { Restaurant } from '../types/restaurant';

export interface RestaurantCategory {
  id: string;
  title: string;
  icon: string;
  restaurants: Restaurant[];
}

interface CategoryRule {
  id: string;
  title: string;
  icon: string;
  keywords: string[];
}

const categoryRules: CategoryRule[] = [
  {
    id: 'pizzarias',
    title: 'Pizzarias',
    icon: '🍕',
    keywords: [
      'pizza',
      'pizzaria',
      'pizzas',
    ],
  },

  {
    id: 'hamburgueres',
    title: 'Hambúrgueres',
    icon: '🍔',
    keywords: [
      'hamburguer',
      'hambúrguer',
      'burger',
      'burguer',
      'lanches',
      'lanche',
    ],
  },

  {
    id: 'carnes',
    title: 'Carnes e churrasco',
    icon: '🥩',
    keywords: [
      'picanha',
      'churrasco',
      'churrascaria',
      'steak',
      'grill',
      'carne',
      'carnes',
      'espeto',
      'espeteria',
      'costela',
    ],
  },

  {
    id: 'mexicana',
    title: 'Sabores mexicanos',
    icon: '🌮',
    keywords: [
      'mexicano',
      'mexicana',
      'mexican',
      'taco',
      'nacho',
      'burrito',
    ],
  },

  {
    id: 'bares',
    title: 'Bares e cervejarias',
    icon: '🍻',
    keywords: [
      'bar',
      'pub',
      'cervejaria',
      'choperia',
      'chopp',
      'beer',
    ],
  },
];

function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function matchesCategory(
  restaurant: Restaurant,
  rule: CategoryRule,
): boolean {
  const searchText = normalizeText(
    [
      restaurant.name,
      restaurant.cuisine ?? '',
      restaurant.description ?? '',
    ].join(' '),
  );

  return rule.keywords.some((keyword) =>
    searchText.includes(normalizeText(keyword)),
  );
}

export function categorizeRestaurants(
  restaurants: Restaurant[],
): RestaurantCategory[] {
  const categories: RestaurantCategory[] = [];

  for (const rule of categoryRules) {
    const matchingRestaurants = restaurants.filter(
      (restaurant) =>
        matchesCategory(restaurant, rule),
    );

    if (matchingRestaurants.length > 0) {
      categories.push({
        id: rule.id,
        title: rule.title,
        icon: rule.icon,
        restaurants: matchingRestaurants,
      });
    }
  }

  return categories;
}