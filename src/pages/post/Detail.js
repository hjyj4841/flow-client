import React, { useEffect, useState, useReducer, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addReportPost,
  addReportUser,
  initState as reportState,
  reportReducer,
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
import { addComment as addCommentAPI, getAllComment } from "../../api/comment";
import FollowButton from "../follow/FollowButton";
import { GrNext, GrPrevious } from "react-icons/gr";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { BsCollection, BsCollectionFill } from "react-icons/bs";
import { CgGenderMale, CgGenderFemale } from "react-icons/cg";
import { handleLikeToggle } from "../../api/likes";
import { handleSaveToggle } from "../../api/collection";
import Comment from "../../components/Comment";

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
      <section className="bg-white py-4 shadow-md" />
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
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
                src={followUser.userProfileUrl}
                onClick={goUserInfo}
              />
              <span
                style={{
                  padding: "0 10px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={goUserInfo}
              >
                {followUser.userNickname}
              </span>
              <span
                style={{ paddingRight: "10px", cursor: "pointer" }}
                onClick={goUserInfo}
              >
                {followUser.userGender === "남성" ? (
                  <CgGenderMale style={{ color: "skyblue" }} />
                ) : (
                  <CgGenderFemale style={{ color: "pink" }} />
                )}
              </span>
              <span
                style={{
                  paddingRight: "10px",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                }}
                onClick={goUserInfo}
              >
                {followUser.userJob}
              </span>
              {followUser.userBodySpecYn === "Y" ? (
                <span
                  style={{
                    paddingRight: "10px",
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
                      className="rounded-lg"
                      style={{
                        height: "600px",
                        width: "400px",
                        objectFit: "cover",
                      }}
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
              <div
                className="flex text-sm text-gray-600 mb-5"
                style={{ justifyContent: "space-between" }}
              >
                <div>
                  <span
                    className="flex items-center space-x-2 mr-4"
                    style={{ fontSize: "1.2rem" }}
                  >
                    {likedPosts.find(
                      (likedPost) => likedPost.post.postCode === post.postCode
                    ) ? (
                      <>
                        <FaHeart
                          onClick={() => handleLike(post.postCode)}
                          style={{ color: "red" }}
                        />
                        <p style={{ paddingRight: "20px" }}>{post.likeCount}</p>
                      </>
                    ) : (
                      <>
                        <FaRegHeart onClick={() => handleLike(post.postCode)} />
                        <p style={{ paddingRight: "20px" }}>{post.likeCount}</p>
                      </>
                    )}
                    {savedPosts.some(
                      (savedPost) => savedPost.post.postCode === post.postCode
                    ) ? (
                      <>
                        <BsCollectionFill
                          onClick={() => handleSave(post.postCode)}
                          style={{ color: "black" }}
                        />
                        <p>{post.collectionCount}</p>
                      </>
                    ) : (
                      <>
                        <BsCollection
                          onClick={() => handleSave(post.postCode)}
                        />
                        <p>{post.collectionCount}</p>
                      </>
                    )}
                  </span>
                </div>
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
              <p className="mb-8 text-blue-500">
                {post.tags && post.tags.length > 0
                  ? post.tags.map((tag, index) => (
                      <span key={index}>
                        #{tag.tagName} {tag.tagType === "체형" ? "체형 " : ""}
                      </span>
                    ))
                  : null}
              </p>
              <p className="mb-10" style={{ lineHeight: "1.5rem" }}>
                {post.postDesc}
              </p>
              <table className="mb-2" style={{ width: "100%" }}>
                {post.products && post.products.length > 0 ? (
                  <>
                    <thead style={{ borderBottom: "1px solid gainsboro" }}>
                      <tr style={{ fontWeight: "bold" }}>
                        <th style={{ paddingBottom: "5px" }}>제품명</th>
                        <th style={{ paddingBottom: "5px" }}>브랜드</th>
                        <th style={{ paddingBottom: "5px" }}>사이즈</th>
                        <th style={{ paddingBottom: "5px" }}>구매처</th>
                        <th style={{ paddingBottom: "5px" }}>구매링크</th>
                      </tr>
                    </thead>
                    <tbody>
                      {post.products.map((product, index) => (
                        <tr key={index}>
                          <td style={{ padding: "10px", textAlign: "center" }}>
                            {product.productName}
                          </td>
                          <td style={{ padding: "10px", textAlign: "center" }}>
                            {product.productBrand}
                          </td>
                          <td style={{ padding: "10px", textAlign: "center" }}>
                            {product.productSize}
                          </td>
                          <td style={{ padding: "10px", textAlign: "center" }}>
                            {product.productBuyFrom}
                          </td>
                          <td style={{ padding: "10px", textAlign: "center" }}>
                            <a
                              href={
                                product.productLink === "" ||
                                (product.productLink.includes("http://") ||
                                  product.productLink.includes("https://"))
                                  ? product.productLink
                                  : `https://${product.productLink}`
                              }
                              className="text-blue-500 hover:text-blue-800"
                            >
                              {product.productLink === "" ||
                              (product.productLink.includes("http://") ||
                                product.productLink.includes("https://"))
                                ? product.productLink
                                : `https://${product.productLink}`}
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                ) : null}
              </table>
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
                        className="w-1/6 border border-black-300 bg-black text-white py-2 rounded p-2 mb-2 hover:bg-gray-700"
                        style={{ height: "39px" }}
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
                          <div />
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
export default Detail;
