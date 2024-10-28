import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { BsCollection, BsCollectionFill } from "react-icons/bs";

const Searched = () => {
  const location = useLocation();
  const { params } = location.state || {};
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userCode = localStorage.getItem("userCode");

  useEffect(() => {
    if (params && Object.keys(params).length > 0) {
      fetchSearchedPosts(params);
    } else {
      setLoading(false);
    }
  }, [params]);

  const fetchSearchedPosts = async (params) => {
    const apiUrl = `http://localhost:8080/api/search/posts`;

    try {
      const response = await axios.post(apiUrl, params);
      console.log("API 응답:", response.data);
      setPosts(response.data || []); // 데이터가 없을 경우 빈 배열로 설정
    } catch (error) {
      console.error("게시글을 가져오는 중 오류 발생:", error);
      setError("게시글을 가져오는 데 실패했습니다.");
    } finally {
      setLoading(false);
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
        console.error("좋아요 게시글을 가져오는 중 오류 발생", error);
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
        console.error("저장된 게시글을 가져오는 중 오류 발생", error);
      }
    }
  };

  useEffect(() => {
    fetchLikedPosts();
    fetchSavedPosts();
  }, [userCode]);

  const handleLikeToggle = async (postCode) => {
    try {
      await axios.post(`http://localhost:8080/api/likes/toggle/${postCode}`, {
        userCode,
      });
      fetchLikedPosts();
    } catch (error) {
      console.error("좋아요 토글 중 오류 발생", error);
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
      console.error("저장 토글 중 오류 발생", error);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">검색된 결과</h2>
        {loading ? (
          <p>로딩 중...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {Array.isArray(posts) && posts.length > 0 ? (
              posts.map((post) => {
                const hasImage =
                  Array.isArray(post.imageUrls) && post.imageUrls.length > 0;

                return (
                  <div
                    key={post.postCode}
                    className="relative w-full h-64 bg-gray-300 rounded-lg group"
                  >
                    {hasImage && (
                      <img
                        src={post.imageUrls[0]}
                        alt={post.postDesc || "게시글 이미지"}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    )}
                    <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white mb-2 cursor-pointer">
                        {post.postDesc}
                      </p>
                      <div className="flex items-center">
                        {likedPosts.some(
                          (likedPost) => likedPost.postCode === post.postCode
                        ) ? (
                          <FaHeart
                            onClick={() => handleLikeToggle(post.postCode)}
                            style={{ color: "red", fontSize: "30px" }}
                            className="mx-2 cursor-pointer"
                          />
                        ) : (
                          <FaRegHeart
                            onClick={() => handleLikeToggle(post.postCode)}
                            style={{ fontSize: "30px" }}
                            className="mx-2 cursor-pointer"
                          />
                        )}
                        {savedPosts.some(
                          (savedPost) => savedPost.postCode === post.postCode
                        ) ? (
                          <BsCollectionFill
                            onClick={() => handleSaveToggle(post.postCode)}
                            style={{ color: "black", fontSize: "30px" }}
                            className="mx-2 cursor-pointer"
                          />
                        ) : (
                          <BsCollection
                            onClick={() => handleSaveToggle(post.postCode)}
                            style={{ fontSize: "30px" }}
                            className="mx-2 cursor-pointer"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>검색 결과가 없습니다.</p>
            )}
          </div>
        )}
      </section>
    </main>
  );
};

export default Searched;
