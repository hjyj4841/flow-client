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
