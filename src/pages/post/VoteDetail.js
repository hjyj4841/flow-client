import React, { useEffect, useState, useReducer, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import {
  addReportPost,
  addReportUser,
  initState as reportState,
  reportReducer,
} from "../../reducers/reportReducer";
import { useDispatch, useSelector } from "react-redux";
import { followStatus } from "../../store/followSlice";
import { useAuth } from "../../contexts/AuthContext";
import { delPost, detailVote } from "../../api/post";
import { findUser, findUserByCode } from "../../api/user";
import { addComment as addCommentAPI, getAllComment } from "../../api/comment";
import FollowButton from "../follow/FollowButton";

const VoteDetail = () => {
  const navigate = useNavigate();
  const { postCode } = useParams();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  // 토큰 / 유저
  const { token } = useAuth(); // 현재 브라우저 내에 저장되어 있는 토큰
  // 현재 접속중인 유저 정보
  const [user, setUser] = useState({
    userCode: 0,
  });
  // 게시물 작성자의 유저 코드
  const [followUser, setFollowUser] = useState({
    userCode: 0,
  });
  const [check, setCheck] = useState(false); // 게시글 작성자와 현재 접속중인 유저가 같은 유저인지 체크
  // 게시물
  const [post, setPost] = useState(null); // 해당 페이지에 해당하는 게시물 객체
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // 게시물 이미지 변경(다음/이전) 관련
  const [imageLoad, setImageLoad] = useState([]); // 이미지 배열 객체
  // 팔로우
  const followBool = useSelector((state) => state.follow.followBool); // 팔로우 상태
  const [followCheck, setFollowCheck] = useState(null);
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
  // 댓글 작성 관련
  const [newComment, setNewComment] = useState({
    commentCode: null,
    commentDesc: "",
    postCode: postCode,
    userCode: 0,
  });

  // 1. 첫 페이지가 로드되는 시점
  useEffect(() => {
    // (1-1) 로그인 되어있는 유저라면 user에 접속중인 유저 정보 담기
    if (token !== null) {
      getUserInfo();
    }
    // (1-2) 게시물 정보 불러오기
    fetchPost();
  }, []);

  // 1-1. 유저정보 가져오기
  const getUserInfo = async () => {
    setUser((await findUser(token)).data);
  };
  // 1-2. 페이지에 해당하는 post 객체를 가져옴
  const fetchPost = async () => {
    const response = await detailVote(postCode);
    setPost(response.data);
    setFollowUser((await findUserByCode(response.data.userCode)).data);
  };

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
  }, [post?.userCode]);
  // 유저가 작성자를 팔로우 했는지 조회
  const dispatchFollowStatus = useCallback(() => {
    if (user.userCode !== 0 && followUser.userCode !== 0) {
      dispatch(
        followStatus({
          followingUserCode: user.userCode,
          followerUserCode: followUser.userCode,
        })
      );
    }
  }, [dispatch, user.userCode, followUser.userCode]);

  useEffect(() => {
    dispatchFollowStatus();
  }, [dispatchFollowStatus]);

  useEffect(() => {
    if (followBool !== undefined && followBool !== followCheck)
      setFollowCheck(followBool);
  }, [followBool]);
  // 게시물 수정 페이지로 이동
  const updatePost = () => {
    navigate("/post/update/" + postCode);
  };
  // 게시물 신고
  const reportPostBtn = (data) => {
    addReportPost(reportDispatch, data);
    alert("신고가 완료되었습니다.");
    setReportPost({
      ...reportPost,
      postReportDesc: "",
    });
  };
  // 유저 신고
  const reportUserBtn = (data) => {
    addReportUser(reportDispatch, data);
    alert("신고가 완료되었습니다.");
    setReportUser({
      ...reportUser,
      userReportDesc: "",
    });
  };
  // 게시물 삭제
  const deletePost = () => {
    deleteAPI();
    alert("삭제 완료");
    window.location.href = "/";
  };
  const deleteAPI = async () => {
    await delPost(postCode);
  };

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
  const addComment = () => {
    addMutation.mutate(newComment);
    setNewComment({ ...newComment, commentDesc: "" });
  };
  // 작성자의 유저정보 페이지로 이동
  const goUserInfo = () => {
    navigate(`/mypage/${post.userCode}`);
  };
  // 접속한 유저 코드가 들어온 시점
  useEffect(() => {
    // newComment에 유저 코드 대입
    if (user.userCode !== 0) {
      setNewComment({
        ...newComment,
        userCode: user.userCode,
      });
    }
  }, [user.userCode]);
  if (isLoading) return <>로딩중...</>;
  if (error) return <>에러 발생...</>;

  return (
    <>
      <div className="max-w-4xl mx-auto p-4">
        <main className="bg-white p-6 rounded-lg shadow-md">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingBottom: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
                src={followUser.userProfileUrl}
                onClick={goUserInfo}
              />
              <span
                style={{
                  padding: "0 15px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={goUserInfo}
              >
                {followUser.userNickname}
              </span>
              {followUser.userBodySpecYn === "Y" ? (
                <span
                  style={{
                    paddingRight: "15px",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                  }}
                  onClick={goUserInfo}
                >
                  {followUser.userHeight}cm · {followUser.userWeight}kg
                </span>
              ) : (
                <></>
              )}
              {!check && followCheck !== null ? (
                <FollowButton user={followUser} bool={followCheck} />
              ) : (
                <></>
              )}
            </div>
            {check ? (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  className="border border-gray-300 rounded bg-gray-200 hover:bg-gray-300 mt-2"
                  style={{ margin: "5px", width: "60px" }}
                  onClick={updatePost}
                >
                  수정
                </button>
                <button
                  className="border border-gray-300 rounded bg-red-200 hover:bg-red-300 mt-2"
                  style={{ margin: "5px", width: "60px" }}
                  onClick={deletePost}
                >
                  삭제
                </button>
              </div>
            ) : (
              <div style={{ display: "flex" }}>
                <input
                  className="report-user-desc"
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
                  className="border border-gray-300 rounded bg-red-200 hover:bg-red-300 mt-2 report-user-btn"
                  style={{ margin: "5px", width: "80px" }}
                  onClick={() => {
                    reportUserBtn(reportUser);
                  }}
                >
                  유저 신고
                </button>
              </div>
            )}
          </div>
          {post ? (
            <>
              <div
                className="relative mb-4"
                style={{ display: "flex", justifyContent: "center" }}
              >
                {post.imageUrls && post.imageUrls.length === 1 ? (
                  <div
                    className="relative bg-gray-300 rounded-lg group mb-5 n-feed"
                    style={{ height: "600px", width: "400px" }}
                  >
                    <img
                      src={post.imageUrls[0]}
                      className="rounded-lg"
                      style={{
                        height: "600px",
                        width: "400px",
                        objectFit: "cover",
                        position: "absolute",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        height: "600px",
                        width: "400px",
                        position: "absolute",
                        opacity: "50%",
                      }}
                    >
                      <div
                        className="hover:opacity-100 opacity-0"
                        style={{
                          height: "100%",
                          width: "50%",
                          backgroundColor: "black",
                        }}
                      />
                      <div
                        className="hover:opacity-100 opacity-0"
                        style={{
                          height: "100%",
                          width: "50%",
                          backgroundColor: "black",
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex" }}>
                    <div className="relative w-256 h-350 bg-gray-300 rounded-lg group mb-5 n-feed">
                      <img
                        src={post.imageUrls[0]}
                        alt={`Post Image ${currentImageIndex}`}
                        className="rounded-lg"
                        style={{
                          height: "600px",
                          width: "400px",
                          objectFit: "cover",
                        }}
                      />
                      <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                    </div>
                    <div className="relative w-256 h-350 bg-gray-300 rounded-lg group mb-5 n-feed">
                      <img
                        src={post.imageUrls[1]}
                        alt={`Post Image ${currentImageIndex}`}
                        className="rounded-lg "
                        style={{
                          height: "600px",
                          width: "400px",
                          objectFit: "cover",
                        }}
                      />
                      <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                    </div>
                  </div>
                )}
              </div>
              <div />
              
              <div
                className="flex text-sm text-gray-600 mb-4"
                style={{ justifyContent: "space-between" }}
              >
                <div>
                  {!check ? (
                    <>
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
                        className="border border-gray-300 rounded bg-red-200 hover:bg-red-300 mt-2 report-post-btn"
                        style={{ width: "100px" }}
                        onClick={() => {
                          reportPostBtn(reportPost);
                        }}
                      >
                        게시글 신고
                      </button>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <p className="mb-3">{post.postDesc}</p>
              <div className="border-t border-gray-300 pt-4">
                <h2 className="font-bold mb-2">
                  댓글 {comments ? comments.data.length : 0}개
                </h2>
                {token !== null ? (
                  <>
                    <div className="mt-4">
                      <input
                        type="text"
                        placeholder="내용을 작성해주세요!"
                        value={newComment.commentDesc}
                        onChange={(e) =>
                          setNewComment({
                            ...newComment,
                            commentDesc: e.target.value,
                          })
                        }
                        className="w-5/6 p-2 border border-gray-300 rounded mb-2"
                      />
                      <button
                        className="w-1/6 bg-black text-white py-2 rounded"
                        onClick={addComment}
                      >
                        댓글 등록
                      </button>
                    </div>
                  </>
                ) : (
                  <></>
                )}
                <table>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td>로딩 중...</td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td>댓글을 불러오는 데 문제가 발생했습니다.</td>
                      </tr>
                    ) : comments.data && comments.data.length > 0 ? (
                      comments.data.map((comment, index) => (
                        <tr
                          key={index}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "5px",
                          }}
                        >
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              navigate(`/mypage/${comment.userCode.userCode}`);
                            }}
                          >
                            <img
                              src={comment.userCode.userProfileUrl}
                              style={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                                objectFit: "cover",
                              }}
                            />
                          </td>
                          <td
                            style={{
                              borderRight: "1px solid gainsboro",
                              padding: "5px",
                              fontWeight: "bold",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              navigate(`/mypage/${comment.userCode.userCode}`);
                            }}
                          >
                            <p>{comment.userCode.userNickname}</p>
                          </td>
                          <td style={{ padding: "5px 5px 5px 10px" }}>
                            <p>{comment.commentDesc}</p>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td>댓글이 없습니다.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : null}
        </main>
      </div>
    </>
  );
};

export default VoteDetail;
