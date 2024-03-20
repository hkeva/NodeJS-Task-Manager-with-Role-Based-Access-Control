import express from "express";
import dotenv from "dotenv";
import { Request, Response, Express, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { sendEmailToMe } from "./utils/emails";
import cors from "cors";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post(
  "/send-email",
  body("name")
    .notEmpty()
    .withMessage("name is required")
    .isString()
    .withMessage("name type must be string"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isString()
    .withMessage("email type must be string")
    .isEmail()
    .withMessage("Invalid email"),
  body("message")
    .notEmpty()
    .withMessage("message is required")
    .isString()
    .withMessage("message type must be string"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors });
    }
    next();
  },
  async (req: Request, res: Response, next: NextFunction) => {
    await sendEmailToMe(req.body.name, req.body.email, req.body.message);
    res.status(200).json(`Email has been successfully sent!`);
  }
);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json(`${req.path} has not been found`);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
