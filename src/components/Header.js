import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../assets/css/header.css";
import { useAuth } from "../contexts/AuthContext";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import SearchModal from "./SearchModal";
import { findUser } from "../api/user";

const Header = () => {
  const { token, logout } = useAuth();
  const [isModalOpen, setModalOpen] = useState(false);
  const [user, setUser] = useState({
    userCode: 0,
    userEmail: "",
    userPlatform: "",
    userJob: "",
    userHeight: 0,
    userWeight: 0,
    userBodySpecYn: "",
    userProfileUrl: "",
    userNickname: "",
    userGender: "",
    userManagerCode: "",
  });

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  // 유저 정보 뽑기
  const getUserInfo = async () => {
    const respones = (await findUser(token)).data;
    if (respones.error) logout();
    else setUser(respones);
  };

  useEffect(() => {
    if (token !== null) {
      getUserInfo();
    }
  }, [token]);

  return (
    <>
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          FLOW
        </Link>
        <nav className="space-x-4">
          {token ? (
            <>
              <button type="button" className="text-sm" onClick={toggleModal}>
                찾기
              </button>
              <a href="#" className="text-sm" onClick={logout}>
                로그아웃
              </a>
              <button
                className="text-sm"
                onClick={() =>
                  (window.location.href = `/mypage/${user.userCode}`)
                }
              >
                마이페이지
              </button>
              {user.userManagerCode === "Y" && (
                <Link to={"/reportList"} className="text-sm">
                  신고리스트
                </Link>
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
              <a href="#" className="text-sm" onClick={toggleModal}>
                찾기
              </a>
              <RegisterModal />
              <LoginModal />
              <Link to={"/votePost"} className="text-sm">
                투표
              </Link>
            </div>
          )}
        </nav>
      </div>
      <SearchModal isOpen={isModalOpen} onClose={toggleModal} />
    </>
  );
};
export default Header;
