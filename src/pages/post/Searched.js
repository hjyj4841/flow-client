import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { findUser } from "../../api/user";
import {
  fetchSearchedPosts,
  fetchLikedPosts,
  fetchSavedPosts,
} from "../../api/post";
import SearchedPostsBox from "../../components/SearchedPostsBox";

const Searched = () => {
  const { token, logout } = useAuth();
  const [user, setUser] = useState({ userCode: 0 });
  const location = useLocation();
  const { params } = location.state || {};
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    if (token) {
      getUserInfo();
    }
  }, [token]);

  const getUserInfo = async () => {
    try {
      const response = await findUser(token);
      if (response.data.error) {
        logout();
      } else {
        setUser(response.data);
      }
    } catch {
      logout();
    }
  };

  useEffect(() => {
    if (params && Object.keys(params).length > 0) {
      fetchSearched(params);
    }
    if (user.userCode !== 0) {
      fetchLiked();
      fetchSaved();
    }
  }, [params, user.userCode]);

  const fetchSearched = async (params) => {
    const response = await fetchSearchedPosts(params);
    console.log(response);
    setPosts(response || []);
  };

  const fetchLiked = async () => {
    const response = await fetchLikedPosts(user.userCode);
    const liked = response.data.postInfoList.map((post) => ({
      ...post,
      isLiked: true,
    }));
    setLikedPosts(liked || []);
  };

  const fetchSaved = async () => {
    const response = await fetchSavedPosts(user.userCode);
    const saved = response.data.postInfoList.map((post) => ({
      ...post,
      isSaved: true,
    }));
    setSavedPosts(saved || []);
  };

  return (
    <div className="bg-gray-100 text-gray-800">
      <main className="container mx-auto px-4 py-8">
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Searched Result</h2>
          <SearchedPostsBox
            posts={posts}
            likedPosts={likedPosts}
            savedPosts={savedPosts}
            user={user}
            fetchLiked={fetchLiked}
            fetchSaved={fetchSaved}
          />
        </section>
      </main>
    </div>
  );
};

export default Searched;
