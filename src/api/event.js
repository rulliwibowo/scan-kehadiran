import axios from "axios";

export async function fetchEvents() {
  try {
    const response = await axios.get("/api/events/index.json");
    console.log("Fetched events:", response.data);
    return response.data;
  } catch (error) {
    console.error("Gagal fetch event:", error);
    return [];
  }
}
