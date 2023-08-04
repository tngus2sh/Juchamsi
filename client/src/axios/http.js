import axios from "axios";

// axios 객체 생성
export default axios.create({
  baseURL: "https://3450-121-179-2-182.ngrok-free.app ",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});
