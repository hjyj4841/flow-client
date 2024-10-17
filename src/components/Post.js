import { useState, useEffect } from "react";
import "../assets/css/post.css";

const Post = ({ upload, post, setPost }) => {
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
            <>
              <div
                className="imgPreviews"
                style={{ height: "130px", width: "100%", padding: "5px" }}
              >
                <p style={{ color: "crimson" }}>
                  이미지 클릭해서 업로드 순서 선택
                </p>

                {imgPreviews.map((preview, index) => (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                      display: "inline-block",
                    }}
                    onClick={() => handleImageClick(index)} // 클릭 이벤트 추가
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
            </>
          )}
        </div>

        <div className="mb-4">
          {post.products?.map((item, index) => (
            <div
              className="grid grid-cols-5 gap-2 text-center text-sm"
              key={index}
            >
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
          <button
            type="button"
            className="w-full p-2 border border-gray-300 rounded bg-gray-200 hover:bg-gray-300 mt-2"
            onClick={addProduct}
          >
            제품 정보 추가
          </button>
        </div>

        <div className="mb-4 text-sm">
          <label htmlFor="content" className="block text-sm font-medium mb-2">
            공개 여부
          </label>
          <div>
            <input
              type="radio"
              name="publicYn"
              className="mr-1"
              value="Y"
              checked={post.postPublicYn === "Y"}
              onChange={() => setPost({ ...post, postPublicYn: "Y" })}
            />
            공개
            <input
              type="radio"
              name="publicYn"
              className="mr-1"
              value="N"
              checked={post.postPublicYn === "N"}
              onChange={() => setPost({ ...post, postPublicYn: "N" })}
            />
            비공개
          </div>
        </div>

        {/* 태그 */}
        <div className="mb-4">
          <div className="text-sm">
            <div className="mb-2">계절</div>
            <div>
              <label>
                <input
                  type="checkbox"
                  className="mr-1"
                  value="1"
                  onChange={tagCheck}
                />
                봄
              </label>
              <label>
                <input
                  type="checkbox"
                  className="mr-1"
                  value="2"
                  onChange={tagCheck}
                />
                여름
              </label>
              <label>
                <input
                  type="checkbox"
                  className="mr-1"
                  value="3"
                  onChange={tagCheck}
                />
                가을
              </label>
              <label>
                <input
                  type="checkbox"
                  className="mr-1"
                  value="4"
                  onChange={tagCheck}
                />
                겨울
              </label>
            </div>
          </div>
          <div className="text-sm mt-4">
            <div className="mb-2">연차</div>
            <div>
              <label>
                <input
                  type="checkbox"
                  className="mr-1"
                  value="5"
                  onChange={tagCheck}
                />
                ~1년 미만
              </label>
              <label>
                <input
                  type="checkbox"
                  className="mr-1"
                  value="6"
                  onChange={tagCheck}
                />
                1~3년차
              </label>
              <label>
                <input
                  type="checkbox"
                  className="mr-1"
                  value="7"
                  onChange={tagCheck}
                />
                3년 이상
              </label>
              <label>
                <input
                  type="checkbox"
                  className="mr-1"
                  value="8"
                  onChange={tagCheck}
                />
                임원
              </label>
            </div>
          </div>
          <div className="text-sm mt-4">
            <div className="mb-2">스타일</div>
            <div>
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
                />
                캐주얼
              </label>
              <label>
                <input
                  type="checkbox"
                  className="mr-1"
                  value="11"
                  onChange={tagCheck}
                />
                스트릿
              </label>
              <label>
                <input
                  type="checkbox"
                  className="mr-1"
                  value="1"
                  onChange={tagCheck}
                />
                아메카지
              </label>
              <label>
                <input
                  type="checkbox"
                  className="mr-1"
                  value="1"
                  onChange={tagCheck}
                />
                빈티지
              </label>
              <label>
                <input
                  type="checkbox"
                  className="mr-1"
                  value="1"
                  onChange={tagCheck}
                />
                시티보이
              </label>
              <label>
                <input
                  type="checkbox"
                  className="mr-1"
                  value="1"
                  onChange={tagCheck}
                />
                페미닌
              </label>
              <label>
                <input
                  type="checkbox"
                  className="mr-1"
                  value="1"
                  onChange={tagCheck}
                />
                미니멀
              </label>
              <label>
                <input
                  type="checkbox"
                  className="mr-1"
                  value="1"
                  onChange={tagCheck}
                />
                스포티
              </label>
              <label>
                <input
                  type="checkbox"
                  className="mr-1"
                  value="1"
                  onChange={tagCheck}
                />
                둠보이
              </label>
              <label>
                <input
                  type="checkbox"
                  className="mr-1"
                  value="1"
                  onChange={tagCheck}
                />
                기타
              </label>
            </div>
          </div>
          <div className="text-sm mt-4">
            <div className="mb-2">체형</div>
            <div>
              <label>
                <input
                  type="checkbox"
                  className="mr-1"
                  value="1"
                  onChange={tagCheck}
                />
                마름
              </label>
              <label>
                <input
                  type="checkbox"
                  className="mr-1"
                  value="1"
                  onChange={tagCheck}
                />
                보통
              </label>
              <label>
                <input
                  type="checkbox"
                  className="mr-1"
                  value="1"
                  onChange={tagCheck}
                />
                건장
              </label>
              <label>
                <input
                  type="checkbox"
                  className="mr-1"
                  value="1"
                  onChange={tagCheck}
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
    </div>
  );
};

export default Post;
