import axios from "axios";
import React from "react";
import { addVote } from "../../api/vote";
import { useNavigate } from "react-router-dom";
import Update from "../../components/Update";

const UploadVotePost = () => {
  const naviagte = useNavigate();

  return (
    <>
      <Update />
    </>
  );
};

export default UploadVotePost;
