import axios from "axios";
export const requestDoiMK = axios.create({
  baseURL: "http://localhost:8081/api",
  timeout: 2000,
});
requestDoiMK.interceptors.request.use(
  (config) => {
    const local123 = localStorage.getItem('refreshToken');
    if (local123) {
      config.headers.Authorization = `Bearer ${local123}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);