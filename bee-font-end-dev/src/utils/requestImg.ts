import axios from "axios";
 const request4ss = axios.create({
    baseURL: "http://localhost:8081/admin/api",
    timeout: 5000,
  });
  request4ss.interceptors.request.use(
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
  export default request4ss;