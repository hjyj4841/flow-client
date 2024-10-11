import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Login from "../pages/Login";
import { getKakaoCode } from "../api/kakao";
import { getGoogleCode } from "../api/google";
import { getNaverCode } from "../api/naver";
import styled from "styled-components";
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
              <Link to={"/reportList"}>신고리스트</Link>
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
                    <div className="input-container-2">
                      <div>
                        아이디 :
                        <input type="text" placeholder="아이디" />
                      </div>
                      <div>
                        비밀번호 :{" "}
                        <input type="password" placeholder="비밀번호" />
                      </div>
                      <div>
                        성별 : <input type="text" placeholder="성별" />
                      </div>
                      <div>
                        직종 : <input type="text" placeholder="직종" />
                      </div>
                      <div>
                        이메일 : <input type="email" placeholder="이메일" />
                      </div>
                    </div>
                    <button type="button" onClick={getGoogleCode}>
                      Google Register
                    </button>
                    <button type="button" onClick={getKakaoCode}>
                      Kakao Register
                    </button>
                    <button type="button" onClick={getNaverCode}>
                      Naver Register
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
                    <div className="input-container">
                      <div className="ID-border">
                        아이디 :{" "}
                        <input
                          className="ID"
                          type="text"
                          placeholder="아이디"
                        />
                      </div>
                      <div className="password-border">
                        비밀번호 :{" "}
                        <input
                          type="password"
                          className="password"
                          placeholder="비밀번호"
                        />
                      </div>
                    </div>
                    <button type="button" onClick={getGoogleCode}>
                      Google Login
                    </button>
                    <button type="button" onClick={getKakaoCode}>
                      Kakao Login
                    </button>
                    <button type="button" onClick={getNaverCode}>
                      Naver Login
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
