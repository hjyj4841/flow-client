import React from "react";
import { useNavigate } from "react-router-dom";
import LikeToggleButton from "./toggleBtn/LikeToggleButton";
import SaveToggleButton from "./toggleBtn/SaveToggleButton";

const SearchedPostsBox = ({
  user,
  posts,
  likedPosts,
  savedPosts,
  fetchLiked,
  fetchSaved,
}) => {
  const navigate = useNavigate();

  const detail = (postCode, e) => {
    const blockedClasses = ["mx-2"];
    if (
      blockedClasses.some((className) => e.target.classList.contains(className))
    ) {
      e.stopPropagation();
      return;
    }
    navigate(`/post/${postCode}`);
  };

  return (
    <section className="flex justify-center">
      <div className="flex flex-col main-section mb-8">
        <div className="main-con grid grid-cols-5 gap-4 flex justify-center content-center">
          {Array.isArray(posts) && posts.length > 0 ? (
            posts.map((post) => {
              const hasImage =
                Array.isArray(post.imageUrls) && post.imageUrls.length > 0;

              return (
                <div
                  key={post.postCode}
                  className="relative bg-gray-300 rounded-lg group main-feed drag-prevent"
                >
                  {hasImage && (
                    <img
                      src={post.imageUrls[0]}
                      alt={post.postDesc || "게시글 이미지"}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  )}
                  <div
                    className="absolute inset-0 flex flex-col justify-start items-start bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                    onClick={(e) => detail(post.postCode, e)}
                  >
                    <div className="flex">
                      <LikeToggleButton
                        likedPosts={likedPosts}
                        user={user}
                        post={post}
                        fetchLiked={fetchLiked}
                      />
                      <SaveToggleButton
                        savedPosts={savedPosts}
                        user={user}
                        post={post}
                        fetchSaved={fetchSaved}
                      />
                    </div>
                    <div className="h-full w-full flex justify-center items-center flex-col">
                      <p className="main-text text-white">
                        {post.postDesc === null
                          ? "내용 없음..."
                          : post.postDesc}
                      </p>
                      <div className="flex justify-center items-center">
                        {post.user.userProfileUrl && (
                          <img
                            src={post.user.userProfileUrl}
                            alt={post.user.userNickname}
                            style={{
                              width: "30px",
                              height: "30px",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                        )}
                        <p className="text-white p-2 text-xs">
                          {post.user.userNickname || "알 수 없는 사용자"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>검색 결과가 없습니다.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default SearchedPostsBox;
