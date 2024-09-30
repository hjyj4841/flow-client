import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      <ul>
        <li>
          <Link to={"/"}>Home</Link>
        </li>
        <li>
          <Link to={"/register"}>회원가입</Link>
        </li>
        <li>
          <Link to={"/login"}>로그인</Link>
        </li>
      </ul>
    </>
  );
};

export default Header;
