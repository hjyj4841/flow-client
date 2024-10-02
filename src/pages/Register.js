import styled from "styled-components";
import { getKakaoCodeByRegister } from "../api/kakao";
import { naverRegister } from "../api/naver";

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
          <button type="button">Google Register</button>
        </li>
        <li>
          <button type="button" onClick={getKakaoCodeByRegister}>
            Kakao Register
          </button>
        </li>
        <li>
          <button type="button" onClick={naverRegister}>
            Naver Register
          </button>
        </li>
      </ul>
    </StyledRegister>
  );
};

export default Register;
