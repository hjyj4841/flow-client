import styled from "styled-components";
import { getKakaoCode } from "../api/kakao";
import { getGoogleCode } from "../api/google";
import { getNaverCode } from "../api/naver";

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
          <button type="button" onClick={() => getGoogleCode("login")}>
            Google Login
          </button>
        </li>
        <li>
          <button type="button" onClick={() => getKakaoCode("login")}>
            Kakao Login
          </button>
        </li>
        <li>
          <button type="button" onClick={() => getNaverCode("login")}>
            Naver Login
          </button>
        </li>
      </ul>
    </StyledLogin>
  );
};
export default Login;
