import axios from "axios";

// axios 객체 생성
export default axios.create({
  baseURL: "https://e6f5-121-178-98-21.ngrok-free.app",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});
