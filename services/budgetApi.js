// src/services/budgetApi.js
// 讀取 budgetDatabase.json 作為初始資料；在記憶體內運作（不回寫檔案）

import db from './budgetDatabase.json';
import { BUDGET_COLORS } from '../theme/theme-color';

// ---------- 初始化 ----------
let _catalog = (db?.categoriesCatalog ?? []).map(c => ({ id: Number(c.id), name: String(c.name) }));
let _monthlyBudgets = Array.isArray(db?.monthlyBudgets) ? db.monthlyBudgets.slice() : [];
let _expenses = (db?.expenses ?? []).map(e => ({
  id: String(e.id),
  title: String(e.title ?? ''),
  price: Number(e.price) || 0,
  categoryId: Number(e.categoryId),
  source: e.source ?? '',
  paymentMethod: e.paymentMethod ?? '',
  status: e.status === 'planned' ? 'planned' : 'purchased',
  date: e.date ?? new Date().toISOString().slice(0, 10), // YYYY-MM-DD
}));

// ---------- 小工具 ----------
const delay = (ms = 120) => new Promise(r => setTimeout(r, ms));

const monthLabelFromDate = (isoDate) => {
  // 'YYYY-MM-DD' -> 'M月'
  const m = Number((isoDate || '').split('-')[1] || 0);
  return m ? `${m}月` : '';
};

const getMonthBudgetEntry = (month) =>
  _monthlyBudgets.find(m => m.month === month) || { month, categories: [] };

const colorOfCategoryId = (categoryId) => {
  // 依 catalog 出現順序指派顏色
  const idx = _catalog.findIndex(c => Number(c.id) === Number(categoryId));
  return BUDGET_COLORS[(idx >= 0 ? idx : 0) % BUDGET_COLORS.length];
};

const sumPurchasedOf = (month, categoryId) =>
  _expenses
    .filter(e =>
      monthLabelFromDate(e.date) === month &&
      e.status === 'purchased' &&
      Number(e.categoryId) === Number(categoryId)
    )
    .reduce((s, e) => s + (Number(e.price) || 0), 0);

// 依名稱找/建類別（使用者可自訂新類別）
const ensureCategory = (nameRaw) => {
  const name = String(nameRaw || '').trim();
  if (!name) return null;
  const found = _catalog.find(c => c.name === name);
  if (found) return found;

  const newCat = { id: Date.now(), name };
  _catalog = [..._catalog, newCat]; // 追加在尾端 → 顏色會照順序對應
  return newCat;
};

