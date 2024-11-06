import { useParams } from "react-router-dom";
import { delImg, detailPost, editPost } from "../../api/post";
import "../../assets/css/post.scoped.scss";
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

  const [imagesToDelete, setImagesToDelete] = useState(new Set());
  const [imgCode, setImgCode] = useState([]);
  const [bodyTag, setBodyTag] = useState(0);
  const [careerTag, setCareerTag] = useState(0);

  // 기존 post 내용 가져오기
  const detailView = async () => {
    const result = await detailPost(postCode);
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
    console.log(update);
    // console.log(delProducts);
  }, [update]);

  // 수정 완료 버튼
  const updateForm = async () => {
    if (imgCode.length > 0) {
      // console.log(imgCode); // 삭제하는 이미지 코드
      await delImg([...imgCode]);
    }

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
