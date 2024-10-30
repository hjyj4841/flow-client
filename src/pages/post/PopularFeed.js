import React, { useEffect, useState } from "react";
import axios from "axios";
import { SlArrowDown } from "react-icons/sl";
import { useNavigate } from "react-router-dom";
import LikeToggleButton from "../../components/toggleBtn/LikeToggleButton";
import SaveToggleButton from "../../components/toggleBtn/SaveToggleButton";
import "../../assets/css/popularfeed.css";

const PopularFeed = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [popularFeedImages, setPopularFeedImages] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

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
      fetchPosts(page);
      fetchLikedPosts();
      fetchSavedPosts();
    }
  }, [token, userCode, page]);

  const fetchPosts = async (currentPage) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/likes/post/ordered-by-likes?page=${currentPage}`
      );
      const { content, totalPages } = response.data;
      setPopularFeedImages((prev) => [...prev, ...content]);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching popular feed", error);
    }
  };

  const fetchLikedPosts = async () => {
    if (token) {
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
    if (token) {
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

  const loadMorePosts = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const detail = (postCode) => {
    navigate(`/post/${postCode}`);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">POPULAR FEED</h2>
        <div className="grid grid-cols-4 gap-4">
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
                    className="text-white cursor-pointer popular-p"
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
        {page < totalPages && <SlArrowDown onClick={loadMorePosts} />}
      </section>
    </main>
  );
};

export default PopularFeed;
