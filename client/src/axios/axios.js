import axios from "axios";

// axios 객체 생성
const axiosInstance = axios.create({
  baseURL: "https://82ee-211-228-66-220.ngrok-free.app",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
    "ngrok-skip-browser-warning": "69420",
    "withCredentials": "true"
  },
});

export default axiosInstance;