import axios from "axios";

//const token = process.env.TOKEN_API;eafe20b1 
//http://www.omdbapi.com/?apikey=eafe20b1?s=Guardian
export const token = "eafe20b1"; 

export const api = axios.create({
  baseURL: "http://localhost:3030/api",
});

export const OMDbSearch = axios.create({
    //baseURL: `https://www.omdbapi.com/?i=tt3896198&apikey=${token}`,
    baseURL: `https://www.omdbapi.com/`,
});