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
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { BsCollection, BsCollectionFill } from "react-icons/bs";
import { useAuth } from "../../contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addComment as addCommentAPI, getAllComment } from "../../api/comment";
import { createComment, fetchComments } from "../../store/commentSlice";
import Comment from "../../components/Comment";
import { useDispatch, useSelector } from "react-redux";
import { followStatus } from "../../store/followSlice";

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
  const [isToken, setIsToken] = useState(false);
  let isSelf = false;
  const [post, setPost] = useState(null);
  const [comment, setComment, commentDesc] = useState("");
  const [isComment, setIsComment] = useState(false);
  const queryClient = useQueryClient();
  const [state, reportDispatch] = useReducer(reportReducer, reportState);
  const dispatch = useDispatch();
  const followBool = useSelector((state) => state.follow.followBool);
  const [followCheck, setFollowCheck] = useState(null);
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

  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [likeRendering, setLikeRendering] = useState([]);
  const [saveRendering, setSaveRendering] = useState([]);
  const [userCode, setUserCode] = useState(0);
  let postUserCode = 0;
  let loginUserCode = 0;
  const [check, setCheck] = useState(false);
  const [user, setUser] = useState({
    userCode: 0,
  });
  const [followUser, setFollowUser] = useState({
    userCode: 0,
  });
  const token = localStorage.getItem("token");
  /*
  if (token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    const userData = JSON.parse(window.atob(base64));
    setUser(userData);
    loginUserCode = userData.userCode;
  }
*/
  useEffect(() => {
    if (token !== null) {
      setIsToken(true);
    }
    fetchPost();
  }, [postCode]);

  useEffect(() => {
    if (token) {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace("-", "+").replace("_", "/");
      const userData = JSON.parse(window.atob(base64));
      setUser(userData);
      loginUserCode = userData.userCode;
      setUserCode(userData.userCode);
      fetchLikedPosts();
      fetchSavedPosts();
    }
  }, [post, token, likeRendering, saveRendering]); // 의존성 배열 추가

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fetchPost = async () => {
    const response = await axios.get(
      `http://localhost:8080/api/post/${postCode}`
    );
    setPost(response.data);
  };

  useEffect(() => {
    const fetchPost = async () => {
      const response = await axios.get(
        `http://localhost:8080/api/post/${postCode}`
      );
      setPost(response.data);
      setFollowUser({
        userCode: response.data.userCode,
      });
    };
    fetchPost();
  }, [token]);
  // 팔로우 여부 확인 코드
  useEffect(() => {
    if (userCode !== 0 && followUser.userCode !== 0) {
      dispatch(
        followStatus({
          followingUserCode: userCode,
          followerUserCode: followUser.userCode, // userCode가 있는 경우에만 실행
        })
      );
      setFollowCheck(followBool);
    }
  }, [userCode, followUser.userCode, followBool]);

  // 자기 자신의 글을 볼때 팔로우 버튼 생성 방지
  if (loginUserCode === user.userCode) {
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
  // const handleCommentSubmit = async () => {
  //   await axios.post(`http://localhost:8080/api/post/${postCode}/comments`, {
  //     content: comment,
  //   });
  //   setComment("");
  // };
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

  // Fetch liked posts
  const fetchLikedPosts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/likes/${loginUserCode}/likes`
      );
      const likedPosts = response.data.postInfoList.map((post) => ({
        ...post,
        isLiked: true,
      }));
      setLikedPosts(likedPosts || []);
    } catch (error) {
      console.error("Error fetching liked posts", error);
    }
  };

  // Fetch saved posts
  const fetchSavedPosts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/collection/${loginUserCode}/collections`
      );
      const savedPosts = response.data.postInfoList.map((post) => ({
        ...post,
        isSaved: true,
      }));
      setSavedPosts(savedPosts || []);
    } catch (error) {
      console.error("Error fetching saved posts", error);
    }
  };

  // Toggle like
  const handleLikeToggle = async (postCode) => {
    try {
      await axios.post(
        `http://localhost:8080/api/likes/toggle/${postCode}`,
        user
      );
      setLikedPosts((prevLikedPosts) =>
        prevLikedPosts.map((post) =>
          post.post.postCode === postCode
            ? { ...post, isLiked: !post.isLiked }
            : post
        )
      );
      fetchLikedPosts();
      fetchPost();
      setLikeRendering(likeRendering + 1);
    } catch (error) {
      console.error("Error toggling like", error);
    }
  };

  // Toggle save
  const handleSaveToggle = async (postCode) => {
    try {
      await axios.post(
        `http://localhost:8080/api/collection/toggle/${postCode}`,
        user
      );
      fetchSavedPosts();
      fetchPost();
      setSaveRendering(saveRendering + 1);
    } catch (error) {
      console.error("Error toggling save", error);
    }
  };

  const [newComment, setNewComment] = useState({
    commentCode: 0,
    commentDesc: "",
    postCode: postCode,
    user: user,
  });

  // 댓글 조회
  const { data: comments, isLoading, error } = useQuery({
    queryKey: ["comments", postCode],
    queryFn: () => getAllComment(postCode),
  });

  // 댓글 작성
  const addMutation = useMutation({
    mutationFn: addCommentAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postCode] });
    },
  });

  const handleCommentSubmit = async () => {
    await addMutation.mutationAsync(newComment);
    setNewComment({ ...newComment, commentDesc: "" });
  };

  if (isLoading) return <>로딩중...</>;
  if (error) return <>에러 발생...</>;

  return (
    <>
      {!isSelf ? <FollowButton user={followUser} bool={followBool} /> : <></>}
      {check ? (
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
          loginuser : {loginUserCode} / user.userCode : {user.userCode} /
          postUser : {post?.userCode}
          {user.userCode === post?.userCode && (
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
                <span className="flex items-center space-x-2 mr-4">
                  {" "}
                  {likedPosts.find(
                    (likedPost) => likedPost.post.postCode === post.postCode
                  ) ? (
                    <>
                      <FaHeart
                        onClick={() => handleLikeToggle(post.postCode)}
                        style={{ color: "red" }}
                        className="mx-2"
                      />
                      <p>{post.likeCount}</p>
                    </>
                  ) : (
                    <>
                      <FaRegHeart
                        onClick={() => handleLikeToggle(post.postCode)}
                        className="mx-2"
                      />
                      <p>{post.likeCount}</p>
                    </>
                  )}
                  {savedPosts.some(
                    (savedPost) => savedPost.post.postCode === post.postCode
                  ) ? (
                    <>
                      <BsCollectionFill
                        onClick={() => handleSaveToggle(post.postCode)}
                        style={{ color: "black" }}
                        className="mx-2"
                      />
                      <p>{post.collectionCount}</p>
                    </>
                  ) : (
                    <>
                      <BsCollection
                        onClick={() => handleSaveToggle(post.postCode)}
                        className="mx-2"
                      />
                      <p>{post.collectionCount}</p>
                    </>
                  )}
                </span>
                <span className="mr-4">
                  :말풍선: {post.comments ? post.comments.length : 0}
                </span>
              </div>
              <span className="font-bold">{post.userName}</span>
              <div className="border-t border-gray-300 pt-4">
                <h2 className="font-bold mb-2">
                  댓글 {post.comments ? post.comments.length : 0}개
                </h2>
                {isLoading ? (
                  <p>로딩 중...</p>
                ) : error ? (
                  <p>댓글을 불러오는 데 문제가 발생했습니다.</p>
                ) : comments.data && comments.data.length > 0 ? (
                  comments.data.map((comment, index) => (
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
                  value={comment.commentDesc}
                  onChange={(e) =>
                    setComment({ ...newComment, commentDesc: e.target.value })
                  }
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
