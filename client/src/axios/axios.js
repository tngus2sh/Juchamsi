import axios from "axios";

// axios 객체 생성
const axiosInstance = axios.create({
  baseURL: "https://3450-121-179-2-182.ngrok-free.app",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
    "ngrok-skip-browser-warning": "69420",
    "withCredentials": "true"
  },
});

export default axiosInstance;