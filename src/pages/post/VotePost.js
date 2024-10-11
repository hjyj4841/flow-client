import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
  return (
    // 나중에 투표 게시물만 표시 되게 구현 .... 투표게시물 구현 중
    <>
      <Link className="text-sm" to={"/uploadVotePost"}>
        투표업로드
      </Link>
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">NEW FEED</h2>
        <div className="grid grid-cols-4 gap-4">
          {newFeedImages.map((post) =>
            post.imageUrls.map((url, index) => (
              <div
                key={`${post.postCode}-${index}`}
                className="w-full h-64 bg-gray-300 rounded-lg"
              >
                <img
                  src={url}
                  alt={post.postDesc}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
};

export default VotePost;
