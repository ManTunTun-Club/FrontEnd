// src/services/budgetApi.js
import database from './budgetDatabase.json';

let localData = {
  categories: JSON.parse(JSON.stringify(database.categories)),
  months: JSON.parse(JSON.stringify(database.months))
};

export const budgetApi = {
  /**
   * 獲取所有分類
   * @returns {Promise} 返回分類陣列
   */
  getCategories: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...localData.categories]);
      }, 300);
    });
  },

  /**
   * 獲取某月的完整預算資料
   * @param {string} month - 月份
   * @returns {Promise} 返回該月的預算數據
   */
  getBudgetData: (month) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const monthData = localData.months[month] || null;
        if (monthData) {
          resolve({
            totalBudget: monthData.totalBudget,
            chartData: [...monthData.chartData]
          });
        } else {
          resolve(null);
        }
      }, 300);
    });
  },

  /**
   * 新增分類
   * @param {object} category - 分類數據
   * @returns {Promise} 返回新增後的分類
   */
  addCategory: (category) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const newCategory = {
          id: Math.max(...localData.categories.map(c => c.id), 0) + 1,
          ...category,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        localData.categories.push(newCategory);
        resolve(newCategory);
      }, 300);
    });
  },

  /**
   * 更新分類
   * @param {number} categoryId - 分類 ID
   * @param {object} updates - 要更新的欄位
   * @returns {Promise} 返回更新後的分類
   */
  updateCategory: (categoryId, updates) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const categoryIndex = localData.categories.findIndex(c => c.id === categoryId);
        if (categoryIndex === -1) {
          reject(new Error('分類不存在'));
          return;
        }
        localData.categories[categoryIndex] = {
          ...localData.categories[categoryIndex],
          ...updates,
          updated_at: new Date().toISOString()
        };
        resolve(localData.categories[categoryIndex]);
      }, 300);
    });
  },

  /**
   * 刪除分類
   * @param {number} categoryId - 分類 ID
   * @returns {Promise} 返回成功/失敗
   */
  deleteCategory: (categoryId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const categoryIndex = localData.categories.findIndex(c => c.id === categoryId);
        if (categoryIndex === -1) {
          reject(new Error('分類不存在'));
          return;
        }
        localData.categories.splice(categoryIndex, 1);
        resolve(true);
      }, 300);
    });
  },

  /**
   * 重置資料
   * @returns {Promise} 返回成功/失敗
   */
  resetData: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localData = {
          categories: JSON.parse(JSON.stringify(database.categories)),
          months: JSON.parse(JSON.stringify(database.months))
        };
        resolve(true);
      }, 300);
    });
  }
};