import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import "../assets/css/main.css";
import { findUser } from "../api/user";
import {
  fetchLikedPosts,
  fetchSavedPosts,
  followedUserPosts,
  newFeed,
  popularFeed,
} from "../api/post";
import MainPostsBox from "../components/MainPostsBox";

const Main = () => {
  // 토큰 받아오기
  const { token, logout } = useAuth();
  const [user, setUser] = useState({
    userCode: 0,
  });
  const [newFeedImages, setNewFeedImages] = useState([]);
  const [followingUserPosts, setFollowingUserPosts] = useState([]);
  const [popularFeedImages, setPopularFeedImages] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    if (token !== null) {
      getUserInfo();
    }
    fetchNewFeedImages();
    fetchPopularFeedImages();
  }, []);

  const getUserInfo = async () => {
    const respones = (await findUser(token)).data;
    if (respones.error) logout();
    else setUser(respones);
  };

  const fetchNewFeedImages = async () => {
    const response = await newFeed();
    setNewFeedImages(response);
  };
  const fetchPopularFeedImages = async () => {
    const response = await popularFeed();
    setPopularFeedImages(response);
  };

  useEffect(() => {
    if (user.userCode !== 0) {
      fetchLiked();
      fetchSaved();
      fetchFollowedUserPosts();
    }
    console.log(newFeedImages);
  }, [user.userCode]);

  // Fetch liked posts
  const fetchLiked = async () => {
    const response = await fetchLikedPosts(user.userCode);
    console.log(response);
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

  const fetchFollowedUserPosts = async () => {
    const response = await followedUserPosts(user.userCode);
    setFollowingUserPosts(response);
  };

  return (
    <div className="bg-gray-100 text-gray-800">
      <section className="bg-white py-4 shadow-md flex justify-center" />
      <main className="container mx-auto">
        <div className="mb-8 flex justify-center">
          <video
            className="mainVideo"
            src="http://192.168.10.51:8081/video/mainVideo.mp4"
            autoPlay
            loop
            muted
            width="1200px"
            style={{ boxShadow: "0px 0px 10px 5px black" }}
          />
        </div>
        {/* Popular Feed Section */}
        <MainPostsBox
          user={user}
          feed="popularFeed"
          posts={popularFeedImages}
          likedPosts={likedPosts}
          fetchLiked={fetchLiked}
          savedPosts={savedPosts}
          fetchSaved={fetchSaved}
        />
        {/* New Feed Section */}
        <MainPostsBox
          user={user}
          feed="newFeed"
          posts={newFeedImages}
          likedPosts={likedPosts}
          fetchLiked={fetchLiked}
          savedPosts={savedPosts}
          fetchSaved={fetchSaved}
        />
        {/* Follower's Feed Section */}
        {user.userCode !== 0 && (
          <MainPostsBox
            user={user}
            feed="myFollowerFeed"
            posts={followingUserPosts}
            likedPosts={likedPosts}
            fetchLiked={fetchLiked}
            savedPosts={savedPosts}
            fetchSaved={fetchSaved}
          />
        )}
      </main>
    </div>
  );
};
export default Main;
