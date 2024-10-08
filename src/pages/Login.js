import styled from "styled-components";
import { getKakaoCodeByLogin } from "../api/kakao";
import { getGoogleCodeByLogin } from "../api/google";

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
          <button type="button" onClick={getGoogleCodeByLogin}>
            Google Login
          </button>
        </li>
        <li>
          <button type="button" onClick={getKakaoCodeByLogin}>
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
