import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Login from "../pages/Login";
import { getKakaoCodeByLogin } from "../api/kakao";
import { getGoogleCodeByLogin } from "../api/google";
import styled from "styled-components";

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
  const modalBackground = useRef();

  return (
    <>
      <ul>
        <li>
          <Link to={"/"}>Home</Link>
        </li>
        {token !== null ? (
          <button type="button" onClick={logout}>
            로그아웃
          </button>
        ) : (
          <>
            <li>
              <Link to={"/register"}>회원가입</Link>
            </li>
            <li>
              <button
                className={"open-login-btn"}
                onClick={() => setLoginOpen(true)}
              >
                로그인
              </button>
              {loginOpen && (
                <div
                  className={"modal-container"}
                  ref={modalBackground}
                  onClick={(e) => {
                    if (e.target === modalBackground.current) {
                      setLoginOpen(false);
                    }
                  }}
                >
                  <div className={"login-content"}>
                    <p>
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
                    </p>
                    <button
                      className={"login-close-btn"}
                      onClick={() => setLoginOpen(false)}
                    >
                      모달 닫기
                    </button>
                  </div>
                </div>
              )}
            </li>
            <li>
              <Link to={"/mypage"}>마이페이지</Link>
            </li>
          </>
        )}
        <li>
          <Link to={"/uploadPost"}>업로드</Link>
        </li>
      </ul>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">FLOW</h1>
        <nav className="space-x-4">
          {token !== null ? (
            <>
              <a href="#" className="text-sm" onClick={logout}>
                로그아웃
              </a>
              <Link className="text-sm" to={"/mypage"}>
                마이페이지
              </Link>
            </>
          ) : (
            <>
              <a href="#" className="text-sm">
                찾기
              </a>
              <Link to={"/register"} className="text-sm">
                회원 가입
              </Link>
              <Link to={"/login"} className="text-sm">
                로그인
              </Link>
              <Link to={"/uploadPost"} className="text-sm">
                업로드
              </Link>
              <Link to={"/votePost"} className="text-sm">
                투표
              </Link>
            </>
          )}
        </nav>
      </div>
    </>
  );
};

export default Header;
