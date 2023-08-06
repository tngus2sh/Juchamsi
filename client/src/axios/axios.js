import axios from "axios";

// axios 객체 생성
const axiosInstance = axios.create({
  baseURL: "http://i9c107.p.ssafy.io:8080",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
    "ngrok-skip-browser-warning": "69420",
    "withCredentials": "true"
  },
});

export default axiosInstance;