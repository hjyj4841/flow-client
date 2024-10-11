import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { BsCollection, BsCollectionFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [newFeedImages, setNewFeedImages] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const navigate = useNavigate();

  let userCode = "";
  let user = "";
  if (token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    const userData = JSON.parse(window.atob(base64));
    userCode = userData.userCode;
    console.log(userCode);
    user = userData;
  }
  useEffect(() => {
    setToken(localStorage.getItem("token"));
    fetchNewFeedImages();
    fetchLikedPosts();
    fetchSavedPosts();
  }, []);

  const fetchNewFeedImages = async () => {
    const response = await axios.get("http://localhost:8080/api/post");
    setNewFeedImages(response.data);
  };

  const fetchLikedPosts = async () => {
    const response = await axios.get(
      `http://localhost:8080/api/likes/${userCode}/likes`
    );
    const likedPosts = response.data.postInfoList.map((post) => ({
      ...post,
      isLiked: true,
    }));
    setLikedPosts(likedPosts || []);
  };

  const fetchSavedPosts = async () => {
    const response = await axios.get(
      `http://localhost:8080/api/collection/${userCode}/collections`
    );
    const savedPosts = response.data.postInfoList.map((post) => ({
      ...post,
      isSaved: true,
    }));
    setSavedPosts(savedPosts || []);
  };

  const handleLikeToggle = async (postCode) => {
    try {
      await axios.post(
        `http://localhost:8080/api/likes/toggle/${postCode}`,
        user
      );
      setLikedPosts((prevPosts) =>
        prevPosts.map((item) =>
          item.post.postCode === postCode
            ? { ...item, isLiked: !item.isLiked }
            : item
        )
      );
      await fetchLikedPosts();
    } catch (error) {
      console.error("Error toggling like", error);
    }
  };

  const handleSaveToggle = async (postCode) => {
    try {
      await axios.post(
        `http://localhost:8080/api/collection/toggle/${postCode}`,
        user
      );
      setSavedPosts((prevPosts) =>
        prevPosts.map((item) =>
          item.post.postCode === postCode
            ? { ...item, isSaved: !item.isSaved }
            : item
        )
      );

      await fetchSavedPosts();
    } catch (error) {
      console.error("Error toggling save", error);
    }
  };

  return (
    <>
      <div className="bg-gray-100 text-gray-800">
        <section className="bg-white py-4 shadow-md">
          <div className="container mx-auto px-4 flex overflow-x-auto space-x-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="flex-none w-16 h-16 bg-gray-300 rounded-full"
              ></div>
            ))}
          </div>
        </section>
        <main className="container mx-auto px-4 py-8">
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">POPULAR FEED</h2>
            <div className="flex items-center">
              <button className="text-2xl">&lt;</button>
              <div className="flex overflow-x-auto space-x-4 mx-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-none w-48 h-64 bg-gray-300 rounded-lg"
                  ></div>
                ))}
              </div>
              <button className="text-2xl">&gt;</button>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">NEW FEED</h2>
            <div className="grid grid-cols-4 gap-4">
              {newFeedImages.map((post) =>
                post.imageUrls.map((url, index) => (
                  <div
                    key={`${post.postCode}-${index}`}
                    className="relative w-full h-64 bg-gray-300 rounded-lg group"
                  >
                    <img
                      src={url}
                      alt={post.postDesc}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white mb-2">{post.postDesc}</p>
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
                ))
              )}
            </div>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-4">My Follower's FEED</h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-full h-64 bg-gray-300 rounded-lg"
                ></div>
              ))}
            </div>
            <button className="px-4 py-2 border border-gray-800 rounded-full">
              더 보러가기
            </button>
          </section>
        </main>
      </div>
    </>
  );
};

export default Main;
