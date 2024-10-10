import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api/",
});

const authorize = axios.create({
  baseURL: "http://localhost:8080/api/private/",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const addPost = async (data) => {
  return await instance.post("post", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updatePost = async (data) => {
  return await instance.put("post", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
