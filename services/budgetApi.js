import database from './budgetDatabase.json';

// 模擬本地存儲（未來可替換為真實 API 調用）
let localData = {
  months: JSON.parse(JSON.stringify(database.months))
};

export const budgetApi = {
  /**
   * 獲取某月的完整預算資料
   * @param {string} month - 月份（例如 "8月"）
   * @returns {Promise} 返回該月的預算數據
   */
  getBudgetData: (month) => {
    return new Promise((resolve) => {
      // 模擬網路延遲
      setTimeout(() => {
        const monthData = localData.months[month] || null;
        if (monthData) {
          resolve({
            totalBudget: monthData.totalBudget,
            budget: [...monthData.budget],
            spending: [...monthData.spending],
            chartData: [...monthData.chartData]
          });
        } else {
          resolve(null);
        }
      }, 300);
    });
  },

  /**
   * 獲取某月某 tab 的項目列表
   * @param {string} month - 月份
   * @param {string} tab - 標籤（'budget' 或 'spending'）
   * @returns {Promise} 返回項目陣列
   */
  getItems: (month, tab) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const monthData = localData.months[month];
        if (monthData && monthData[tab]) {
          resolve([...monthData[tab]]);
        } else {
          resolve([]);
        }
      }, 300);
    });
  },

  /**
   * 獲取圖表數據
   * @param {string} month - 月份
   * @returns {Promise} 返回圖表數據
   */
  getChartData: (month) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const monthData = localData.months[month];
        if (monthData && monthData.chartData) {
          resolve([...monthData.chartData]);
        } else {
          resolve([]);
        }
      }, 300);
    });
  },

  /**
   * 新增項目
   * @param {string} month - 月份
   * @param {string} tab - 標籤（'budget' 或 'spending'）
   * @param {object} item - 項目數據
   * @returns {Promise} 返回新增後的項目
   */
  addItem: (month, tab, item) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const monthData = localData.months[month];
        if (!monthData) {
          reject(new Error(`月份 ${month} 不存在`));
          return;
        }

        if (!monthData[tab]) {
          reject(new Error(`標籤 ${tab} 不存在`));
          return;
        }

        const newItem = {
          id: Date.now(),
          ...item,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        monthData[tab].push(newItem);
        resolve(newItem);
      }, 300);
    });
  },

  /**
   * 更新項目
   * @param {string} month - 月份
   * @param {string} tab - 標籤（'budget' 或 'spending'）
   * @param {number} itemId - 項目 ID
   * @param {object} updates - 要更新的欄位
   * @returns {Promise} 返回更新後的項目
   */
  updateItem: (month, tab, itemId, updates) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const monthData = localData.months[month];
        if (!monthData || !monthData[tab]) {
          reject(new Error('月份或標籤不存在'));
          return;
        }

        const itemIndex = monthData[tab].findIndex(item => item.id === itemId);
        if (itemIndex === -1) {
          reject(new Error('項目不存在'));
          return;
        }

        monthData[tab][itemIndex] = {
          ...monthData[tab][itemIndex],
          ...updates,
          updated_at: new Date().toISOString()
        };

        resolve(monthData[tab][itemIndex]);
      }, 300);
    });
  },

  /**
   * 刪除項目
   * @param {string} month - 月份
   * @param {string} tab - 標籤（'budget' 或 'spending'）
   * @param {number} itemId - 項目 ID
   * @returns {Promise} 返回成功/失敗
   */
  deleteItem: (month, tab, itemId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const monthData = localData.months[month];
        if (!monthData || !monthData[tab]) {
          reject(new Error('月份或標籤不存在'));
          return;
        }

        const itemIndex = monthData[tab].findIndex(item => item.id === itemId);
        if (itemIndex === -1) {
          reject(new Error('項目不存在'));
          return;
        }

        monthData[tab].splice(itemIndex, 1);
        resolve(true);
      }, 300);
    });
  },

  /**
   * 重置資料（開發用）
   * @returns {Promise} 返回成功/失敗
   */
  resetData: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localData = {
          months: JSON.parse(JSON.stringify(database.months))
        };
        resolve(true);
      }, 300);
    });
  },

  /**
   * 獲取所有月份
   * @returns {Promise} 返回月份陣列
   */
  getAllMonths: () => {
    return Promise.resolve(Object.keys(localData.months));
  }
};