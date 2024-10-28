import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api/",
});

// 찬/반 투표
export const addVote = async (data) => {
  return await instance.post("postVote", data);
};

// 찬성 투표
export const voteY = async (data) => {
  return await instance.post("postVote", data);
};

// 반대 투표
export const voteN = async (data) => {
  return await instance.post("postVote", data);
};

// 투표 취소
export const removeVote = async (voteCode) => {
  return await instance.delete(`postVote/${voteCode}`);
};

// 투표 했는지 체크
export const checkVote = async (data) => {
  return await instance.post("postVote", data);
};

// 투표 수정
export const updateVote = async (data) => {
  return await instance.put("postVote", data);
};

// 전체 투표 현황
export const countVote = async (voteCode) => {
  return await instance.get("postVote", voteCode);
};

// 찬성 투표 현황
export const countY = async (voteYn) => {
  return await instance.get("postVote", voteYn);
};

// 반대 투표 형황
export const countN = async (voteYn) => {
  return await instance.get("postVote", voteYn);
};

// 투표 생성 유무 조회
export const haveVote = async (userCode) => {
  return await instance.get(`postVote/haveVote?userCode=${userCode}`);
};
