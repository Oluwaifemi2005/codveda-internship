
import axios from "https://cdn.jsdelivr.net/npm/axios@1.13.2/+esm";

const API = axios.create({
  baseURL: "http://localhost:5000/api/tasks",
  headers: {
    "Content-Type": "application/json"
  }
});

export default API;
