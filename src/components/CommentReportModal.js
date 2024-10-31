import { useState, useRef, useReducer } from "react";
import {
  initState as reportState,
  reportReducer,
  addReportComment,
} from "../reducers/reportReducer";
import "../assets/css/commentReportModal.css";

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

  // 댓글 신고
  const reportCommentBtn = (data) => {
    addReportComment(reportDispatch, data);
    alert("신고가 완료되었습니다");
    console.log(reportComment);
    setReportComment({
      ...reportComment,
      commentReportDesc: "",
    });
    setCommentReportOpen(false);
  };

  return (
    <>
      <button onClick={() => setCommentReportOpen((prev) => !prev)}>
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
          <div
            className="commentReport-container"
            ref={commentReportRef}
            onClick={(e) => {
              if (e.target === commentReportRef.current) {
                setCommentReportOpen(false);
              }
            }}
          >
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
          </div>
        </>
      )}
    </>
  );
};

export default CommentReportModal;
