// import axios from "axios";
import axios from "../libs/axios.js";

export async function login(username, password) {
  const res = await axios.post("/user/login.json", {
    username,
    password,
  });

  if (res.data?.token) {
    return res.data.token;
  }

  throw new Error("Login gagal: token tidak ditemukan");
}
