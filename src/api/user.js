import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api/user/",
});

// 회원 로그인 or 회원가입
export const userCheck = async (user) => {
  const result = await instance.get(
    `duplicateCheck?userEmail=${user.userEmail}&userPlatform=${user.userPlatform}`
  );

  if (!result.data) {
    if (user.type === "login") {
      try {
        const response = await instance.post("login", {
          userEmail: user.userEmail,
          userPlatform: user.userPlatform,
        });
        localStorage.setItem("token", response.data);
      } catch (error) {
        alert("너 밴");
      }
      window.location.href = "/";
    } else {
      alert("이미 가입한 회원입니다.");
      window.location.href = "/";
    }
  } else {
    if (user.type === "login") {
      alert("회원가입 후 이용해 주세요.");
      window.location.href = "/";
    } else {
      window.location.href = `/registerUser?userEmail=${user.userEmail}&userPlatform=${user.userPlatform}`;
    }
  }
};

// 회원가입 최종
export const registerUser = async (user) => {
  await instance.post("register", user);
};

// 회원 탈퇴
export const deleteUser = async () => {
  await instance.delete("deleteUser");
};
