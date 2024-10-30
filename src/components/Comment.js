import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addComment, updateComment, deleteComment } from "../api/comment";

const Comment = ({ comment, postCode }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [commentDesc, setCommentDesc] = useState("");
  const [newComment, setNewComment] = useState({
    commentCode: 0,
    commentDesc: "",
    postCode: postCode,
    user: user,
    parentCommentCode: comment.commentCode || 0,
  });
};
export default Comment;
