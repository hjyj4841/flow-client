import React, { useState, useEffect, useReducer } from "react";
import { Card, CardContent, Divider, Typography } from "@mui/material";
import Paging from "./Paging";
import {
  fetchReportComment,
  rCommentState,
  reportReducer,
  cancelRComment,
  delReportComment,
} from "../reducers/reportReducer";
import { delReportUser, banUserReport } from "../reducers/reportReducer";
import "../assets/css/reportComment.css";
import { useNavigate } from "react-router-dom";

const ReportComment = () => {
  const [state, dispatch] = useReducer(reportReducer, rCommentState);
  const { reportComments } = state;

  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage] = useState(6);
  const [indexOfLastPost, setIndexOfLastPost] = useState(0);
  const [indexOfFirstPost, setIndexOfFirstPost] = useState(0);
  const [currentPosts, setCurrentPosts] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    fetchReportComment(dispatch);
    setCount(reportComments.length);
    setIndexOfLastPost(currentPage * postPerPage);
    setIndexOfFirstPost(indexOfLastPost - postPerPage);
    setCurrentPosts(reportComments.slice(indexOfFirstPost, indexOfLastPost));
  }, [
    currentPage,
    indexOfLastPost,
    indexOfFirstPost,
    postPerPage,
    reportComments,
  ]);

  const setPage = (error) => {
    setCurrentPage(error);
  };

  const cancleComment = (commentReportCode) => {
    // 취소 기능
    // cancelRComment(dispatch, commentReportCode);
    console.log(reportComments);
    alert("관리자에 의해 취소되었습니다.");
  };

  const banUser = (userCode, commentReportCode) => {
    // 밴 기능
    banUserReport(dispatch, userCode);
    cancelRComment(dispatch, commentReportCode);
    alert("관리자에 의해 밴되었습니다.");
  };

  const deleteComment = (commentReportCode) => {
    // 댓글삭제
    delReportComment(dispatch, commentReportCode);
    alert("관리자에 의해 삭제되었습니다.");
  };

  const moveBtn = (comment) => {
    if (comment.post.postType === "post") {
      navigate("/post/" + comment.post.postCode);
    } else if (comment.post.postType === "vote") {
      navigate("/votePost/" + comment.post.postCode);
    }
  };

  const myPage = (comment) => {
    navigate("/myPage/" + comment.comment.userCode.userCode);
  };

  return (
    <>
      <div style={{ marginBottom: 150 }}>
        {currentPosts && reportComments.length > 0 ? (
          currentPosts.map((comment) => (
            <div
              className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-4 w-full max-w-full"
              key={comment.commentReportCode}
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
                  src={comment.comment.userCode.userProfileUrl}
                  onClick={() => myPage(comment)}
                  style={{ cursor: "pointer" }}
                />
              </div>
              <div className="flex-grow">
                <div className="bg-gray-100 p-4 rounded-lg shadow-inner relative">
                  <p
                    className="text-gray-700"
                    onClick={() => moveBtn(comment.comment)}
                    style={{ cursor: "pointer" }}
                  >
                    신고내용 :
                    <span className="text-gray-500">
                      {" "}
                      {comment.commentReportDesc}
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
                  onClick={() => cancleComment(comment.commentReportCode)}
                >
                  취소
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => deleteComment(comment.commentReportCode)}
                >
                  삭제
                </button>
                <button
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                  onClick={() =>
                    banUser(
                      comment.comment.userCode.userCode,
                      comment.commentReportCode
                    )
                  }
                >
                  밴
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="report-post-list">
            <h1>신고된 댓글이 없습니다.</h1>
          </div>
        )}
        <Paging page={currentPage} count={count} setPage={setPage} />
      </div>
    </>
  );
};

export default ReportComment;
