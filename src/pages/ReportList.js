import styled from "styled-components";
import ReportPost from "../components/ReportPost";
import ReportUser from "../components/ReportUser";
import { useState } from "react";
import ReportComment from "../components/ReportComment";

const ReportBtnDiv = styled.div`
  .report-type-button {
    display: flex;
  }
  .report-type-post {
    margin: 10px;
  }
  .report-type-comment {
    margin: 10px;
  }
  .report-type-user {
    margin: 10px;
  }
`;

const ReportList = () => {
  const [type, setType] = useState("");

  const showRpost = () => {
    setType("ReportPost");
  };
  const showRcomment = () => {
    setType("ReportComment");
  };
  const showRuser = () => {
    setType("ReportUser");
  };

  return (
    <>
      <ReportBtnDiv className="report-type-button">
        <div className="report-type-button">
          <button className="report-type-post" onClick={showRpost}>
            글
          </button>
          <button className="report-type-comment" onClick={showRcomment}>
            댓글
          </button>
          <button className="report-type-user" onClick={showRuser}>
            유저
          </button>
        </div>
      </ReportBtnDiv>
      {type == "ReportPost" ? (
        <ReportPost />
      ) : type == "ReportUser" ? (
        <ReportUser />
      ) : type == "ReportComment" ? (
        <ReportComment />
      ) : (
        <></>
      )}
    </>
  );
};

export default ReportList;