// ---------- API ----------
export const budgetApi = {
  // 有資料的月份（依 monthlyBudgets）
  async getAvailableMonths() {
    await delay();
    const ms = Array.from(new Set(_monthlyBudgets.map(m => m.month)));
    return ms.sort((a, b) => Number(a.replace('月', '')) - Number(b.replace('月', '')));
  },

  // 該月總預算（amount 合計）
  async getBudgetData(month = '8月') {
    await delay();
    const entry = getMonthBudgetEntry(month);
    const totalBudget = entry.categories.reduce((s, c) => s + (Number(c.amount) || 0), 0);
    return { month, totalBudget };
  },

  /**
   * 該月分類列表（API 端加總 spent 與 percentage）
   * return: [{ id, name, amount, spent, percentage, color }]
   */
  async getCategories(month = '8月') {
    await delay();
    const entry = getMonthBudgetEntry(month);
    return entry.categories.map(c => {
      const cat = _catalog.find(x => x.id === c.categoryId);
      const amount = Number(c.amount) || 0;
      const spent = sumPurchasedOf(month, c.categoryId);
      const pct = amount > 0 ? Math.round(((amount - spent) / amount) * 100) : 0;
      return {
        id: c.categoryId,
        name: cat ? cat.name : `類別#${c.categoryId}`,
        amount,
        spent,
        percentage: Math.max(0, Math.min(100, pct)),
        color: colorOfCategoryId(c.categoryId),
      };
    });
  },

  /**
   * 在某月新增/更新分類預算金額
   * - 舊用法：{ categoryId, amount }
   * - 新用法：{ name, amount } 會自動建立 catalog 類別
   * 回傳：該月的分類列表（同 getCategories(month)）
   */
  async addCategoryToMonth(month, payload) {
    await delay();
    let categoryId = null;

    if (payload?.categoryId != null) {
      categoryId = Number(payload.categoryId);
      // 若傳入 categoryId 但 catalog 裡沒有，則補上一筆（避免脫鉤）
      if (!_catalog.find(c => c.id === categoryId)) {
        _catalog = [..._catalog, { id: categoryId, name: `類別#${categoryId}` }];
      }
    } else if (payload?.name) {
      const cat = ensureCategory(payload.name);
      if (!cat) return this.getCategories(month);
      categoryId = cat.id;
    } else {
      return this.getCategories(month);
    }

    const amount = Number(payload?.amount) || 0;
    const m = getMonthBudgetEntry(month);

    const exists = m.categories.find(c => c.categoryId === categoryId);
    if (exists) {
      exists.amount = amount;
    } else {
      m.categories.push({ categoryId, amount });
      // 若原本 _monthlyBudgets 沒這個月，追加
      if (!_monthlyBudgets.find(x => x.month === month)) {
        _monthlyBudgets = [..._monthlyBudgets, m];
      } else {
        // 覆寫回去（避免 getMonthBudgetEntry 回傳的是臨時物件）
        _monthlyBudgets = _monthlyBudgets.map(x => (x.month === month ? m : x));
      }
    }

    return this.getCategories(month);
  },

  async updateCategoryAmount(month, categoryId, amount) {
    await delay();
    const m = getMonthBudgetEntry(month);
    const t = m.categories.find(c => c.categoryId === Number(categoryId));
    if (t) t.amount = Number(amount) || 0;
    // 覆寫回去
    _monthlyBudgets = _monthlyBudgets.map(x => (x.month === month ? m : x));
    return this.getCategories(month);
  },

  async deleteCategoryFromMonth(month, categoryId) {
    await delay();
    const m = getMonthBudgetEntry(month);
    m.categories = m.categories.filter(c => c.categoryId !== Number(categoryId));
    _monthlyBudgets = _monthlyBudgets.map(x => (x.month === month ? m : x));
    return this.getCategories(month);
  },

  // 支出頁：當月已購買清單（可依類別過濾）
  async getExpenses({ month = '8月', status = 'purchased', categoryId = null, page = 1, pageSize = 50 } = {}) {
    await delay();
    let list = _expenses.filter(e => monthLabelFromDate(e.date) === month);
    if (status) list = list.filter(e => e.status === status);
    if (categoryId != null) list = list.filter(e => Number(e.categoryId) === Number(categoryId));
    list.sort((a, b) => (a.date < b.date ? 1 : -1));
    const start = (page - 1) * pageSize;
    const paged = list.slice(start, start + pageSize);
    return { items: paged, total: list.length, page, pageSize };
  },

  // 類別詳情：當月購物車 + 已購買（給 BudgetCategoryScreen）
  async getCategoryCartItems({ month = '8月', categoryId }) {
    await delay();
    return _expenses
      .filter(e => monthLabelFromDate(e.date) === month && Number(e.categoryId) === Number(categoryId))
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .map(e => ({
        id: e.id,
        name: e.title,
        source: e.source || '',
        paymentMethod: e.paymentMethod || '',
        status: e.status,              // 'planned' | 'purchased'
        price: Number(e.price) || 0,
        date: e.date,
      }));
  },

  // --- 測試用：增刪改支出（不寫回 JSON） ---
  async addExpense({ title, price = 0, categoryId, source = '', paymentMethod = '', status = 'purchased', date = null }) {
    await delay();
    const id = `e-${Date.now()}`;
    const d = date || new Date().toISOString().slice(0, 10);
    _expenses = [{ id, title, price: Number(price) || 0, categoryId: Number(categoryId), source, paymentMethod, status, date: d }, ..._expenses];
    return { id };
  },
  async updateExpense(id, patch) {
    await delay();
    _expenses = _expenses.map(e => (e.id === id ? { ...e, ...patch } : e));
    return true;
  },
  async deleteExpense(id) {
    await delay();
    _expenses = _expenses.filter(e => e.id !== id);
    return true;
  },

  // 方便頁面載入前取總覽（debug）
  async _debug_getAll() {
    await delay();
    return { catalog: _catalog, monthlyBudgets: _monthlyBudgets, expenses: _expenses };
  },
};

// 相容別名（如果你有 import { expensesApi }）
export const expensesApi = {
  getExpenses:   budgetApi.getExpenses,
  addExpense:    budgetApi.addExpense,
  updateExpense: budgetApi.updateExpense,
  deleteExpense: budgetApi.deleteExpense,
};
