import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api/user/",
});

// 회원 로그인 or 회원가입
export const userCheck = async (user) => {
  const result = await instance.get(
    `duplicateCheck?userEmail=${user.userEmail}&userPlatform=${
      user.userPlatform
    }`
  );

  if (!result.data) {
    if (user.type === "login") {
      try {
        const response = await instance.post("login", {
          userEmail: user.userEmail,
          userPlatform: user.userPlatform,
        });
        return response.data;
      } catch (error) {
        alert("너 밴");
      }
      return null;
    } else {
      alert("이미 가입한 회원입니다.");
      window.location.href = "/";
    }
  } else {
    if (user.type === "login") {
      alert("회원가입 후 이용해 주세요.");
      return null;
    } else {
      window.location.href = `/registerUser?userEmail=${
        user.userEmail
      }&userPlatform=${user.userPlatform}`;
    }
  }
};

// 회원가입 최종
export const registerUser = async (user) => {
  await instance.post("register", user);
};

// 회원 탈퇴
export const deleteUser = async (token) => {
  await instance.delete("deleteUser", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// 유저 정보 가져오기
export const findUser = async (token) => {
  return await instance.get("findUser", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const findUserByCode = async (userCode) => {
  return await instance.get(`findUserByCode?userCode=${userCode}`);
};

// 유저 정보 수정하기
export const updateUser = async (data) => {
  await instance.put("updateUser", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 유저 닉네임 중복 체크
export const nicknameCheck = async (userNickname) => {
  return await instance.get(`nickNameCheck?userNickname=${userNickname}`);
};
