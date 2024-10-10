import styled from "styled-components";
import { getKakaoCode } from "../api/kakao";
import { getNaverCode } from "../api/naver";
import { getGoogleCode } from "../api/google";

const StyledRegister = styled.header`
  ul {
    li {
      padding: 20px;
      font-size: 1.5rem;
    }
  }
`;

const Register = () => {
  return (
    <StyledRegister>
      <ul>
        <li>
          <button type="button" onClick={() => getGoogleCode("register")}>
            Google Register
          </button>
        </li>
        <li>
          <button type="button" onClick={() => getKakaoCode("register")}>
            Kakao Register
          </button>
        </li>
        <li>
          <button type="button" onClick={() => getNaverCode("register")}>
            Naver Register
          </button>
        </li>
      </ul>
    </StyledRegister>
  );
};

export default Register;
