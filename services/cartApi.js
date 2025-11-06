import database from './database.json';

// Simulate localStorage functionality
let localData = {
  categories: [...database.categories],
  items: [...database.items],
  budgets: {
    food: database.categories.find(c => c.id === 'food')?.budget_limit || 0,
    life: database.categories.find(c => c.id === 'life')?.budget_limit || 0,
    med: database.categories.find(c => c.id === 'med')?.budget_limit || 0,
  }
};

export const cartApi = {
  // Get all categories
  getCategories: () => {
    return Promise.resolve(localData.categories);
  },

  // Get items for specific category
  getItemsByCategory: (categoryId) => {
    const items = localData.items
      .filter(item => item.category_id === categoryId)
      .sort((a, b) => a.order - b.order);
    return Promise.resolve(items);
  },

  // Get items and budget info for specific category (for backward compatibility)
  getItems: (categoryId) => {
    const items = localData.items
      .filter(item => item.category_id === categoryId)
      .sort((a, b) => a.order - b.order);
    
    const purchasedItems = localData.items.filter(
      item => item.category_id === categoryId && item.purchased
    );
    const totalSpent = purchasedItems.reduce((sum, item) => sum + item.price, 0);
    const remainingBudget = localData.budgets[categoryId] - totalSpent;
    
    return Promise.resolve({
      items,
      remainingBudget
    });
  },

  // Get remaining budget for category
  getRemainingBudget: (categoryId) => {
    const purchasedItems = localData.items.filter(
      item => item.category_id === categoryId && item.purchased
    );
    const totalSpent = purchasedItems.reduce((sum, item) => sum + item.price, 0);
    const remaining = localData.budgets[categoryId] - totalSpent;
    return Promise.resolve(remaining);
  },

  // Toggle item purchase status
  toggleItemPurchased: (itemId) => {
    const itemIndex = localData.items.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
      localData.items[itemIndex].purchased = !localData.items[itemIndex].purchased;
      localData.items[itemIndex].updated_at = new Date().toISOString();
    }
    return Promise.resolve(localData.items[itemIndex]);
  },

  // Update item order
  updateItemOrder: (categoryId, reorderedItems) => {
    reorderedItems.forEach((item, index) => {
      const itemIndex = localData.items.findIndex(i => i.id === item.id);
      if (itemIndex !== -1) {
        localData.items[itemIndex].order = index + 1;
        localData.items[itemIndex].updated_at = new Date().toISOString();
      }
    });
    return Promise.resolve(true);
  },

  // Get total spent amount for purchased items
  getTotalSpent: (categoryId) => {
    const purchasedItems = localData.items.filter(
      item => item.category_id === categoryId && item.purchased
    );
    const total = purchasedItems.reduce((sum, item) => sum + item.price, 0);
    return Promise.resolve(total);
  },

  // Reset data (for development use)
  resetData: () => {
    localData = {
      categories: [...database.categories],
      items: [...database.items],
      budgets: {
        food: database.categories.find(c => c.id === 'food')?.budget_limit || 0,
        life: database.categories.find(c => c.id === 'life')?.budget_limit || 0,
        med: database.categories.find(c => c.id === 'med')?.budget_limit || 0,
      }
    };
    return Promise.resolve(true);
  }
};