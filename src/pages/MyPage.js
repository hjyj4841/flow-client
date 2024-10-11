import axios from "axios";
import { useState, useEffect } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { BsCollection } from "react-icons/bs";
import { BsCollectionFill } from "react-icons/bs";
import FollowButton from "./follow/FollowButton";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [createdPosts, setCreatedPosts] = useState([]);
  const navigate = useNavigate();

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
  const myFollower = (userCode) => {
    navigate(`follow/myFollower/${userCode}`);
  }
  const followMeUsers = (userCode) => {
    navigate(`follow/followMeUsers/${userCode}`);
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

      // 좋아요 상태 업데이트 후 다시 데이터를 가져옴
      await fetchLikedPosts();
    } catch (error) {
      console.error("Error toggling like", error);
    }
  };

  // 저장 토글 함수
  const handleSaveToggle = async (postCode) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/collection/toggle/${postCode}`,
        user
      );

      setSavedPosts((prevPosts) =>
        prevPosts.map((item) =>
          item.post.postCode === postCode
            ? { ...item, isSaved: !item.isSaved }
            : item
        )
      );

      // 저장 상태 업데이트 후 다시 데이터를 가져옴
      await fetchSavedPosts();
    } catch (error) {
      console.error("Error toggling save", error);
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

      const savedPosts = response.data.postInfoList.map((post) => ({
        ...post,
        isSaved: true, // 저장된 게시물에 isSaved 값을 true로 설정
      }));

      setSavedPosts(savedPosts || []);
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
    fetchLikedPosts();
    fetchSavedPosts();
    fetchCreatedPosts();
  }, []);

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
            {item.isSaved ? (
              <BsCollectionFill
                onClick={() => handleSaveToggle(item.post.postCode)}
                style={{ color: "black" }}
              />
            ) : (
              <BsCollection
                onClick={() => handleSaveToggle(item.post.postCode)}
              />
            )}
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
            {item.isSaved ? (
              <BsCollectionFill
                onClick={() => handleSaveToggle(item.post.postCode)}
                style={{ color: "black" }}
              />
            ) : (
              <BsCollection
                onClick={() => handleSaveToggle(item.post.postCode)}
              />
            )}
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
            {item.isSaved ? (
              <BsCollectionFill
                onClick={() => handleSaveToggle(item.post.postCode)}
                style={{ color: "black" }}
              />
            ) : (
              <BsCollection
                onClick={() => handleSaveToggle(item.post.postCode)}
              />
            )}
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
      <div>
      <button onClick={() => myFollower(userCode)}>내가 팔로우한 인간들</button>
      </div>
      <button onClick={() => followMeUsers(userCode)}>나를 팔로우한 인간들</button>
    </div>
  );
};

export default MyPage;
