import { useEffect, useState, useMemo, useCallback} from "react";
import {
  createFollowRelative,
  removeFollowRelative,
  followStatus
} from "../../store/followSlice";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { getKakaoCode } from "../../api/kakao";
import { getGoogleCode } from "../../api/google";
import { getNaverCode } from "../../api/naver";

const FollowButton = ({ user }) => {
  const FollowStyleAndEffect = styled.div`
    button {
      color: #006666;
      margin: 1px;
      margin-top: 10px;
      width: 6rem;
      height: 3rem;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      background-color: #c6fcff;
      box-shadow: inset 5px 0px 4px rgba(203, 249, 252, 1);
      font-size: 1.2rem;
      font-weight: 500;
      font-family: "Poppins", sans-serif;
    }
    .loginAndRegister-container {
    position: fixed;
    top: 0px;
    left: -16px;
    display: flex;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;
    z-index: 4;
    .modal-content {
      display: flex;
      width: 500px;
      height: 700px;
      flex-direction: column;
      background-color: white;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
        .register span{
          margin: 4px;
        }
        .register .registerLink {
          color: skyblue;
          text-decoration: underline;
          cursor: pointer;
        }
    }
  }
  
  `;
  // Google Fonts를 동적으로 로드하는 useEffect 훅
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link); // <head>에 추가
  }, []);
  const token = localStorage.getItem("token");
  const [isLogin, setIsLogin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const followBool = useSelector((state) => state.follow.counter);
  useEffect(() => {
    if (token) {
      setIsLogin(true);
    }
  }, []);
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
  }, [token, user]);

  const [isFollow, setIsFollow] = useState(followBool);

  const addFollowRelative = () => {
    setIsFollow(true);
    dispatch(createFollowRelative(follow));
  };
  
  const unfollow = () => {
    setIsFollow(false);
    dispatch(
      removeFollowRelative({
        followingUserCode: follow.followingUser.userCode,
        followerUserCode: follow.followerUser.userCode,
      })
    );
  };

  const statusFollow = useCallback(() => {
    dispatch(
      followStatus({
        followingUserCode: tokenCode,
        followerUserCode: user?.userCode,
      })
    );
  }, [tokenCode, user?.userCode, dispatch])

  useEffect(() => {
    statusFollow();
  }, []);

  const submit = () => {
    if (!isFollow) {
      addFollowRelative();
    } else {
      unfollow();
    }
  };
  const tryRegister = () => {
    setShowModal(true);
  };
  const toRegister = () => {

  }
  return (
    <>
      <FollowStyleAndEffect>
        {isLogin ? (
          <>
          {followBool ? (<button onClick={submit}>언팔로우</button>) : (<button onClick={submit}>팔로우</button>)}
          </>
        ) : (
          <button onClick={tryRegister}>팔로우</button>
        )}
      {showModal && (
        <div className={"loginAndRegister-container"}>
          <div className={"modal-content"}>
            <h1></h1>
            <p>네이버, 구글, 카카오 계정으로 간편하게!</p>
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
            <button onClick={() => setShowModal(false)}>
              닫기
            </button>
            <div className="register"><span>아직 회원이 아니신가요?</span><span className="registerLink" onClick={toRegister}>가입</span></div>
          </div>
        </div>
      )}
      </FollowStyleAndEffect>
    </>
  );
};
export default FollowButton;
