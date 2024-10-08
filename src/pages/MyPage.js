import axios from "axios";
import { useState, useEffect } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { BsCollection } from "react-icons/bs";

const MyPage = () => {
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [createdPosts, setCreatedPosts] = useState([]);

  // 유저 코드 저장 및 불러오기
  const token = localStorage.getItem("token");
  let userCode = "";
  let user = "";
  if (token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    const userData = JSON.parse(window.atob(base64));
    userCode = userData.userCode;
    user = userData;
  }

  // 좋아요 토글 함수
  const handleLikeToggle = async (postCode) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/likes/toggle/${postCode}`,
        user
      );

      setLikedPosts((prevPosts) =>
        prevPosts.map((item) =>
          item.post.postCode === postCode
            ? { ...item, isLiked: !item.isLiked }
            : item
        )
      );
    } catch (error) {
      console.error("Error toggling like", error);
    }
  };

  const fetchLikedPosts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/likes/${userCode}/likes`
      );

      const likedPosts = response.data.postInfoList.map((post) => ({
        ...post,
        isLiked: true, // 좋아요된 게시물에 isLiked 값을 true로 설정
      }));

      setLikedPosts(likedPosts || []);
    } catch (error) {
      console.error("Error fetching liked posts", error);
    }
  };

  const fetchSavedPosts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/collection/${userCode}/collections`
      );
      setSavedPosts(response.data.postInfoList || []);
    } catch (error) {
      console.error("Error fetching saved posts", error);
    }
  };

  const fetchCreatedPosts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/${userCode}/post`
      );
      setCreatedPosts(response.data.postInfoList || []);
    } catch (error) {
      console.error("Error fetching created posts", error);
    }
  };

  useEffect(() => {
    if (likedPosts.length === 0) {
      fetchLikedPosts();
    }
    fetchSavedPosts();
    fetchCreatedPosts();
  }, []);

  useEffect(() => {
    fetchLikedPosts();
  }, [likedPosts]);

  return (
    <div>
      <h2>내가 좋아한 게시물</h2>
      <ul>
        {likedPosts.map((item) => (
          <li key={item.post.postCode}>
            {item.isLiked ? (
              <FaHeart
                onClick={() => handleLikeToggle(item.post.postCode)}
                style={{ color: "red" }}
              />
            ) : (
              <FaRegHeart
                onClick={() => handleLikeToggle(item.post.postCode)}
              />
            )}
            <BsCollection />
            {item.post.postDesc}
            {item.imageFiles.length > 0 && (
              <div>
                {item.imageFiles.map((img) => (
                  <img
                    key={img.postImgCode}
                    src={img.postImgUrl}
                    alt="post"
                    style={{ width: "100px" }}
                  />
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>

      <h2>내가 저장한 게시물</h2>
      <ul>
        {savedPosts.map((item) => (
          <li key={item.post.postCode}>
            {item.isLiked ? (
              <FaHeart
                onClick={() => handleLikeToggle(item.post.postCode)}
                style={{ color: "red" }}
              />
            ) : (
              <FaRegHeart
                onClick={() => handleLikeToggle(item.post.postCode)}
              />
            )}
            <BsCollection />
            {item.post.postDesc}
            {item.imageFiles.length > 0 && (
              <div>
                {item.imageFiles.map((img) => (
                  <img
                    key={img.postImgCode}
                    src={img.postImgUrl}
                    alt="post"
                    style={{ width: "100px" }}
                  />
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>

      <h2>내가 만든 게시물</h2>
      <ul>
        {createdPosts.map((item) => (
          <li key={item.post.postCode}>
            {item.isLiked ? (
              <FaHeart
                onClick={() => handleLikeToggle(item.post.postCode)}
                style={{ color: "red" }}
              />
            ) : (
              <FaRegHeart
                onClick={() => handleLikeToggle(item.post.postCode)}
              />
            )}
            <BsCollection />
            {item.post.postDesc}
            {item.imageFiles.length > 0 && (
              <div>
                {item.imageFiles.map((img) => (
                  <img
                    key={img.postImgCode}
                    src={img.postImgUrl}
                    alt="post"
                    style={{ width: "100px" }}
                  />
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyPage;
