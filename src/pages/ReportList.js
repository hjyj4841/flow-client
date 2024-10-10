// import { useEffect, useReducer } from "react";
// import styled from "styled-components";
// import {
//   fetchReportPost,
//   initState as reportPostState,
//   reportReducer,
// } from "../reducers/reportReducer";
// import { fetchDeleteReportPost } from "../reducers/reportReducer";

// const StyledDiv = styled.div`
//   h1 {
//     font-size: 2rem;
//   }
//   h2 {
//     font-size: 1.5rem;
//   }
//   .post-report-list {
//     display: flex;
//   }
//   .post-report-code {
//     margin: 10px;
//     padding: 5px 5px;
//   }
//   .post-report-desc {
//     margin: 10px;
//     padding: 5px 5px;
//   }
//   button {
//     border-color: red;
//     border-radius: 10%;
//     border-width: 1px;
//   }
// `;

// const ReportList = () => {
//   const [state, dispatch] = useReducer(reportReducer, reportPostState);
//   const { reportPosts } = state;

//   const deletePost = (postReportCode) => {
//     // 삭제 기능
//     fetchDeleteReportPost(dispatch, postReportCode);
//     alert("관리자에 의해 삭제되었습니다.");
//   };

//   useEffect(() => {
//     fetchReportPost(dispatch);
//   }, []);

//   return (
//     <StyledDiv>
//       <br />
//       <h1>테스트중</h1>
//       <main className="report">
//         <div className="post-report">
//           <h2>**신고글 리스트**</h2>
//           <br />
//         </div>
//         {/* map 시작 지점 */}
//         {reportPosts.map((post) => (
//           <div className="post-report-list" key={post.postReportCode}>
//             <div className="post-report-code">{post.postReportCode}</div>
//             <div className="post-report-desc">
//               <h4>{post.postReportDesc}</h4>
//             </div>
//             {/* 버튼 클릭시 게시물 삭제 후 alert로 삭제알림, 화면에서도 삭제 */}
//             <button
//               type="button"
//               onClick={() => deletePost(post.postReportCode)}
//             >
//               삭제
//             </button>
//           </div>
//         ))}
//       </main>
//     </StyledDiv>
//   );
// };

// export default ReportList;

import React, { useState, useEffect, useReducer } from "react";
// import ProgressBar from "../components/ProgressBar";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  Grid,
} from "@mui/material";
import Paging from "../components/Paging";
import {
  fetchReportPost,
  initState as reportPostState,
  reportReducer,
} from "../reducers/reportReducer";
import { fetchDeleteReportPost } from "../reducers/reportReducer";

const ReportList = () => {
  const [state, dispatch] = useReducer(reportReducer, reportPostState);
  const { reportPosts } = state;

  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage] = useState(5);
  const [indexOfLastPost, setIndexOfLastPost] = useState(0);
  const [indexOfFirstPost, setIndexOfFirstPost] = useState(0);
  const [currentPosts, setCurrentPosts] = useState(0);

  const deletePost = (postReportCode) => {
    // 삭제 기능
    fetchDeleteReportPost(dispatch, postReportCode);
    alert("관리자에 의해 삭제되었습니다.");
  };

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

  return (
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
        <div> No posts.</div>
      )}

      <Paging page={currentPage} count={count} setPage={setPage} />
    </div>
  );
};

export default ReportList;
