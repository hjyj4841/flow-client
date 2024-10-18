import { useRef, useState } from "react";
import { getKakaoCode } from "../api/kakao";
import { getGoogleCode } from "../api/google";
import { getNaverCode } from "../api/naver";
import "../assets/css/header.css";

const LoginModal = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const loginBackground = useRef();

  return (
    <>
      <button className={"login-open-btn"} onClick={() => setLoginOpen(true)}>
        로그인
      </button>
      {loginOpen && (
        <div
          className={"login-container"}
          ref={loginBackground}
          onClick={(e) => {
            if (e.target === loginBackground.current) {
              setLoginOpen(false);
            }
          }}
        >
          <div className={"login-content"}>
            <h1>로그인</h1>
            <button
              type="button"
              className="google"
              onClick={() => getGoogleCode("login")}
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
              onClick={() => getKakaoCode("login")}
            >
              Kakao
            </button>
            <button
              type="button"
              className="naver"
              onClick={() => getNaverCode("login")}
            >
              NAVER
            </button>
            <button
              className={"login-close-btn"}
              onClick={() => setLoginOpen(false)}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default LoginModal;
