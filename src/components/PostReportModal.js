import React, { useState, useRef, useReducer, useEffect } from "react";
import { PiSirenLight } from "react-icons/pi";
import {
  addReportPost,
  initState as reportState,
  reportReducer,
} from "../reducers/reportReducer";
import { useParams } from "react-router-dom";
import "../assets/css/postReportModal.css";

const PostReportModal = () => {
  const [postReportOpen, setPostReportOpen] = useState(false);
  const { postCode } = useParams();
  const postReportRef = useRef();
  const [check, setCheck] = useState(false); // 게시글 작성자와 현재 접속중인 유저가 같은 유저인지 체크
  // 게시물
  const [post, setPost] = useState(null); // 해당 페이지에 해당하는 게시물 객체
  const [user, setUser] = useState({
    userCode: 0,
  });
  // 신고
  const [state, reportDispatch] = useReducer(reportReducer, reportState);
  // 게시물 신고 관련
  const [reportPost, setReportPost] = useState({
    postReportDesc: "",
    post: {
      postCode: postCode,
    },
  });
  // 유저 신고 관련
  const [reportUser, setReportUser] = useState({
    userReportDesc: "",
    user: {
      userCode: 0,
    },
  });

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

  // 게시물 신고
  const reportPostBtn = (data) => {
    addReportPost(reportDispatch, data);
    alert("신고가 완료되었습니다.");
    setReportPost({
      ...reportPost,
      postReportDesc: "",
    });
    setPostReportOpen(false);
  };

  return (
    <>
      <PiSirenLight
        className="postReport-button"
        onClick={() => setPostReportOpen((prev) => !prev)}
      />
      {postReportOpen && (
        <>
          <div
            style={{
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: "50",
              position: "absolute",
            }}
            onClick={() => setPostReportOpen(false)}
          />
          <div
            className="postReport-container"
            ref={postReportRef}
            onClick={(e) => {
              if (e.target === postReportRef.current) {
                setPostReportOpen(false);
              }
            }}
          >
            <div className="postReport-content">
              {!check ? (
                <span>
                  <input
                    className="report-post-desc"
                    type="text"
                    placeholder="신고 내용"
                    value={reportPost.postReportDesc}
                    onChange={(e) =>
                      setReportPost({
                        ...reportPost,
                        postReportDesc: e.target.value,
                      })
                    }
                  />
                  <button
                    onClick={() => {
                      reportPostBtn(reportPost);
                    }}
                  >
                    게시글 신고
                  </button>
                </span>
              ) : (
                <></>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PostReportModal;
