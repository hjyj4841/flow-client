import { useRef, useState } from "react";
import { getKakaoCode } from "../api/kakao";
import { getGoogleCode } from "../api/google";
import { getNaverCode } from "../api/naver";
import "../assets/css/header.css";

const RegisterModal = () => {
  const [registerOpen, setRegisterOpen] = useState(false);
  const registerBackground = useRef();

  return (
    <>
      <button
        className={"register-open-btn"}
        onClick={() => setRegisterOpen(true)}
      >
        회원가입
      </button>
      {registerOpen && (
        <div
          className={"register-container"}
          ref={registerBackground}
          onClick={(e) => {
            if (e.target === registerBackground.current) {
              setRegisterOpen(false);
            }
          }}
        >
          <div className={"register-content"}>
            <h1>회원가입</h1>
            <button
              type="button"
              className="google"
              onClick={() => getGoogleCode("register")}
            >
              <span className="blue">G</span>
              <span className="red">o</span>
              <span className="yellow">o</span>
              <span className="blue">g</span>
              <span className="green">l</span>
              <span className="red">e</span>
            </button>
            <button
              type="button"
              className="kakao"
              onClick={() => getKakaoCode("register")}
            >
              Kakao
            </button>
            <button
              type="button"
              className="naver"
              onClick={() => getNaverCode("register")}
            >
              NAVER
            </button>
            <button
              className={"login-close-btn"}
              onClick={() => setRegisterOpen(false)}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterModal;
