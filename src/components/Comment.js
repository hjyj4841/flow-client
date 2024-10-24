import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addComment, updateComment, deleteComment } from "../api/comment";

const Comment = ({ comment, postCode }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [commentDesc, setCommentDesc, setIsUpdating, isUpdating] = useState("");
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
    mutationFn: updateComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postCode] });
      setIsUpdating(false);
    },
  });

  // 댓글 삭제
  const deleteMutation = useMutation({
    mutationFn: (commentCode) => deleteComment(commentCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postCode] });
    },
  });

  // const handleUpdate = () => {
  //   updateMutation.mutate({ ...comment, commentDesc });
  // };

  const handleDelete = () => {
    deleteMutation.mutate(comment.commentCode);
  };

  return (
    <div>
      <tr>
        <tr className="flex justify-between items-center" />
        <p>{comment.commentDesc}</p>
        {user.userCode === comment.userCode && (
          <button
            onClick={handleDelete}
            className="ml-2 bg-red-500 text-white py-1 px-2 rounded"
          >
            삭제
          </button>
        )}
      </tr>
    </div>
  );
};

export default Comment;
