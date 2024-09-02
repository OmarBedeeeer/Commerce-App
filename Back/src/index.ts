import express, { Application, Request, Response, NextFunction } from "express";
import connectToMongoDb from "./db/db.connection";
import dotenv from "dotenv";
import categoryRouter from "./modules/category/router/category.router";
const app: Application = express();
dotenv.config();

app.use(express.json());
app.use("/api/v1", categoryRouter);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(404).send("Can't find this Page");
});

const port = process.env.PORT;

connectToMongoDb();

app.listen(port, () => {
  console.log(`App listening on port`);
});
