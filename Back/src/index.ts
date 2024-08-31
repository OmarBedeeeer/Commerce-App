import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

const app: Application = express();
dotenv.config();
app.use(express.json());

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hello World");
  console.log("Home route accessed");
});

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(404).send("Can't find this Page");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
