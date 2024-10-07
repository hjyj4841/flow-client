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
            </>
          )}
        </nav>
      </div>
    </>
  );
};

export default Header;
