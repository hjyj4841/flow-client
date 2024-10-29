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

const ReportComment = () => {
  const [state, dispatch] = useReducer(reportReducer, rCommentState);
  const { reportComments } = state;

  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage] = useState(5);
  const [indexOfLastPost, setIndexOfLastPost] = useState(0);
  const [indexOfFirstPost, setIndexOfFirstPost] = useState(0);
  const [currentPosts, setCurrentPosts] = useState(0);

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
    cancelRComment(dispatch, commentReportCode);
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

  return (
    <>
      <div style={{ marginBottom: 150 }}>
        {currentPosts && reportComments.length > 0 ? (
          currentPosts.map((comment) => (
            <Card
              className="card"
              key={comment.commentReportCode}
              sx={{ minWidth: 275 }}
              variant="outlined"
            >
              <CardContent className="reportContainer">
                <Typography variant="h5" component="div" className="reportName">
                  신고번호: {comment.commentReportCode}
                </Typography>
                <Typography variant="body" className="reportInfo">
                  신고내용 : {comment.commentReportDesc}
                </Typography>

                <div className="buttonContainer">
                  <button
                    className="cancel-report-comment-btn"
                    type="button"
                    onClick={() => cancleComment(comment.commentReportCode)}
                  >
                    취소
                  </button>
                  <button
                    className="delete-report-comment-btn"
                    type="button"
                    onClick={() => deleteComment(comment.commentReportCode)}
                  >
                    삭제
                  </button>
                  <button
                    className="ban-report-comment-user-btn"
                    type="button"
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
              </CardContent>
            </Card>
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
