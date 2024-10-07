import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Main = () => {
  const [token, setToken] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/post", {
          params: {
            page: 1,
            sort: "newest",
          },
        });
        const formattedPosts = response.data.map((post) => ({
          id: post.postCode, // post.id가 고유한지 확인
          postDesc: post.postDesc,
          postImg: post.postImg || [],
        }));

        setPosts(formattedPosts);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching posts: {error.message}</div>;
  }

  return (
    <div className="bg-gray-100 text-gray-800">
      <section className="bg-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex overflow-x-auto space-x-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={`profile-${i}`} // 각 프로필에 대해 고유한 key 부여
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
                  key={`popular-${i}`} // 고유한 key 부여
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
            {posts.map((post) => (
              <div
                key={post.id}
                className="w-full h-64 bg-gray-300 rounded-lg flex items-center justify-center"
              >
                {post.postImg && post.postImg.length > 0 ? (
                  <img
                    src={post.postImg[0]} // 이미지 URL
                    alt={post.postDesc}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null; // prevent infinite loop
                      e.target.src = "your-fallback-image-url"; // 대체 이미지 URL
                    }}
                  />
                ) : (
                  <p>No Image Available</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">My Follower's FEED</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={`follower-${i}`} // 고유한 key 부여
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
  );
};

export default Main;
