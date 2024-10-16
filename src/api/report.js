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

export const getReportUser = async () => {
  return await instance.get("showAllUserReport");
};

// 수정필요 => 삭제하면서 밴도 해야함
export const deleteUser = async (userReportCode) => {
  return await instance.delete(
    "delUserReport?userReportCode=" + userReportCode
  );
};
