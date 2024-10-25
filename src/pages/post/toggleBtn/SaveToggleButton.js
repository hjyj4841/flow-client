import { handleSaveToggle } from "../../../api/collection";
import { BsCollection, BsCollectionFill } from "react-icons/bs";

const SaveToggleButton = ({ savedPosts, user, post, fetchSaved }) => {
  // Toggle save
  const handleSave = async (postCode) => {
    await handleSaveToggle(postCode, user);
    fetchSaved();
  };

  return (
    <>
      {savedPosts.some(
        (savedPost) => savedPost.post.postCode === post.postCode
      ) ? (
        <BsCollectionFill
          onClick={(e) => {
            e.stopPropagation(); // 이벤트 전파 막기
            handleSave(post.postCode);
          }}
          style={{ color: "white", fontSize: "30px" }}
          className="mx-2"
        />
      ) : (
        <BsCollection
          onClick={(e) => {
            e.stopPropagation(); // 이벤트 전파 막기
            handleSave(post.postCode);
          }}
          style={{ fontSize: "30px" }}
          className="mx-2"
        />
      )}
    </>
  );
};
export default SaveToggleButton;
