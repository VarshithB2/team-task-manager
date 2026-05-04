import.meta.env.VITE_API_URL
console.log(import.meta.env.VITE_API_URL);
const api = axios.create({
  baseURL: "https://team-task-manager-3u55.onrender.com/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ttm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('ttm_token');
      localStorage.removeItem('ttm_user');
    }
    return Promise.reject(err);
  }
);

export default api;