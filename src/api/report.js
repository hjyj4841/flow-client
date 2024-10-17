import {
  getReportPost,
  deletePost,
  getReportUser,
  deleteUser,
  banUser,
  reportPost,
  reportUser,
} from "../api/report";
export const initState = {
  reportPosts: [],
};
export const rUserState = {
  reportUsers: [],
};
// 액션함수
// 신고받은 글 가져오기
export const fetchReportPost = async (dispatch) => {
  const response = await getReportPost();
  dispatch({ type: "FETCH_REPORT_POST", payload: response.data });
};
// 신고글 지우기
export const fetchDeleteReportPost = async (dispatch, postReportCode) => {
  await deletePost(postReportCode);
  dispatch({ type: "FETCH_DELETE_REPORT_POST" });
};

export const getReportUser = async () => {
  return await instance.get("showAllUserReport");
};
// 유저 밴하기
export const banUserReport = async (dispatch, userCode) => {
  await banUser(userCode);
  dispatch({ type: "BAN_USER_REPORT" });
};
export const addReportPost = async (dispatch, data) => {
  await reportPost(data);
  dispatch({ type: "REPORT_POST" });
};
export const addReportUser = async (dispatch, data) => {
  await reportUser(data);
  dispatch({ type: "REPORT_USER" });
};
export const reportReducer = (state, action) => {
  switch (action.type) {
    // 신고받은 글 가져오기
    case "FETCH_REPORT_POST":
      return { ...state, reportPosts: action.payload };
    case "FETCH_DELETE_REPORT_POST":
      return state;
    case "FETCH_REPORT_USER":
      return { ...state, reportUsers: action.payload };
    case "DELETE_REPORT_USER":
      return state;
    case "BAN_USER_REPORT":
      return state;
    case "REPORT_POST":
      return state;
    case "REPORT_USER":
      return state;
    default:
      return state;
  }
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
