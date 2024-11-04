import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { newVote } from "../../api/post";

const VotePost = () => {
  const [newFeedImages, setNewFeedImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNewFeedImages();
  }, []);

  const fetchNewFeedImages = async () => {
    const response = await newVote();
    setNewFeedImages(response);
  };

  const detail = (postCode) => {
    // 나머지 태그에서는 네비게이션 동작
    navigate(`/votePost/${postCode}`);
  };

  return (
    // 나중에 투표 게시물만 표시 되게 구현 .... 투표게시물 구현 중
    <>
      <section className="bg-white py-4 shadow-md" />
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
          {newFeedImages.map((post) =>
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
