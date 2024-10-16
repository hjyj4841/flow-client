import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api/",
});

export const addVote = async (data) => {
  return await instance.post("addVote", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
