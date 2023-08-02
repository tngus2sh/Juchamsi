import axios from "axios";

// axios 객체 생성
export default axios.create({
  baseURL: "https://6a7a-220-95-12-66.ngrok-free.app",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});
