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

// 게시물 추가
export const addPost = async (data) => {
  return await instance.post("post", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 게시물 수정
export const updatePost = async (data) => {
  return await instance.put("post", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// POST_CODE로 게시물 1개 조회
export const detailPost = async (postCode) => {
  return await instance.get(`post/${postCode}`);
};

// postCode로 게시물 이미지 조회
export const detailImg = async (postCode) => {
  return await instance.get(`postImg/${postCode}`);
};

// postCode로 product + tag  조회
