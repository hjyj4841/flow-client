import axios from "axios";
import styled from "styled-components";
import React, { useEffect, useState, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GrNext, GrPrevious } from "react-icons/gr";
import { delPost } from "../../api/post";
import {
  addReportPost,
  addReportUser,
  initState as reportState,
  reportReducer,
} from "../../reducers/reportReducer";
import FollowButton from "../follow/FollowButton";
const DetailDiv = styled.div`
  .report {
    display: flex;
  }
  .report-post-btn {
    margin: 20px;
  }
  .report-user-btn {
    margin: 20px;
  }
  .report button {
    background-color: #F05650;
    padding: 10px;
    border-radius: 15px;
    margin: 10px 5px;
  }
  .update-post-btn {
    background-color: #ddd;
    padding: 10px;
    border-radius: 15px;
    margin: 10px 5px;
  }
`;
const Detail = () => {
  const { postCode } = useParams();
  const navigate = useNavigate();
  const [isToken, setIsToken] = useState(false);
  let isSelf = false;
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [state, reportDispatch] = useReducer(reportReducer, reportState);
  const { report } = state;
  const [reportPost, setReportPost] = useState({
    postReportDesc: "",
    post: {
      postCode: postCode,
    },
  });
  
  const [reportUser, setReportUser] = useState({
    userReportDesc: "",
    user: {
      userCode: 0,
    },
  });
  let postUserCode = 0;
  let loginUserCode = 0;
  const [check, setCheck] = useState(false);
  const [user, setUser] = useState({
    userCode : 0
  });
  const token = localStorage.getItem("token");
  useEffect(() => {
    if(token!==null) {
      setIsToken(true);
    }
  }, []);
  if (token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    const userData = JSON.parse(window.atob(base64));
    loginUserCode = userData.userCode;
  }
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  useEffect(() => {
    const fetchPost = async () => {
      const response = await axios.get(
        `http://localhost:8080/api/post/${postCode}`
      );
      setPost(response.data);
      setUser({
        userCode : response.data.userCode
      });
    };
    fetchPost();
  }, [isToken]);
  if(loginUserCode === user.userCode) {
    isSelf = true;
  }
  // 포스트 안에 있는 유저 코드
  useEffect(() => {
    if (post?.userCode !== undefined) {
      // alert(post?.userCode);
      setReportUser({
        ...reportUser,
        user: {
          userCode: post.userCode,
        },
      });
      postUserCode = post.userCode;
      setCheck(postUserCode === loginUserCode);
    }
  }, [post?.userCode]);
  const updatePost = () => {
    navigate("/post/update/" + postCode);
  };
  const reportPostBtn = (data) => {
    addReportPost(reportDispatch, data);
    alert("신고가 완료되었습니다.");
    setReportPost({
      ...reportPost,
      postReportDesc: "",
    });
  };
  const reportUserBtn = (data) => {
    addReportUser(reportDispatch, data);
    alert("신고가 완료되었습니다.");
    setReportUser({
      ...reportUser,
      userReportDesc: "",
    });
  };
  const handleCommentSubmit = async () => {
    await axios.post(`http://localhost:8080/api/post/${postCode}/comments`, {
      content: comment,
    });
    setComment("");
  };
  const deleteAPI = async () => {
    await delPost(postCode);
  };
  const deletePost = () => {
    deleteAPI();
    alert("삭제 완료");
    window.location.href = "/";
  };
  const handleNextImage = () => {
    if (post.imageUrls && post.imageUrls.length > 0) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % post.imageUrls.length
      );
    }
  };
  const handlePreviousImage = () => {
    if (post.imageUrls && post.imageUrls.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? post.imageUrls.length - 1 : prevIndex - 1
      );
    }
  };
  return (
    <>
      {/* <FollowButton user={user} /> */}
      {!isSelf ? <FollowButton user={user}/> : <></>}
      {check ? <>같은 경우</> : <>다른 경우</>}
      {Number.loginUserCode !== Number.postUserCode ? (
        <></>
      ) : (
        <DetailDiv>
          <div className="report">
            <div className="report-post">
              <input
                className="report-post-desc"
                type="text"
                placeholder="설명"
                value={reportPost.postReportDesc}
                onChange={(e) =>
                  setReportPost({
                    ...reportPost,
                    postReportDesc: e.target.value,
                  })
                }
              />
              <button
                className="report-post-btn"
                onClick={() => {
                  reportPostBtn(reportPost);
                }}
              >
                글 신고버튼
              </button>
            </div>
            <div className="report-user">
              <input
                className="report-user-desc"
                type="text"
                placeholder="설명"
                value={reportUser.userReportDesc}
                onChange={(e) =>
                  setReportUser({
                    ...reportUser,
                    userReportDesc: e.target.value,
                  })
                }
              />
              <button
                className="report-user-btn"
                onClick={() => {
                  reportUserBtn(reportUser);
                }}
              >
                유저 신고버튼
              </button>
            </div>
          </div>
        </DetailDiv>
      )}
      <div className="max-w-4xl mx-auto p-4">
        <main className="bg-white p-6 rounded-lg shadow-md">
          {loginUserCode === post?.userCode && (
            <>
              <button
                className="border border-gray-300 rounded bg-gray-200 hover:bg-gray-300 mt-2"
                onClick={updatePost}
              >
                수정
              </button>
              <button
                className="border border-gray-300 rounded bg-red-200 hover:bg-red-300 mt-2"
                onClick={deletePost}
              >
                삭제
              </button>
            </>
          )}
          {post ? (
            <>
              <div className="relative mb-4">
                {post.imageUrls && post.imageUrls.length > 0 ? (
                  <>
                    <button
                      onClick={handlePreviousImage}
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full shadow-lg"
                    >
                      <GrPrevious />
                    </button>
                    <img
                      src={post.imageUrls[currentImageIndex]}
                      alt={`Post Image ${currentImageIndex}`}
                      className="w-full rounded-lg"
                    />
                    <button
                      onClick={handleNextImage}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full shadow-lg"
                    >
                      <GrNext />
                    </button>
                  </>
                ) : (
                  <p>No images available</p>
                )}
              </div>
              <p className="mb-2">
                {post.postDesc}
                <span className="text-blue-500">
                  {post.tags && post.tags.length > 0
                    ? post.tags.map((tag, index) => (
                        <span key={index}>#{tag} </span>
                      ))
                    : null}
                </span>
              </p>
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <span className="mr-4">:하트2: {post.likes}</span>
                <span className="mr-4">
                  :말풍선: {post.comments ? post.comments.length : 0}
                </span>
              </div>
              <span className="font-bold">{post.userName}</span>
              <div className="border-t border-gray-300 pt-4">
                <h2 className="font-bold mb-2">
                  댓글 {post.comments ? post.comments.length : 0}개
                </h2>
                {post.comments && post.comments.length > 0 ? (
                  post.comments.map((comment, index) => (
                    <div key={index} className="mb-2">
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  ))
                ) : (
                  <p>댓글이 없습니다.</p>
                )}
              </div>
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="내용을 작성해주세요!"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                />
                <button
                  className="w-full bg-black text-white py-2 rounded"
                  onClick={handleCommentSubmit}
                >
                  작성 완료
                </button>
              </div>
            </>
          ) : null}
        </main>
      </div>
    </>
  );
};
export default Detail;