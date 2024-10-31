import { useState, useEffect } from "react";
import { TiDelete } from "react-icons/ti";
import { BiShoppingBag } from "react-icons/bi";
import "../assets/css/post.scoped.scss";

const Post = ({ upload, post, setPost, setBodyTag, setCareerTag }) => {
  const [imgPreviews, setImgPreviews] = useState([]);
  const [sortedFiles, setSortedFiles] = useState([]);
  const [click, setClick] = useState([]);

  const product = {
    productBrand: "",
    productName: "",
    productSize: "",
    productBuyFrom: "",
    productLink: "",
  };

  useEffect(() => {
    console.log(post);
  }, [post]);

  const imageUpload = (e) => {
    let files = Array.from(e.target.files);

    // 현재 상태에서 기존 이미지 파일을 가져옵니다.
    const currentFiles = post.imageFiles || [];
    const newFiles = [...currentFiles, ...files];

    // 최대 5개 파일 체크
    if (newFiles.length > 5) {
      alert("이미지는 최대 5개까지 업로드할 수 있습니다.");
      e.target.value = "";
      return;
    }

    // 이미지 파일 설정
    setPost({ ...post, imageFiles: newFiles });

    // 이미지 미리보기 설정
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setImgPreviews(newPreviews);

    // 클릭 순서 초기화
    setClick([]);
  };

  // 이미지 순서 정하기
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

  // 이미지 삭제
  const handleDelete = (index) => {
    setPost((prevPost) => {
      const updatedFiles = prevPost.imageFiles.filter((_, i) => i !== index);
      return { ...prevPost, imageFiles: updatedFiles };
    });

    setImgPreviews((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    );
    setClick((prevClick) => prevClick.filter((i) => i !== index));
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

  // - 제품 삭제 버튼
  const deleteProduct = (index) => {
    setPost((prevPost) => {
      // 현재 제품 목록에서 선택한 인덱스를 제외한 새로운 배열 생성
      const updatedProducts = prevPost.products.filter((_, i) => i !== index);
      return { ...prevPost, products: updatedProducts };
    });
  };

  const careerCheck = (e) => {
    const value = e.target.value;

    const checkCareer = document.getElementsByName("career");
    for (let i = 0; i < checkCareer.length; i++) {
      if (checkCareer[i].value !== value) {
        // console.log(checkCareer[i].value);
        checkCareer[i].checked = false;
      }
    }

    console.log(value);
    setCareerTag(value);
  };

  const bodyCheck = (e) => {
    const value = e.target.value;
    const checkBody = document.getElementsByName("bodyType");
    for (let i = 0; i < checkBody.length; i++) {
      if (checkBody[i].value !== value) {
        // console.log(checkBody[i].value);
        checkBody[i].checked = false;
      }
    }

    console.log(value);
    setBodyTag(value);
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

  const switched = (e) => {
    const checked = e.target.checked;
    if (checked) {
      setPost({ ...post, postPublicYn: "N" });
      console.log("비공개");
    } else {
      setPost({ ...post, postPublicYn: "Y" });
      console.log("공개");
    }
  };

  return (
    <>
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-md mt-10 rounded-lg">
        <div className="mb-4">
          <textarea
            id="content"
            className="w-full border border-gray-300 rounded px-3 py-2 h-32"
            placeholder="내용을 입력해 다른이들과 소통해보세요!"
            value={post.postDesc}
            onChange={(e) => setPost({ ...post, postDesc: e.target.value })}
          />
        </div>
        <div
          className="mb-4"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={imageUpload}
            style={{ padding: "10px" }}
          />

          {imgPreviews.length > 0 && (
            <div
              className="imgPreviews"
              style={{ height: "130px", width: "100%", padding: "5px" }}
            >
              <p style={{ color: "crimson", marginBottom: "10px" }}>
                이미지 클릭해서 업로드 순서 선택
              </p>

              {imgPreviews.map((preview, index) => (
                <div
                  key={index}
                  style={{
                    position: "relative",
                    display: "inline-block",
                  }}
                >
                  <img
                    src={preview}
                    alt={`preview-${index}`}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      margin: "5px",
                    }}
                    onClick={() => handleImageClick(index)} // 클릭 이벤트 추가
                  />
                  {click.includes(index) && (
                    <span
                      style={{
                        position: "absolute",
                        fontWeight: "bold",
                        top: "87px",
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
                  <button
                    onClick={(e) => {
                      handleDelete(index); // 삭제 함수 호출
                    }}
                    style={{
                      position: "absolute",
                      fontWeight: "bold",
                      top: "0",
                      right: "0",
                      color: "white",
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      padding: "2px 5px",
                      cursor: "pointer",
                      zIndex: "1",
                    }}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-4">
          {post.products?.map((item, index) => (
            <div className="text-sm" style={{ margin: "10px 2px" }} key={index}>
              <input
                type="text"
                placeholder="브랜드"
                value={item.productBrand}
                // onChange={(e) => setPost({ ...product, productBrand: e.target.value })} 바로 쓸 수 없음..
                onChange={(e) => setBrand(e, index)}
                style={{
                  borderBottom: "1px solid #bbb",
                  width: "18%",
                }}
              />
              <input
                type="text"
                placeholder="제품명"
                value={item.productName}
                onChange={(e) => setName(e, index)}
                style={{
                  borderBottom: "1px solid #bbb",
                  width: "18%",
                  margin: "2px",
                }}
              />
              <input
                type="text"
                placeholder="컬러/사이즈"
                value={item.productSize}
                onChange={(e) => setSize(e, index)}
                style={{
                  borderBottom: "1px solid #bbb",
                  width: "18%",
                  margin: "2px",
                }}
              />
              <input
                type="text"
                placeholder="구매처"
                value={item.productBuyFrom}
                onChange={(e) => setBuyFrom(e, index)}
                style={{
                  borderBottom: "1px solid #bbb",
                  width: "18%",
                  margin: "2px",
                }}
              />
              <input
                type="text"
                placeholder="구매 링크"
                value={item.productLink}
                onChange={(e) => setLink(e, index)}
                style={{
                  borderBottom: "1px solid #bbb",
                  width: "18%",
                  margin: "2px",
                }}
              />
              <button
                className="product-del"
                onClick={() => deleteProduct(index)}
              >
                <TiDelete />
              </button>
            </div>
          ))}
          <button
            type="button"
            className="w-full p-2 border border-gray-300 rounded bg-gray-200 hover:bg-gray-300 mt-2"
            onClick={addProduct}
          >
            <p className="add-product">
              제품 정보 추가
              <BiShoppingBag />
            </p>
          </button>
        </div>

        <div className="mb-4 text-sm" style={{ display: "flex" }}>
          <label
            htmlFor="content"
            className="block text-sm font-bold font-medium mb-2"
          >
            공개 여부
          </label>
          <div>
            <label className="switch">
              <input type="checkbox" onChange={switched} />
              <span>
                <em />
                <strong />
              </span>
            </label>
          </div>
        </div>

        {/* 태그 */}
        <div className="mb-4">
          <div className="text-sm">
            <div className="mb-2 font-bold">SEASON</div>
            <div>
              <div className="checkbox-wrapper">
                <input type="checkbox" className="check" id="check1" />
                <label htmlFor="check1" className="label">
                  <svg width={20} height={25} viewBox="0 0 95 95">
                    <rect
                      x={0}
                      y={8}
                      width={60}
                      height={60}
                      stroke="black"
                      fill="none"
                    />
                    <g transform="scale(0.9) translate(-10,-965.36222)">
                      <path
                        d="m 56,963 c -102,122 6,9 7,9 17,-5 -66,69 -38,52 122,-77 -7,14 18,4 29,-11 45,-43 23,-4"
                        stroke="black"
                        strokeWidth={3}
                        fill="none"
                        className="path1"
                      />
                    </g>
                  </svg>
                  테스트
                </label>

                <input type="checkbox" className="check" id="check2" />
                <label htmlFor="check2" className="label">
                  <svg width={20} height={25} viewBox="0 0 95 95">
                    <rect
                      x={0}
                      y={8}
                      width={60}
                      height={60}
                      stroke="black"
                      fill="none"
                    />
                    <g transform="scale(0.9) translate(-10,-965.36222)">
                      <path
                        d="m 56,963 c -102,122 6,9 7,9 17,-5 -66,69 -38,52 122,-77 -7,14 18,4 29,-11 45,-43 23,-4"
                        stroke="black"
                        strokeWidth={3}
                        fill="none"
                        className="path1"
                      />
                    </g>
                  </svg>
                  테스트2
                </label>
              </div>
              <div className="container">
                <input type="checkbox" id="cbx" style={{ display: "none" }} />
                <label htmlFor="cbx" className="check5">
                  <svg width="18px" height="18px" viewBox="0 0 18 18">
                    <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z" />
                    <polyline points="1 9 7 14 15 4" />
                  </svg>
                  테스트 333
                </label>
              </div>

              <label className="checkBox">
                <input
                  type="checkbox"
                  className="mr-1"
                  value="1"
                  onChange={tagCheck}
                />
                봄
              </label>
              <label className="checkBox">
                <input
                  type="checkbox"
                  className="mr-1"
                  value="2"
                  onChange={tagCheck}
                  style={{ marginLeft: "15px" }}
                />
                여름
              </label>
              <label className="checkBox">
                <input
                  type="checkbox"
                  className="mr-1"
                  value="3"
                  onChange={tagCheck}
                  style={{ marginLeft: "15px" }}
                />
                가을
              </label>
              <label className="checkBox">
                <input
                  type="checkbox"
                  className="mr-1"
                  value="4"
                  onChange={tagCheck}
                  style={{ marginLeft: "15px" }}
                />
                겨울
              </label>
            </div>
          </div>
          <div className="text-sm mt-4">
            <div className="mb-2 font-bold">CAREER</div>
            <div>
              <label>
                <input
                  type="checkbox"
                  name="career"
                  className="mr-1"
                  value="5"
                  onChange={careerCheck}
                />
                ~1년 미만
              </label>
              <label>
                <input
                  type="checkbox"
                  name="career"
                  className="mr-1"
                  value="6"
                  onChange={careerCheck}
                  style={{ marginLeft: "15px" }}
                />
                1~3년차
              </label>
              <label>
                <input
                  type="checkbox"
                  name="career"
                  className="mr-1"
                  value="7"
                  onChange={careerCheck}
                  style={{ marginLeft: "15px" }}
                />
                3년 이상
              </label>
              <label>
                <input
                  type="checkbox"
                  name="career"
                  className="mr-1"
                  value="8"
                  onChange={careerCheck}
                  style={{ marginLeft: "15px" }}
                />
                임원
              </label>
            </div>
          </div>
          <div className="text-sm mt-4">
            <div className="mb-2 font-bold">MOOD</div>
            <div style={{ width: "85%" }}>
              <label>
                <input
                  type="checkbox"
                  className="mr-1"
                  value="9"
                  onChange={tagCheck}
                />
                포멀
              </label>
              <label>
                <input
                  type="checkbox"
                  className="mr-1"
                  value="10"
                  onChange={tagCheck}
                  style={{ marginLeft: "15px" }}
                />
                캐주얼
              </label>
              <label>
                <input
                  type="checkbox"
                  className="mr-1"
                  value="11"
                  onChange={tagCheck}
                  style={{ marginLeft: "15px" }}
                />
                스트릿
              </label>
              <label>
                <input
                  type="checkbox"
                  className="mr-1"
                  value="12"
                  onChange={tagCheck}
                  style={{ marginLeft: "15px" }}
                />
                아메카지
              </label>
              <label>
                <input
                  type="checkbox"
                  className="mr-1"
                  value="13"
                  onChange={tagCheck}
                  style={{ marginLeft: "15px" }}
                />
                빈티지
              </label>
              <label>
                <input
                  type="checkbox"
                  className="mr-1"
                  value="14"
                  onChange={tagCheck}
                  style={{ marginLeft: "15px" }}
                />
                시티보이
              </label>
              <label>
                <input
                  type="checkbox"
                  className="mr-1"
                  value="15"
                  onChange={tagCheck}
                  style={{ marginLeft: "15px" }}
                />
                페미닌
              </label>
              <label>
                <input
                  type="checkbox"
                  className="mr-1"
                  value="16"
                  onChange={tagCheck}
                />
                미니멀
              </label>
              <label>
                <input
                  type="checkbox"
                  className="mr-1"
                  value="17"
                  onChange={tagCheck}
                  style={{ marginLeft: "15px" }}
                />
                스포티
              </label>
              <label>
                <input
                  type="checkbox"
                  className="mr-1"
                  value="18"
                  onChange={tagCheck}
                  style={{ marginLeft: "15px" }}
                />
                톰보이
              </label>
              <label>
                <input
                  type="checkbox"
                  className="mr-1"
                  value="19"
                  onChange={tagCheck}
                  style={{ marginLeft: "15px" }}
                />
                기타
              </label>
            </div>
          </div>
          <div className="text-sm mt-4">
            <div className="mb-2 font-bold">BODY TYPE</div>
            <div>
              <label>
                <input
                  type="checkbox"
                  name="bodyType"
                  className="mr-1"
                  value="20"
                  onChange={bodyCheck}
                />
                마름
              </label>
              <label>
                <input
                  type="checkbox"
                  name="bodyType"
                  className="mr-1"
                  value="21"
                  onChange={bodyCheck}
                  style={{ marginLeft: "15px" }}
                />
                보통
              </label>
              <label>
                <input
                  type="checkbox"
                  name="bodyType"
                  className="mr-1"
                  value="22"
                  onChange={bodyCheck}
                  style={{ marginLeft: "15px" }}
                />
                건장
              </label>
              <label>
                <input
                  type="checkbox"
                  name="bodyType"
                  className="mr-1"
                  value="23"
                  onChange={bodyCheck}
                  style={{ marginLeft: "15px" }}
                />
                빅사이즈
              </label>
            </div>
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="w-full p-3 bg-black text-white rounded hover:bg-gray-800"
            onClick={upload}
          >
            업로드
          </button>
        </div>
      </div>
    </>
  );
};

export default Post;
