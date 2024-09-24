// src/app.ts

import dotenv from "dotenv";
import express, { Express } from "express";
import cors, { CorsOptions } from "cors";

import ReviewRouter from "../src/domains/Review/controllers/index";
import LibraryRouter from "../src/domains/Library/controllers/index";
import LibraryMoviesRouter from "../src/domains/Library_Movies/controllers/index";
import MovieRouter from "../src/domains/Movie/controllers/index";
import UserRouter from "../src/domains/User/controllers/index";

dotenv.config();

const app: Express = express();

const corsOptions: CorsOptions = {
  origin: process.env.APP_URL || process.env.APP_URL_NATIVE || "*", 
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Montagem das rotas com prefixo /api
app.use("/api/reviews", ReviewRouter);
app.use("/api/libraries", LibraryRouter);
app.use("/api/library-movies", LibraryMoviesRouter);
app.use("/api/movies", MovieRouter);
app.use("/api/users", UserRouter);

console.log("Rotas montadas corretamente.");

// Rota de Teste
app.get("/api/test", (req, res) => {
  res.status(200).json({ message: "API está funcionando corretamente!" });
});

// Rota padrão
app.get("/", (req, res) => {
  res.status(200).send("Bem-vindo à API do Sistema de Biblioteca de Filmes!");
});


export default app;
