import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:8080/api/",
  });

export const addPost = async (data) => {
    return await instance.post("post", data, {
        headers: {
        "Content-Type": "multipart/form-data",
        },
    });
};