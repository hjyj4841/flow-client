import { getKakaoCode } from "../../api/kakao";
import { getGoogleCode } from "../../api/google";
import { getNaverCode } from "../../api/naver";
import "../../assets/css/forNotUser.scss";

const ForNotUser = ({setShowModal, toRegister}) => {
    return (
        <>
         <div className="loginAndRegister-container">
            <div className="forNotUsers-modal-content">
              <span id="forNotUserHeadline">로그인 후 이용하실 수 있습니다!</span>
              <p>로그인하고 나만의 서비스를 만나보세요!</p>
              <div className="divider"></div> {/* 구분선 */}
              <button
                type="button"
                className="google"
                onClick={() => getGoogleCode("login")}
              >
                <span className="blue">
                  <span className="text-stretch">G</span>
                </span>
                <span className="red">
                <span className="text-stretch">o</span>
                </span>
                <span className="yellow">
                  <span className="text-stretch">o</span>
                </span>
                <span className="blue">
                  <span className="text-stretch">g</span>
                </span>
                <span className="green">
                  <span className="text-stretch">l</span>
                </span>
                <span className="red">
                  <span className="text-stretch">e</span>
                </span>
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
                <span className="text-stretch">NAVER</span>
              </button>
              <button className="forNotUser-close-button" onClick={() => setShowModal(false)}>닫기</button>
              <div className="divider"></div>
              <div className="registerAndLogin">
                <span>아직 회원이 아니신가요?</span>
                <span className="registerAndLoginLink" onClick={toRegister}>
                  가입
                </span>
              </div>
              <div className="brand-name">FLOW</div>
            </div>
          </div>
        </>
    )
}

export default ForNotUser;