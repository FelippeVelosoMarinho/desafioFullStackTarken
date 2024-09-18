import dotenv from "dotenv";
import express, { Express } from "express";
import cors, { CorsOptions } from "cors";

dotenv.config();

export const api: Express = express();

const options: CorsOptions = {
  origin: process.env.CLIENTURL,
  credentials: true,
};
api.use(cors(options));

api.use(express.json());
api.use(express.urlencoded({
    extended: true
}));

//api.use("/api/reviews", ReviewRouter);

export default api;