import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("authToken");
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401 ) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("currentUser");
        window.location.href = "/SignupPopup";
      
    }
    
    console.error("Request failed:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;