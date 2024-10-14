import { useParams } from "react-router-dom";
import { updatePost, detailPost } from "../../api/post";
import Post from "../../components/Post";
import { useState, useEffect } from "react";

const UpdatePost = () => {
  const { postCode } = useParams();

  // userCode 가져오기

  // 기존 post DTO 내용 가져오기
  useEffect(async () => {
    const post = await detailPost(postCode);
    console.log(post);
  }, []);

  return (
    <>
      <div className="update-post-form">
        <h1>EDIT POST_TEST</h1>
      </div>
    </>
  );
};

export default UpdatePost;
