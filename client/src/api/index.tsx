import axios from "axios";

//const token = process.env.TOKEN_API;eafe20b1 
//http://www.omdbapi.com/?apikey=[yourkey]&
const token = "eafe20b1"; 

export const api = axios.create({
  baseURL: "http://localhost:3030",
});

export const OMDb = axios.create({
    baseURL: `http://www.omdbapi.com/?apikey=${token}`,
});