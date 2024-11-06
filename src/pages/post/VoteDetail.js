import React, { useEffect, useState, useReducer, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addReportPost,
  addReportUser,
  initState as reportState,
  reportReducer,
  addReportComment,
} from "../../reducers/reportReducer";
import { useDispatch, useSelector } from "react-redux";
import { followStatus } from "../../store/followSlice";
import { useAuth } from "../../contexts/AuthContext";
import { delPost, detailVote } from "../../api/post";
import { findUser, findUserByCode } from "../../api/user";
import {
  addComment as addCommentAPI,
  deleteComment,
  getAllComment,
  updateComment as updateCommentAPI,
} from "../../api/comment";
import FollowButton from "../follow/FollowButton";
import { CgGenderMale, CgGenderFemale } from "react-icons/cg";
import UserModal from "../../components/UserModal";
import "../../assets/css/detail.scoped.scss";
import { addVote, checkPostVote, removeVote } from "../../api/vote";
import PostReportModal from "../../components/PostReportModal";
import CommentReportModal from "../../components/CommentReportModal";

const Detail = () => {
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
  const [isUpdating, setIsUpdating] = useState(false);
  const [newComment, setNewComment] = useState({
    commentCode: null,
    commentDesc: "",
    postCode: postCode,
    userCode: 0,
  });

  const [updateComment, setUpdateComment] = useState({
    commentCode: null,
    commentDesc: "",
    postCode: postCode,
    userCode: 0,
  });

  // 투표 관련
  const [vote, setVote] = useState({
    post: {
      postCode: postCode,
    },
    userCode: 0,
    voteYn: "",
  });
  const [isVote, setIsVote] = useState(false);

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
      getVoteInfo();
    }
  }, [post?.userCode, user.userCode]);

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

  // 투표 수정 페이지로 이동
  const updateVote = () => {
    navigate("/votePost/update/" + postCode);
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
  // 댓글 신고
  const reportCommentBtn = (data) => {
    addReportComment(reportDispatch, data);
    alert("신고가 완료되었습니다");
    console.log(reportComment);
    setReportComment({
      ...reportComment,
      commentReportDesc: "",
    });
  };
  // 댓글 신고 관련
  const [reportComment, setReportComment] = useState({
    commentReportDesc: "",
    comment: {
      commentCode: 0,
    },
  });
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
  // 댓글 삭제
  const deleteMutation = useMutation({
    mutationFn: (commentCode) => deleteComment(commentCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postCode] });
    },
  });
  const handleDelete = (commentCode) => {
    deleteMutation.mutate(commentCode);
  };
  // 댓글 수정
  const updateMutation = useMutation({
    mutationFn: (updateComment) => updateCommentAPI(updateComment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postCode] });
    },
  });

  const update = (comment) => {
    setUpdateComment({
      commentCode: comment.commentCode,
      commentDesc: comment.commentDesc,
      postCode: postCode,
      userCode: user.userCode,
    });
    setIsUpdating(comment.commentCode); // 수정할 댓글 코드 설정
  };

  const handleUpdate = () => {
    updateMutation.mutate(updateComment);
    setIsUpdating(null); // 수정 상태 초기화
    setUpdateComment({ ...updateComment, commentDesc: "" }); // 입력 필드 초기화
  };

  const handleUpdateCancel = () => {
    setIsUpdating(null); // 수정 상태 초기화
    setUpdateComment({ ...updateComment, commentDesc: "", commentCode: 0 }); // 입력 필드 초기화
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

  // 왼쪽 항목 투표
  const voteLeft = () => {
    if (
      user.userCode !== null &&
      user.userCode !== 0 &&
      user.userCode !== undefined
    ) {
      setVote({
        ...vote,
        user: user,
        voteYn: "Y",
      });
      setIsVote(true);
    } else {
      alert("로그인 후 이용해주세요!");
    }
  };

  // 오른쪽 항목 투표
  const voteRight = () => {
    if (
      user.userCode !== null &&
      user.userCode !== 0 &&
      user.userCode !== undefined
    ) {
      setVote({
        ...vote,
        user: user,
        voteYn: "N",
      });
      setIsVote(true);
      fetchPost();
    } else {
      alert("로그인 후 이용해주세요!");
    }
  };

  useEffect(() => {
    if (vote.voteYn !== "" && isVote) {
      insertVote();
      setIsVote(false);
    }
  }, [vote, isVote]);

  const insertVote = async () => {
    await addVote(vote);
    getVoteInfo();
  };

  // 투표 여부 체크
  const getVoteInfo = async () => {
    const response = (await checkPostVote(user.userCode, postCode)).data;
    if (response !== "") {
      setVote(response);
      fetchPost();
    }
  };

  // 투표 삭제
  const deleteVote = async () => {
    await removeVote(vote.voteCode);
    setVote({
      post: {
        postCode: postCode,
      },
      userCode: 0,
      voteYn: "",
    });
    fetchPost();
  };

  if (isLoading) return <>로딩중...</>;
  if (error) return <>에러 발생...</>;

  return (
    <>
      <section className="bg-white py-4 shadow-md" />
      <div className="detail-con">
        <div className="detail-box">
          <div className="detail-img">
            {post ? (
              <>
                {post.imageUrls && post.imageUrls.length == 1 ? (
                  <>
                    <div
                      style={{
                        width: "100%",
                        position: "relative",
                        cursor: "pointer",
                      }}
                    >
                      <img
                        src={post.imageUrls[0]}
                        style={{ position: "absolute", zIndex: "1" }}
                      />

                      <p
                        className={
                          vote.voteYn === "Y"
                            ? "group bg-black-900 bg-opacity-90 w-1/2 h-full hover:bg-opacity-0"
                            : "group bg-gray-900 bg-opacity-50 hover:bg-opacity-0 w-1/2 h-full"
                        }
                        style={{
                          color: "white",
                          position: "absolute",
                          zIndex: "20",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          cursor: "pointer",
                          fontWeight: "bold",
                          left: "0",
                        }}
                        onClick={
                          vote.voteYn === "Y"
                            ? () => deleteVote()
                            : () => voteLeft()
                        }
                      >
                        {vote.voteYn === "Y" ? (
                          <span
                            className="group-hover:opacity-0 mb-1.5"
                            style={{
                              fontWeight: "bold",
                              textShadow: "2px 2px 4px rgba(0, 0, 0, 10)",
                            }}
                          >
                            Pick your
                          </span>
                        ) : (
                          <></>
                        )}
                        <span
                          className="group-hover:opacity-0"
                          style={{
                            fontWeight: "bold",
                            textShadow: "2px 2px 4px rgba(0, 0, 0, 10)",
                          }}
                        >
                          {post.voteTextFirst}
                        </span>
                      </p>

                      <p
                        className={
                          vote.voteYn === "N"
                            ? "group bg-black-900 bg-opacity-90 w-1/2 h-full hover:bg-opacity-0"
                            : "group bg-gray-900 bg-opacity-50 hover:bg-opacity-0 w-1/2 h-full"
                        }
                        style={{
                          color: "white",
                          position: "absolute",
                          zIndex: "20",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          cursor: "pointer",
                          fontWeight: "bold",
                          right: "0",
                        }}
                        onClick={
                          vote.voteYn === "N"
                            ? () => deleteVote()
                            : () => voteRight()
                        }
                      >
                        {vote.voteYn === "N" ? (
                          <span
                            className="group-hover:opacity-0 mb-1.5"
                            style={{
                              fontWeight: "bold",
                              textShadow: "2px 2px 4px rgba(0, 0, 0, 10)",
                            }}
                          >
                            Pick your
                          </span>
                        ) : (
                          <></>
                        )}
                        <span
                          className="group-hover:opacity-0"
                          style={{
                            fontWeight: "bold",
                            textShadow: "2px 2px 4px rgba(0, 0, 0, 10)",
                          }}
                        >
                          {post.voteTextSecond}
                        </span>
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        width: "50%",
                        position: "relative",
                      }}
                    >
                      <img
                        src={post.imageUrls[0]}
                        style={{ position: "absolute", zIndex: "1" }}
                      />
                      <p
                        className={
                          vote.voteYn === "Y"
                            ? "group bg-gray-10 w-full h-full hover:bg-opacity-0"
                            : "group text-white bg-gray-900 bg-opacity-50 hover:bg-opacity-0 w-full h-full"
                        }
                        style={{
                          color: "white",
                          position: "absolute",
                          zIndex: "20",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                        onClick={
                          vote.voteYn === "Y"
                            ? () => deleteVote()
                            : () => voteLeft()
                        }
                      >
                        {vote.voteYn === "Y" ? (
                          <span
                            className="group-hover:opacity-0 mb-1.5"
                            style={{
                              fontWeight: "bold",
                              textShadow: "2px 2px 4px rgba(0, 0, 0, 50)",
                            }}
                          >
                            Pick your
                          </span>
                        ) : (
                          <></>
                        )}

                        <span
                          className="group-hover:opacity-0"
                          style={{
                            fontWeight: "bold",
                            textShadow: "2px 2px 4px rgba(0, 0, 0, 50)",
                          }}
                        >
                          {post.voteTextFirst}
                        </span>
                      </p>
                    </div>
                    <div
                      style={{
                        width: "50%",
                        position: "relative",
                      }}
                    >
                      <img
                        src={post.imageUrls[1]}
                        style={{ position: "absolute", zIndex: "1" }}
                      />

                      <p
                        className={
                          vote.voteYn === "N"
                            ? "group bg-gray-10 w-full h-full hover:bg-opacity-0"
                            : "group text-white bg-gray-900 bg-opacity-50 hover:bg-opacity-0 w-full h-full"
                        }
                        style={{
                          color: "white",
                          position: "absolute",
                          zIndex: "20",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          fontWeight: "bold",
                        }}
                        onClick={
                          vote.voteYn === "N"
                            ? () => deleteVote()
                            : () => voteRight()
                        }
                      >
                        {vote.voteYn === "N" ? (
                          <span
                            className="group-hover:opacity-0 mb-1.5"
                            style={{
                              fontWeight: "bold",
                              textShadow: "2px 2px 4px rgba(0, 0, 0, 50)",
                            }}
                          >
                            Pick your
                          </span>
                        ) : (
                          <></>
                        )}
                        <span
                          className="group-hover:opacity-0"
                          style={{
                            fontWeight: "bold",
                            textShadow: "2px 2px 4px rgba(0, 0, 0, 50)",
                          }}
                        >
                          {post.voteTextSecond}
                        </span>
                      </p>
                    </div>
                  </>
                )}
              </>
            ) : (
              <p>No images available</p>
            )}
          </div>
          <div className="detail-desc">
            {post ? (
              <>
                <div className="detail-desc-top">
                  <div />
                  <div className="detail-post-report">
                    {check && (
                      <div>
                        <button
                          className="bg-red-200 hover:bg-red-300"
                          onClick={deletePost}
                        >
                          삭제
                        </button>
                      </div>
                    )}
                    <PostReportModal />
                  </div>
                </div>
                <div className="detail-desc-mid">
                  <div className="detail-post-date">
                    <p>{post?.postDate.split("T")[0]}</p>
                  </div>
                  <div className="detail-post-tag" />
                  <div className="detail-post-info">
                    <div className="detail-post-desc">
                      <p>{post.postDesc}</p>
                    </div>
                    <div className="detail-post-product">
                      <p>Total : {post.voteCount}</p>
                      <p>
                        {post.voteTextFirst} : {post.ycount}
                      </p>
                      <p>
                        {post.voteTextSecond} : {post.ncount}
                      </p>
                    </div>
                  </div>
                  <div className="detail-post-user">
                    <div className="post-user-desc">
                      <div className="post-user-img">
                        <img
                          src={followUser.userProfileUrl}
                          onClick={goUserInfo}
                        />
                      </div>
                      <div className="post-user-info">
                        <UserModal user={followUser} />
                        <div className="post-user-more">
                          <span>
                            {followUser.userGender === "남성" ? (
                              <CgGenderMale style={{ color: "skyblue" }} />
                            ) : (
                              <CgGenderFemale style={{ color: "pink" }} />
                            )}
                          </span>
                          <span>{followUser.userJob}</span>
                          {followUser.userBodySpecYn === "Y" ? (
                            <span>
                              {followUser.userHeight}cm ·{" "}
                              {followUser.userWeight}
                              kg
                            </span>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="post-user-follow">
                      {!check && followCheck !== null ? (
                        <FollowButton user={followUser} bool={followCheck} />
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
                <div className="detail-desc-bot">
                  <div>
                    <div className="comment-count">
                      <p>댓글 {comments ? comments.data.length : 0}개</p>
                    </div>
                    <div className="comment-con">
                      {isLoading ? (
                        <div>로딩 중...</div>
                      ) : error ? (
                        <div>댓글을 불러오는 데 문제가 발생했습니다.</div>
                      ) : comments.data && comments.data.length > 0 ? (
                        comments.data.map((comment, index) => (
                          <div className="comment-contents" key={index}>
                            <div className="comment-user-img">
                              <img src={comment.userCode.userProfileUrl} />
                            </div>
                            <div className="comment-info">
                              <div className="comment-info-top">
                                <div className="comment-user-nick">
                                  <p>{comment.userCode.userNickname}</p>
                                </div>
                                <div className="comment-desc">
                                  {isUpdating === comment.commentCode ? (
                                    <input
                                      type="text"
                                      value={updateComment.commentDesc}
                                      onChange={(e) =>
                                        setUpdateComment({
                                          ...updateComment,
                                          commentDesc: e.target.value,
                                        })
                                      }
                                    />
                                  ) : (
                                    <p>{comment.commentDesc}</p>
                                  )}
                                </div>
                              </div>
                              <div className="comment-info-bot">
                                <div className="comment-date">2024-10-31</div>
                                <div className="comment-button">
                                  {user.userCode ===
                                    comment.userCode.userCode && (
                                    <>
                                      {isUpdating === comment.commentCode ? (
                                        <>
                                          <button
                                            onClick={handleUpdateCancel}
                                            className="hover:text-gray-900 text-gray-500"
                                          >
                                            취소
                                          </button>
                                          <button
                                            onClick={handleUpdate}
                                            className="hover:text-gray-900 text-gray-500"
                                          >
                                            수정완료
                                          </button>
                                        </>
                                      ) : (
                                        <>
                                          <button
                                            onClick={() => update(comment)}
                                            className="hover:text-gray-900 text-gray-500"
                                          >
                                            수정
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleDelete(comment.commentCode)
                                            }
                                            className="hover:text-red-500 text-gray-500"
                                          >
                                            삭제
                                          </button>
                                        </>
                                      )}
                                    </>
                                  )}
                                  <CommentReportModal />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                  <div className="comment-add">
                    {token !== null ? (
                      <div>
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
                        />
                        <button
                          className="hover:bg-gray-700"
                          style={{ height: "39px" }}
                          onClick={addComment}
                        >
                          댓글 등록
                        </button>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <p>댓글이 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Detail;
