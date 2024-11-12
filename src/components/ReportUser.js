import React, { useState, useEffect, useReducer } from "react";
import { Card, CardContent, Divider, Typography } from "@mui/material";
import Paging from "./Paging";
import {
  cancelRUser,
  fetchReportUser,
  rUserState,
  reportReducer,
} from "../reducers/reportReducer";
import { delReportUser, banUserReport } from "../reducers/reportReducer";
import "../assets/css/reportUsers.css";
import { useNavigate } from "react-router-dom";

const ReportUser = () => {
  const [state, dispatch] = useReducer(reportReducer, rUserState);
  const { reportUsers } = state;

  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage] = useState(6);
  const [indexOfLastPost, setIndexOfLastPost] = useState(0);
  const [indexOfFirstPost, setIndexOfFirstPost] = useState(0);
  const [currentPosts, setCurrentPosts] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    fetchReportUser(dispatch);
    setCount(reportUsers.length);
    setIndexOfLastPost(currentPage * postPerPage);
    setIndexOfFirstPost(indexOfLastPost - postPerPage);
    setCurrentPosts(reportUsers.slice(indexOfFirstPost, indexOfLastPost));
  }, [
    currentPage,
    indexOfLastPost,
    indexOfFirstPost,
    reportUsers,
    postPerPage,
  ]);

  const setPage = (error) => {
    setCurrentPage(error);
  };

  //   수정필요 삭제하면서 밴도 해야함
  const deleteUser = (userReportCode) => {
    // 삭제 기능
    delReportUser(dispatch, userReportCode);
    alert("관리자에 의해 삭제되었습니다.");
  };

  const banUser = (userCode, userReportCode) => {
    // 밴 기능
    banUserReport(dispatch, userCode);
    cancelRUser(dispatch, userReportCode);
    alert("관리자에 의해 밴되었습니다.");
  };

  const cancleUser = (userReportCode) => {
    cancelRUser(dispatch, userReportCode);
    alert("관리자에 의해 취소되었습니다.");
  };

  const moveBtn = (userCode) => {
    navigate("/mypage/" + userCode);
  };

  return (
    <>
      <div>
        {currentPosts && reportUsers.length > 0 ? (
          currentPosts.map((user) => (
            <div
              className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-4 w-full max-w-full"
              key={user.userReportCode}
            >
              <div
                className="w-16 h-16 bg-gray-300 rounded-full flex-shrink-0"
                style={{
                  overflow: "hidden",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={user.user.userProfileUrl}
                  onClick={() => moveBtn(user.user.userCode)}
                  style={{ cursor: "pointer" }}
                />
              </div>
              <div className="flex-grow">
                <div className="bg-gray-100 p-4 rounded-lg shadow-inner relative">
                  <p className="text-gray-700">
                    신고내용 :
                    <span className="text-gray-500">
                      {" "}
                      {user.userReportDesc}
                    </span>
                  </p>
                  <div className="absolute left-4 bottom-0 transform translate-y-1/2">
                    <svg
                      className="w-6 h-6 text-gray-100"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 22l-8-8h6V2h4v12h6z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => cancleUser(user.userReportCode)}
                >
                  취소
                </button>
                <button
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                  onClick={() =>
                    banUser(user.user.userCode, user.userReportCode)
                  }
                >
                  밴
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="report-user-list">
            <h1>신고된 유저가 없습니다.</h1>
          </div>
        )}
        <Paging page={currentPage} count={count} setPage={setPage} />
      </div>
    </>
  );
};

export default ReportUser;
