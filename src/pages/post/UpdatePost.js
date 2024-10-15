import { useParams } from "react-router-dom";
import { updatePost, detailPost, detailImg } from "../../api/post";
import Post from "../../components/Post";
import { useState, useEffect } from "react";
import Update from "../../components/Update";

const UpdatePost = () => {
  const { postCode } = useParams();
  const [updateImg, setUpdateImg] = useState([]);
  const [update, setUpdate] = useState({
    postCode: postCode,
    imageFiles: [],
    postDesc: "",
    postPublicYn: "Y",
    userCode: "",
    products: [],
    tagCodes: [],
  });
  const [imagesToDelete, setImagesToDelete] = useState(new Set());

  // userCode 가져오기?
  const token = localStorage.getItem("token");
  let userCode = "";
  if (token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    const userData = JSON.parse(window.atob(base64));
    userCode = userData.userCode;
  }

  // 기존 post 내용 가져오기
  const detailView = async () => {
    const result = await detailPost(postCode);
    // console.log(result.data);
    setUpdate(result.data);
  };

  // 기존 postImg 내용 가져오기
  const detailImgs = async () => {
    const response = await detailImg(postCode);
    // console.log(response.data);
    setUpdateImg(response.data);
  };

  // 이미지 미리보기 삭제 버튼
  const handleDelete = (postImgCode) => {
    setImagesToDelete((prev) => {
      const updatedSet = new Set(prev);
      updatedSet.add(postImgCode);

      const remainingImages = updateImg.filter(
        (post) => !updatedSet.has(post.postImgCode)
      );
      // console.log(remainingImages); // 남아있는 postImgCode
      console.log(updatedSet); // 삭제된 postImgCode

      return updatedSet; //  삭제된 postImgCode
    });
  };

  useEffect(() => {
    detailImgs();
    detailView();
  }, []);

  /*
  useEffect(() => {
    console.log(update);
  }, [update]);
  */

  const updateForm = (updatedSet) => {
    console.log(updatedSet);
  };

  const tagCheck = () => {};

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md mt-10 rounded-lg">
      <form>
        <div className="mb-4">
          <label
            for="board"
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
          <label for="content" className="block text-sm font-medium mb-2">
            내용
          </label>
          <textarea
            id="content"
            className="w-full border border-gray-300 rounded px-3 py-2 h-32"
            placeholder="내용을 입력해 다른이들과 소통해보세요!"
            value={update?.postDesc}
            onChange={(e) => setUpdate({ ...update, postDesc: e.target.value })}
          ></textarea>
        </div>
        <div className="mb-4 flex items-center">
          {updateImg
            .filter((post) => !imagesToDelete.has(post.postImgCode)) // 삭제할 이미지 제외
            .map((post) => (
              <div
                key={post.postImgCode}
                style={{ position: "relative", display: "inline-block" }}
              >
                <img
                  src={post.postImgUrl}
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    margin: "5px",
                  }}
                />
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
              </div>
            ))}
        </div>
        <div className="mb-4">
          <div className="grid grid-cols-5 gap-2 text-center text-sm">
            <div>브랜드</div>
            <div>제품명</div>
            <div>제품 사이즈</div>
            <div>구매처</div>
            <div>구매 링크</div>
          </div>
          <button
            type="button"
            className="w-full p-2 border border-gray-300 rounded bg-gray-200 hover:bg-gray-300 mt-2"
          >
            제품 정보 추가 +
          </button>
        </div>

        <div className="mb-4 text-sm">
          <label for="content" className="block text-sm font-medium mb-2">
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
            <div style={{ width: "80%" }}>
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
                톰보이
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
            type="button"
            className="w-full p-3 bg-black text-white rounded hover:bg-gray-800"
            onClick={updateForm}
          >
            업로드
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePost;
