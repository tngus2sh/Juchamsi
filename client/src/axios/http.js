import axios from "axios";

// axios 객체 생성
export default axios.create({
  baseURL: "https://67e6-175-223-11-164.ngrok-free.app",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});
