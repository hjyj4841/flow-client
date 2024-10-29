import { useEffect, useState } from "react";
import {
  createFollowRelative,
  removeFollowRelative,
} from "../../store/followSlice";
import { useDispatch} from "react-redux";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import "../../assets/css/forNotUser.scss";
import "../../components/RegisterModal.js"
import ForNotUser from "./ForNotUserModal.js";
import ToRegister from "./ToRegister.js";

const FollowStyleAndEffect = styled.div`
    .followButton {
      button {
        color: #FFFFFF; /* 텍스트와 테두리 색상을 차분한 청록색으로 */
        margin: 1px;
        width: 5.7rem;
        height: 2.7rem;
        border: 1px solid transparent;
        border-radius: 8px;
        cursor: pointer;
        background-color: #E74C3C;
        font-size: 1rem;
        font-weight: 400;
        font-family: "Poppins", sans-serif;
        letter-spacing: 0.05em;
        transition: transform 0.1s ease, box-shadow 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
        -webkit-appearance: none; /* 브라우저 기본 스타일 제거 */
        -moz-appearance: none;
        appearance: none;
          &:active {
            transform: translateY(2px);
            box-shadow: inset 1px 1px 1px rgba(150, 150, 150, 0.6);
            background-color: #C0392B;
          }
          &:hover {
            background-color: #FF6F61;
            border-color: #FF6F61; 
          }
          &:hover:active {
            background-color: #C0392B;
            box-shadow: inset 1px 1px 1px rgba(150, 150, 150, 0.6);
          }
      }
    }
  `;
const FollowButton = ({ user, bool }) => {
  const {followingUserCode} = useParams();
  const token = localStorage.getItem("token");
  const [isLogin, setIsLogin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (token) {
      setIsLogin(true);
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
    if((tokenCode !==0 && followingUserCode !==0 && follow.followingUser.userCode !== 0)) {
      isSelf = (tokenCode === parseInt(followingUserCode) ? 1 : ((tokenCode !== parseInt(followingUserCode)) && (parseInt(followingUserCode) === parseInt(follow.followingUser.userCode))) ? 2 : 0);
    } // isSelf 계산
    dispatch(createFollowRelative({isSelf, 
      follow}));
    setIsFollow(true);
  };

  const unfollow = () => {
    if((tokenCode !==0 && followingUserCode !==0 && follow.followingUser.userCode !== 0)) {
      isSelf = (tokenCode === parseInt(followingUserCode) ? 1 : ((tokenCode !== parseInt(followingUserCode)) && (parseInt(followingUserCode) === parseInt(follow.followingUser.userCode))) ? 2 : 0);
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
  const submit = () => {
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
  }
  return (
    <>
      <FollowStyleAndEffect>
        <div className="followButton">
        {isLogin ? (
          <>
            {isFollow ? (
              <button onClick={submit}>언팔로우</button>
            ) : (
              <button onClick={submit}>팔로우</button>
            )}
          </>
        ) : (
          <button onClick={tryRegister}>팔로우</button>
        )}
        </div>
        </FollowStyleAndEffect>
        {showModal && (
         <ForNotUser setShowModal={setShowModal} toRegister={toRegister}/>
        )}
        {registerOpen && (
        <ToRegister setRegisterOpen={setRegisterOpen}/>
      )}
    </>
  );
};
export default FollowButton;
