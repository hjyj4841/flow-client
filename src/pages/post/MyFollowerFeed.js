import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { BsCollection, BsCollectionFill } from "react-icons/bs";

const MyFollowerFeed = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [followingUserPosts, setFollowingUserPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);

  let userCode = "";
  if (token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    const userData = JSON.parse(window.atob(base64));
    userCode = userData.userCode;
  }

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    if (token && userCode) {
      fetchFollowingUserPosts();
      fetchLikedPosts();
      fetchSavedPosts();
    }
  }, [token, userCode]);

  const fetchFollowingUserPosts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/posts/following/${userCode}`
      );
      setFollowingUserPosts(response.data);
    } catch (error) {
      console.error("Error fetching follower posts", error);
    }
  };

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

  const handleLikeToggle = async (postCode) => {
    try {
      await axios.post(`http://localhost:8080/api/likes/toggle/${postCode}`, {
        userCode,
      });
      fetchLikedPosts();
    } catch (error) {
      console.error("Error toggling like", error);
    }
  };

  const handleSaveToggle = async (postCode) => {
    try {
      await axios.post(
        `http://localhost:8080/api/collection/toggle/${postCode}`,
        { userCode }
      );
      fetchSavedPosts();
    } catch (error) {
      console.error("Error toggling save", error);
    }
  };

  const navigate = useNavigate();

  const detail = (postCode) => {
    navigate(`/post/${postCode}`);
  };

  return (
    <div className="bg-gray-100 text-gray-800">
      <main className="container">
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">MY FOLLOWER'S FEED</h2>
          <div className="mff-con grid grid-cols-5 gap-4">
            {followingUserPosts.slice(0, 10).map((post) =>
              post.imageUrls.length > 0 ? (
                <div
                  key={post.postCode}
                  className="relative w-full h-64 bg-gray-300 rounded-lg group mf-feed"
                >
                  <img
                    src={post.imageUrls[0]}
                    alt={post.postDesc}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div
                    className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                    onClick={() => detail(post.postCode)}
                  >
                    <p className="mf-text text-white mb-2">{post.postDesc}</p>
                    <div className="flex items-center">
                      {likedPosts.some(
                        (likedPost) => likedPost.post.postCode === post.postCode
                      ) ? (
                        <FaHeart
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLikeToggle(post.postCode);
                          }}
                          style={{ color: "red", fontSize: "30px" }}
                          className="mx-2"
                        />
                      ) : (
                        <FaRegHeart
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLikeToggle(post.postCode);
                          }}
                          style={{ fontSize: "30px" }}
                          className="mx-2"
                        />
                      )}
                      {savedPosts.some(
                        (savedPost) => savedPost.post.postCode === post.postCode
                      ) ? (
                        <BsCollectionFill
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveToggle(post.postCode);
                          }}
                          style={{ color: "white", fontSize: "30px" }}
                          className="mx-2"
                        />
                      ) : (
                        <BsCollection
                          onClick={(e) => {
                            e.stopPropagation();
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
        </section>
      </main>
    </div>
  );
};

export default MyFollowerFeed;
