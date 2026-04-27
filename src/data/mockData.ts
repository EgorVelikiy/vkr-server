/**
 * Генерация mock данных для сервера
 * Используется для имитации базы данных
 */

import { DashboardItem } from '../types';

// In-memory хранилище элементов
let itemsStore: DashboardItem[] = [];

/**
 * Создание mock элемента
 */
export const createMockItem = (id: string, index: number): DashboardItem => {
  const categories = ['Category A', 'Category B', 'Category C', 'Category D'];
  const statuses: Array<'active' | 'inactive' | 'pending'> = ['active', 'inactive', 'pending'];
  
  return {
    id,
    name: `Item ${index + 1}`,
    value: Math.floor(Math.random() * 1000) + 1,
    category: categories[Math.floor(Math.random() * categories.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    timestamp: Date.now() + index * 1000,
  };
};

/**
 * Инициализация хранилища данными
 */
export const initializeItems = (count: number = 1000): DashboardItem[] => {
  itemsStore = Array.from({ length: count }, (_, index) => 
    createMockItem(`item-${index}`, index)
  );
  return itemsStore;
};

/**
 * Получение всех элементов
 */
export const getAllItems = (): DashboardItem[] => {
  return itemsStore;
};

/**
 * Получение элемента по ID
 */
export const getItemById = (id: string): DashboardItem | undefined => {
  return itemsStore.find(item => item.id === id);
};

/**
 * Обновление элемента
 */
export const updateItem = (item: DashboardItem): DashboardItem | null => {
  const index = itemsStore.findIndex(i => i.id === item.id);
  if (index === -1) {
    return null;
  }
  const updatedItem = { ...item, timestamp: Date.now() };
  itemsStore[index] = updatedItem;
  return updatedItem;
};

/**
 * Массовое обновление элементов
 */
export const bulkUpdateItems = (items: DashboardItem[]): DashboardItem[] => {
  const updatedItems: DashboardItem[] = [];
  const itemMap = new Map(items.map(item => [item.id, item]));

  itemsStore = itemsStore.map(existingItem => {
    const updatedItem = itemMap.get(existingItem.id);
    if (updatedItem) {
      const item = { ...updatedItem, timestamp: Date.now() };
      updatedItems.push(item);
      return item;
    }
    return existingItem;
  });

  return updatedItems;
};

/**
 * Сброс хранилища (для тестирования)
 */
export const resetItems = (count: number = 1000): DashboardItem[] => {
  return initializeItems(count);
};

// Инициализация при загрузке модуля
initializeItems(1000);
