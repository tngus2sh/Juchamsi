import axios from "axios";

// axios 객체 생성
const axiosInstance = axios.create({
  baseURL: "https://67e6-175-223-11-164.ngrok-free.app",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
    "ngrok-skip-browser-warning": "69420",
    "withCredentials": "true"
  },
});

export default axiosInstance;