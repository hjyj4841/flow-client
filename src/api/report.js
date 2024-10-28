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
export const getReportComment = async () => {
  return await instance.get("showAllCommentReport");
};
// 댓글 신고하기
export const reportComment = async (data) => {
  return await instance.post("reportComment", data);
};
// 신고된 댓글 취소
export const cancelReportComment = async (commentReportCode) => {
  return await instance.delete(
    "cancelCommentReport?commentReportCode=" + commentReportCode
  );
};
// 신고된 글 취소
export const cancelReportPost = async (postReportCode) => {
  return await instance.delete(
    "cancelPostReport?postReportCode=" + postReportCode
  );
};
// 신고된 유저 취소
export const cancelReportUser = async (userReportCode) => {
  return await instance.delete(
    "cancelUserReport?userReportCode=" + userReportCode
  );
};
// 신고된 댓글 한개 삭제하기
export const deleteReportComment = async (commentReportCode) => {
  return await instance.delete(
    "delCommentReport?commentReportCode=" + commentReportCode
  );
};
