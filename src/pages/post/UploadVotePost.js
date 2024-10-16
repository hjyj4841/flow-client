import axios from "axios";
import React from "react";
import { addVote } from "../../api/vote";
import { useNavigate } from "react-router-dom";
import Update from "../../components/Update";

const UploadVotePost = () => {
  const naviagte = useNavigate();

  return (
    <>
      <div>
        <input type="textarea" placeholder="투표 내용 입력" />
      </div>
      <div>
        <div>찬성</div>
        <div>반대</div>
      </div>
      <Update />
    </>
  );
};

export default UploadVotePost;
