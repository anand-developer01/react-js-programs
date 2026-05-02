import axios from "axios";
import { getToken } from "../utils/token";

const apiClient = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 10000, // ⏱ Timeout
});

// 🔐 Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();

    // attach token only if required
    if (config.withAuth && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 📩 Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized → redirect login");
    }
    return Promise.reject(error);
  }
);

export default apiClient;