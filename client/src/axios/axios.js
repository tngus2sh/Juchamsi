import axios from "axios";

// axios 객체 생성
const axiosInstance = axios.create({
  baseURL: "https://e6f5-121-178-98-21.ngrok-free.app",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
    "ngrok-skip-browser-warning": "69420",
    "withCredentials": "true"
  },
});

export default axiosInstance;