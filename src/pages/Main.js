import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Main = () => {
  const [token, setToken] = useState(null);
  const [newFeedImages, setNewFeedImages] = useState([]);
  const [popularFeedImages, setPopularFeedImages] = useState([]);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    fetchNewFeedImages();
    fetchPopularFeedImages();
  }, []);

  const fetchNewFeedImages = async () => {
    const response = await axios.get("http://localhost:8080/api/post");
    console.log(response.data);
    setNewFeedImages(response.data);
  };

  const fetchPopularFeedImages = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/likes/post/ordered-by-likes"
    );
    console.log(response.data);
    setPopularFeedImages(response.data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };
  return (
    <>
      <div className="bg-gray-100 text-gray-800">
        <section className="bg-white py-4 shadow-md">
          <div className="container mx-auto px-4 flex overflow-x-auto space-x-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="flex-none w-16 h-16 bg-gray-300 rounded-full"
              ></div>
            ))}
          </div>
        </section>
        <main className="container mx-auto px-4 py-8">
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">POPULAR FEED</h2>
            <div className="flex overflow-x-auto space-x-4 mx-4">
              {popularFeedImages.map((post) =>
                post.imageUrls.length > 0 ? (
                  <div
                    key={post.postCode}
                    className="w-full h-64 bg-gray-300 rounded-lg"
                  >
                    <img
                      src={post.imageUrls[0]}
                      alt={post.postDesc}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ) : null
              )}
            </div>
            <button className="text-2xl">&gt;</button>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">NEW FEED</h2>
            <div className="grid grid-cols-4 gap-4">
              {newFeedImages.map((post) =>
                post.imageUrls.length > 0 ? (
                  <div
                    key={post.postCode}
                    className="w-full h-64 bg-gray-300 rounded-lg"
                  >
                    <img
                      src={post.imageUrls[0]}
                      alt={post.postDesc}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ) : null
              )}
            </div>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-4">My Follower's FEED</h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-full h-64 bg-gray-300 rounded-lg"
                ></div>
              ))}
            </div>
            <button className="px-4 py-2 border border-gray-800 rounded-full">
              더 보러가기
            </button>
          </section>
        </main>
      </div>
    </>
  );
};
export default Main;
