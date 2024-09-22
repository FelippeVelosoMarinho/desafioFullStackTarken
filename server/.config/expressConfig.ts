import dotenv from "dotenv";
import express, { Express } from "express";
import cors, { CorsOptions } from "cors";

import ReviewRouter from "../src/domains/Review/controllers/index";
import LibraryRouter from "../src/domains/Library/controllers/index";
import LibraryMoviesRouter from "../src/domains/Library_Movies/controllers/index";
import MovieRouter from "../src/domains/Movie/controllers/index";
import UserRouter from "../src/domains/User/controllers/index";

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

app.use("/app/reviews", ReviewRouter);
app.use("/app/libraryroute", LibraryRouter);
app.use("/app/librarymoviesrouter", LibraryMoviesRouter);
app.use("/app/movie", MovieRouter);
app.use("/app/user", UserRouter);

export default app;