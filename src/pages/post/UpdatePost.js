import { useParams } from "react-router-dom";
import { detailPost } from "../../api/post";
import { useState, useEffect } from "react";

const UpdatePost = () => {
  const { postCode } = useParams();
  const [update, setUpdate] = useState({
    postCode: postCode,
    postImgInfo: [],
    postDesc: "",
    postPublicYn: "",
    userCode: "",
    products: [],
    tagCodes: [],
  });

  const product = {
    productBrand: "",
    productName: "",
    productSize: "",
    productBuyFrom: "",
    productLink: "",
  };

  const [imagesToDelete, setImagesToDelete] = useState(new Set());
  const [imgCode, setImgCode] = useState([]);

  // 기존 post 내용 가져오기
  const detailView = async () => {
    const result = await detailPost(postCode);
    // console.log(result.data);
    setUpdate(result.data);
  };

  // 이미지 미리보기 삭제 버튼
  const handleDelete = (postImgCode) => {
    setImagesToDelete((prev) => {
      const updatedSet = new Set(prev);
      updatedSet.add(postImgCode);

      const remainingImages = update.postImgInfo.filter(
        (post) => !updatedSet.has(post.postImgCode)
      );
      // console.log(remainingImages); // 남아있는 postImgCode
      console.log(updatedSet); // 삭제된 postImgCode

      // 상태 업데이트
      setUpdate((prev) => ({
        ...prev,
        postImgInfo: remainingImages,
      }));

      setImgCode(updatedSet); //  삭제된 postImgCode

      return updatedSet;
    });
  };

  const tagCheck = (event) => {
    const value = parseInt(event.target.value, 10); // 체크박스의 값을 정수로 변환

    setUpdate((prev) => {
      // 체크된 경우
      if (event.target.checked) {
        return {
          ...prev,
          tagCodes: [...prev.tagCodes, value], // 새로운 값을 추가
        };
      } else {
        // 체크 해제된 경우
        return {
          ...prev,
          tagCodes: prev.tagCodes.filter((tag) => tag !== value), // 값을 제거
        };
      }
    });
  };

  useEffect(() => {
    detailView();
  }, []);

  // 수정 완료 버튼
  const updateForm = () => {
    console.log(imgCode); // 삭제하는 이미지
    console.log(update);
  };

  const setBrand = (e, i) => {
    const products = update.products;
    products[i].productBrand = e.target.value;
    setUpdate({ ...update, products: products });
  };

  const setName = (e, i) => {
    const products = update.products;
    products[i].productName = e.target.value;
    setUpdate({ ...update, products: products });
  };

  const setSize = (e, i) => {
    const products = update.products;
    products[i].productSize = e.target.value;
    setUpdate({ ...update, products: products });
  };

  const setBuyFrom = (e, i) => {
    const products = update.products;
    products[i].productBuyFrom = e.target.value;
    setUpdate({ ...update, products: products });
  };

  const setLink = (e, i) => {
    const products = update.products;
    products[i].productLink = e.target.value;
    setUpdate({ ...update, products: products });
  };

  // + 제품 추가 버튼
  const addProduct = () => {
    const products = update.products;
    products.push(product);
    setUpdate({ ...update, products: products });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md mt-10 rounded-lg">
      <div className="mb-4">
        <label
          htmlFor="board"
          className="block text-sm font-medium mb-2"
          style={{
            fontWeight: "bold",
            fontSize: "1.8rem",
            paddingBottom: "20px",
          }}
        >
          게시물 수정하기
        </label>
      </div>
      <div className="mb-4">
        <label htmlFor="content" className="block text-sm font-medium mb-2">
          내용
        </label>
        <textarea
          id="content"
          className="w-full border border-gray-300 rounded px-3 py-2 h-32"
          placeholder="내용을 입력해 다른이들과 소통해보세요!"
          value={update?.postDesc}
          onChange={(e) => setUpdate({ ...update, postDesc: e.target.value })}
        />
      </div>
      <div className="mb-4 flex items-center">
        {update.postImgInfo
          .filter((post) => !imagesToDelete.has(post.postImgCode)) // 삭제할 이미지 제외
          .map((post) => (
            <div
              key={post.postImgCode}
              style={{ position: "relative", display: "inline-block" }}
            >
              <img
                src={post.postImgUrl}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  margin: "5px",
                }}
              />
              {update.postImgInfo.length > 1 && (
                <button
                  onClick={() => handleDelete(post.postImgCode)}
                  style={{
                    position: "absolute",
                    fontWeight: "bold",
                    top: "0",
                    right: "0",
                    color: "white",
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    padding: "2px 5px",
                    borderRadius: "3px",
                    cursor: "pointer",
                  }}
                >
                  X
                </button>
              )}
            </div>
          ))}
      </div>
      <div className="mb-4">
        {update.products?.map((post, index) => (
          <div
            className="grid grid-cols-5 gap-2 text-center text-sm"
            key={index}
          >
            <input
              type="text"
              placeholder="브랜드"
              value={post.productBrand}
              onChange={(e) => setBrand(e, index)}
            />
            <input
              type="text"
              placeholder="제품명"
              value={post.productName}
              onChange={(e) => setName(e, index)}
            />
            <input
              type="text"
              placeholder="제품 사이즈"
              value={post.productSize}
              onChange={(e) => setSize(e, index)}
            />
            <input
              type="text"
              placeholder="구매처"
              value={post.productBuyFrom}
              onChange={(e) => setBuyFrom(e, index)}
            />
            <input
              type="text"
              placeholder="구매 링크"
              value={post.productLink}
              onChange={(e) => setLink(e, index)}
            />
          </div>
        ))}

        <button
          type="button"
          className="w-full p-2 border border-gray-300 rounded bg-gray-200 hover:bg-gray-300 mt-2"
          onClick={addProduct}
        >
          제품 정보 추가 +
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
            checked={update.postPublicYn === "Y"}
            onChange={() => setUpdate({ ...update, postPublicYn: "Y" })}
          />
          공개
          <input
            type="radio"
            name="publicYn"
            className="mr-1"
            value="N"
            checked={update.postPublicYn === "N"}
            onChange={() => setUpdate({ ...update, postPublicYn: "N" })}
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
                checked={update.tagCodes.includes(1)} // 1이 선택되었는지 확인
                onChange={tagCheck}
              />
              봄
            </label>
            <label>
              <input
                type="checkbox"
                className="mr-1"
                value="2"
                checked={update.tagCodes.includes(2)}
                onChange={tagCheck}
              />
              여름
            </label>
            <label>
              <input
                type="checkbox"
                className="mr-1"
                value="3"
                checked={update.tagCodes.includes(3)}
                onChange={tagCheck}
              />
              가을
            </label>
            <label>
              <input
                type="checkbox"
                className="mr-1"
                value="4"
                checked={update.tagCodes.includes(4)}
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
                checked={update.tagCodes.includes(5)}
                onChange={tagCheck}
              />
              ~1년 미만
            </label>
            <label>
              <input
                type="checkbox"
                className="mr-1"
                value="6"
                checked={update.tagCodes.includes(6)}
                onChange={tagCheck}
              />
              1~3년차
            </label>
            <label>
              <input
                type="checkbox"
                className="mr-1"
                value="7"
                checked={update.tagCodes.includes(7)}
                onChange={tagCheck}
              />
              3년 이상
            </label>
            <label>
              <input
                type="checkbox"
                className="mr-1"
                value="8"
                checked={update.tagCodes.includes(8)}
                onChange={tagCheck}
              />
              임원
            </label>
          </div>
        </div>
        <div className="text-sm mt-4">
          <div className="mb-2">스타일</div>
          <div style={{ width: "80%" }}>
            <label>
              <input
                type="checkbox"
                className="mr-1"
                value="9"
                checked={update.tagCodes.includes(9)}
                onChange={tagCheck}
              />
              포멀
            </label>
            <label>
              <input
                type="checkbox"
                className="mr-1"
                value="10"
                checked={update.tagCodes.includes(10)}
                onChange={tagCheck}
              />
              캐주얼
            </label>
            <label>
              <input
                type="checkbox"
                className="mr-1"
                value="11"
                checked={update.tagCodes.includes(11)}
                onChange={tagCheck}
              />
              스트릿
            </label>
            <label>
              <input
                type="checkbox"
                className="mr-1"
                value="12"
                checked={update.tagCodes.includes(12)}
                onChange={tagCheck}
              />
              아메카지
            </label>
            <label>
              <input
                type="checkbox"
                className="mr-1"
                value="13"
                checked={update.tagCodes.includes(13)}
                onChange={tagCheck}
              />
              빈티지
            </label>
            <label>
              <input
                type="checkbox"
                className="mr-1"
                value="14"
                checked={update.tagCodes.includes(14)}
                onChange={tagCheck}
              />
              시티보이
            </label>
            <label>
              <input
                type="checkbox"
                className="mr-1"
                value="15"
                checked={update.tagCodes.includes(15)}
                onChange={tagCheck}
              />
              페미닌
            </label>
            <label>
              <input
                type="checkbox"
                className="mr-1"
                value="16"
                checked={update.tagCodes.includes(16)}
                onChange={tagCheck}
              />
              미니멀
            </label>
            <label>
              <input
                type="checkbox"
                className="mr-1"
                value="17"
                checked={update.tagCodes.includes(17)}
                onChange={tagCheck}
              />
              스포티
            </label>
            <label>
              <input
                type="checkbox"
                className="mr-1"
                value="18"
                checked={update.tagCodes.includes(18)}
                onChange={tagCheck}
              />
              톰보이
            </label>
            <label>
              <input
                type="checkbox"
                className="mr-1"
                value="19"
                checked={update.tagCodes.includes(19)}
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
                value="20"
                checked={update.tagCodes.includes(20)}
                onChange={tagCheck}
              />
              마름
            </label>
            <label>
              <input
                type="checkbox"
                className="mr-1"
                value="21"
                checked={update.tagCodes.includes(21)}
                onChange={tagCheck}
              />
              보통
            </label>
            <label>
              <input
                type="checkbox"
                className="mr-1"
                value="22"
                checked={update.tagCodes.includes(22)}
                onChange={tagCheck}
              />
              건장
            </label>
            <label>
              <input
                type="checkbox"
                className="mr-1"
                value="23"
                checked={update.tagCodes.includes(23)}
                onChange={tagCheck}
              />
              빅사이즈
            </label>
          </div>
        </div>
      </div>
      <div>
        <button
          type="button"
          className="w-full p-3 bg-black text-white rounded hover:bg-gray-800"
          onClick={updateForm}
        >
          수정 완료
        </button>
      </div>
    </div>
  );
};

export default UpdatePost;
