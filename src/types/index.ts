/**
 * Типы данных для Express сервера
 * Должны соответствовать типам клиентского приложения
 */

export interface DashboardItem {
  id: string;
  name: string;
  value: number;
  category: string;
  status: 'active' | 'inactive' | 'pending';
  timestamp: number;
}

export interface BulkUpdateRequest {
  items: DashboardItem[];
}

export interface BulkUpdateResponse {
  success: boolean;
  items: DashboardItem[];
  count: number;
}
