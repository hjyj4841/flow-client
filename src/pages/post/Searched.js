import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Searched = () => {
  const location = useLocation();
  const { params } = location.state || {};

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (params) {
      fetchSearchedPosts(params);
    }
  }, [params]);

  const fetchSearchedPosts = async (params) => {
    const { jobs, seasons, moods } = params;

    const apiParams = {
      "jobs[]": jobs.length > 0 ? jobs : undefined,
      "seasons[]": seasons.length > 0 ? seasons : undefined,
      "moods[]": moods.length > 0 ? moods : undefined,
    };

    try {
      const response = await axios.get("http://localhost:8080/api/tags/posts", {
        params: apiParams,
      });
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching searched posts", error);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Searched Results</h2>
        <div className="grid grid-cols-4 gap-4">
          {posts.length > 0 ? (
            posts.map((post) => (
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
                  <p className="text-white mb-2 cursor-pointer">
                    {post.postDesc}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No posts found for the selected filters.</p>
          )}
        </div>
      </section>
    </main>
  );
};

export default Searched;
