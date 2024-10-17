import axios from "axios";
import React from "react";
import { addVote } from "../../api/vote";
import { useNavigate } from "react-router-dom";
import Update from "../../components/Update";

const UploadVotePost = () => {
  const naviagte = useNavigate();

  return (
    <>
      <section className="bg-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex overflow-x-auto space-x-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex-none w-16 h-16 bg-gray-300 rounded-full"
            />
          ))}
        </div>
      </section>
      <Update />
    </>
  );
};

export default UploadVotePost;
