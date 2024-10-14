import {
  getReportPost,
  deletePost,
  getReportUser,
  deleteUser,
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

export const fetchDeleteReportPost = async (dispatch, postReportCode) => {
  const response = await deletePost(postReportCode);
  dispatch({ type: "FETCH_DELETE_REPORT_POST" });
};

export const fetchReportUser = async (dispatch) => {
  const response = await getReportUser();
  dispatch({ type: "FETCH_REPORT_USER", payload: response.data });
};

// 수정필요 => 삭제하면서 밴도 해야함
export const delReportUser = async (dispatch, userReportCode) => {
  await deleteUser(userReportCode);
  dispatch({ type: "DELETE_REPORT_USER" });
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
    default:
      return state;
  }
};
