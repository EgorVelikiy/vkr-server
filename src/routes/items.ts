/**
 * Маршруты для работы с элементами
 * API endpoints для CRUD операций
 */

import { Router, Request, Response } from 'express';
import {
  getAllItems,
  getItemById,
  updateItem,
  bulkUpdateItems,
  resetItems,
} from '../data/mockData';
import { DashboardItem, BulkUpdateRequest, BulkUpdateResponse } from '../types';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const count = req.query.count ? parseInt(req.query.count as string) : undefined;
    
    let items = getAllItems();
    
    // Если запрашивается другое количество, реинициализируем
    if (count && count !== items.length) {
      items = resetItems(count);
    }

    // Симуляция сетевой задержки для реалистичности
    setTimeout(() => {
      res.json({
        success: true,
        items,
        count: items.length,
      });
    }, 500);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Ошибка при получении элементов',
    });
  }
});

/**
 * GET /api/items/:id
 * Получение одного элемента по ID
 */
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = getItemById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Элемент не найден',
      });
    }

    setTimeout(() => {
      res.json({
        success: true,
        item,
      });
    }, 200);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Ошибка при получении элемента',
    });
  }
});

/**
 * PUT /api/items/:id
 * Обновление одного элемента
 * Body может содержать полный объект DashboardItem или частичное обновление
 */
router.put('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const itemData: DashboardItem = req.body;

    // Проверяем, что ID в body совпадает с ID в URL (если указан)
    if (itemData.id && itemData.id !== id) {
      return res.status(400).json({
        success: false,
        error: 'ID в URL не совпадает с ID в body',
      });
    }

    const existingItem = getItemById(id);
    if (!existingItem) {
      return res.status(404).json({
        success: false,
        error: 'Элемент не найден',
      });
    }

    // Объединяем существующие данные с новыми, гарантируя правильный ID
    const updatedItem: DashboardItem = {
      ...existingItem,
      ...itemData,
      id, // Гарантируем, что ID из URL всегда используется
    };

    const result = updateItem(updatedItem);
    
    if (!result) {
      return res.status(500).json({
        success: false,
        error: 'Ошибка при обновлении элемента',
      });
    }

    setTimeout(() => {
      res.json({
        success: true,
        item: result,
      });
    }, 200);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Ошибка при обновлении элемента',
    });
  }
});

/**
 * POST /api/items
 * Создание нового элемента
 */
router.post('/', (req: Request, res: Response) => {
  try {
    const itemData: Omit<DashboardItem, 'id' | 'timestamp'> = req.body;

    // В реальном приложении здесь была бы генерация уникального ID
    const newItem: DashboardItem = {
      ...itemData,
      id: `item-${Date.now()}`,
      timestamp: Date.now(),
    } as DashboardItem;

    // Добавляем в хранилище
    const items = getAllItems();
    items.push(newItem);

    setTimeout(() => {
      res.status(201).json({
        success: true,
        item: newItem,
      });
    }, 200);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Ошибка при создании элемента',
    });
  }
});

/**
 * POST /api/items/bulk
 * Массовое обновление элементов
 */
router.post('/bulk', (req: Request, res: Response) => {
  try {
    const { items }: BulkUpdateRequest = req.body;
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        error: 'Неверный формат данных. Ожидается массив items',
      });
    }

    const updatedItems = bulkUpdateItems(items);

    // Симуляция сетевой задержки для реалистичности
    setTimeout(() => {
      const response: BulkUpdateResponse = {
        success: true,
        items: updatedItems,
        count: updatedItems.length,
      };

      res.json(response);
    }, 800);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Ошибка при массовом обновлении элементов',
    });
  }
});

/**
 * DELETE /api/items/:id
 * Удаление элемента
 */
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const items = getAllItems();
    const index = items.findIndex(item => item.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: 'Элемент не найден',
      });
    }

    items.splice(index, 1);

    setTimeout(() => {
      res.json({
        success: true,
        message: 'Элемент успешно удален',
      });
    }, 200);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Ошибка при удалении элемента',
    });
  }
});

export default router;
