import styled from "styled-components";

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
    button {
      background-color: #f05650;
      padding: 10px;
      border-radius: 15px;
      margin: 10px 5px;
    }
  `;
  return (
    <DetailDiv>
      <h1>디테일 테스트 페이지</h1>
      <div className="report">
        <button className="report-post-btn">글 신고버튼</button>
        <button className="report-user-btn">유저 신고버튼</button>
      </div>
    </DetailDiv>
  );
};

export default Detail;
