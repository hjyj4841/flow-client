import React, { useEffect, useState } from "react";
import { newFeed } from "../../api/post";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { BsCollection, BsCollectionFill } from "react-icons/bs";
import { SlArrowDown } from "react-icons/sl";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NewFeed = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [newFeedImages, setNewFeedImages] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const navigate = useNavigate();

  const fetchLikedPosts = async () => {
    if (token) {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/likes/${token}/likes`
        );
        const likedPosts = response.data.postInfoList.map((post) => ({
          ...post,
          isLiked: true,
        }));
        setLikedPosts(likedPosts || []);
      } catch (error) {
        console.error("Error fetching liked posts", error);
      }
    }
  };

  const fetchSavedPosts = async () => {
    if (token) {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/collection/${token}/collections`
        );
        const savedPosts = response.data.postInfoList.map((post) => ({
          ...post,
          isSaved: true,
        }));
        setSavedPosts(savedPosts || []);
      } catch (error) {
        console.error("Error fetching saved posts", error);
      }
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await newFeed(1);
      setNewFeedImages(data);
    };

    fetchPosts();
    fetchLikedPosts();
    fetchSavedPosts();
  }, [token]);

  // Toggle like
  const handleLikeToggle = async (postCode) => {
    try {
      await axios.post(`http://localhost:8080/api/likes/toggle/${postCode}`, {
        token,
      });
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
        { token }
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
    <main className="container mx-auto px-4 py-8">
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
                    className="text-white mb-2 cursor-pointer"
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
                        className="mx-2 cursor-pointer"
                      />
                    ) : (
                      <FaRegHeart
                        onClick={() => handleLikeToggle(post.postCode)}
                        className="mx-2 cursor-pointer"
                      />
                    )}
                    {savedPosts.some(
                      (savedPost) => savedPost.post.postCode === post.postCode
                    ) ? (
                      <BsCollectionFill
                        onClick={() => handleSaveToggle(post.postCode)}
                        style={{ color: "black" }}
                        className="mx-2 cursor-pointer"
                      />
                    ) : (
                      <BsCollection
                        onClick={() => handleSaveToggle(post.postCode)}
                        className="mx-2 cursor-pointer"
                      />
                    )}
                  </div>
                </div>
              </div>
            ) : null
          )}
        </div>
        <SlArrowDown />
      </section>
    </main>
  );
};

export default NewFeed;
