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

// 투표 게시물 전체 조회
export const allVoteView = async () => {
  return await instance.get("postVote");
}

// 투표 게시물 1개 조회
export const detailPostVote = async (postType) => {
  return await instance.get(`postVote/${postType}`)
}

// 투표 업로드
export const addVote = async (data) => {
  return await authorize.post("addVote", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 투표 찬/반 변경
export const updateVote = async (data) => {
  return await authorize.put("updateVote", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// 투표 게시물 삭제
export const deleteVote = async (postCode) => {
  return await authorize.delete(`deleteVote/${postCode}`);
}