import { useEffect, useState } from "react";
import {
  createFollowRelative,
  removeFollowRelative,
} from "../../store/followSlice";
import { useDispatch} from "react-redux";
import styled from "styled-components";
import { getKakaoCode } from "../../api/kakao";
import { getGoogleCode } from "../../api/google";
import { getNaverCode } from "../../api/naver";
import { useParams } from "react-router-dom";
import "../../assets/css/forNotUser.scss";

const FollowStyleAndEffect = styled.div`
    .followButton {
      button {
        color: #FFFFFF; /* 텍스트와 테두리 색상을 차분한 청록색으로 */
        margin: 1px;
        margin-top: 10px;
        width: 6rem;
        height: 3rem;
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
  const toRegister = () => {};
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
          <div className="loginAndRegister-container">
            <div className="modal-content">
              <h1>로그인 후 이용하실 수 있습니다!</h1>
              <p>네이버, 구글, 카카오 계정으로 간편하게!</p>
              <div className="divider"></div> {/* 구분선 */}
              <button
                type="button"
                className="google"
                onClick={() => getGoogleCode("login")}
              >
                <span className="blue">G</span>
                <span className="red">o</span>
                <span className="yellow">o</span>
                <span className="blue">g</span>
                <span className="green">l</span>
                <span className="red">e</span>
              </button>
              <button
                type="button"
                className="kakao"
                onClick={() => getKakaoCode("login")}
              >
                Kakao
              </button>
              <button
                type="button"
                className="naver"
                onClick={() => getNaverCode("login")}
              >
                NAVER
              </button>
              <button onClick={() => setShowModal(false)}>닫기</button>
              <div className="divider"></div> {/* 구분선 */}
              <div className="register">
                <span>아직 회원이 아니신가요?</span>
                <span className="registerLink" onClick={toRegister}>
                  가입
                </span>
              </div>
            </div>
          </div>
        )}
    </>
  );
};
export default FollowButton;
