import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const VoteDetail = () => {
  const { postCode } = useParams();
  const [isToken, setIsToken] = useState(false);
  const [post, setPost] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [reportPost, setReportPost] = useState({
    postReportDesc: "",
    post: {
      postCode: postCode,
    },
  });
  const [reportUser, setReportUser] = useState({
    userReportDesc: "",
    user: {
      userCode: 0,
    },
  });
  const [newComment, setNewComment] = useState({
    commentCode: null,
    commentDesc: "",
    postCode: postCode,
    userCode: 0,
  });
  const [followUser, setFollowUser] = useState({
    userCode: 0,
  });

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsToken(true);
    }
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      const response = await axios.get(
        `http://localhost:8080/api/post/${postCode}`
      );
      setPost(response.data);
      setFollowUser({
        userCode: response.data.userCode,
      });
    };
    fetchPost();
  }, [token]);

};
