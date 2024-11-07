import React, { useState, useRef, useReducer, useEffect } from "react";
import {
  addReportUser,
  initState as reportState,
  reportReducer,
} from "../reducers/reportReducer";
import "../assets/css/userReportModal.scoped.scss";
import { useAuth } from "../contexts/AuthContext";
import { findUser, findUserByCode } from "../api/user";
import { detailPost } from "../api/post";
import { useParams } from "react-router-dom";

const UserReportModal = ({ closeUserModal }) => {
  const [userReportOpen, setUserReportOpen] = useState(false);
  const reportRef = useRef();
  const [state, reportDispatch] = useReducer(reportReducer, reportState);
  const [reportUser, setReportUser] = useState({
    userReportDesc: "",
    user: {
      userCode: 0,
    },
  });
  const { postCode } = useParams();
  const { token } = useAuth(); // 현재 브라우저 내에 저장되어 있는 토큰
  // 현재 접속중인 유저 정보
  // 게시물 작성자의 유저 코드
  const [followUser, setFollowUser] = useState({
    userCode: 0,
  });

  const reportUserBtn = (data) => {
    if (token != null) {
      addReportUser(reportDispatch, data);
      alert("신고가 완료되었습니다.");
      setReportUser({
        ...reportUser,
        userReportDesc: "",
      });
      setUserReportOpen(false);
      closeUserModal();
    } else if (token == null) {
      alert("유저 정보가 없습니다.");
      setUserReportOpen(false);
      closeUserModal();
    }
  };

  const [user, setUser] = useState({
    userCode: 0,
  });

  useEffect(() => {
    // (1-1) 로그인 되어있는 유저라면 user에 접속중인 유저 정보 담기
    if (token !== null) {
      getUserInfo();
    }
    // (1-2) 게시물 정보 불러오기
    fetchPost();
  }, []);

  const getUserInfo = async () => {
    setUser((await findUser(token)).data);
  };

  const [check, setCheck] = useState(false); // 게시글 작성자와 현재 접속중인 유저가 같은 유저인지 체크
  const [post, setPost] = useState(null); // 해당 페이지에 해당하는 게시물 객체
  // 3. 작성자 유저 코드가 변경되는 시점
  useEffect(() => {
    if (post?.userCode !== undefined) {
      // reportUser의 userCode를 작성자 코드로 대입
      setReportUser({
        ...reportUser,
        user: {
          userCode: post.userCode,
        },
      });
      setCheck(post.userCode === user.userCode);
    }
  }, [post?.userCode, user.userCode]);

  const fetchPost = async () => {
    const response = await detailPost(postCode);
    setPost(response.data);
    setFollowUser((await findUserByCode(response.data.userCode)).data);
  };

  return (
    <>
      {!check && (
        <button
          className="report-open-button"
          onClick={() => setUserReportOpen(true)}
        >
          유저 신고하기
        </button>
      )}

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
            {!check ? (
              <>
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
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UserReportModal;
