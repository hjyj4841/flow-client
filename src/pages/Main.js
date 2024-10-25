import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../assets/css/main.css";
import { findUser } from "../api/user";
import {
  fetchLikedPosts,
  fetchSavedPosts,
  FollowedUserPosts,
  newFeed,
  popularFeed,
} from "../api/post";
import LikeToggleButton from "./post/toggleBtn/LikeToggleButton";
import SaveToggleButton from "./post/toggleBtn/SaveToggleButton";
const Main = () => {
  // 토큰 받아오기
  const { token } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [newFeedImages, setNewFeedImages] = useState([]);
  const [followingUserPosts, setFollowingUserPosts] = useState([]);
  const [popularFeedImages, setPopularFeedImages] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);

  // 페이지 첫 로드 시 실행
  useEffect(() => {
    if (token !== null) {
      getUserInfo();
    }
    fetchNewFeedImages();
    fetchPopularFeedImages();
  }, []);

  const getUserInfo = async () => {
    setUser((await findUser(token)).data);
  };

  useEffect(() => {
    if (user.userCode != null) {
      fetchLiked();
      fetchSaved();
      fetchFollowedUserPosts();
    }
  }, [user.userCode]);

  const fetchNewFeedImages = async () => {
    const response = await newFeed();
    setNewFeedImages(response);
  };
  const fetchPopularFeedImages = async () => {
    const response = await popularFeed();
    setPopularFeedImages(response);
  };
  const fetchFollowedUserPosts = async () => {
    const response = await FollowedUserPosts(user.userCode);
    setFollowingUserPosts(response);
  };

  // Fetch liked posts
  const fetchLiked = async () => {
    const response = await fetchLikedPosts(user.userCode);
    const likedPosts = response.data.postInfoList.map((post) => ({
      ...post,
      isLiked: true,
    }));
    setLikedPosts(likedPosts || []);
  };
  // Fetch saved posts
  const fetchSaved = async () => {
    const response = await fetchSavedPosts(user.userCode);
    const savedPosts = response.data.postInfoList.map((post) => ({
      ...post,
      isSaved: true,
    }));
    setSavedPosts(savedPosts || []);
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
            <div className="main-con grid grid-cols-5 gap-4 flex justify-center content-center">
              {popularFeedImages.slice(0, 10).map((post) =>
                post.imageUrls.length > 0 ? (
                  <div
                    key={post.postCode}
                    className="relative bg-gray-300 rounded-lg group main-feed"
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
                        <LikeToggleButton
                          likedPosts={likedPosts}
                          user={user}
                          post={post}
                          fetchLiked={fetchLiked}
                        />
                        <SaveToggleButton
                          savedPosts={savedPosts}
                          user={user}
                          post={post}
                          fetchSaved={fetchSaved}
                        />
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
            <div className="main-con grid grid-cols-5 gap-4">
              {newFeedImages.slice(0, 10).map((post) =>
                post.imageUrls.length > 0 ? (
                  <div
                    key={post.postCode}
                    className="relative w-256 h-350 bg-gray-300 rounded-lg group main-feed"
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
                        <LikeToggleButton
                          likedPosts={likedPosts}
                          user={user}
                          post={post}
                          fetchLiked={fetchLiked}
                        />
                        <SaveToggleButton
                          savedPosts={savedPosts}
                          user={user}
                          post={post}
                          fetchSaved={fetchSaved}
                        />
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
          <section className="flex justify-center">
            <div className="flex flex-col main-section mb-8">
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
                      className="relative bg-gray-300 rounded-lg group main-feed"
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
                          <LikeToggleButton
                            likedPosts={likedPosts}
                            user={user}
                            post={post}
                            fetchLiked={fetchLiked}
                          />
                          <SaveToggleButton
                            savedPosts={savedPosts}
                            user={user}
                            post={post}
                            fetchSaved={fetchSaved}
                          />
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
