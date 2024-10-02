import React, { useState, useEffect } from "react";
import axios from "axios";

const Comment = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
};

// 댓글 목록 조회
useEffect(() => {
  const fetchComments = async () => {
    const response = await axios.get("/api/comments?postId=${postId}");
    setComments(response.data);
  };
  fetchComments();
}, [postId]);

export default Comment;
