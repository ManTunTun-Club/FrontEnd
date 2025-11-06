// 文件：src/features/Budget/constants/budgetConstants.js
// ============================================
export const BUDGET_CATEGORIES = {
  food: { label: '食物', color: '#FFE66D', icon: '🍔' },
  shopping: { label: '購物', color: '#4A90E2', icon: '🛍️' },
  medical: { label: '醫療', color: '#FF9A56', icon: '⚕️' },
  lifestyle: { label: '生活用品', color: '#52C77F', icon: '🛁' },
  clothing: { label: '衣服', color: '#E8E8E8', icon: '👕' }
};

export const MONTHS = [
  '1月', '2月', '3月', '4月', '5月', '6月',
  '7月', '8月', '9月', '10月', '11月', '12月'
];

export const CHART_DATA = {
  '8月': [
    { percentage: 29, color: '#52C77F', category: 'lifestyle' },
    { percentage: 20, color: '#FF9A56', category: 'medical' },
    { percentage: 36, color: '#4A90E2', category: 'shopping' },
    { percentage: 15, color: '#FFE66D', category: 'food' }
  ]
};

export const BUDGET_ITEMS = {
  '8月': {
    budget: [
      { id: 1, category: 'food', amount: 7200, percentage: 40, spent: 2880 },
      { id: 2, category: 'medical', amount: 4000, percentage: 12, spent: 480 }
    ],
    spending: [
      { id: 3, category: 'lifestyle', amount: 5800, percentage: 90, spent: 5220 },
      { id: 4, category: 'clothing', amount: 3000, percentage: 0, spent: 0 }
    ]
  }
};
