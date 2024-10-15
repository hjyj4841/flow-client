import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";

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

  const updatePost = () => {
    navigate("/updatePost/" + postCode);
  };
  return (
    <>
      <DetailDiv>
        <h1>디테일 테스트 페이지</h1>
        <div className="report">
          <button className="report-post-btn">글 신고버튼</button>
          <button className="report-user-btn">유저 신고버튼</button>
        </div>
        <button className="update-post-btn" onClick={updatePost}>
          수정
        </button>
      </DetailDiv>
      <div className="max-w-4xl mx-auto p-4">
        <main className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <img
              src="https://source.unsplash.com/random/600x400"
              alt="Post Image"
              className="w-full rounded-lg"
            />
          </div>
          <div className="flex items-center mb-2">
            <img
              src="https://source.unsplash.com/random/40x40"
              alt="User Avatar"
              className="w-10 h-10 rounded-full mr-2"
            />
            <span className="font-bold">글쓴이</span>
          </div>
          <p className="mb-2">
            요즘 회사에서 이렇게 안 입게 해준다고? 못 입겠음 ㅋㅋㅋ
            <span className="text-blue-500">
              #친구 #이야기 #트렌드 #회사 #수둔
            </span>
          </p>
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <span className="mr-4">❤️ 27</span>
            <span className="mr-4">💬 8</span>
            <span>⚠️</span>
          </div>
          <div className="border-t border-gray-300 pt-4">
            <h2 className="font-bold mb-2">댓글 7개</h2>
            <div className="mb-2">
              <div className="flex items-center mb-1">
                <img
                  src="https://source.unsplash.com/random/40x40"
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="font-bold">사용자1</span>
              </div>
              <p className="text-sm">
                내 회사는 저렇게 입으면 어디 놀러가냐고 혼내 주던데....
              </p>
            </div>
            <div className="mb-2">
              <div className="flex items-center mb-1">
                <img
                  src="https://source.unsplash.com/random/40x40"
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="font-bold">사용자2</span>
              </div>
              <p className="text-sm">
                ㅋㅋ 네, 우리 회사는 딱히 뭐라 안하던데.
              </p>
            </div>
          </div>
          <div className="mt-4">
            <input
              type="text"
              placeholder="내용을 작성해주세요!"
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <button className="w-full bg-black text-white py-2 rounded">
              작성 완료
            </button>
          </div>
        </main>
      </div>
    </>
  );
};

export default Detail;
