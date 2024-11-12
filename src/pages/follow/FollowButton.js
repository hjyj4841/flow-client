import { useEffect, useState } from "react";
import {
  createFollowRelative,
  removeFollowRelative,
} from "../../store/followSlice";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import "../../assets/css/forNotUser.scss";
import "../../components/RegisterModal.js";
import ForNotUser from "./ForNotUserModal.js";
import ToRegister from "./ToRegister.js";

const FollowStyleAndEffect = styled.div`
  .followButton {
    #follow,
    #unfollow {
      width: 5.5rem;
      height: 2.4rem;
      border-radius: 5px;
      cursor: pointer;
      font-size: 0.85rem;
      font-family: "Pretendard", sans-serif;
      transition: transform 0.1s ease, box-shadow 0.3s ease,
        background-color 0.3s ease, border-color 0.3s ease;
      -webkit-appearance: none; /* 브라우저 기본 스타일 제거 */
      -moz-appearance: none;
      appearance: none;
    }
    #unfollow {
      background-color: white;
      color: #dc143c;
      border: 1.2px solid #dc143c;
      font-weight: 500;
      letter-spacing: 1px;
      &:hover {
        border: 1px solid transparent;
        background-color: #dc143c;
        color: white;
      }
      &:hover:active {
        transform: translateY(2px);
        box-shadow: inset 1px 1px 2px rgba(45, 0, 0, 0.5);
      }
    }
    #follow {
      color: white;
      background-color: #6ec6ff;
      border: 1px solid transparent;
      &:hover {
        border: 1.2px solid #6ec6ff;
        background-color: white;
        color: #6ec6ff;
      }
      &:hover:active {
        transform: translateY(2px);
        box-shadow: inset 1px 1px 2px rgb(71, 166, 230);
        border-color: #6ec6ff;
        background-color: white;
      }
    }
  }
`;
const FollowButton = ({ user, bool }) => {
  const { mypageUserCode } = useParams();
  const token = localStorage.getItem("token");
  const [isLogin, setIsLogin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (token) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [token]);

  function parseJwt(token) {
    if (token !== null) {
      const base64Url = token.split(".")[1]; // 토큰의 두 번째 부분 (Payload)
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function(c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      const result = JSON.parse(jsonPayload);
      const tokenCode = result.userCode;
      return tokenCode;
    }
  }
  const tokenCode = parseJwt(token);
  const [follow, setFollow] = useState({
    followingUser: {
      userCode: 0,
    },
    followerUser: {
      userCode: 0,
    },
  });
  useEffect(() => {
    if (user?.userCode) {
      setFollow({
        followingUser: {
          userCode: tokenCode,
        },
        followerUser: {
          userCode: Number(user.userCode) || 0, // 숫자로 변환되거나 0으로 처리
        },
      });
    }
  }, [tokenCode, user]);

  const [isFollow, setIsFollow] = useState(false);
  useEffect(() => {
    setIsFollow(bool);
  }, [bool]);

  let isSelf = 0;

  const addFollowRelative = () => {
    if (
      tokenCode !== 0 &&
      mypageUserCode !== 0 &&
      follow.followingUser.userCode !== 0
    ) {
      isSelf =
        tokenCode === parseInt(mypageUserCode)
          ? 1
          : tokenCode !== parseInt(mypageUserCode) &&
            parseInt(mypageUserCode) === parseInt(follow.followingUser.userCode)
          ? 2
          : 0;
    } // isSelf 계산
    dispatch(createFollowRelative({ isSelf, follow }));
    setIsFollow(true);
  };

  const unfollow = () => {
    if (
      tokenCode !== 0 &&
      mypageUserCode !== 0 &&
      follow.followingUser.userCode !== 0
    ) {
      isSelf =
        tokenCode === parseInt(mypageUserCode)
          ? 1
          : tokenCode !== parseInt(mypageUserCode) &&
            parseInt(mypageUserCode) === parseInt(follow.followingUser.userCode)
          ? 2
          : 0;
    } // isSelf 계산
    dispatch(
      removeFollowRelative({
        isSelf,
        followingUserCode: follow.followingUser.userCode,
        followerUserCode: follow.followerUser.userCode,
      })
    );
    setIsFollow(false);
  };
  const submit = (event) => {
    event.stopPropagation();
    if (!isFollow) {
      addFollowRelative();
    } else {
      unfollow();
    }
  };
  const toRegister = () => {
    setShowModal(false);
    setRegisterOpen(true);
  };
  const tryRegister = () => {
    setShowModal(true);
  };
  return (
    <>
      <FollowStyleAndEffect>
        <div className="followButton">
          {isLogin ? (
            <>
              {isFollow ? (
                <button
                  id="unfollow"
                  onClick={(event) => {
                    submit(event);
                  }}
                >
                  언팔로우
                </button>
              ) : (
                <button
                  id="follow"
                  onClick={(event) => {
                    submit(event);
                  }}
                >
                  팔로우
                </button>
              )}
            </>
          ) : (
            <button id="follow" onClick={tryRegister}>
              팔로우
            </button>
          )}
        </div>
      </FollowStyleAndEffect>
      {showModal && (
        <ForNotUser setShowModal={setShowModal} toRegister={toRegister} />
      )}
      {registerOpen && (
        <ToRegister
          setRegisterOpen={setRegisterOpen}
          setShowModal={setShowModal}
        />
      )}
    </>
  );
};
export default FollowButton;
