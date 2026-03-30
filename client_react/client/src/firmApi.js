import axios from "axios";

const API = "/api"; // 
export const getFirms = async () => {
  try {
    const res = await axios.get(`${API}/firm`);
    return res.data;
  } catch (error) {
    console.error("Error fetching firms:", error);
  }
};