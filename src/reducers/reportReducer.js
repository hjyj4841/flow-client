import { getReportPost } from "../api/report";

export const initState = {
  reportPosts: [],
};

// 액션함수
// 신고받은 글 가져오기
export const fetchReportPost = async (dispatch) => {
  const response = await getReportPost();
  dispatch({ type: "FETCH_REPORT_POST", payload: response.data });
};

export const fetchDeleteReportPost = async (dispatch) => {
  dispatch({ type: "FETCH_DELETE_REPORT_POST" });
};

export const reportReducer = (state, action) => {
  switch (action.type) {
    // 신고받은 글 가져오기
    case "FETCH_REPORT_POST":
      return { ...state, reportPosts: action.payload };
    case "FETCH_DELETE_REPORT_POST":
      return { ...state };
  }
};
