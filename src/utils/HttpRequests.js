import axios from "axios";

const HttpRequest = axios.create({
  baseURL: "http://localhost:8080/api",
  // baseURL: "https://pharmacy-webapp-backend-uz5m.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: Add token to Authorization header for all requests
HttpRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const get = async (path, options = {}) => {
  const response = await HttpRequest.get(path, options);
  return response.data;
};

export const post = async (path, data = {}, options = {}) => {
  const response = HttpRequest.post(path, data, options);
  return (await response).data;
};

export const put = async (path, data = {}, options = {}) => {
  const response = HttpRequest.put(path, data, options);
  return (await response).data;
};

export default HttpRequest;
