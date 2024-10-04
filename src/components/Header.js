import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

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
              <Link to={"/login"}>로그인</Link>
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
    </>
  );
};

export default Header;
