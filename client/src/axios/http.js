import axios from "axios";

// axios 객체 생성
export default axios.create({
  baseURL: "https://i9c107.p.ssafy.io/api",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
    "ngrok-skip-browser-warning": "69420",
    "withCredentials": true
  },
});
