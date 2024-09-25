import axios from "axios";

export const token = "eafe20b1"; 

//APP_URL_NATIVE=http://192.168.0.78:8081

export const api = axios.create({
  baseURL: "http://192.168.1.154:3030/api",
});

export const OMDbSearch = axios.create({
    baseURL: `https://www.omdbapi.com/`,
});