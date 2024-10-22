import { addPostVote } from "../../api/post";
import { useState } from "react";
import VoteUpload from "../../components/VotePost";

const UploadVote = () => {
  // 유저 코드 저장 및 불러오기 -> 확인 필요**
  const token = localStorage.getItem("token");
  let userCode = "";
  if (token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    const userData = JSON.parse(window.atob(base64));
    userCode = userData.userCode;
  }

  const [post, setPost] = useState({
    imageFiles: [],
    postDesc: "",
    postPublicYn: "Y",
    userCode: "",
  });

  const upload = async () => {
    const formData = new FormData();
    if (post.imageFiles.length === 0) {
      alert("이미지 첨부 필요");
      return;
    }

    // 이미지 리스트
    for (let i = 0; i < post.imageFiles.length; i++) {
      formData.append(`imageFiles[${i}]`, post.imageFiles[i]);
    }

    formData.append("userCode", userCode);
    formData.append("postDesc", post.postDesc);
    formData.append("postPublicYn", post.postPublicYn);

    try {
      await addPostVote(formData);
      alert("업로드 완료");
      window.location.href = "/";
    } catch (error) {
      alert("업로드 실패:" + error);
      console.log(post);
    }
  };

  return (
    <div>
      <VoteUpload upload={upload} post={post} setPost={setPost} />
    </div>
  );
};

export default UploadVote;