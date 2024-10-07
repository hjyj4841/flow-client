import React from "react";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Main = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

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
            <div className="flex items-center">
              <button className="text-2xl">&lt;</button>
              <div className="flex overflow-x-auto space-x-4 mx-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-none w-48 h-64 bg-gray-300 rounded-lg"
                  ></div>
                ))}
              </div>
              <button className="text-2xl">&gt;</button>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">NEW FEED</h2>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-full h-64 bg-gray-300 rounded-lg"
                ></div>
              ))}
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
