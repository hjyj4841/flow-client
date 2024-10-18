import axios from "axios";
import { useState, useEffect } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { BsCollection, BsCollectionFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "../api/user";
import { useAuth } from "../contexts/AuthContext";

const MyPage = () => {
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [createdPosts, setCreatedPosts] = useState([]);
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  let userCode = "";
  let user = "";
  if (token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    const userData = JSON.parse(window.atob(base64));
    userCode = userData.userCode;
    user = userData;
  }

  // 팔로우 기능
  const myFollower = () => {
    navigate(`follow/myFollower/${userCode}`, {state : true});
  };
  const followMeUsers = () => {
    navigate(`follow/myFollower/${userCode}`, {state : false});
  };

  // Fetch liked posts
  const fetchLikedPosts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/likes/${userCode}/likes`
      );
      const likedPosts = response.data.postInfoList.map((post) => ({
        ...post,
        isLiked: true,
      }));
      setLikedPosts(likedPosts || []);
    } catch (error) {
      console.error("Error fetching liked posts", error);
    }
  };

  // Fetch saved posts
  const fetchSavedPosts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/collection/${userCode}/collections`
      );
      const savedPosts = response.data.postInfoList.map((post) => ({
        ...post,
        isSaved: true,
      }));
      setSavedPosts(savedPosts || []);
    } catch (error) {
      console.error("Error fetching saved posts", error);
    }
  };

  // Fetch created posts
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

  const withOutUser = async () => {
    await deleteUser(token);
    localStorage.removeItem("token");
    alert("회원탈퇴!");
    logout();
  };

  // Toggle like
  const handleLikeToggle = async (postCode) => {
    try {
      await axios.post(
        `http://localhost:8080/api/likes/toggle/${postCode}`,
        user
      );
      await fetchLikedPosts(); // Re-fetch to update UI
      await fetchSavedPosts();
      await fetchCreatedPosts();
    } catch (error) {
      console.error("Error toggling like", error);
    }
  };

  // Toggle save
  const handleSaveToggle = async (postCode) => {
    try {
      await axios.post(
        `http://localhost:8080/api/collection/toggle/${postCode}`,
        user
      );
      await fetchSavedPosts(); // Re-fetch to update UI
      await fetchLikedPosts();
      await fetchCreatedPosts();
    } catch (error) {
      console.error("Error toggling save", error);
    }
  };

  // Navigate to post detail
  const detail = (postCode) => {
    navigate(`/post/${postCode}`);
  };

  useEffect(() => {
    fetchLikedPosts();
    fetchSavedPosts();
    fetchCreatedPosts();
  }, []);

  return (
    <div className="bg-gray-100 text-gray-800">
      <section className="bg-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex overflow-x-auto space-x-4">
          {/* Profile & Follow buttons */}
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        {/* Liked Posts Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Liked Posts</h2>
          <div className="grid grid-cols-4 gap-4">
            {likedPosts.map((item) => (
              <div
                key={item.post.postCode}
                className="relative w-full h-64 bg-gray-300 rounded-lg group"
              >
                {item.imageFiles && item.imageFiles.length > 0 ? (
                  <img
                    src={item.imageFiles[0]?.postImgUrl || "default.jpg"}
                    alt={item.postDesc}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex justify-center items-center text-gray-500">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p
                    className="text-white mb-2"
                    onClick={() => detail(item.post.postCode)}
                  >
                    {item.post.postDesc}
                  </p>
                  <div className="flex items-center">
                    {likedPosts.some(
                      (likedPost) =>
                        likedPost.post.postCode === item.post.postCode
                    ) ? (
                      <FaHeart
                        onClick={() => handleLikeToggle(item.post.postCode)}
                        style={{ color: "red" }}
                        className="mx-2"
                      />
                    ) : (
                      <FaRegHeart
                        onClick={() => handleLikeToggle(item.post.postCode)}
                        className="mx-2"
                      />
                    )}
                    {savedPosts.some(
                      (savedPost) =>
                        savedPost.post.postCode === item.post.postCode
                    ) ? (
                      <BsCollectionFill
                        onClick={() => handleSaveToggle(item.post.postCode)}
                        style={{ color: "black" }}
                        className="mx-2"
                      />
                    ) : (
                      <BsCollection
                        onClick={() => handleSaveToggle(item.post.postCode)}
                        className="mx-2"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Saved Posts Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Saved Posts</h2>
          <div className="grid grid-cols-4 gap-4">
            {savedPosts.map((item) => (
              <div
                key={item.post.postCode}
                className="relative w-full h-64 bg-gray-300 rounded-lg group"
              >
                {item.imageFiles && item.imageFiles.length > 0 ? (
                  <img
                    src={item.imageFiles[0]?.postImgUrl || "default.jpg"}
                    alt={item.postDesc}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex justify-center items-center text-gray-500">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p
                    className="text-white mb-2"
                    onClick={() => detail(item.post.postCode)}
                  >
                    {item.post.postDesc}
                  </p>
                  <div className="flex items-center">
                    {likedPosts.some(
                      (likedPost) =>
                        likedPost.post.postCode === item.post.postCode
                    ) ? (
                      <FaHeart
                        onClick={() => handleLikeToggle(item.post.postCode)}
                        style={{ color: "red" }}
                        className="mx-2"
                      />
                    ) : (
                      <FaRegHeart
                        onClick={() => handleLikeToggle(item.post.postCode)}
                        className="mx-2"
                      />
                    )}
                    {savedPosts.some(
                      (savedPost) =>
                        savedPost.post.postCode === item.post.postCode
                    ) ? (
                      <BsCollectionFill
                        onClick={() => handleSaveToggle(item.post.postCode)}
                        style={{ color: "black" }}
                        className="mx-2"
                      />
                    ) : (
                      <BsCollection
                        onClick={() => handleSaveToggle(item.post.postCode)}
                        className="mx-2"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Created Posts Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Created Posts</h2>
          <div className="grid grid-cols-4 gap-4">
            {createdPosts.map((item) => (
              <div
                key={item.post.postCode}
                className="relative w-full h-64 bg-gray-300 rounded-lg group"
              >
                {item.imageFiles && item.imageFiles.length > 0 ? (
                  <img
                    src={item.imageFiles[0]?.postImgUrl || "default.jpg"}
                    alt={item.postDesc}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex justify-center items-center text-gray-500">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p
                    className="text-white mb-2"
                    onClick={() => detail(item.post.postCode)}
                  >
                    {item.post.postDesc}
                  </p>
                  <div className="flex items-center">
                    {likedPosts.some(
                      (likedPost) =>
                        likedPost.post.postCode === item.post.postCode
                    ) ? (
                      <FaHeart
                        onClick={() => handleLikeToggle(item.post.postCode)}
                        style={{ color: "red" }}
                        className="mx-2"
                      />
                    ) : (
                      <FaRegHeart
                        onClick={() => handleLikeToggle(item.post.postCode)}
                        className="mx-2"
                      />
                    )}
                    {savedPosts.some(
                      (savedPost) =>
                        savedPost.post.postCode === item.post.postCode
                    ) ? (
                      <BsCollectionFill
                        onClick={() => handleSaveToggle(item.post.postCode)}
                        style={{ color: "black" }}
                        className="mx-2"
                      />
                    ) : (
                      <BsCollection
                        onClick={() => handleSaveToggle(item.post.postCode)}
                        className="mx-2"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 팔로우 섹션 */}
        <section>
          <button onClick={() => myFollower(userCode)}>
            내가 팔로우한 사람들
          </button>
          <button onClick={() => followMeUsers(userCode)}>
            나를 팔로우한 사람들
          </button>
          <div>
            <button onClick={withOutUser}>회원탈퇴</button>
          </div>
          <div>
            <button onClick={() => navigate("/updateUser")}>회원 수정</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MyPage;
