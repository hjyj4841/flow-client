import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { addReportPost, addReportUser } from "../../reducers/reportReducer";
import { reportReducer } from "../../reducers/reportReducer";
import { useReducer, useState, useEffect } from "react";
import axios from "axios";

const Detail = () => {
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
  const { postCode } = useParams();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reportReducer, report);
  const [report] = state;

  const [user, setUser] = useState({});
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      const response = await axios.get(
        `http://localhost:8080/api/post/${postCode}`
      );
      setPost(response.data);
    };

    fetchPost();
  }, [postCode]);

  const updatePost = () => {
    navigate("/updatePost/" + postCode);
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
        <h1>디테일 페이지</h1>
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
        <button className="update-post-btn" onClick={updatePost}>
          수정
        </button>
      </DetailDiv>
      <div className="max-w-4xl mx-auto p-4">
        <main className="bg-white p-6 rounded-lg shadow-md">
          {post ? (
            <>
              <div className="mb-4">
                {post.imageUrls && post.imageUrls.length > 0 ? (
                  post.imageUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Post Image ${index}`}
                      className="w-full rounded-lg"
                    />
                  ))
                ) : (
                  <p>No images available</p>
                )}
              </div>
              <div className="flex items-center mb-2">
                <img
                  src="https://source.unsplash.com/random/40x40"
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full mr-2"
                />
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
                <span className="mr-4">❤️ {post.likes}</span>
                <span className="mr-4">
                  💬 {post.comments ? post.comments.length : 0}
                </span>
                <span>⚠️</span>
              </div>
              <span className="font-bold">{post.userName}</span>
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
