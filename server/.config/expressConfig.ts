import dotenv from "dotenv";
import express, { Express } from "express";
import cors, { CorsOptions } from "cors";

dotenv.config();

export const app: Express = express();

const options: CorsOptions = {
  origin: process.env.CLIENTURL,
  credentials: true,
};
app.use(cors(options));

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

//app.use("/app/reviews", ReviewRouter);

export default app;