import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { nicknameCheck, registerUser } from "../../api/user";
import "../../assets/css/registerUser.scoped.scss";

const RegisterUser = () => {
  const [user, setUser] = useState({
    userEmail: new URL(window.location.href).searchParams.get("userEmail"),
    userPlatform: new URL(window.location.href).searchParams.get(
      "userPlatform"
    ),
    userNickname: "",
    userJob: "사무직",
    userGender: "남성",
    userHeight: 160,
    userWeight: 80,
    userBodySpecYn: "Y",
    userProfileUrl: "http://192.168.10.51:8081/userImg/defaultUser.png",
  });

  const navigate = useNavigate();

  const register = async () => {
    let nickCheck = false;
    let heightCheck = false;
    let weightCheck = false;
    let nickDuplicateCheck = false;

    const nickDupl = await nicknameCheck(user.userNickname);
    if (!nickDupl.data) alert(user.userNickname + "은 중복된 닉네임 입니다.");
    else nickDuplicateCheck = true;

    if (user.userNickname === "") alert("닉네임을 입력해주세요!");
    else nickCheck = true;

    if (user.userHeight < 140 || user.userHeight > 200)
      alert("정확한 신장을 입력해주세요.");
    else heightCheck = true;

    if (user.userWeight < 30 || user.userWeight > 120)
      alert("정확한 체중을 입력해주세요.");
    else weightCheck = true;

    if (nickCheck && heightCheck && weightCheck && nickDuplicateCheck) {
      registerUser(user);
      alert(user.userNickname + "님 회원가입에 성공하셨습니다!");
      navigate("/");
    }
  };

  return (
    <div className="con">
      <h1>회원 가입</h1>
      <div>
        <input
          type="text"
          value={user.userNickname}
          onChange={(e) => setUser({ ...user, userNickname: e.target.value })}
          placeholder="닉네임"
        />
      </div>
      <div>
        직종
        <select onChange={(e) => setUser({ ...user, userJob: e.target.value })}>
          <option value="사무직">사무직</option>
          <option value="연구직">연구직</option>
          <option value="공공직">공공직</option>
          <option value="의료직">의료직</option>
          <option value="엔터테인먼트">엔터테인먼트</option>
          <option value="서비스직">서비스직</option>
          <option value="영업직">영업직</option>
          <option value="건설직">건설직</option>
          <option value="생산직">생산직</option>
          <option value="농림어업직">농림어업직</option>
          <option value="기타">기타</option>
        </select>
      </div>
      <div>
        성별
        <label onClick={() => setUser({ ...user, userGender: "남성" })}>
          <input type="radio" value="남성" name="gender" defaultChecked />
          남성
        </label>
        <label onClick={() => setUser({ ...user, userGender: "여성" })}>
          <input type="radio" value="여성" name="gender" />
          여성
        </label>
      </div>
      <div>
        신장
        <input
          type="range"
          min="140"
          max="200"
          step="1"
          value={user.userHeight}
          onChange={(e) => setUser({ ...user, userHeight: e.target.value })}
        />
        <input
          type="number"
          value={user.userHeight}
          onChange={(e) => setUser({ ...user, userHeight: e.target.value })}
        />
        <span>cm</span>
      </div>
      <div>
        체중
        <input
          type="range"
          min="30"
          max="120"
          step="1"
          value={user.userWeight}
          onChange={(e) => setUser({ ...user, userWeight: e.target.value })}
        />
        <input
          type="number"
          value={user.userWeight}
          onChange={(e) => setUser({ ...user, userWeight: e.target.value })}
        />
        <span>kg</span>
      </div>
      <button type="button" onClick={register}>
        회원가입
      </button>
    </div>
  );
};
export default RegisterUser;
