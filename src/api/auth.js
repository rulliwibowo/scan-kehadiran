import axios from "../libs/axios";

export async function login(username, password) {
  try {
    const res = await axios.post("/api/user/login.json", {
      username,
      password,
    });
    if (res.data?.token) {
      return res.data.token;
    }
  } catch (err) {
    throw new Error(
      err.response?.data?.response?.message ||
        "Login failed. Please check your credentials."
    );
  }
  throw new Error("Login failed: An unknown error occurred.");
}
