import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { GrNext, GrPrevious } from "react-icons/gr";

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

  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      const response = await axios.get(
        `http://localhost:8080/api/post/${postCode}`
      );
      setPost(response.data);
    };

    fetchPost();
  }, [postCode]);

  const handleNextImage = () => {
    if (post.imageUrls && post.imageUrls.length > 0) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % post.imageUrls.length
      );
    }
  };

  const handlePreviousImage = () => {
    if (post.imageUrls && post.imageUrls.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? post.imageUrls.length - 1 : prevIndex - 1
      );
    }
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
          <button className="report-post-btn">글 신고버튼</button>
          <button className="report-user-btn">유저 신고버튼</button>
        </div>
        <button
          className="update-post-btn"
          onClick={() => navigate("/updatePost/" + postCode)}
        >
          수정
        </button>
      </DetailDiv>

      <div className="max-w-4xl mx-auto p-4">
        <main className="bg-white p-6 rounded-lg shadow-md">
          {post ? (
            <>
              <div className="relative mb-4">
                {post.imageUrls && post.imageUrls.length > 0 ? (
                  <>
                    <button
                      onClick={handlePreviousImage}
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full shadow-lg"
                    >
                      <GrPrevious />
                    </button>
                    <img
                      src={post.imageUrls[currentImageIndex]}
                      alt={`Post Image ${currentImageIndex}`}
                      className="w-full rounded-lg"
                    />
                    <button
                      onClick={handleNextImage}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full shadow-lg"
                    >
                      <GrNext />
                    </button>
                  </>
                ) : (
                  <p>No images available</p>
                )}
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
              </div>
              <span className="font-bold">{post.userName}</span>

              <div className="border-t border-gray-300 pt-4">
                <h2 className="font-bold mb-2">
                  댓글 {post.comments ? post.comments.length : 0}개
                </h2>
                {post.comments && post.comments.length > 0 ? (
                  post.comments.map((comment, index) => (
                    <div key={index} className="mb-2">
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
                <span class="font-bold">사용자1</span>
              </div>
              <p class="text-sm">
                내 회사는 저렇게 입으면 어디 놀러가냐고 혼내 주던데....
              </p>
            </div>
            <div class="mb-2">
              <div class="flex items-center mb-1">
                <img
                  src="https://source.unsplash.com/random/40x40"
                  alt="User Avatar"
                  class="w-8 h-8 rounded-full mr-2"
                />
                <span class="font-bold">사용자2</span>
              </div>
              <p class="text-sm">ㅋㅋ 네, 우리 회사는 딱히 뭐라 안하던데.</p>
            </div>
          </div>
          <div class="mt-4">
            <input
              type="text"
              placeholder="내용을 작성해주세요!"
              class="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <button class="w-full bg-black text-white py-2 rounded">
              작성 완료
            </button>
          </div>
        </main>
      </div>
    </>
  );
};

export default Detail;
