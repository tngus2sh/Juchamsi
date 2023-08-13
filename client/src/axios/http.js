import axios from "axios";

// axios 객체 생성
export default axios.create({
  baseURL: "https://292f-121-179-2-182.ngrok-free.app",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
    "ngrok-skip-browser-warning": "69420",
    "withCredentials": true
  },
});
