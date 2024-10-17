import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { addReportPost, addReportUser } from "../../reducers/reportReducer";
import { reportReducer } from "../../reducers/reportReducer";
import { useReducer, useState, useEffect } from "react";
import axios from "axios";
import { delPost } from "../../api/post";

const DetailDiv = styled.div`
  .report {
    display: flex;
  }
  .report-post-btn {
    margin: 20px;
  }
  .report-user-btn {
    margin: 20px;
  }
  .report button {
    background-color: #f05650;
    padding: 10px;
    border-radius: 15px;
    margin: 10px 5px;
  }
  .update-post-btn {
    background-color: #ddd;
    padding: 10px;
    border-radius: 15px;
    margin: 10px 5px;
  }
`;

const Detail = () => {
  const { postCode } = useParams();
  const navigate = useNavigate();
  const initialState = {};
  const [dispatch] = useReducer(reportReducer, initialState);

  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const token = localStorage.getItem("token");
  if (token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    const userData = JSON.parse(window.atob(base64));
    loginUserCode = userData.userCode;
  }
  useEffect(() => {
    const fetchPost = async () => {
      const response = await axios.get(
        `http://localhost:8080/api/post/${postCode}`
      );
      setPost(response.data);
    };
    fetchPost();
  }, []);
  const updatePost = () => {
    navigate("/post/update/" + postCode);
  };
  const deleteAPI = async () => {
    await delPost(postCode);
  };
  const deletePost = () => {
    deleteAPI();
    alert("삭제 완료");
    window.location.href = "/";
  };
  const reportPost = (data) => {
    addReportPost(dispatch, data);
  };
  const reportUser = (data) => {
    addReportUser(dispatch, data);
  };
  const handleCommentSubmit = async () => {
    await axios.post(`http://localhost:8080/api/post/${postCode}/comments`, {
      content: comment,
    });
    setComment("");
  };
  return (
    <>
      <DetailDiv>
        <div className="report">
          <button
            className="report-post-btn"
            onClick={(data) => {
              reportPost(data);
            }}
          >
            글 신고버튼
          </button>
          <button
            className="report-user-btn"
            onClick={(data) => {
              reportUser(data);
            }}
          >
            유저 신고버튼
          </button>
        </div>
      </DetailDiv>
      <div className="max-w-4xl mx-auto p-4">
        <main className="bg-white p-6 rounded-lg shadow-md">
          {loginUserCode === post?.userCode && (
            <>
              <button
                className="border border-gray-300 rounded bg-gray-200 hover:bg-gray-300 mt-2"
                onClick={updatePost}
              >
                수정
              </button>
              <button
                className="border border-gray-300 rounded bg-red-200 hover:bg-red-300 mt-2"
                onClick={deletePost}
              >
                삭제
              </button>
            </>
          )}
          {post ? (
            <>
              <div className="flex items-center mb-2">
                <img
                  src="https://source.unsplash.com/random/40x40"
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full mr-2"
                />
              </div>
              <div className="mb-4">
                {post.imageUrls && post.imageUrls.length > 0
                  ? post.imageUrls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Post Image ${index}`}
                        className="w-full rounded-lg"
                      />
                    ))
                  : null}
              </div>
              <p className="mb-2">
                {post.postDesc}
                <span className="text-blue-500">
                  {post.tags && post.tags.length > 0
                    ? post.tags.map((tag, index) => (
                        <span key={index}>#{tag} </span>
                      ))
                    : null}
                </span>
              </p>
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <span className="mr-4">:하트2: {post.likes}</span>
                <span className="mr-4">
                  :말풍선: {post.comments ? post.comments.length : 0}
                </span>
                <span>:경고:</span>
              </div>
              <div className="border-t border-gray-300 pt-4">
                <h2 className="font-bold mb-2">
                  댓글 {post.comments ? post.comments.length : 0}개
                </h2>
                {post.comments && post.comments.length > 0 ? (
                  post.comments.map((comment, index) => (
                    <div key={index} className="mb-2">
                      <div className="flex items-center mb-1">
                        <img
                          src="https://source.unsplash.com/random/40x40"
                          alt="User Avatar"
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span className="font-bold">{comment.userName}</span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  ))
                ) : (
                  <p>댓글이 없습니다.</p>
                )}
              </div>
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="내용을 작성해주세요!"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                />
                <button
                  className="w-full bg-black text-white py-2 rounded"
                  onClick={handleCommentSubmit}
                >
                  작성 완료
                </button>
              </div>
            </>
          ) : null}
        </main>
      </div>
    </>
  );
};
export default Detail;
