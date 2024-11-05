import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LikeToggleButton from "../../components/toggleBtn/LikeToggleButton";
import SaveToggleButton from "../../components/toggleBtn/SaveToggleButton";
import { SlArrowDown } from "react-icons/sl";

const MyFollowerFeed = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [followingUserPosts, setFollowingUserPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

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
      fetchFollowingUserPosts(page);
      fetchLikedPosts();
      fetchSavedPosts();
    }
  }, [token, userCode, page]);

  const fetchFollowingUserPosts = async (currentPage) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/posts/following/${userCode}?page=${currentPage -
          1}`
      );

      console.log("Response data:", response.data);

      setFollowingUserPosts((prev) => [
        ...prev,
        ...(response.data.content || []),
      ]);
      setTotalPages(response.data.totalPages);
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

  const navigate = useNavigate();

  const detail = (postCode) => {
    navigate(`/post/${postCode}`);
  };

  const loadMorePosts = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="bg-gray-100 text-gray-800">
      <main className="container">
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">MY FOLLOWER'S FEED</h2>
          <div className="mff-con grid grid-cols-5 gap-4">
            {followingUserPosts.map((post) =>
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
                    <div className="absolute top-2 left-2 flex space-x-2">
                      <LikeToggleButton
                        likedPosts={likedPosts}
                        user={{ userCode }}
                        post={post}
                        fetchLiked={fetchLikedPosts}
                      />
                      <SaveToggleButton
                        savedPosts={savedPosts}
                        user={{ userCode }}
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
    </div>
  );
};

export default MyFollowerFeed;
