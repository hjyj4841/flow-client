import React, { useEffect, useState, useReducer, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiMiniLink } from "react-icons/hi2";
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
import {
  delPost,
  detailPost,
  fetchLikedPosts,
  fetchSavedPosts,
} from "../../api/post";
import { findUser, findUserByCode } from "../../api/user";
import {
  addComment as addCommentAPI,
  deleteComment,
  getAllComment,
  updateComment as updateCommentAPI,
  deleteParent,
} from "../../api/comment";
import FollowButton from "../follow/FollowButton";
import { GrNext, GrPrevious } from "react-icons/gr";
import { FaRegHeart, FaHeart, FaRegEdit } from "react-icons/fa";
import { CgGenderMale, CgGenderFemale } from "react-icons/cg";
import { BsCollection, BsCollectionFill } from "react-icons/bs";
import { RiDeleteBin5Line } from "react-icons/ri";
import { PiSirenLight } from "react-icons/pi";
import { handleLikeToggle } from "../../api/likes";
import { handleSaveToggle } from "../../api/collection";
import UserModal from "../../components/UserModal";
import "../../assets/css/detail.scoped.scss";
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
  const [likedPosts, setLikedPosts] = useState([]); // 좋아요 정보를 담는 배열 객체
  const [likeRendering, setLikeRendering] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]); // 북마크 정보를 담는 배열 객체
  const [saveRendering, setSaveRendering] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // 게시물 이미지 변경(다음/이전) 관련
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
  const [parents, setParents] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [newComment, setNewComment] = useState({
    commentCode: null,
    commentDesc: "",
    postCode: postCode,
    userCode: 0,
    parentCommentCode: 0,
  });

  // 댓글 수정 관련
  const [updateComment, setUpdateComment] = useState({
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
    const response = await detailPost(postCode);
    setPost(response.data);
    setFollowUser((await findUserByCode(response.data.userCode)).data);
  };
  // 2. likeRedering, saveRedering 값이 변화되는 시점
  useEffect(() => {
    if (token !== null) {
      fetchLiked();
      fetchSaved();
    }
    console.log(post);
  }, [likeRendering, saveRendering, post]); // 의존성 배열 추가
  // 2-1. 좋아요 정보를 객체 배열로 담기
  const fetchLiked = async () => {
    const response = await fetchLikedPosts(user.userCode);
    const likedPosts = response.data.postInfoList.map((post) => ({
      ...post,
      isLiked: true,
    }));
    setLikedPosts(likedPosts || []);
  };
  // 2-2. 북마크 정보를 객체 배열로 담기
  const fetchSaved = async () => {
    const response = await fetchSavedPosts(user.userCode);
    const savedPosts = response.data.postInfoList.map((post) => ({
      ...post,
      isSaved: true,
    }));
    setSavedPosts(savedPosts || []);
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
  // 이미지(다음/이전) 변경 관련 메서드
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
  // 라이크 버튼 클릭 시 발생
  const handleLike = async (postCode) => {
    await handleLikeToggle(postCode, user);
    setLikedPosts((prevLikedPosts) =>
      prevLikedPosts.map((post) =>
        post.post.postCode === postCode
          ? { ...post, isLiked: !post.isLiked }
          : post
      )
    );
    fetchLikedPosts(user.userCode);
    fetchPost();
    setLikeRendering(likeRendering + 1);
  };
  // 북마크 버튼 클릭 시 발생
  const handleSave = async (postCode) => {
    await handleSaveToggle(postCode, user);
    fetchSavedPosts(user.userCode);
    fetchPost();
    setSaveRendering(saveRendering + 1);
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
    if (newComment.commentDesc !== "") {
      addMutation.mutate(newComment);
      setNewComment({ ...newComment, commentDesc: "" });
    } else {
      alert("내용을 입력해주세요");
    }
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

  // 댓글 수정 완료
  const handleUpdate = () => {
    updateMutation.mutate(updateComment);
    setIsUpdating(null); // 수정 상태 초기화
    setUpdateComment({ ...updateComment, commentDesc: "" }); // 입력 필드 초기화
  };

  // 댓글 수정 취소
  const handleUpdateCancel = () => {
    setIsUpdating(null); // 수정 상태 초기화
    setUpdateComment({ ...updateComment, commentDesc: "", commentCode: 0 }); // 입력 필드 초기화
  };

  // 대댓글 작성
  const parentCommentCode = () => {
    addMutation.mutate(newComment);
    setNewComment({ ...newComment, commentDesc: "", parentCommentCode: 0 });
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
      <section className="bg-white py-4 shadow-md" />
      <div className="detail-con">
        <div className="detail-box">
          <div className="detail-img">
            {post ? (
              <>
                {post.imageUrls && post.imageUrls.length > 0 ? (
                  <>
                    {currentImageIndex > 0 && (
                      <button
                        onClick={handlePreviousImage}
                        className="shadow-lg prev-button"
                      >
                        <GrPrevious />
                      </button>
                    )}
                    <img src={post.imageUrls[currentImageIndex]} />
                    {currentImageIndex < post.imageUrls.length - 1 && (
                      <button
                        onClick={handleNextImage}
                        className="shadow-lg next-button"
                      >
                        <GrNext />
                      </button>
                    )}
                  </>
                ) : (
                  <></>
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
                  <div>
                    <div className="detail-like">
                      <span>
                        {likedPosts.find(
                          (likedPost) =>
                            likedPost.post.postCode === post.postCode
                        ) ? (
                          <FaHeart
                            onClick={() => handleLike(post.postCode)}
                            style={{ color: "red" }}
                          />
                        ) : (
                          <FaRegHeart
                            onClick={() => handleLike(post.postCode)}
                          />
                        )}
                        <p>{post.likeCount}</p>
                      </span>
                    </div>
                    <div className="detail-save">
                      <span>
                        {savedPosts.some(
                          (savedPost) =>
                            savedPost.post.postCode === post.postCode
                        ) ? (
                          <BsCollectionFill
                            onClick={() => handleSave(post.postCode)}
                            style={{ color: "black" }}
                          />
                        ) : (
                          <BsCollection
                            onClick={() => handleSave(post.postCode)}
                          />
                        )}
                        <p>{post.collectionCount}</p>
                      </span>
                    </div>
                  </div>
                  <div className="detail-post-report">
                    {check && (
                      <div className="user-button">
                        <button className="edit" onClick={updatePost}>
                          <FaRegEdit />
                        </button>
                        <button className="del" onClick={deletePost}>
                          <RiDeleteBin5Line />
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
                  <div className="detail-post-tag">
                    <p>
                      {post.tags && post.tags.length > 0
                        ? post.tags.map((tag, index) => (
                            <span key={index}>
                              #{tag.tagName}
                              {tag.tagType === "체형" ? "체형 " : ""}
                            </span>
                          ))
                        : null}
                    </p>
                  </div>
                  <div className="detail-post-info">
                    <div className="detail-post-desc">
                      <p>{post.postDesc}</p>
                    </div>
                    <div className="detail-post-product">
                      {post.products.length > 0 && (
                        <p>제품 {post.products.length}개</p>
                      )}
                      <table>
                        {post.products && post.products.length > 0 ? (
                          <>
                            <thead>
                              <tr>
                                <th>브랜드</th>
                                <th>제품명</th>
                                <th>컬러/사이즈</th>
                                <th>구매처</th>
                                {/* <th>구매링크</th> */}
                              </tr>
                            </thead>
                            <tbody>
                              {post.products.map((product, index) => (
                                <tr key={index}>
                                  <td>{product.productBrand}</td>
                                  <td>{product.productName}</td>
                                  <td>{product.productSize}</td>
                                  <td>
                                    {product.productBuyFrom === "" &&
                                    product.productLink === "" ? (
                                      ""
                                    ) : product.productBuyFrom === "" &&
                                      product.productLink !== "" ? (
                                      <a
                                        href={
                                          product.productLink === "" ||
                                          (product.productLink.includes(
                                            "http://"
                                          ) ||
                                            product.productLink.includes(
                                              "https://"
                                            ))
                                            ? product.productLink
                                            : `https://${product.productLink}`
                                        }
                                      >
                                        <HiMiniLink />
                                      </a>
                                    ) : product.productBuyFrom !== "" &&
                                      product.productLink !== "" ? (
                                      <a
                                        href={
                                          product.productLink === "" ||
                                          (product.productLink.includes(
                                            "http://"
                                          ) ||
                                            product.productLink.includes(
                                              "https://"
                                            ))
                                            ? product.productLink
                                            : `https://${product.productLink}`
                                        }
                                        style={{
                                          display: "flex",
                                          textAlign: "center",
                                        }}
                                      >
                                        {product.productBuyFrom}
                                        <HiMiniLink />
                                      </a>
                                    ) : product.productBuyFrom !== "" &&
                                      product.productLink === "" ? (
                                      product.productBuyFrom
                                    ) : null}
                                  </td>

                                  {/* <td>
                                    <a
                                      href={
                                        product.productLink === "" ||
                                        (product.productLink.includes(
                                          "http://"
                                        ) ||
                                          product.productLink.includes(
                                            "https://"
                                          ))
                                          ? product.productLink
                                          : `https://${product.productLink}`
                                      }
                                    >
                                      {product.productLink === "" ||
                                      (product.productLink.includes(
                                        "http://"
                                      ) ||
                                        product.productLink.includes(
                                          "https://"
                                        ))
                                        ? product.productLink
                                        : `https://${product.productLink}`}
                                    </a>
                                  </td> */}
                                </tr>
                              ))}
                            </tbody>
                          </>
                        ) : null}
                      </table>
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
                      ) : comments.data && comments.data.length === 0 ? (
                        <p>첫번째로 댓글을 남겨보세요.</p>
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
                                      style={{
                                        width: "140%",
                                        border: "1px #808080 solid",
                                        borderRadius: "5px",
                                      }}
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
                                          <button
                                            onClick={() =>
                                              setNewComment({
                                                ...newComment,
                                                parentCommentCode:
                                                  comment.commentCode,
                                              })
                                            }
                                          >
                                            답글
                                          </button>
                                          {user === comment.user && (
                                            <button
                                              onClick={() =>
                                                deleteComment(
                                                  comment.commentCode
                                                )
                                              }
                                            >
                                              삭제
                                            </button>
                                          )}
                                        </>
                                      )}
                                      {newComment.parentCommentCode ===
                                        comment.commentCode && (
                                        <>
                                          <input
                                            type="text"
                                            value={newComment.commentDesc}
                                            onChange={(e) =>
                                              setNewComment({
                                                ...newComment,
                                                commentDesc: e.target.value,
                                              })
                                            }
                                            style={{
                                              width: "100%",
                                              border: "1px #808080 solid",
                                              borderRadius: "5px",
                                            }}
                                          />
                                          <div className="parent-box">
                                            <button
                                              onClick={() =>
                                                setNewComment({
                                                  ...newComment,
                                                  commentDesc: "",
                                                  parentCommentCode: 0,
                                                })
                                              }
                                            >
                                              취소
                                            </button>
                                            <button onClick={parentCommentCode}>
                                              답글 완료
                                            </button>
                                          </div>
                                        </>
                                      )}
                                    </>
                                  )}
                                  <CommentReportModal comment={comment} />
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
