import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api",
});

const authorize = axios.create({
  baseURL: "http://localhost:8080/api/private",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// 댓글 조회
export const getAllComment = async (postCode) => {
  return await instance.get(`/${postCode}/comment`);
};

// 댓글 작성
export const addComment = async (data) => {
  return await instance.post(`/addcomment`, data);
};

// 댓글 수정
export const updateComment = async (data) => {
  return await instance.put("updatecomment", data);
};

// 댓글 삭제
export const deleteComment = async (commentCode) => {
  return await instance.delete(`deletecomment/${commentCode}`);
};
