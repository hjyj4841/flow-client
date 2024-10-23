import React, { useState, useEffect, useReducer } from "react";
import { Card, CardContent, Divider, Typography } from "@mui/material";
import Paging from "./Paging";
import {
  fetchReportComment,
  rCommentState,
  reportReducer,
} from "../reducers/reportReducer";

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
    reportComments,
    postPerPage,
  ]);

  const setPage = (error) => {
    setCurrentPage(error);
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
                    className="delete-report-post-btn"
                    type="button"
                    //   onClick={() => deletePost(post.postReportCode)}
                  >
                    삭제
                  </button>
                  <button
                    className="ban-report-user-btn"
                    type="button"
                    //   onClick={() =>
                    //     banUser(post.post.user.userCode, post.postReportCode)
                    //   }
                  >
                    밴
                  </button>
                </div>
              </CardContent>
            </Card>
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

export default ReportComment;
