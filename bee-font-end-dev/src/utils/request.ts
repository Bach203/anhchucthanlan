import axios from "axios";
const request = axios.create({
  baseURL: "http://localhost:8081/admin/api",
  timeout: 2000,
});
request.interceptors.request.use(
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
export const request1 = axios.create({
  baseURL: "http://localhost:8081/client/api",
  timeout: 2000,
});
export const requestTimMatKhau = axios.create({
  baseURL: "http://localhost:8081/admin/api",
  timeout: 10000,
});
export const requestTimMatKhau1 = axios.create({
  baseURL: "http://localhost:8081/api",
  timeout: 10000,
  
});
export const requestDangNhap = axios.create({
  baseURL: "http://localhost:8081/api",
  timeout: 5000,
});
export const requestDangKi = axios.create({
  baseURL: "http://localhost:8081/api",
  timeout: 10000,
});
export const request4s = axios.create({
  baseURL: "http://localhost:8081/admin/api",
  timeout: 5000,
});
export const requestLogout = axios.create({
  baseURL: "http://localhost:8081/api",
  timeout: 5000,
});

export default request;
