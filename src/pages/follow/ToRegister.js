import { getKakaoCode } from "../../api/kakao";
import { getGoogleCode } from "../../api/google";
import { getNaverCode } from "../../api/naver";
import "../../assets/css/forNotUser.scss";

const ToRegister = ({setRegisterOpen, setShowModal}) => {
    return(
        <>
        <div className="loginAndRegister-container">
            <div className="forNotUsers-modal-content">
            <h1>회원가입</h1>
            <p>네이버, 구글, 카카오 계정으로 간편하게!</p>
            <div className="divider"></div> {/* 구분선 */}
            <button
              type="button"
              className="google"
              onClick={() => getGoogleCode("register")}
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
              onClick={() => getKakaoCode("register")}
            >
              <span className="text-stretch">kakao</span>
            </button>
            <button
              type="button"
              className="naver"
              onClick={() => getNaverCode("register")}
            >
              <span className="text-stretch">NAVER</span>
            </button>
            <button
              className="forNotUser-close-button"
              onClick={() => setRegisterOpen(false)}
            >
              닫기
            </button>
            <div className="divider"></div> {/* 구분선 */}
            <div className="registerAndLogin">
              <span>로그인 화면으로 돌아가기</span>
              <span className="registerAndLoginLink"
              onClick={() => {
                setRegisterOpen(false);
                setShowModal(true);
              }}
              >로그인</span>
            </div>
            <div className="brand-name">FLOW</div>
          </div>
        </div>
        </>
    )
}
export default ToRegister;