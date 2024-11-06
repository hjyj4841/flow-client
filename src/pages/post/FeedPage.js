import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { findUser } from "../../api/user";
import { useNavigate, useParams } from "react-router-dom";
import { fetchLikedPosts } from "../../api/likes";
import {
  fetchSavedPosts,
  followedUserPosts,
  newFeed,
  popularFeed,
} from "../../api/post";
import LikeToggleButton from "../../components/toggleBtn/LikeToggleButton";
import SaveToggleButton from "../../components/toggleBtn/SaveToggleButton";
import { SlArrowDown } from "react-icons/sl";

const FeedPage = () => {
  const { token } = useAuth();
  const { pageState } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    userCode: 0,
  });
  const [FeedImages, setFeedImages] = useState([]);
  const [page, setPage] = useState(0);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    if (token !== null) {
      getUserInfo();
    }
  }, []);

  useEffect(() => {
    if (user.userCode !== 0) {
      fetchFeedImages(page);
      fetchLiked();
      fetchSaved();
    }
  }, [user, page]);

  const getUserInfo = async () => {
    const respones = (await findUser(token)).data;
    setUser(respones);
  };

  const fetchFeedImages = async (currentPage) => {
    let respones;

    if (pageState === "newFeed") {
      respones = await newFeed(currentPage);
    } else if (pageState === "popularFeed") {
      respones = await popularFeed(currentPage);
    } else if (pageState === "followedFeed") {
      respones = await followedUserPosts(user.userCode, currentPage);
    }
    const content = respones.content || [];
    setFeedImages((prev) => [...prev, ...content]);
  };

  const fetchLiked = async () => {
    const respones = await fetchLikedPosts(user.userCode);
    console.log(respones);
    const likedPosts = respones.map((post) => ({
      ...post,
      isLiked: true,
    }));
    setLikedPosts(likedPosts || []);
  };

  const fetchSaved = async () => {
    const respones = await fetchSavedPosts(user.userCode);
    const savedPosts = respones.data.postInfoList.map((post) => ({
      ...post,
      isSaved: true,
    }));
    console.log(respones);
    setSavedPosts(savedPosts || []);
  };

  const detail = (postCode) => {
    navigate(`/post/${postCode}`);
  };

  const loadMorePosts = () => setPage((prev) => prev + 1);

  return (
    <div>
      <section className="bg-white py-4 shadow-md flex justify-center" />
      <main className="container mx-auto">
        <div className="flex justify-center flex-col">
          <h2 className="text-gray-500 pb-4">
            {pageState === "newFeed"
              ? "New Feed"
              : pageState === "popularFeed"
              ? "Popular Feed"
              : "My Follower's Feed"}
          </h2>
          <div className="grid grid-cols-5 gap-4">
            {FeedImages.map((post) =>
              post.imageUrls.length > 0 ? (
                <div
                  key={post.postCode}
                  className="relative bg-gray-300 rounded-lg group"
                  style={{ width: "280px", height: "350px" }}
                >
                  <img
                    src={post.imageUrls[0]}
                    alt={post.postDesc}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div
                    className="cursor-pointer absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => detail(post.postCode)}
                  >
                    <p className="text-white mb-2 cursor-pointer truncate w-full text-center">
                      {post.postDesc}
                    </p>
                    <div className="absolute top-2 left-2 flex space-x-2">
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
          <div
            className="w-full flex justify-center items-center p-5 cursor-pointer mt-3 hover:bg-gray-800 hover:text-white transition-all"
            onClick={loadMorePosts}
          >
            <SlArrowDown />
          </div>
        </div>
      </main>
    </div>
  );
};

export default FeedPage;
