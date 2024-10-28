import React, { useState, useRef, useReducer } from "react";
import {
  addReportUser,
  initState as reportState,
  reportReducer,
} from "../reducers/reportReducer";
import "../assets/css/userReportModal.scoped.scss";

const UserReportModal = () => {
  const [userReportOpen, setUserReportOpen] = useState(false);
  const reportRef = useRef();
  const [state, reportDispatch] = useReducer(reportReducer, reportState);
  const [reportUser, setReportUser] = useState({
    userReportDesc: "",
    user: {
      userCode: 0,
    },
  });
  const reportUserBtn = (data) => {
    addReportUser(reportDispatch, data);
    alert("신고가 완료되었습니다.");
    setReportUser({
      ...reportUser,
      userReportDesc: "",
    });
  };

  return (
    <>
      <button
        className="report-open-button"
        onClick={() => setUserReportOpen(true)}
      >
        유저 신고하기
      </button>
      {userReportOpen && (
        <div
          className={"user-Report-container"}
          ref={reportRef}
          onClick={(e) => {
            if (e.target === reportRef.current) {
              setUserReportOpen(false);
            }
          }}
        >
          <div className="Report-content">
            <input
              className="report-user"
              type="text"
              placeholder="신고 내용"
              value={reportUser.userReportDesc}
              onChange={(e) =>
                setReportUser({
                  ...reportUser,
                  userReportDesc: e.target.value,
                })
              }
            />
            <button
              className="report-user-button"
              style={{ margin: "5px", width: "80px" }}
              onClick={() => {
                reportUserBtn(reportUser);
              }}
            >
              유저 신고
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserReportModal;
