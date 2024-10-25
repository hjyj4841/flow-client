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
      job = [],
      season = [],
      mood = [],
      heightMin,
      heightMax,
      weightMin,
      weightMax,
      gender,
    } = params;

    const query = new URLSearchParams();

    // 직업 필터 추가
    if (job.length > 0) {
      job.forEach((jobItem) => query.append("jobs[]", jobItem));
    }

    // 시즌 및 무드 필터 추가
    const tagCodes = [...season, ...mood];
    if (tagCodes.length > 0) {
      query.append("tagCodes", tagCodes.join(","));
    }

    // 키 범위 필터 추가
    if (heightMin !== undefined) query.append("heightMin", heightMin);
    if (heightMax !== undefined) query.append("heightMax", heightMax);
    if (weightMin !== undefined) query.append("weightMin", weightMin);
    if (weightMax !== undefined) query.append("weightMax", weightMax);

    // 성별 필터 추가 (undefined일 경우 추가하지 않음)
    if (gender) query.append("gender", gender);

    const queryStr = query.toString();
    const apiUrl = `http://localhost:8080/api/tags/posts?${queryStr}`;
    console.log(`Fetching from: ${apiUrl}`);
    console.log(`Query Parameters: ${queryStr}`);

    try {
      const response = await fetch(apiUrl);
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
