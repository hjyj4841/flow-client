import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { addComment } from "../api/comment";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Comment = ({ comment, postCode }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [newComment, setNewComment] = useState({
    commentCode: 0,
    commentDesc: "",
    postCode: postCode,
    user: user,
  });

  // 댓글 작성
  const addMutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", postCode]);
    },
  });
};

export default Comment;
