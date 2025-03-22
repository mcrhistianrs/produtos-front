import axios from "axios";

// Make sure this points to our JSON Server
export const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
}); 