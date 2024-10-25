import { Link } from "react-router-dom";
import LikeToggleButton from "./toggleBtn/LikeToggleButton";
import SaveToggleButton from "./toggleBtn/SaveToggleButton";
import { useNavigate } from "react-router-dom";

const MainPostsBox = ({
  user,
  feed,
  posts,
  likedPosts,
  fetchLiked,
  savedPosts,
  fetchSaved,
}) => {
  const navigate = useNavigate();

  const detail = (postCode, e) => {
    // 막고 싶은 태그 리스트
    const blockedClasses = ["mx-2"];
    // 이벤트가 발생한 요소의 className 체크
    if (
      blockedClasses.some((className) => e.target.classList.contains(className))
    ) {
      e.stopPropagation(); // 해당 태그일 경우 이벤트를 막음
      return;
    }
    // 나머지 태그에서는 네비게이션 동작
    navigate(`/post/${postCode}`);
  };

  return (
    <section className="mb-8 flex justify-center">
      <div className="flex flex-col main-section">
        <h2 className="text-xl font-bold mb-4">
          <Link
            to={
              feed === "popularFeed"
                ? "/popularFeed"
                : feed === "newFeed"
                ? "/newFeed"
                : "/myFollowerFeed"
            }
            className="hover:underline"
          >
            {feed === "popularFeed"
              ? "Popular Feed"
              : feed === "newFeed"
              ? "New Feed"
              : "My Follower's Feed"}
          </Link>
        </h2>

        <div className="main-con grid grid-cols-5 gap-4 flex justify-center content-center">
          {posts.slice(0, 10).map((post) =>
            post.imageUrls.length > 0 ? (
              <div
                key={post.postCode}
                className="relative bg-gray-300 rounded-lg group main-feed"
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
                  <p className="main-text text-white mb-2">{post.postDesc}</p>
                  <div className="flex items-center">
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
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>
    </section>
  );
};
export default MainPostsBox;
