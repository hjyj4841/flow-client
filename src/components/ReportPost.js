import React, { useState, useEffect, useReducer } from "react";
import { Card, CardContent, Divider, Typography } from "@mui/material";
import Paging from "./Paging";
import {
  fetchReportPost,
  initState as reportPostState,
  reportReducer,
} from "../reducers/reportReducer";
import { fetchDeleteReportPost } from "../reducers/reportReducer";

const ReportPost = () => {
  const [state, dispatch] = useReducer(reportReducer, reportPostState);
  const { reportPosts } = state;

  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage] = useState(5);
  const [indexOfLastPost, setIndexOfLastPost] = useState(0);
  const [indexOfFirstPost, setIndexOfFirstPost] = useState(0);
  const [currentPosts, setCurrentPosts] = useState(0);

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

  return (
    <>
      <div style={{ marginBottom: 150 }}>
        {currentPosts && reportPosts.length > 0 ? (
          currentPosts.map((post) => (
            <Card
              key={post.postReportCode}
              sx={{ minWidth: 275 }}
              variant="outlined"
            >
              <CardContent>
                <Typography variant="h5" component="div">
                  신고번호: {post.postReportCode}
                </Typography>
                <Typography variant="body2">
                  신고내용 : {post.postReportDesc}
                  <br />
                </Typography>
                <br />
                <button
                  className="delete-report-post-btn"
                  type="button"
                  onClick={() => deletePost(post.postReportCode)}
                >
                  삭제
                </button>
              </CardContent>
              <Divider />
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

export default ReportPost;
