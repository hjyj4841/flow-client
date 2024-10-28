import { getKakaoCode } from "../../api/kakao";
import { getGoogleCode } from "../../api/google";
import { getNaverCode } from "../../api/naver";
import "../../assets/css/forNotUser.scss";

const ForNotUser = ({setShowModal, toRegister}) => {
    return (
        <>
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
              <div className="divider"></div>
              <div className="register">
                <span>아직 회원이 아니신가요?</span>
                <span className="registerLink" onClick={toRegister}>
                  가입
                </span>
              </div>
            </div>
          </div>
        </>
    )
}

export default ForNotUser;