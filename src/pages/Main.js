import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { BsCollection, BsCollectionFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import "../assets/css/main.css";
const Main = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [newFeedImages, setNewFeedImages] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [followingUserPosts, setFollowingUserPosts] = useState([]);
  const [popularFeedImages, setPopularFeedImages] = useState([]);
  const navigate = useNavigate();
  let userCode = "";
  let user = "";
  if (token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    const userData = JSON.parse(window.atob(base64));
    userCode = userData.userCode;
    user = userData;
  }
  useEffect(() => {
    setToken(localStorage.getItem("token"));
    fetchNewFeedImages();
    fetchPopularFeedImages();
    if (token) {
      fetchLikedPosts();
      fetchSavedPosts();
      if (userCode) fetchFollowedUserPosts();
    }
  }, [token, userCode]);
  const fetchNewFeedImages = async () => {
    const response = await axios.get("http://localhost:8080/api/post");
    setNewFeedImages(response.data);
  };
  const fetchPopularFeedImages = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/likes/post/ordered-by-likes"
    );
    setPopularFeedImages(response.data);
  };
  const fetchFollowedUserPosts = async () => {
    const response = await axios.get(
      `http://localhost:8080/api/posts/following/${userCode}`
    );
    setFollowingUserPosts(response.data);
  };
  // Fetch liked posts
  const fetchLikedPosts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/likes/${userCode}/likes`
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
        `http://localhost:8080/api/collection/${userCode}/collections`
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
      fetchLikedPosts();
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
    } catch (error) {
      console.error("Error toggling save", error);
    }
  };
  const detail = (postCode, e) => {
    // 막고 싶은 태그 리스트
    const blockedClasses = ["mx-2"];
    // 이벤트가 발생한 요소의 className 체크
    if (
      blockedClasses.some((className) => e.target.classList.contains(className))
    ) {
      e.stopPropagation(); // 해당 태그일 경우 이벤트를 막음
      return;
    }
    // 나머지 태그에서는 네비게이션 동작
    navigate(`/post/${postCode}`);
  };

  return (
    <div className="bg-gray-100 text-gray-800">
      <section className="bg-white py-4 shadow-md flex justify-center">
        <div className="menu-container flex justify-center">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="menu-button flex-none w-16 h-16 bg-gray-300 rounded-full ml-5 mr-5"
            />
          ))}
        </div>
      </section>
      <main className="container mx-auto">
        {/* Popular Feed Section */}
        <section className="mb-8 flex justify-center">
          <div className="flex flex-col main-section">
            <h2 className="text-xl font-bold mb-4">
              <Link to="/popularFeed" className="hover:underline">
                POPULAR FEED
              </Link>
            </h2>
            <div className="pf-con grid grid-cols-5 gap-4 flex justify-center content-center">
              {popularFeedImages.slice(0, 10).map((post) =>
                post.imageUrls.length > 0 ? (
                  <div
                    key={post.postCode}
                    className="relative bg-gray-300 rounded-lg group mb-5 main-feed"
                  >
                    <img
                      src={post.imageUrls[0]}
                      alt={post.postDesc}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div
                      className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                      onClick={(e) => detail(post.postCode, e)}
                    >
                      <p className="main-text text-white mb-2">
                        {post.postDesc}
                      </p>
                      <div className="flex items-center">
                        {likedPosts.some(
                          (likedPost) =>
                            likedPost.post.postCode === post.postCode
                        ) ? (
                          <FaHeart
                            onClick={(e) => {
                              e.stopPropagation(); // 이벤트 전파 막기
                              handleLikeToggle(post.postCode);
                            }}
                            style={{ color: "red", fontSize: "30px" }}
                            className="mx-2"
                          />
                        ) : (
                          <FaRegHeart
                            onClick={(e) => {
                              e.stopPropagation(); // 이벤트 전파 막기
                              handleLikeToggle(post.postCode);
                            }}
                            style={{ fontSize: "30px" }}
                            className="mx-2"
                          />
                        )}
                        {savedPosts.some(
                          (savedPost) =>
                            savedPost.post.postCode === post.postCode
                        ) ? (
                          <BsCollectionFill
                            onClick={(e) => {
                              e.stopPropagation(); // 이벤트 전파 막기
                              handleSaveToggle(post.postCode);
                            }}
                            style={{ color: "white", fontSize: "30px" }}
                            className="mx-2"
                          />
                        ) : (
                          <BsCollection
                            onClick={(e) => {
                              e.stopPropagation(); // 이벤트 전파 막기
                              handleSaveToggle(post.postCode);
                            }}
                            style={{ fontSize: "30px" }}
                            className="mx-2"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </div>
        </section>
        {/* New Feed Section */}
        <section className="mb-8 flex justify-center">
          <div className="flex flex-col main-section">
            <h2 className="text-xl font-bold mb-4">
              <Link to="/newFeed" className="hover:underline">
                NEW FEED
              </Link>
            </h2>
            <div className="nf-con grid grid-cols-5 gap-4">
              {newFeedImages.slice(0, 10).map((post) =>
                post.imageUrls.length > 0 ? (
                  <div
                    key={post.postCode}
                    className="relative w-256 h-350 bg-gray-300 rounded-lg group mb-5 main-feed"
                  >
                    <img
                      src={post.imageUrls[0]}
                      alt={post.postDesc}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div
                      className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                      onClick={(e) => detail(post.postCode, e)}
                    >
                      <p className="main-text text-white mb-2">
                        {post.postDesc}
                      </p>
                      <div className="flex items-center">
                        {likedPosts.some(
                          (likedPost) =>
                            likedPost.post.postCode === post.postCode
                        ) ? (
                          <FaHeart
                            onClick={(e) => {
                              e.stopPropagation(); // 이벤트 전파 막기
                              handleLikeToggle(post.postCode);
                            }}
                            style={{ color: "red", fontSize: "30px" }}
                            className="mx-2"
                          />
                        ) : (
                          <FaRegHeart
                            onClick={(e) => {
                              e.stopPropagation(); // 이벤트 전파 막기
                              handleLikeToggle(post.postCode);
                            }}
                            style={{ fontSize: "30px" }}
                            className="mx-2"
                          />
                        )}
                        {savedPosts.some(
                          (savedPost) =>
                            savedPost.post.postCode === post.postCode
                        ) ? (
                          <BsCollectionFill
                            onClick={(e) => {
                              e.stopPropagation(); // 이벤트 전파 막기
                              handleSaveToggle(post.postCode);
                            }}
                            style={{ color: "white", fontSize: "30px" }}
                            className="mx-2"
                          />
                        ) : (
                          <BsCollection
                            onClick={(e) => {
                              e.stopPropagation(); // 이벤트 전파 막기
                              handleSaveToggle(post.postCode);
                            }}
                            style={{ fontSize: "30px" }}
                            className="mx-2"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </div>
        </section>
        {/* Follower's Feed Section */}
        {token && (
          <section className="mb-8 flex justify-center">
            <div className="flex flex-col main-section">
              <h2 className="text-xl font-bold mb-4">
                <Link to="/popularFeed" className="hover:underline">
                  MY FOLLOWER'S FEED
                </Link>
              </h2>
              <div className="main-con grid grid-cols-5 gap-4">
                {followingUserPosts.slice(0, 10).map((post) =>
                  post.imageUrls.length > 0 ? (
                    <div
                      key={post.postCode}
                      className="relative bg-gray-300 rounded-lg group mb-5 main-feed"
                    >
                      <img
                        src={post.imageUrls[0]}
                        alt={post.postDesc}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div
                        className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                        onClick={(e) => detail(post.postCode, e)}
                      >
                        <p className="main-text text-white mb-2">
                          {post.postDesc}
                        </p>
                        <div className="flex items-center">
                          {likedPosts.some(
                            (likedPost) =>
                              likedPost.post.postCode === post.postCode
                          ) ? (
                            <FaHeart
                              onClick={(e) => {
                                e.stopPropagation(); // 이벤트 전파 막기
                                handleLikeToggle(post.postCode);
                              }}
                              style={{ color: "red", fontSize: "30px" }}
                              className="mx-2"
                            />
                          ) : (
                            <FaRegHeart
                              onClick={(e) => {
                                e.stopPropagation(); // 이벤트 전파 막기
                                handleLikeToggle(post.postCode);
                              }}
                              style={{ fontSize: "30px" }}
                              className="mx-2"
                            />
                          )}
                          {savedPosts.some(
                            (savedPost) =>
                              savedPost.post.postCode === post.postCode
                          ) ? (
                            <BsCollectionFill
                              onClick={(e) => {
                                e.stopPropagation(); // 이벤트 전파 막기
                                handleSaveToggle(post.postCode);
                              }}
                              style={{ color: "white", fontSize: "30px" }}
                              className="mx-2"
                            />
                          ) : (
                            <BsCollection
                              onClick={(e) => {
                                e.stopPropagation(); // 이벤트 전파 막기
                                handleSaveToggle(post.postCode);
                              }}
                              style={{ fontSize: "30px" }}
                              className="mx-2"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
export default Main;
