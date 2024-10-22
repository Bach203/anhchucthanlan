import axios from "axios";
const requestClient = axios.create({
  baseURL: "http://localhost:8081/client/api",
  timeout: 7000,
});
requestClient.interceptors.request.use(
  (config) => {
    const local123 = localStorage.getItem("refreshToken");
    if (local123) {
      config.headers.Authorization = `Bearer ${local123}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default requestClient;
