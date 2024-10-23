import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { addComment } from "../api/comment";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
    mutationFn: (data) => updateComment(data),
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

  const updateComment = () => {
    updateMutation.mutate({ ...comment, commentDesc });
  };

  const updateCancle = () => {
    setNewComment({ ...newComment, commentDesc: "", commentCode: 0 });
  };

  const deleteComment = () => {
    deleteMutation.mutate(comment.commentCode);
  };
  return (
    <div>
      {isUpdating ? (
        <>
          <input
            value={commentDesc}
            onChange={(e) => setCommentDesc(e.target.value)}
          />
        </>
      ) : (
        <>
          <p>{comment.commentDesc}</p>
          {user.userCode === comment.userCode && ( // 작성자만 수정 및 삭제 가능
            <div>
              <button onClick={() => updateComment(comment.commentCode)}>
                수정
              </button>
              <button onClick={() => deleteComment(comment.commentCode)}>
                삭제
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Comment;
