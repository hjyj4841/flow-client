import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import {
  addReportPost,
  addReportUser,
  initState as reportState,
} from "../../reducers/reportReducer";
import { reportReducer } from "../../reducers/reportReducer";
import { useReducer, useState, useEffect } from "react";
import axios from "axios";

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

  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");

  const [state, reportDispatch] = useReducer(reportReducer, reportState);
  const { report } = state;

  const [reportPost, setReportPost] = useState({
    reportDesc: "",
    post: {
      postCode: 0,
    },
  });

  const [reportUser, setReportUser] = useState({
    reportDesc: "",
    userCode: 0,
  });

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

  const reportPostBtn = (data) => {
    addReportPost(data);
  };

  // const reportUser = (data) => {
  //   addReportUser(dispatch, data);
  // };

  const handleCommentSubmit = async () => {
    await axios.post(`http://localhost:8080/api/post/${postCode}/comments`, {
      content: comment,
    });
    setComment("");
  };

  return (
    <>
      <DetailDiv>
        <h1>디테일 테스트 페이지</h1>
        <div className="report">
          <input
            className="report-post-desc"
            type="text"
            placeholder="설명"
            value={reportPost.reportDesc}
            onChange={(e) =>
              setReportPost({ ...reportPost, reportDesc: e.target.value })
            }
          />
          <button
            className="report-post-btn"
            onClick={() => {
              setReportPost({ ...reportPost, post: { postCode: postCode } });
              console.log(reportPost);
              reportPostBtn(reportPost);
            }}
          >
            글 신고버튼
          </button>
          <input
            className="report-user-desc"
            type="text"
            placeholder="설명"
            onChange={(e) =>
              setReportUser({ ...reportUser, reportDesc: e.target.value })
            }
          />
          <button
            className="report-user-btn"
            // onClick={(data) => {
            //   reportUser(data);
            // }}
          >
            유저 신고버튼
          </button>
        </div>
        <button className="update-post-btn" onClick={updatePost}>
          수정
        </button>
      </DetailDiv>
      <div class="max-w-4xl mx-auto p-4">
        <main class="bg-white p-6 rounded-lg shadow-md">
          <div class="mb-4">
            <img
              src="https://source.unsplash.com/random/600x400"
              alt="Post Image"
              class="w-full rounded-lg"
            />
          </div>
          <div class="flex items-center mb-2">
            <img
              src="https://source.unsplash.com/random/40x40"
              alt="User Avatar"
              class="w-10 h-10 rounded-full mr-2"
            />
            <span class="font-bold">글쓴이</span>
          </div>
          <p class="mb-2">
            요즘 회사에서 이렇게 안 입게 해준다고? 못 입겠음 ㅋㅋㅋ
            <span class="text-blue-500">#친구 #이야기 #트렌드 #회사 #수둔</span>
          </p>
          <div class="flex items-center text-sm text-gray-600 mb-4">
            <span class="mr-4">❤️ 27</span>
            <span class="mr-4">💬 8</span>
            <span>⚠️</span>
          </div>
          <div class="border-t border-gray-300 pt-4">
            <h2 class="font-bold mb-2">댓글 7개</h2>
            <div class="mb-2">
              <div class="flex items-center mb-1">
                <img
                  src="https://source.unsplash.com/random/40x40"
                  alt="User Avatar"
                  class="w-8 h-8 rounded-full mr-2"
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
