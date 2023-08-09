import axios from "axios";

// axios 객체 생성
export default axios.create({
  baseURL: "https://453d-121-178-98-21.ngrok-free.app",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
    "ngrok-skip-browser-warning": "69420",
    "withCredentials": true
  },
});
