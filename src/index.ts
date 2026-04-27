import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import itemsRouter from "./routes/items";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:4173",
    ],
    credentials: true,
  }),
);

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get("/ping", (req, res) => {
  res.send("ping pong");
});

app.use("/api/items", itemsRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: "Маршрут не найден",
    path: req.path,
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    error: "Внутренняя ошибка сервера",
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
  console.log(`API доступен по адресу http://localhost:${PORT}/api/items`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
