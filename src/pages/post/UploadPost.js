import { addPost } from "../../api/post";
import Post from "../../components/Post";
import { useState } from "react";

const UploadPost = () => {
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
    products: [],
    tagCodes: [],
  });

  const [careerTag, setCareerTag] = useState(0);
  const [bodyTag, setBodyTag] = useState(0);

  const upload = async () => {
    // formData저장
    const formData = new FormData();

    // 이미지 첨부 필수 알림처리
    if (post.imageFiles.length === 0) {
      alert("이미지 첨부 필요");
      return;
    }

    // 이미지 리스트
    for (let i = 0; i < post.imageFiles.length; i++) {
      formData.append(`imageFiles[${i}]`, post.imageFiles[i]);
    }

    // product 리스트
    for (let i = 0; i < post.products.length; i++) {
      formData.append(
        `products[${i}].productBrand`,
        post.products[i].productBrand
      );
      formData.append(
        `products[${i}].productName`,
        post.products[i].productName
      );
      formData.append(
        `products[${i}].productSize`,
        post.products[i].productSize
      );
      formData.append(
        `products[${i}].productBuyFrom`,
        post.products[i].productBuyFrom
      );
      formData.append(
        `products[${i}].productLink`,
        post.products[i].productLink
      );
    }

    for (let i = 0; i < post.tagCodes.length; i++) {
      console.log(post.tagCodes[i]);
      formData.append(`tagCodes[${i}]`, post.tagCodes[i]);
    }

    if (careerTag !== 0 && bodyTag === 0)
      formData.append(`tagCodes[${post.tagCodes.length}]`, careerTag);
    else if (careerTag === 0 && bodyTag !== 0)
      formData.append(`tagCodes[${post.tagCodes.length}]`, bodyTag);
    else if (careerTag !== 0 && bodyTag !== 0) {
      formData.append(`tagCodes[${post.tagCodes.length}]`, careerTag);
      formData.append(`tagCodes[${post.tagCodes.length + 1}]`, bodyTag);
    }

    formData.append("userCode", userCode);
    formData.append("postDesc", post.postDesc);
    formData.append("postPublicYn", post.postPublicYn);

    try {
      await addPost(formData);
      alert("업로드 완료");
      window.location.href = "/";
    } catch (error) {
      alert("업로드 실패" + error);
      window.location.reload();
    }
  };

  return (
    <div className="text-gray-800">
      <section className="bg-white py-4 shadow-md" />
      <div className="post-form">
        <Post
          upload={upload}
          post={post}
          setPost={setPost}
          bodyTag={bodyTag}
          setBodyTag={setBodyTag}
          careerTag={careerTag}
          setCareerTag={setCareerTag}
        />
      </div>
    </div>
  );
};

export default UploadPost;
