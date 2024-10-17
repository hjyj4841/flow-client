import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { addComment } from "../api/comment";

const Comment = ({ comment, postCode }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [newComment, setNewComment] = useState({
    commentCode: 0,
    commentDesc: "",
    postCode: postCode,
    user: user,
    parentCommentCode: 0,
  });

  const addMutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries({});
    },
  });
};

export default Comment;
