import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import UserReportModal from "./UserReportModal";
import "../assets/css/userModal.css";

const UserModal = ({ user }) => {
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef();

  const goUserInfo = () => {
    navigate(`/mypage/${user.userCode}`);
  };

  return (
    <div className="userMenu">
      <span
        className="menu-open-Button"
        onClick={() => setUserMenuOpen((prev) => !prev)}
      >
        {user.userNickname}
      </span>

      {userMenuOpen && (
        <div
          className="menu-content"
          ref={menuRef}
          onClick={(e) => {
            if (e.target === menuRef.current) {
              setUserMenuOpen(false);
            }
          }}
        >
          <button className="user-button" onClick={goUserInfo}>
            유저 페이지
          </button>
          <UserReportModal
            className="Report-button"
            closeUserModal={() => setUserMenuOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default UserModal;
