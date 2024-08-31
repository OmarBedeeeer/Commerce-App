import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

const app: Application = express();
dotenv.config();
app.use(express.json());

const port = process.env.PORT;
app.listen(port, () => console.log("App listening on port"));
