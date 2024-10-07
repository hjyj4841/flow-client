import { useEffect, useReducer } from "react";
import styled from "styled-components";
import {
  fetchReportPost,
  initState as reportPostState,
  reportReducer,
} from "../reducers/reportReducer";

const StyledDiv = styled.div`
  h1 {
    font-size: 2rem;
  }
  h2 {
    font-size: 1.5rem;
  }
  .post-report-list {
    display: flex;
  }
  .post-report-code {
    margin: 10px;
    padding: 5px 5px;
  }
  .post-report-desc {
    margin: 10px;
    padding: 5px 5px;
  }
`;

const ReportList = () => {
  const [state, dispatch] = useReducer(reportReducer, reportPostState);
  const { reportPosts } = state;

  const deletePost = () => {};

  useEffect(() => {
    fetchReportPost(dispatch);
  }, []);

  return (
    <StyledDiv>
      <br />
      <h1>테스트중</h1>
      <main className="report">
        <div className="post-report">
          <h2>**신고글 리스트**</h2>
          <br />
        </div>
        {/* map 시작 지점 */}
        {reportPosts.map((post) => (
          <div className="post-report-list">
            <div className="post-report-code">{post.postReportCode}</div>
            <div className="post-report-desc">
              <h4>{post.postReportDesc}</h4>
            </div>
            {/* 버튼 클릭시 게시물 삭제 후 alert로 삭제알림, 화면에서도 삭제 */}
            <button type="button" onClick={deletePost}>
              삭제
            </button>
          </div>
        ))}
      </main>
    </StyledDiv>
  );
};

export default ReportList;
