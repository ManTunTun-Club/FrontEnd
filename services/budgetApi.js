// src/services/budgetApi.js
// 簡易 in-memory 假資料（App 開著期間有效）
let _categories = [
  { id: 1, name: '食物', amount: 7200, spent: 2880 },
  { id: 2, name: '醫療', amount: 4000, spent: 480  },
  { id: 3, name: '慢吞吞', amount: 14000, spent: 980 },
];

const delay = (ms = 150) => new Promise(r => setTimeout(r, ms));

export const budgetApi = {
  async getBudgetData(monthLabel = '8月') {
    const totalBudget = _categories.reduce((s, c) => s + (Number(c.amount) || 0), 0);
    await delay();
    return { month: monthLabel, totalBudget };
  },

  async getCategories() {
    await delay();
    return _categories; // 回傳同一份參考，保持狀態一致
  },

  async addCategory({ name, amount, spent = 0 }) {
    await delay();
    const id = Date.now();
    const item = { id, name, amount: Number(amount) || 0, spent: Number(spent) || 0 };
    _categories = [..._categories, item];
    return item;
  },

  async updateCategory(id, payload) {
    await delay();
    _categories = _categories.map(c => (c.id === id ? { ...c, ...payload } : c));
    return _categories.find(c => c.id === id);
  },

  async deleteCategory(id) {
    await delay();
    _categories = _categories.filter(c => c.id !== id);
    return true;
  },

  // BudgetCategoryScreen 用到的假「購物車」清單
  async getCategoryCartItems(categoryId) {
    await delay();
    const now = new Date();
    const fmt = (d) => `${d.getMonth() + 1}/${String(d.getDate()).padStart(2, '0')}`;
    return [
      { id: `${categoryId}-1`, name: '牙膏', source: '全聯', paymentMethod: '信用卡', status: 'purchased', price: 120, date: fmt(now) },
      { id: `${categoryId}-2`, name: '衛生紙', source: '家樂福', paymentMethod: '現金',     status: 'planned',   price: 250, date: fmt(now) },
    ];
  },
};
