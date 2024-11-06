import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { newVote } from "../../api/post";
import { useAuth } from "../../contexts/AuthContext";

const VotePost = () => {
  const [newFeedImages, setNewFeedImages] = useState([]);
  const navigate = useNavigate();
  const { token } = useAuth();

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

      <section className="flex flex-col justify-center items-center ">
        <h2 className="text-xl pt-5">
          <Link to="/votePost" className="hover:underline text-gray-500">
            VOTE
          </Link>
        </h2>
        <div>
          {token && (
            <Link className="text-sm hover:text-red-500" to={"/uploadVote"}>
              투표업로드
            </Link>
          )}

          <div className="grid grid-cols-4 gap-4 mt-5">
            {newFeedImages.map((post) =>
              post.imageUrls.length > 0 ? (
                <div
                  key={post.postCode}
                  className="relative bg-gray-300 rounded-lg group"
                  style={{ width: "200px", height: "250px" }}
                >
                  <img
                    src={post.imageUrls[0]}
                    alt={post.postDesc}
                    className="object-cover rounded-lg"
                    style={{ width: "200px", height: "250px" }}
                  />
                  <div
                    className="cursor-pointer absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                    onClick={(e) => detail(post.postCode, e)}
                  >
                    <p className="nf-text text-white truncate w-full text-center">
                      {post.postDesc}
                    </p>
                    <div className="flex justify-center items-center pt-3">
                      <img
                        src={post.user.userProfileUrl}
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                      <p className="text-white p-2 text-xs">
                        {post.user.userNickname}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default VotePost;
