# Express API Server

Express сервер для React State Managers Comparison приложения.

## Установка

```bash
cd server
npm install
```

## Запуск

### Development режим (с hot reload)
```bash
npm run dev
```

### Production режим
```bash
npm run build
npm start
```

## API Endpoints

### Health Check
- **GET** `/health` - Проверка состояния сервера

### Items API

- **GET** `/api/items` - Получить все элементы
  - Query параметры:
    - `count` (опционально) - количество элементов для генерации

- **GET** `/api/items/:id` - Получить элемент по ID

- **POST** `/api/items` - Создать новый элемент

- **PUT** `/api/items/:id` - Обновить элемент

- **POST** `/api/items/bulk` - Массовое обновление элементов
  - Body: `{ items: DashboardItem[] }`

- **DELETE** `/api/items/:id` - Удалить элемент

## Примеры запросов

### Получение всех элементов
```bash
curl http://localhost:3001/api/items
```

### Получение элементов с указанием количества
```bash
curl http://localhost:3001/api/items?count=500
```

### Обновление элемента
```bash
curl -X PUT http://localhost:3001/api/items/item-1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Item", "value": 100}'
```

### Массовое обновление
```bash
curl -X POST http://localhost:3001/api/items/bulk \
  -H "Content-Type: application/json" \
  -d '{"items": [{"id": "item-1", "value": 200}, {"id": "item-2", "value": 300}]}'
```

## Конфигурация

По умолчанию сервер запускается на порту `3001`. 
Для изменения используйте переменную окружения `PORT`:

```bash
PORT=4000 npm run dev
```

## CORS

Сервер настроен для работы с фронтендом на `http://localhost:5173` (Vite dev server).
Для изменения настройте CORS в `src/index.ts`.
