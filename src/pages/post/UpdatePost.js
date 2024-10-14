import { useParams } from "react-router-dom";
import { updatePost, detailPost, detailImg } from "../../api/post";
import Post from "../../components/Post";
import { useState, useEffect } from "react";

const UpdatePost = () => {
  const { postCode } = useParams();
  const [updateImg, setUpdateImg] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState(new Set());
  let postUserCode = "";

  // userCode 가져오기
  const token = localStorage.getItem("token");
  let userCode = "";
  if (token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    const userData = JSON.parse(window.atob(base64));
    userCode = userData.userCode;
  }

  // 기존 post DTO 내용 가져오기
  const detailView = async () => {
    const result = await detailPost(postCode);
    // console.log(result); // only post
  };

  // 기존 postImg 내용 가져오기
  const detailImgs = async () => {
    const response = await detailImg(postCode);
    // console.log(response.data);
    setUpdateImg(response.data);
  };

  // 이미지 삭제 버튼
  const handleDelete = (postImgCode) => {
    // 이미지 미리보기에서 삭제
    setImagesToDelete((prev) => {
      const updatedSet = new Set(prev);
      updatedSet.add(postImgCode);

      const remainingImages = updateImg.filter(
        (post) => !updatedSet.has(post.postImgCode)
      );
      // console.log(remainingImages); // 남은거
      console.log(updatedSet); // 삭제된거

      return updatedSet;
    });
  };

  useEffect(() => {
    detailImgs();
  }, []);

  const updateForm = () => {};

  return (
    <>
      <div className="update-post-form">
        {updateImg
          .filter((post) => !imagesToDelete.has(post.postImgCode)) // 삭제할 이미지 제외
          .map((post) => (
            <div
              key={post.postImgCode}
              style={{ position: "relative", display: "inline-block" }}
            >
              <img
                src={post.postImgUrl}
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  margin: "5px",
                }}
              />
              <button
                onClick={() => handleDelete(post.postImgCode)}
                style={{
                  position: "absolute",
                  fontWeight: "bold",
                  top: "0",
                  right: "0",
                  color: "white",
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  padding: "2px 5px",
                  borderRadius: "3px",
                  cursor: "pointer",
                }}
              >
                X
              </button>
            </div>
          ))}

        <button onClick={updateForm}>수정 완료</button>
      </div>
    </>
  );
};

export default UpdatePost;
