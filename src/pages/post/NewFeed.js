import React, { useEffect, useState } from "react";
import { newFeed } from "../../api/post";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LikeToggleButton from "../../components/toggleBtn/LikeToggleButton";
import SaveToggleButton from "../../components/toggleBtn/SaveToggleButton";
import { SlArrowDown } from "react-icons/sl";
import "../../assets/css/newfeed.scoped.scss";

const NewFeed = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [newFeedImages, setNewFeedImages] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const userCode = token
    ? JSON.parse(window.atob(token.split(".")[1])).userCode
    : "";

  useEffect(() => {
    if (token && userCode) {
      fetchPosts(page);
      fetchLikedPosts();
      fetchSavedPosts();
    }
  }, [token, userCode, page]);

  const fetchPosts = async (currentPage) => {
    try {
      const data = await newFeed(currentPage);
      const content = data.content || []; // `content`를 안전하게 추출
      setNewFeedImages((prev) => [...prev, ...content]);
    } catch (error) {
      console.error("Error fetching new feed images:", error);
    }
  };

  const fetchLikedPosts = async () => {
    if (userCode) {
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
    }
  };

  const fetchSavedPosts = async () => {
    if (userCode) {
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
    }
  };

  const loadMorePosts = () => setPage((prev) => prev + 1);

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
                  <div className="absolute top-2 left-2 flex space-x-2">
                    <LikeToggleButton
                      likedPosts={likedPosts}
                      user={{ userCode }} // user object를 생성
                      post={post}
                      fetchLiked={fetchLikedPosts}
                    />
                    <SaveToggleButton
                      savedPosts={savedPosts}
                      user={{ userCode }} // user object를 생성
                      post={post}
                      fetchSaved={fetchSavedPosts}
                    />
                  </div>
                </div>
              </div>
            ) : null
          )}
        </div>
        <SlArrowDown onClick={loadMorePosts} />
      </section>
    </main>
  );
};

export default NewFeed;
