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
export const getReportUser = async () => {
  return await instance.get("showAllUserReport");
};
// 수정필요 => 삭제하면서 밴도 해야함
export const deleteUser = async (userReportCode) => {
  return await instance.delete(
    "delUserReport?userReportCode=" + userReportCode
  );
};
export const banUser = async (userCode) => {
  return await instance.put("banUser?userCode=" + userCode);
};
// 글 신고하기
export const reportPost = async (data) => {
  return await instance.post("reportPost", data);
};
// 유저 신고하기
export const reportUser = async (data) => {
  return await instance.post("reportUser", data);
};
