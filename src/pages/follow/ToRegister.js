import { getKakaoCode } from "../../api/kakao";
import { getGoogleCode } from "../../api/google";
import { getNaverCode } from "../../api/naver";
import "../../assets/css/forNotUser.scss";

const ToRegister = ({setRegisterOpen}) => {
    return(
        <>
        <div className="loginAndRegister-container">
            <div className="modal-content">
            <h1>회원가입</h1>
            <button
              type="button"
              className="google"
              onClick={() => getGoogleCode("register")}
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
              onClick={() => getKakaoCode("register")}
            >
              Kakao
            </button>
            <button
              type="button"
              className="naver"
              onClick={() => getNaverCode("register")}
            >
              NAVER
            </button>
            <button
              className={"login-close-btn"}
              onClick={() => setRegisterOpen(false)}
            >
              닫기
            </button>
          </div>
        </div>
        </>
    )
}
export default ToRegister;