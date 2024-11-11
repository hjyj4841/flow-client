import { useState, useRef, useReducer, useEffect } from "react";
import {
  initState as reportState,
  reportReducer,
  addReportComment,
} from "../reducers/reportReducer";
import "../assets/css/commentReportModal.css";
import { useAuth } from "../contexts/AuthContext";
import { findUser } from "../api/user";

const CommentReportModal = ({ comment }) => {
  const [commentReportOpen, setCommentReportOpen] = useState();
  const commentReportRef = useRef();

  // 신고
  const [state, reportDispatch] = useReducer(reportReducer, reportState);

  // 댓글 신고 관련
  const [reportComment, setReportComment] = useState({
    commentReportDesc: "",
    comment: {
      commentCode: 0,
    },
  });

  const { token } = useAuth(); // 현재 브라우저 내에 저장되어 있는 토큰
  // 현재 접속중인 유저 정보
  const [user, setUser] = useState({
    userCode: 0,
  });
  const getUserInfo = async () => {
    setUser((await findUser(token)).data);
  };

  useEffect(() => {
    if (token !== null) {
      getUserInfo();
    }
  }, []);

  // 댓글 신고
  const reportCommentBtn = (data) => {
    if (token !== null) {
      addReportComment(reportDispatch, data);
      alert("신고가 완료되었습니다");
      console.log(reportComment);
      setReportComment({
        ...reportComment,
        commentReportDesc: "",
      });
      setCommentReportOpen(false);
    } else if (token == null) {
      alert("유저 정보가 없습니다.");
      setCommentReportOpen(false);
    }
  };

  return (
    <>
      <button
        className="cmmtReport-button"
        onClick={() => setCommentReportOpen((prev) => !prev)}
      >
        신고
      </button>
      {commentReportOpen && (
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
            onClick={() => setCommentReportOpen(false)}
          />
          <div className="reportComment-content">
            <input
              className="report-comment-desc ml-2"
              type="text"
              placeholder="신고 내용"
              value={reportComment.commentReportDesc}
              onChange={(e) =>
                setReportComment({
                  commentReportDesc: e.target.value,
                  comment: {
                    commentCode: comment.commentCode,
                  },
                })
              }
            />
            <button
              className="report-comment-btn"
              type="button"
              onClick={() => reportCommentBtn(reportComment)}
            >
              신고하기
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default CommentReportModal;
