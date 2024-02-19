import { Request, Response, Express, NextFunction } from "express";
import connectDatabase from "@src/config/db";
import router from "@src/modules/routes/user";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(express.static("public"));

//connect to db
connectDatabase();

// Define other routes
app.use("/", router);

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
