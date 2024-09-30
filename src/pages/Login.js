import styled from "styled-components";
import { getKakaoCode } from "../api/kakao";

const StyledLogin = styled.header`
  ul {
    li {
      padding: 20px;
      font-size: 1.5rem;
    }
  }
`;

const Login = () => {
  return (
    <StyledLogin>
      <ul>
        <li>
          <button type="button">Google Login</button>
        </li>
        <li>
          <button type="button" onClick={getKakaoCode}>
            Kakao Login
          </button>
        </li>
        <li>
          <button type="button">Naver Login</button>
        </li>
      </ul>
    </StyledLogin>
  );
};
export default Login;
