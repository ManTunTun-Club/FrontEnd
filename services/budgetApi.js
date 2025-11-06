// src/services/budgetApi.js


// 模擬資料庫
let localData = {
  categories: [
    { id: 1, name: "食物", amount: 7200, spent: 2880 },
    { id: 2, name: "醫療", amount: 4000, spent: 480 },
    { id: 3, name: "慢吞吞", amount: 14000, spent: 10000 }
  ],
  months: {
     "8月": { totalBudget: 25200, chartData: [] }
  },
  // 新增：購物車商品資料
  cartItems: [
    {
      id: 101,
      categoryId: 1, // 屬於「食物」
      name: "日本和牛 頂級A5和牛燒肉片100gX3盒",
      source: "PChome",
      paymentMethod: "星展PChome聯名卡",
      price: 2190,
      status: "purchased", // 已購買
      date: "8/3",
      image: "https://example.com/wagyu.jpg" // 實際開發時請換成真實圖片網址或本地資源
    },
    {
      id: 102,
      categoryId: 1,
      name: "漢克嚴選 澳洲準神穀飼牛腱條2包組",
      source: "PChome",
      paymentMethod: "星展PChome聯名卡",
      price: 1430,
      status: "planned", // 預計購買
      date: "8/25",
      image: "https://example.com/beef.jpg"
    }
  ]
};

export const budgetApi = {
  getCategories: () => new Promise((resolve) => setTimeout(() => resolve([...localData.categories]), 300)),
  getBudgetData: (month) => new Promise((resolve) => setTimeout(() => resolve(localData.months[month]), 300)),
  addCategory: (category) => { /* ...略... */ return Promise.resolve() }, 
  updateCategory: (id, updates) => { /* ...略... */ return Promise.resolve() },

  /**
   * 新增：獲取特定類別的購物車商品
   */
  getCategoryCartItems: (categoryId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const items = localData.cartItems.filter(item => item.categoryId === categoryId);
        resolve(items);
      }, 300);
    });
  }
};