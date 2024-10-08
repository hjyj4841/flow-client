import { TbCirclePlus } from "react-icons/tb";
import { useState, useEffect } from "react";
import { addPost } from "../../api/post";

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

  const [imgPreviews, setImgPreviews] = useState([]);
  const [click, setClick] = useState([]);
  const [sortedFiles, setSortedFiles] = useState([]);

  const product = {
    productBrand: "",
    productName: "",
    productSize: "",
    productBuyFrom: "",
    productLink: "",
  };

  const [post, setPost] = useState({
    imageFiles: [],
    postDesc: "",
    postPublicYn: "Y",
    userCode: "",
    products: [],
    tagCodes: [],
  });

  /*
  useEffect(() => {
    console.log(post);
  }, [post]);
  */

  const upload = async () => {
    const formData = new FormData();

    // 필수항목 알림처리
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

    // tag 리스트
    for (let i = 0; i < post.tagCodes.length; i++) {
      formData.append(`tagCodes[${i}]`, post.tagCodes[i]);
    }

    formData.append("userCode", userCode);
    formData.append("postDesc", post.postDesc);
    formData.append("postPublicYn", post.postPublicYn);

    try {
      const response = await addPost(formData);
      console.log(response.data); // 새 post 정보
      alert("업로드 완료");
      window.location.href = "/";
    } catch (error) {
      alert("업로드 실패:" + error);
    }
  };

  const imageUpload = (e) => {
    let files = Array.from(e.target.files);

    if (files.length > 5) {
      alert("이미지는 최대 5개까지 업로드할 수 있습니다.");
      e.target.value = "";
      return;
    }

    setPost({ ...post, imageFiles: files });

    // 이미지 미리보기 설정
    const previews = files.map((file) => URL.createObjectURL(file));
    setImgPreviews(previews);

    setClick([]); // 클릭 순서 초기화
  };

  const handleImageClick = (index) => {
    setClick((prevIndex) => {
      if (prevIndex.includes(index)) {
        // 이미 존재하는 인덱스는 제거
        return prevIndex.filter((i) => i !== index);
      } else {
        // 새로 클릭된 인덱스를 추가
        return [...prevIndex, index];
      }
    });
  };

  useEffect(() => {
    // 클릭 순서에 맞춰 post 상태 업데이트
    setSortedFiles(click.map((i) => post.imageFiles[i]));
    //console.log(sortedFiles);

    // setPost({ ...post, imageFiles: sortedFiles }); -> 불가능
  }, [click]);

  useEffect(() => {
    if (post.imageFiles.length === sortedFiles.length) {
      setPost({ ...post, imageFiles: sortedFiles }); //-> post에 저장
    }
  }, [sortedFiles]);

  const setBrand = (e, i) => {
    const products = post.products;
    products[i].productBrand = e.target.value;
    setPost({ ...post, products: products });
  };

  const setName = (e, i) => {
    const products = post.products;
    products[i].productName = e.target.value;
    setPost({ ...post, products: products });
  };

  const setSize = (e, i) => {
    const products = post.products;
    products[i].productSize = e.target.value;
    setPost({ ...post, products: products });
  };

  const setBuyFrom = (e, i) => {
    const products = post.products;
    products[i].productBuyFrom = e.target.value;
    setPost({ ...post, products: products });
  };

  const setLink = (e, i) => {
    const products = post.products;
    products[i].productLink = e.target.value;
    setPost({ ...post, products: products });
  };

  // + 제품 추가 버튼
  const addProduct = () => {
    const products = post.products;
    products.push(product);
    setPost({ ...post, products: products });
  };

  const tagCheck = (e) => {
    const value = e.target.value;

    setPost((post) => {
      const isChecked = post.tagCodes.includes(value);
      return {
        ...post,
        tagCodes: isChecked
          ? post.tagCodes.filter((el) => el !== value) // 체크 해제
          : [...post.tagCodes, value], // 체크
      };
    });
  };

  return (
    <>
      <div>
        <input type="file" accept="image/*" multiple onChange={imageUpload} />
        {imgPreviews.length > 0 && (
          <p style={{ color: "crimson" }}>이미지 순서 선택</p>
        )}
        <div className="imgPreviews">
          {imgPreviews.map((preview, index) => (
            <div
              key={index}
              style={{ position: "relative", display: "inline-block" }}
              onClick={() => handleImageClick(index)} // 클릭 이벤트 추가
            >
              <img
                src={preview}
                alt={`preview-${index}`}
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  margin: "5px",
                }}
              />
              {click.includes(index) && (
                <span
                  style={{
                    position: "absolute",
                    fontWeight: "bold",
                    top: "5px",
                    left: "5px",
                    color: "white",
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    padding: "2px 5px",
                    borderRadius: "3px",
                    fontSize: "14px",
                  }}
                >
                  {click.indexOf(index) + 1}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <label>내용 입력</label>
        <textarea
          rows="5"
          placeholder="내용 입력"
          value={post.postDesc}
          onChange={(e) => setPost({ ...post, postDesc: e.target.value })}
        ></textarea>
      </div>

      <div>
        <label>제품 정보 추가</label>
        {post.products?.map((item, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="브랜드"
              value={item.productBrand}
              // onChange={(e) => setPost({ ...product, productBrand: e.target.value })} 바로 쓸 수 없음..
              onChange={(e) => setBrand(e, index)}
            />
            <input
              type="text"
              placeholder="제품명"
              value={item.productName}
              onChange={(e) => setName(e, index)}
            />
            <input
              type="text"
              placeholder="제품 사이즈"
              value={item.productSize}
              onChange={(e) => setSize(e, index)}
            />
            <input
              type="text"
              placeholder="구매처"
              value={item.productBuyFrom}
              onChange={(e) => setBuyFrom(e, index)}
            />
            <input
              type="text"
              placeholder="구매 링크"
              value={item.productLink}
              onChange={(e) => setLink(e, index)}
            />
          </div>
        ))}
        <button type="button" onClick={addProduct}>
          <TbCirclePlus />
        </button>
      </div>

      <div>
        <label>공개 여부</label>
        <div>
          <input
            type="radio"
            name="publicYn"
            value="Y"
            checked={post.postPublicYn === "Y"}
            onChange={() => setPost({ ...post, postPublicYn: "Y" })}
          />
          공개
          <input
            type="radio"
            name="publicYn"
            value="N"
            checked={post.postPublicYn === "N"}
            onChange={() => setPost({ ...post, postPublicYn: "N" })}
          />
          비공개
        </div>
      </div>

      {/* 태그 */}
      <label className="tagType"> 계절 </label>
      <div>
        <input type="checkbox" value="1" onChange={tagCheck} /> 봄
        <input type="checkbox" value="2" onChange={tagCheck} /> 여름
        <input type="checkbox" value="3" onChange={tagCheck} /> 가을
        <input type="checkbox" value="4" onChange={tagCheck} /> 겨울
      </div>
      <label className="tagType"> 연차 </label>
      <div>
        <input type="checkbox" value="5" onChange={tagCheck} /> ~1년 미만
        <input type="checkbox" value="6" onChange={tagCheck} /> 1~3년차
        <input type="checkbox" value="7" onChange={tagCheck} /> 3년 이상
        <input type="checkbox" value="8" onChange={tagCheck} /> 임원
      </div>
      <label className="tagType"> 스타일 </label>
      <div>
        <input type="checkbox" value="9" onChange={tagCheck} /> 포멀
        <input type="checkbox" value="10" onChange={tagCheck} /> 캐주얼
        <input type="checkbox" value="11" onChange={tagCheck} /> 스트릿
        <input type="checkbox" value="12" onChange={tagCheck} /> 아메카지
        <input type="checkbox" value="13" onChange={tagCheck} /> 빈티지
        <input type="checkbox" value="14" onChange={tagCheck} /> 시티보이
        <input type="checkbox" value="15" onChange={tagCheck} /> 페미닌
        <input type="checkbox" value="16" onChange={tagCheck} /> 미니멀
        <input type="checkbox" value="17" onChange={tagCheck} /> 스포티
        <input type="checkbox" value="18" onChange={tagCheck} /> 톰보이
        <input type="checkbox" value="19" onChange={tagCheck} /> 기타
      </div>
      <label className="tagType"> 체형 </label>
      <div>
        <input type="checkbox" value="20" onChange={tagCheck} /> 마름
        <input type="checkbox" value="21" onChange={tagCheck} /> 보통
        <input type="checkbox" value="22" onChange={tagCheck} /> 건장
        <input type="checkbox" value="23" onChange={tagCheck} /> 빅사이즈
      </div>
      <div>
        <button onClick={upload}>업로드</button>
      </div>
    </>
  );
};

export default UploadPost;
