import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api/",
});

// 신고받은 글 가져오기
export const getReportPost = async () => {
  return await instance.get("showAllPostReport");
};

export const deletePost = async (postReportCode) => {
  return await instance.delete(
    "delPostReport?postReportCode=" + postReportCode
  );
};

export const reportPost = async () => {
  return await instance.post("reportPost");
};

// 테이블 하나 더 필요함
export const reportUser = async () => {
  return await instance.put("reportUser");
};
