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
import { useAuth } from "../../contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addComment as addCommentAPI, getAllComment } from "../../api/comment";
import { createComment, fetchComments } from "../../store/commentSlice";
import Comment from "../../components/Comment";

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
    background-color: #f05650;
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

  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");

  const [state, reportDispatch] = useReducer(reportReducer, reportState);
  const { report } = state;

  const [reportPost, setReportPost] = useState({
    reportDesc: "",
    post: {
      postCode: postCode,
    },
  });

  const [reportUser, setReportUser] = useState({
    reportDesc: "",
    user: {
      userCode: 0,
    },
  });

  let loginUserCode = 0;
  const [user, setUser] = useState({});
  const token = localStorage.getItem("token");
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
    };
    fetchPost();
  }, []);

  const updatePost = () => {
    navigate("/post/update/" + postCode);
  };

  const reportPostBtn = (data) => {
    addReportPost(reportDispatch, data);
  };

  const reportUserBtn = (data) => {
    addReportUser(reportDispatch, data);
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

  // 신고 버튼 눌렀을 때
  useEffect(() => {
    if (reportUser.user.userCode !== 0) {
      alert(reportUser.user.userCode);
      console.log(reportUser);
      setReportUser({
        ...reportUser,
        user: {
          userCode: post.user.userCode,
        },
      });
    }
  }, [reportUser.user]);

  const [newComment, setNewComment] = useState({
    commentCode: 0,
    commentDesc: "",
    postCode: postCode,
    user: user,
  });

  // 댓글 조회
  const { data: comments, isLoading: commentLoading } = useQuery({
    queryKey: ["comments", postCode],
    queryFn: () => getAllComment(postCode),
    refetchInterval: 1000,
  });

  // // 댓글 작성
  // const handleCommentSubmit = async () => {
  //   await addMutation.mutateAsync(newComment);
  //   setComment("");
  // };

  return (
    <>
      <FollowButton />
      <DetailDiv>
        <div className="report">
          <input
            className="report-post-desc"
            type="text"
            placeholder="설명"
            value={reportPost.reportDesc}
            onChange={(e) =>
              setReportPost({ ...reportPost, reportDesc: e.target.value })
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
          <input
            className="report-user-desc"
            type="text"
            placeholder="설명"
            onChange={(e) =>
              setReportUser({ ...reportUser, reportDesc: e.target.value })
            }
          />
          <button
            className="report-user-btn"
            onClick={() => {
              console.log(reportUser);
              // reportUserBtn(reportUser);
            }}
          >
            유저 신고버튼
          </button>
        </div>
      </DetailDiv>

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
                <span className="mr-4">❤️ {post.likes}</span>
                <span className="mr-4">
                  💬 {post.comments ? post.comments.length : 0}
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
                      <p className="text-sm">{comment.commentDesc}</p>
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
                  value={newComment.commentDesc}
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
