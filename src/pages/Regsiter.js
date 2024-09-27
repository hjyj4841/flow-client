import styled from "styled-components";

const StyledRegister = styled.header`
  ul {
    li {
      padding: 20px;
      font-size: 1.5rem;
    }
  }
`;
const Register = () => {
  const kakaoApiKey = "1a0c2ee5a1c05d498d69df5ba445b391";
  const redirectUri = "http://localhost:3000/auth";
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoApiKey}&redirect_uri=${redirectUri}&response_type=code`;

  const kakaoRegister = () => {
    window.location.href = kakaoURL;
  };

  return (
    <StyledRegister>
      <ul>
        <li>
          <button type="button">Google Register</button>
        </li>
        <li>
          <button type="button" onClick={kakaoRegister}>
            Kakao Register
          </button>
        </li>
        <li>
          <button type="button">Naver Register</button>
        </li>
      </ul>
    </StyledRegister>
  );
};

export default Register;
