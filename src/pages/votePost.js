import axios from "axios";
import React from "react";
import { addVote } from "../api/vote";
import { useNavigate } from "react-router-dom";

const UploadPostVote = () => {
  const naviagte = useNavigate();

  return (
    <>
      <div>
        <input type="textarea" placeholder="투표 내용 입력" />
      </div>
      <div>
        찬성
        <div></div>
      </div>
      <div>
        반대
        <div></div>
      </div>
    </>
  );
};

export default UploadPostVote;
