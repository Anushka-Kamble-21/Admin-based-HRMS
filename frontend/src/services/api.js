import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true
});

export default api;

/*
add interceptors

Attach JWT token

Handle 401 globally
*/