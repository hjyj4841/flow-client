import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getKakaoCode } from "../api/kakao";
import { getGoogleCode } from "../api/google";
import { getNaverCode } from "../api/naver";
import "../assets/css/header.css";

const Header = () => {
  const [token, setToken] = useState(null);
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const [loginOpen, setLoginOpen] = useState(false);
  const loginBackground = useRef();
  const [registerOpen, setRegisterOpen] = useState(false);
  const registerBackground = useRef();

  // 유저 정보 뽑기
  let userData;
  if (token) {
    const testToken = token;

    const base64Url = testToken.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    userData = JSON.parse(window.atob(base64));
  }
  // const ManagerCode = userData.userManagerCode;
  // console.log(ManagerCode);

  return (
    <>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          FLOW
        </Link>
        <nav className="space-x-4">
          {token !== null ? (
            <>
              <a href="#" className="text-sm" onClick={logout}>
                로그아웃
              </a>
              <Link className="text-sm" to={"/mypage"}>
                마이페이지
              </Link>
              {token !== null ? (
                userData.userManagerCode === "Y" ? (
                  <Link to={"/reportList"}>신고리스트</Link>
                ) : (
                  <></>
                )
              ) : (
                <></>
              )}
              <Link to={"/uploadPost"} className="text-sm">
                업로드
              </Link>
              <Link to={"/votePost"} className="text-sm">
                투표
              </Link>
            </>
          ) : (
            <div className="quick-slot">
              <a href="#" className="text-sm">
                찾기
              </a>
              <div className={"register-wrapper"}>
                <button
                  className={"register-open-btn"}
                  onClick={() => setRegisterOpen(true)}
                >
                  회원가입
                </button>
              </div>
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
              <div className={"login-wrapper"}>
                <button
                  className={"login-open-btn"}
                  onClick={() => setLoginOpen(true)}
                >
                  로그인
                </button>
              </div>
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
              <Link to={"/uploadPost"} className="text-sm">
                업로드
              </Link>
              <Link to={"/votePost"} className="text-sm">
                투표
              </Link>
            </div>
          )}
        </nav>
      </div>
    </>
  );
};

export default Header;
