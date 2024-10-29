import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  fetchSearchedPosts,
  fetchLikedPosts,
  fetchSavedPosts,
} from "../../api/post";
import SearchedPostsBox from "../../components/SearchedPostsBox";

const Searched = () => {
  const location = useLocation();
  const { params } = location.state || {};
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const userCode = localStorage.getItem("userCode");

  useEffect(() => {
    if (params && Object.keys(params).length > 0) {
      fetchSearchedPostsData(params);
    }
  }, [params]);

  useEffect(() => {
    fetchLikedPostsData();
    fetchSavedPostsData();
  }, [userCode]);

  const fetchSearchedPostsData = async (params) => {
    try {
      const data = await fetchSearchedPosts(params);
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching searched posts:", error);
      setPosts([]); // 오류 발생 시 빈 배열로 초기화
    }
  };

  const fetchLikedPostsData = async () => {
    if (userCode) {
      const response = await fetchLikedPosts(userCode);
      const liked = response.data.postInfoList.map((post) => ({
        ...post,
        isLiked: true,
      }));
      setLikedPosts(liked || []);
    }
  };

  const fetchSavedPostsData = async () => {
    if (userCode) {
      const response = await fetchSavedPosts(userCode);
      const saved = response.data.postInfoList.map((post) => ({
        ...post,
        isSaved: true,
      }));
      setSavedPosts(saved || []);
    }
  };

  return (
    <div className="bg-gray-100 text-gray-800">
      <main className="container mx-auto px-4 py-8">
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">검색 결과</h2>
          <SearchedPostsBox
            posts={posts}
            likedPosts={likedPosts}
            savedPosts={savedPosts}
          />
        </section>
      </main>
    </div>
  );
};

export default Searched;
