import {
  getReportPost,
  deletePost,
  getReportUser,
  deleteUser,
  banUser,
  reportPost,
  reportUser,
  getReportComment,
  cancelReportComment,
  reportComment,
} from "../api/report";
export const initState = {
  reportPosts: [],
};
export const rUserState = {
  reportUsers: [],
};
export const rCommentState = {
  reportComments: [],
};
// 액션함수
// 신고받은 글 가져오기
export const fetchReportPost = async (dispatch) => {
  const response = await getReportPost();
  dispatch({ type: "FETCH_REPORT_POST", payload: response.data });
};
// 신고글 지우기
export const fetchDeleteReportPost = async (dispatch, postReportCode) => {
  const response = await deletePost(postReportCode);
  dispatch({ type: "FETCH_DELETE_REPORT_POST" });
};
// 유저 신고 가져오기
export const fetchReportUser = async (dispatch) => {
  const response = await getReportUser();
  dispatch({ type: "FETCH_REPORT_USER", payload: response.data });
};
// 유저 신고 삭제하기
export const delReportUser = async (dispatch, userReportCode) => {
  await deleteUser(userReportCode);
  dispatch({ type: "DELETE_REPORT_USER" });
};
// 유저 밴하기
export const banUserReport = async (dispatch, userCode) => {
  await banUser(userCode);
  dispatch({ type: "BAN_USER_REPORT" });
};
export const addReportPost = async (dispatch, data) => {
  const response = await reportPost(data);
  dispatch({ type: "REPORT_POST" });
};
export const addReportUser = async (dispatch, data) => {
  const response = await reportUser(data);
  dispatch({ type: "REPORT_USER" });
};
export const fetchReportComment = async (dispatch) => {
  const response = await getReportComment();
  dispatch({ type: "FETCH_REPORT_COMMENT", payload: response.data });
};
export const cancelRComment = async (dispatch, commentReportCode) => {
  await cancelReportComment(commentReportCode);
  dispatch({ type: "CANCEL_REPORT_COMMENT" });
};
export const addReportComment = async (dispatch, data) => {
  const response = await reportComment(data);
  dispatch({ type: "REPORT_COMMENT" });
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
    case "FETCH_REPORT_COMMENT":
      return { ...state, reportComments: action.payload };
    case "CANCEL_REPORT_COMMENT":
      return state;
    case "REPORT_COMMENT":
      return state;
    default:
      return state;
  }
};
