import axios from "axios";

//const token = process.env.TOKEN_API;eafe20b1 
const token = "eafe20b1"; 

export const api = axios.create({
  baseURL: "http://localhost:3030",
});

export const OMDb = axios.create({
    baseURL: `http://www.omdbapi.com/?i=tt3896198&apikey=${token}`,
    /*headers: {
        Authorization: `Bearer ${token}`,
    },*/
});