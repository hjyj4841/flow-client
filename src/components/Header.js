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
        {/* 신고리스트는 token값으로 user_manager_code가 Y일 경우에만 보이게 해야함 */}
        <li>
          <Link to={"/reportList"}>신고리스트</Link>
        </li>
      </ul>
    </>
  );
};

export default Header;
