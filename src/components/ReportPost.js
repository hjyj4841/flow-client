import React, { useState, useEffect, useReducer } from "react";
import { Card, CardContent, Divider, Typography } from "@mui/material";
import Paging from "./Paging";
import {
  cancelRPost,
  fetchReportPost,
  initState as reportPostState,
  reportReducer,
} from "../reducers/reportReducer";
import {
  fetchDeleteReportPost,
  banUserReport,
} from "../reducers/reportReducer";
import "../assets/css/reportPost.css";
import { useNavigate } from "react-router-dom";

const ReportPost = () => {
  const [state, dispatch] = useReducer(reportReducer, reportPostState);
  const { reportPosts } = state;

  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage] = useState(6);
  const [indexOfLastPost, setIndexOfLastPost] = useState(0);
  const [indexOfFirstPost, setIndexOfFirstPost] = useState(0);
  const [currentPosts, setCurrentPosts] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    fetchReportPost(dispatch);
    setCount(reportPosts.length);
    setIndexOfLastPost(currentPage * postPerPage);
    setIndexOfFirstPost(indexOfLastPost - postPerPage);
    setCurrentPosts(reportPosts.slice(indexOfFirstPost, indexOfLastPost));
  }, [
    currentPage,
    indexOfLastPost,
    indexOfFirstPost,
    reportPosts,
    postPerPage,
  ]);

  const setPage = (error) => {
    setCurrentPage(error);
  };

  const deletePost = (postReportCode) => {
    // 삭제 기능
    fetchDeleteReportPost(dispatch, postReportCode);
    alert("관리자에 의해 삭제되었습니다.");
  };

  const banUser = (userCode, postReportCode) => {
    // 밴 기능
    banUserReport(dispatch, userCode);
    cancelRPost(dispatch, postReportCode);
    alert("관리자에 의해 밴되었습니다.");
  };

  const cancelPost = (postReportCode) => {
    // 취소 기능
    // cancelRPost(dispatch, postReportCode);
    console.log(reportPosts);
    alert("관리자에 의해 취소되었습니다.");
  };

  const moveBtn = (post) => {
    if (post.postType === "post") {
      navigate("/post/" + post.postCode);
    } else if (post.postType === "vote") {
      navigate("/votePost/" + post.postCode);
    }
  };

  const myPage = (post) => {
    navigate("/myPage/" + post.post.user.userCode);
  };

  return (
    <>
      <div className="fullContainer">
        {currentPosts && reportPosts.length > 0 ? (
          currentPosts.map((post) => (
            <div
              className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-4 w-full max-w-full"
              key={post.postReportCode}
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
                  src={post.post.user.userProfileUrl}
                  onClick={() => myPage(post)}
                  style={{ cursor: "pointer" }}
                />
              </div>
              <div className="flex-grow">
                <div className="bg-gray-100 p-4 rounded-lg shadow-inner relative">
                  <p
                    className="text-gray-700"
                    onClick={() => moveBtn(post.post)}
                    style={{ cursor: "pointer" }}
                  >
                    신고내용 :
                    <span className="text-gray-500">
                      {" "}
                      {post.postReportDesc}
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
                  onClick={() => cancelPost(post.postReportCode)}
                >
                  취소
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => deletePost(post.postReportCode)}
                >
                  삭제
                </button>
                <button
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                  onClick={() =>
                    banUser(post.post.user.userCode, post.postReportCode)
                  }
                >
                  밴
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="report-post-list">
            <h1>신고된 글이 없습니다.</h1>
          </div>
        )}
        <Paging page={currentPage} count={count} setPage={setPage} />
      </div>
    </>
  );
};

export default ReportPost;
