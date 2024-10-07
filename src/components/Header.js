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
        {/* 신고리스트는 token값으로 user_manager_code가 Y일 경우에만 보이게 해야함 */}
        <li>
          <Link to={"/reportList"}>신고리스트</Link>
        </li>
      </ul>
    </>
  );
};

export default Header;
