import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";

const VotePost = () => {
  const [token, setToken] = useState(null);
  const [newFeedImages, setNewFeedImages] = useState([]);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    fetchNewFeedImages();
  }, []);

  const fetchNewFeedImages = async () => {
    const response = await axios.get("http://localhost:8080/api/post");
    console.log(response.data);
    setNewFeedImages(response.data);
  };

  const detail = (postCode, postType, e) => {
    // 나머지 태그에서는 네비게이션 동작
    Navigate(`/votePost/${postCode}`);
  };

  return (
    // 나중에 투표 게시물만 표시 되게 구현 .... 투표게시물 구현 중
    <>
      <section className="bg-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex overflow-x-auto space-x-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex-none w-16 h-16 bg-gray-300 rounded-full"
            />
          ))}
        </div>
      </section>
      <Link className="text-sm" to={"/uploadVote"}>
        투표업로드
      </Link>
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">
          <Link to="/votePost" className="hover:underline">
            NEW VOTE
          </Link>
        </h2>
        <div className="nf-con grid grid-cols-5 gap-4">
          {newFeedImages.slice(0, 10).map((post) =>
            post.imageUrls.length > 0 ? (
              <div
                key={post.postCode}
                className="relative w-256 h-350 bg-gray-300 rounded-lg group mb-5 n-feed"
              >
                <img
                  src={post.imageUrls[0]}
                  alt={post.postDesc}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div
                  className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                  onClick={(e) => detail(post.postCode, e)}
                >
                  <p className="nf-text text-white mb-2">{post.postDesc}</p>
                </div>
              </div>
            ) : null
          )}
        </div>
      </section>
    </>
  );
};

export default VotePost;
