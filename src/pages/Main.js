import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { BsCollection, BsCollectionFill } from "react-icons/bs";

const Main = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [newFeedImages, setNewFeedImages] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [followedUserPosts, setFollowedUserPosts] = useState([]);
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
      `http://localhost:8080/api/posts/followed/${userCode}`
    );
    setFollowedUserPosts(response.data);
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

  const detail = (postCode) => {
    navigate(`/post/${postCode}`);
  };

  return (
    <div className="bg-gray-100 text-gray-800">
      <section className="bg-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex overflow-x-auto space-x-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex-none w-16 h-16 bg-gray-300 rounded-full"
            />
          ))}
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        {/* Popular Feed Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">POPULAR FEED</h2>
          <div className="flex overflow-x-auto space-x-4 mx-4">
            {popularFeedImages.map((post) =>
              post.imageUrls.length > 0 ? (
                <div
                  key={post.postCode}
                  className="relative w-full h-64 bg-gray-300 rounded-lg group"
                >
                  <img
                    src={post.imageUrls[0]}
                    alt={post.postDesc}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p
                      className="text-white mb-2 w-full flex justify-center items-center text-sm truncate"
                      onClick={() => detail(post.postCode)}
                    >
                      {post.postDesc}
                    </p>
                    <div className="flex justify-center items-center">
                      {likedPosts.some(
                        (likedPost) => likedPost.post.postCode === post.postCode
                      ) ? (
                        <FaHeart
                          onClick={() => handleLikeToggle(post.postCode)}
                          style={{ color: "red" }}
                          className="mx-2"
                        />
                      ) : (
                        <FaRegHeart
                          onClick={() => handleLikeToggle(post.postCode)}
                          className="mx-2"
                        />
                      )}
                      {savedPosts.some(
                        (savedPost) => savedPost.post.postCode === post.postCode
                      ) ? (
                        <BsCollectionFill
                          onClick={() => handleSaveToggle(post.postCode)}
                          style={{ color: "black" }}
                          className="mx-2"
                        />
                      ) : (
                        <BsCollection
                          onClick={() => handleSaveToggle(post.postCode)}
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

        {/* New Feed Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">NEW FEED</h2>
          <div className="grid grid-cols-4 gap-4">
            {newFeedImages.map((post) =>
              post.imageUrls.length > 0 ? (
                <div
                  key={post.postCode}
                  className="relative w-full h-64 bg-gray-300 rounded-lg group"
                >
                  <img
                    src={post.imageUrls[0]}
                    alt={post.postDesc}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p
                      className="text-white mb-2"
                      onClick={() => detail(post.postCode)}
                    >
                      {post.postDesc}
                    </p>
                    <div className="flex items-center">
                      {likedPosts.some(
                        (likedPost) => likedPost.post.postCode === post.postCode
                      ) ? (
                        <FaHeart
                          onClick={() => handleLikeToggle(post.postCode)}
                          style={{ color: "red" }}
                          className="mx-2"
                        />
                      ) : (
                        <FaRegHeart
                          onClick={() => handleLikeToggle(post.postCode)}
                          className="mx-2"
                        />
                      )}
                      {savedPosts.some(
                        (savedPost) => savedPost.post.postCode === post.postCode
                      ) ? (
                        <BsCollectionFill
                          onClick={() => handleSaveToggle(post.postCode)}
                          style={{ color: "black" }}
                          className="mx-2"
                        />
                      ) : (
                        <BsCollection
                          onClick={() => handleSaveToggle(post.postCode)}
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

        {/* Follower's Feed Section */}
        {token && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">My Follower's Feed</h2>
            <div className="grid grid-cols-4 gap-4">
              {followedUserPosts.map((post) =>
                post.imageUrls.length > 0 ? (
                  <div
                    key={post.postCode}
                    className="relative w-full h-64 bg-gray-300 rounded-lg group"
                  >
                    <img
                      src={post.imageUrls[0]}
                      alt={post.postDesc}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p
                        className="text-white mb-2"
                        onClick={() => detail(post.postCode)}
                      >
                        {post.postDesc}
                      </p>
                      <div className="flex items-center">
                        {likedPosts.some(
                          (likedPost) =>
                            likedPost.post.postCode === post.postCode
                        ) ? (
                          <FaHeart
                            onClick={() => handleLikeToggle(post.postCode)}
                            style={{ color: "red" }}
                            className="mx-2"
                          />
                        ) : (
                          <FaRegHeart
                            onClick={() => handleLikeToggle(post.postCode)}
                            className="mx-2"
                          />
                        )}
                        {savedPosts.some(
                          (savedPost) =>
                            savedPost.post.postCode === post.postCode
                        ) ? (
                          <BsCollectionFill
                            onClick={() => handleSaveToggle(post.postCode)}
                            style={{ color: "black" }}
                            className="mx-2"
                          />
                        ) : (
                          <BsCollection
                            onClick={() => handleSaveToggle(post.postCode)}
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
        )}
      </main>
    </div>
  );
};

export default Main;
