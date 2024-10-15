import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../assets/css/header.css";
import { useAuth } from "../contexts/AuthContext";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

const Header = () => {
  const { token, logout } = useAuth();

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
              <a href="/search" className="text-sm">
                찾기
              </a>
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
              <a href="/search" className="text-sm">
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
    </>
  );
};

export default Header;
