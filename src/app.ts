import { Request, Response, Express, NextFunction } from "express";
import connectDatabase from "@src/config/db";
import userRouter from "@src/modules/routes/user";
import projectRouter from "@src/modules/routes/project";
import express from "express";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

//connect to db
connectDatabase();

// Define other routes
app.use("/", userRouter, projectRouter);

// Middleware for error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.statusCode || 500;
  res.status(status).json({
    error: {
      message: err.message,
    },
  });
});

// Handle 404 errors
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json(`${req.path} has not been found`);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
