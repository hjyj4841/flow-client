import { handleLikeToggle } from "../../api/likes";
import { FaRegHeart, FaHeart } from "react-icons/fa";

const LikeToggleButton = ({ likedPosts, user, post, fetchLiked }) => {
  // Toggle like
  const handleLike = async (postCode) => {
    await handleLikeToggle(postCode, user);
    fetchLiked();
  };

  return (
    <>
      {likedPosts.some(
        (likedPost) => likedPost.post.postCode === post.postCode
      ) ? (
        <FaHeart
          onClick={(e) => {
            e.stopPropagation(); // 이벤트 전파 막기
            handleLike(post.postCode);
          }}
          style={{ color: "red", fontSize: "20px" }}
          className="m-2"
        />
      ) : (
        <FaRegHeart
          onClick={(e) => {
            e.stopPropagation(); // 이벤트 전파 막기
            handleLike(post.postCode);
          }}
          style={{ fontSize: "20px", color: "gainsboro" }}
          className="m-2"
        />
      )}
    </>
  );
};
export default LikeToggleButton;
