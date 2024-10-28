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
    parentCommentCode: 0,
  });

  // 댓글 작성
  const addMutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postCode] });
    },
  });

  // 댓글 수정
  const updateMutation = useMutation({
    mutationFn: updateComment({ ...comment, commentDesc }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postCode] });
      // setIsUpdating(false);
    },
  });

  // 댓글 삭제
  const deleteMutation = useMutation({
    mutationFn: (commentCode) => deleteComment(commentCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postCode] });
    },
  });

  const handleUpdate = () => {
    updateMutation.mutate({ ...comment, commentDesc });
  };

  const handleUpdateCancel = () => {
    setNewComment({ ...newComment, commentDesc: "", commentCode: 0 });
  };

  const handleDelete = () => {
    deleteMutation.mutate(comment.commentCode);
  };

  return;
  <>
    {user.commentCode === comment.commentCode && (
      <button
        type="text"
        value={newComment.commentDesc}
        onClick={() => handleUpdate(comment.commentDesc)}
        className="text-black px-1 hover:text-gray-900 text-gray-500"
      >
        수정
      </button>
    )}
  </>;
};

export default Comment;
