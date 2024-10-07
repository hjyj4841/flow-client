import axios from "axios";
import { useState, useEffect } from "react";
import { FaRegHeart } from "react-icons/fa";
import { BsCollection } from "react-icons/bs";

const MyPage = () => {
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [createdPosts, setCreatedPosts] = useState([]);

  // 유저 코드 저장 및 불러오기
  const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰 가져오기
  let userCode = "";
  if (token) {
    const base64Url = token.split(".")[1]; // 페이로드 부분 추출
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    const userData = JSON.parse(window.atob(base64)); // 디코딩 후 JSON으로 파싱
    userCode = userData.userCode;
    console.log(userData); // 유저 정보 출력
  }

  const handleLikeToggle = async (postCode) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/toggle/${postCode}`,
        { userCode } // 백엔드에서 필요한 유저 데이터 전송
      );
      const updatedLikedPosts = likedPosts.map((item) =>
        item.post.postCode === postCode
          ? { ...item, isLiked: response.data }
          : item
      );
      setLikedPosts(updatedLikedPosts); // 좋아요 상태 업데이트
    } catch (error) {
      console.error("Error toggling like", error);
    }
  };

  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/likes/${userCode}/likes`
        );
        setLikedPosts(response.data.postInfoList || []);
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

    fetchLikedPosts();
    fetchSavedPosts();
    fetchCreatedPosts();
  }, [userCode]);

  return (
    <div>
      <h2>내가 좋아한 게시물</h2>
      <ul>
        {likedPosts.map((item) => (
          <li key={item.post.postCode}>
            <FaRegHeart onClick={() => handleLikeToggle(item.post.postCode)} />
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
            <FaRegHeart onClick={() => handleLikeToggle(item.post.postCode)} />
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
            <FaRegHeart onClick={() => handleLikeToggle(item.post.postCode)} />
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
