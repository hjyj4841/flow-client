import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api/",
});

// Toggle save
export const handleSaveToggle = async (postCode, user) => {
  try {
    await instance.post(`collection/toggle/${postCode}`, user);
  } catch (error) {
    console.error("Error toggling save", error);
  }
};
