import React, { useState, useEffect, useReducer } from "react";
import { Card, CardContent, Divider, Typography } from "@mui/material";
import Paging from "./Paging";
import {
  fetchReportUser,
  rUserState,
  reportReducer,
} from "../reducers/reportReducer";
import { delReportUser, banUserReport } from "../reducers/reportReducer";
import "../assets/css/reportUsers.css";

const ReportUser = () => {
  const [state, dispatch] = useReducer(reportReducer, rUserState);
  const { reportUsers } = state;

  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage] = useState(5);
  const [indexOfLastPost, setIndexOfLastPost] = useState(0);
  const [indexOfFirstPost, setIndexOfFirstPost] = useState(0);
  const [currentPosts, setCurrentPosts] = useState(0);

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
    delReportUser(dispatch, userReportCode);
    alert("관리자에 의해 밴되었습니다.");
  };

  return (
    <>
      <div>
        {currentPosts && reportUsers.length > 0 ? (
          currentPosts.map((user) => (
            <Card
              className="card"
              key={user.userReportCode}
              sx={{ minWidth: 275 }}
              variant="outlined"
            >
              <CardContent className="reportContainer">
                <Typography variant="h5" component="div" className="reportName">
                  신고번호: {user.userReportCode}
                </Typography>
                <Typography variant="body" className="reportInfo">
                  신고내용 : {user.userReportDesc}
                </Typography>
                <div>
                  <button
                    className="delete-report-user-btn"
                    type="button"
                    onClick={() => deleteUser(user.userReportCode)}
                  >
                    삭제
                  </button>
                  <button
                    className="ban-report-user-btn"
                    type="button"
                    onClick={() =>
                      banUser(user.user.userCode, user.userReportCode)
                    }
                  >
                    밴
                  </button>
                </div>
              </CardContent>
            </Card>
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
