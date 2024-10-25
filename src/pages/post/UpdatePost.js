import { useParams } from "react-router-dom";
import { delImg, delProduct, detailPost, editPost } from "../../api/post";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TiDelete } from "react-icons/ti";
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
  const [bodyTag, setBodyTag] = useState(0);
  const [careerTag, setCareerTag] = useState(0);
  const [delProducts, setDelProducts] = useState([]);

  // 기존 post 내용 가져오기
  const detailView = async () => {
    const result = await detailPost(postCode);
    // null 처리
    if (result.data.postDesc === null) {
      result.data.postDesc = "";
    }
    // console.log(result.data.postDesc);
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
      // console.log(updatedSet); // 삭제된 postImgCode

      // 상태 업데이트
      setUpdate((prev) => ({
        ...prev,
        postImgInfo: remainingImages,
      }));

      const imgArray = [...updatedSet];
      // console.log(imgArray);
      setImgCode(imgArray); //  삭제된 postImgCode

      return updatedSet;
    });
  };

  const careerCheck = (e) => {
    const value = Number(e.target.value);
    // console.log("value : " + value);
    // console.log("careerTag : " + careerTag);

    const checkCareer = document.getElementsByName("career");
    for (let i = 0; i < checkCareer.length; i++) {
      if (checkCareer[i].value !== value) {
        checkCareer[i].checked = false;
      }
    }

    setCareerTag(value);
  };

  const bodyCheck = (e) => {
    const value = Number(e.target.value);
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

  useEffect(() => {
    update.tagCodes.forEach((item, index) => {
      if (5 <= item && item <= 8) {
        setUpdate({
          ...update,
          tagCodes: update.tagCodes.filter((value) => value !== item),
        });
        setCareerTag(item);
      }
      if (20 <= item && item <= 23) {
        setUpdate({
          ...update,
          tagCodes: update.tagCodes.filter((value) => value !== item),
        });
        setBodyTag(item);
      }
    });
    // console.log(update);
    // console.log(delProducts);
  }, [update]);

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

  const delProductAPI = async (productCode) => {
    await delProduct(productCode);
  };

  // - 제품 삭제 버튼
  const deleteProduct = (index, productCode) => {
    // console.log(productCode);
    setDelProducts((prevDelProducts) => [...prevDelProducts, productCode]);

    setUpdate((prevPost) => {
      // 현재 제품 목록에서 선택한 인덱스를 제외한 새로운 배열 생성
      const updatedProducts = prevPost.products.filter((_, i) => i !== index);
      return { ...prevPost, products: updatedProducts };
    });
  };

  // 수정 완료 버튼
  const updateForm = async () => {
    if (imgCode.length > 0) {
      // console.log(imgCode); // 삭제하는 이미지 코드
      await delImg([...imgCode]);
    }

    delProductAPI(delProducts);
    // console.log(delProducts);
    try {
      if (careerTag === 0 && bodyTag === 0) {
        await editPost(update);
      } else if (careerTag === 0 && bodyTag !== 0) {
        await editPost({
          ...update,
          tagCodes: [...update.tagCodes, bodyTag],
        });
      } else if (careerTag !== 0 && bodyTag === 0) {
        await editPost({
          ...update,
          tagCodes: [...update.tagCodes, careerTag],
        });
      } else {
        await editPost({
          ...update,
          tagCodes: [...update.tagCodes, careerTag, bodyTag],
        });
      }
      alert("수정 완료");
      window.location.href = "/";
    } catch (error) {
      alert("수정 실패:" + error);
    }
  };

  return (
    <div className="text-gray-800">
      <section className="bg-white py-4 shadow-md" />
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
            <div className="text-center text-sm" key={index}>
              <input
                type="text"
                placeholder="브랜드"
                value={post.productBrand}
                onChange={(e) => setBrand(e, index)}
                style={{
                  borderBottom: "1px solid #bbb",
                  width: "18%",
                  margin: "10px 2px",
                }}
              />
              <input
                type="text"
                placeholder="제품명"
                value={post.productName}
                onChange={(e) => setName(e, index)}
                style={{
                  borderBottom: "1px solid #bbb",
                  width: "18%",
                  margin: "10px 2px",
                }}
              />
              <input
                type="text"
                placeholder="제품 사이즈"
                value={post.productSize}
                onChange={(e) => setSize(e, index)}
                style={{
                  borderBottom: "1px solid #bbb",
                  width: "18%",
                  margin: "10px 2px",
                }}
              />
              <input
                type="text"
                placeholder="구매처"
                value={post.productBuyFrom}
                onChange={(e) => setBuyFrom(e, index)}
                style={{
                  borderBottom: "1px solid #bbb",
                  width: "18%",
                  margin: "10px 2px",
                }}
              />
              <input
                type="text"
                placeholder="구매 링크"
                value={post.productLink}
                onChange={(e) => setLink(e, index)}
                style={{
                  borderBottom: "1px solid #bbb",
                  width: "18%",
                  margin: "10px 2px",
                }}
              />
              <button
                style={{ marginLeft: "10px", fontSize: "1.8rem" }}
                onClick={() => deleteProduct(index, post.productCode)}
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
            제품 정보 추가 +
          </button>
        </div>

        <div className="mb-4 text-sm">
          <label
            htmlFor="content"
            className="block text-sm font-bold font-medium mb-2"
          >
            공개 여부
          </label>
          <div>
            <label>
              <input
                type="radio"
                name="publicYn"
                className="mr-1"
                value="Y"
                checked={update.postPublicYn === "Y"}
                onChange={() => setUpdate({ ...update, postPublicYn: "Y" })}
              />
              공개
            </label>
            <label>
              <input
                type="radio"
                name="publicYn"
                className="mr-1"
                value="N"
                checked={update.postPublicYn === "N"}
                onChange={() => setUpdate({ ...update, postPublicYn: "N" })}
                style={{ marginLeft: "15px" }}
              />
              비공개
            </label>
          </div>
        </div>

        {/* 태그 */}
        <div className="mb-4">
          <div className="text-sm">
            <div className="mb-2 font-bold">SEASON</div>
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
                  style={{ marginLeft: "15px" }}
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
                  style={{ marginLeft: "15px" }}
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
                  checked={careerTag === 5}
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
                  checked={careerTag === 6}
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
                  checked={careerTag === 7}
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
                  checked={careerTag === 8}
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
                  style={{ marginLeft: "15px" }}
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
                  style={{ marginLeft: "15px" }}
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
                  style={{ marginLeft: "15px" }}
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
                  style={{ marginLeft: "15px" }}
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
                  style={{ marginLeft: "15px" }}
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
                  style={{ marginLeft: "15px" }}
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
                  style={{ marginLeft: "15px" }}
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
                  style={{ marginLeft: "15px" }}
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
                  className="mr-1"
                  name="bodyType"
                  value="20"
                  checked={bodyTag === 20}
                  onChange={bodyCheck}
                />
                마름
              </label>
              <label>
                <input
                  type="checkbox"
                  className="mr-1"
                  name="bodyType"
                  value="21"
                  checked={bodyTag === 21}
                  onChange={bodyCheck}
                  style={{ marginLeft: "15px" }}
                />
                보통
              </label>
              <label>
                <input
                  type="checkbox"
                  className="mr-1"
                  name="bodyType"
                  value="22"
                  checked={bodyTag === 22}
                  onChange={bodyCheck}
                  style={{ marginLeft: "15px" }}
                />
                건장
              </label>
              <label>
                <input
                  type="checkbox"
                  className="mr-1"
                  name="bodyType"
                  value="23"
                  checked={bodyTag === 23}
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
            type="button"
            className="w-full p-3 bg-black text-white rounded hover:bg-gray-800"
            onClick={updateForm}
          >
            수정 완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePost;
