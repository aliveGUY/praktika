import "reflect-metadata";
import express from "express";
import session, { MemoryStore } from "express-session";
import { DataSource } from "typeorm";
import userRoutes from "./routes/users";
import playgroundRoutes from "./routes/playgrounds";
import bookingRoutes from "./routes/bookings";
import htmlRoutes from "./routes/html"

const app = express();
const PORT = 3000;

const store = new MemoryStore();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    store,
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// Database connection
export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: true,
  entities: [__dirname + "/entity/*.ts"],
});

AppDataSource.initialize()
  .then(() => {
    console.log("Database initialized");
  })
  .catch((err) => console.error("Database initialization error:", err));

// Routes
app.use("/", htmlRoutes);
app.use("/api/users", userRoutes);
app.use("/api/playgrounds", playgroundRoutes);
app.use("/api/bookings", bookingRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
