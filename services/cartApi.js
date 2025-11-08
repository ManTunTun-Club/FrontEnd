// services/cartApi.js
import database from './database.json';

// --- Helpers ---
const idAlias = (cid) => (cid === 'medicine' ? 'med' : cid);

const sortByCreatedAtThenName = (arr) =>
  [...arr].sort((a, b) => {
    const ad = a?.created_at ? new Date(a.created_at).getTime() : Number.POSITIVE_INFINITY;
    const bd = b?.created_at ? new Date(b.created_at).getTime() : Number.POSITIVE_INFINITY;
    if (ad !== bd) return ad - bd;
    return String(a?.name || '').localeCompare(String(b?.name || ''));
  });

const sortItems = (arr) =>
  [...arr].sort((a, b) => {
    const ao = Number.isFinite(a?.order) ? a.order : Number.POSITIVE_INFINITY;
    const bo = Number.isFinite(b?.order) ? b.order : Number.POSITIVE_INFINITY;
    if (ao !== bo) return ao - bo;

    const ad = a?.created_at ? new Date(a.created_at).getTime() : Number.POSITIVE_INFINITY;
    const bd = b?.created_at ? new Date(b.created_at).getTime() : Number.POSITIVE_INFINITY;
    if (ad !== bd) return ad - bd;

    return String(a?.title || '').localeCompare(String(b?.title || ''));
  });

const buildBudgets = (categories) =>
  categories.reduce((acc, c) => {
    acc[c.id] = c?.budget_limit ?? 0;
    return acc;
  }, {});

// --- Local state (simulate DB) ---
let localData = {
  categories: sortByCreatedAtThenName([...database.categories]),
  items: [...database.items].map((it) => ({
    ...it,
    category_id: idAlias(it.category_id),
  })),
  budgets: buildBudgets(database.categories),
};

export const cartApi = {
  // 類別清單（排序：created_at -> name）
  getCategories: () => {
    return Promise.resolve(sortByCreatedAtThenName(localData.categories));
  },

  // 取單一類別（給 Header 顯示最新 name/icon）
  getCategory: (categoryId) => {
    const id = idAlias(categoryId);
    const cat = localData.categories.find((c) => c.id === id);
    return Promise.resolve(cat || null);
  },

  // 指定類別的（未購買）品項清單
  getItemsByCategory: (categoryId) => {
    const id = idAlias(categoryId);
    const items = sortItems(
      localData.items.filter((item) => item.category_id === id && !item.purchased)
    );
    return Promise.resolve(items);
  },

  // 指定類別：未購買品項 + 剩餘預算
  getItems: (categoryId) => {
    const id = idAlias(categoryId);

    const items = sortItems(
      localData.items.filter((item) => item.category_id === id && !item.purchased)
    );

    const purchasedItems = localData.items.filter(
      (item) => item.category_id === id && item.purchased
    );
    const totalSpent = purchasedItems.reduce((sum, item) => sum + (item.price ?? 0), 0);

    const budgetFromMap = localData.budgets[id];
    const budgetFromCat =
      localData.categories.find((c) => c.id === id)?.budget_limit ?? 0;
    const budget = Number.isFinite(budgetFromMap) ? budgetFromMap : budgetFromCat;

    const remainingBudget = Math.max(0, budget - totalSpent);

    return Promise.resolve({
      items,
      remainingBudget,
    });
  },

  // 剩餘預算
  getRemainingBudget: (categoryId) => {
    const id = idAlias(categoryId);
    const purchasedItems = localData.items.filter(
      (item) => item.category_id === id && item.purchased
    );
    const totalSpent = purchasedItems.reduce((sum, item) => sum + (item.price ?? 0), 0);

    const budgetFromMap = localData.budgets[id];
    const budgetFromCat =
      localData.categories.find((c) => c.id === id)?.budget_limit ?? 0;
    const budget = Number.isFinite(budgetFromMap) ? budgetFromMap : budgetFromCat;

    const remaining = Math.max(0, budget - totalSpent);
    return Promise.resolve(remaining);
  },

  // ✅ 購買：標記 purchased=true、更新價格為實付金額
  purchaseItem: (categoryId, itemId, amount) => {
    const id = idAlias(categoryId);
    const idx = localData.items.findIndex((it) => it.id === itemId && it.category_id === id);
    if (idx === -1) return Promise.resolve(null);

    const pay = Number.isFinite(amount) ? Number(amount) : localData.items[idx].price ?? 0;

    localData.items[idx] = {
      ...localData.items[idx],
      purchased: true,
      price: pay, // 用對話框的實付金額覆蓋
      updated_at: new Date().toISOString(),
    };

    // 回傳更新後的剩餘預算
    const purchasedItems = localData.items.filter(
      (item) => item.category_id === id && item.purchased
    );
    const totalSpent = purchasedItems.reduce((sum, item) => sum + (item.price ?? 0), 0);

    const budgetFromMap = localData.budgets[id];
    const budgetFromCat =
      localData.categories.find((c) => c.id === id)?.budget_limit ?? 0;
    const budget = Number.isFinite(budgetFromMap) ? budgetFromMap : budgetFromCat;
    const remainingBudget = Math.max(0, budget - totalSpent);

    return Promise.resolve({
      item: localData.items[idx],
      remainingBudget,
    });
  },

  // 切換購買狀態（保留，若你有別處用到）
  toggleItemPurchased: (itemId) => {
    const itemIndex = localData.items.findIndex((item) => item.id === itemId);
    if (itemIndex !== -1) {
      localData.items[itemIndex].purchased = !localData.items[itemIndex].purchased;
      localData.items[itemIndex].updated_at = new Date().toISOString();
      return Promise.resolve(localData.items[itemIndex]);
    }
    return Promise.resolve(null);
  },

  // 更新排序（同類別內）
  updateItemOrder: (categoryId, reorderedItems) => {
    const id = idAlias(categoryId);
    const idToOrder = new Map(reorderedItems.map((x, i) => [x.id, i + 1]));
    localData.items = localData.items.map((it) => {
      if (it.category_id === id && idToOrder.has(it.id)) {
        return { ...it, order: idToOrder.get(it.id), updated_at: new Date().toISOString() };
      }
      return it;
    });
    return Promise.resolve(true);
  },

  // 已購買總額
  getTotalSpent: (categoryId) => {
    const id = idAlias(categoryId);
    const total = localData.items
      .filter((item) => item.category_id === id && item.purchased)
      .reduce((sum, item) => sum + (item.price ?? 0), 0);
    return Promise.resolve(total);
  },

  // 直接設定預算（可選）
  setBudget: (categoryId, amount) => {
    const id = idAlias(categoryId);
    localData.budgets[id] = amount ?? 0;
    const idx = localData.categories.findIndex((c) => c.id === id);
    if (idx !== -1) {
      localData.categories[idx].budget_limit = amount ?? 0;
      localData.categories[idx].updated_at = new Date().toISOString();
    }
    return Promise.resolve(true);
  },

  // 開發重置
  resetData: () => {
    localData = {
      categories: sortByCreatedAtThenName([...database.categories]),
      items: [...database.items].map((it) => ({
        ...it,
        category_id: idAlias(it.category_id),
      })),
      budgets: buildBudgets(database.categories),
    };
    return Promise.resolve(true);
  },
};
