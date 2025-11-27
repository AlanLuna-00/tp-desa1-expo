import axios from "axios";

export const api = axios.create({
  baseURL: "https://reqres.in/api",
  headers: {
    "x-api-key": "reqres-free-v1",
    "Content-Type": "application/json",
  },
});
