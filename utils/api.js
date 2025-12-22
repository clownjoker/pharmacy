import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// إضافة التوكن تلقائيًا إن وُجد
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;








// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://127.0.0.1:5000/api",
// });

// export default api;

