import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Searched = () => {
  const location = useLocation();
  const { params } = location.state || {};
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (params) {
      console.log("Params:", params);
      fetchSearchedPosts(params);
    } else {
      console.log("No params found");
    }
  }, [params]);

  const fetchSearchedPosts = async (params) => {
    const {
      jobs = [],
      seasons = [],
      moods = [],
      heightMin,
      heightMax,
      weightMin,
      weightMax,
      gender,
    } = params;

    const query = new URLSearchParams();

    if (jobs.length > 0) {
      jobs.forEach((job) => query.append("jobs[]", job));
    }

    const tagCodes = [...seasons, ...moods];
    if (tagCodes.length > 0) {
      query.append("tagCodes", tagCodes.join(","));
    }

    if (heightMin !== undefined) query.append("heightMin", heightMin);
    if (heightMax !== undefined) query.append("heightMax", heightMax);
    if (weightMin !== undefined) query.append("weightMin", weightMin);
    if (weightMax !== undefined) query.append("weightMax", weightMax);
    if (gender) query.append("gender", gender);

    console.log(`Fetching from: /api/tags/posts?${query}`);

    try {
      const response = await fetch(`/api/tags/posts?${query}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched data:", data);
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
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
