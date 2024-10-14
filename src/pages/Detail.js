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
  );
};

export default Detail;
