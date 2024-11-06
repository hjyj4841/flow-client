import { useState, useEffect } from "react";
import React from "react";

const VoteUpload = ({ upload, post, setPost }) => {
  const [imgPreviews, setImgPreviews] = useState([]);
  const [sortedFiles, setSortedFiles] = useState([]);
  const [click, setClick] = useState([]);

  const imageUpload = (e) => {
    let files = Array.from(e.target.files);
    const currentFiles = post.imageFiles || [];
    const newFiles = [...currentFiles, ...files];

    // Maximum of 2 files check
    if (newFiles.length > 2) {
      alert("이미지는 최대 2개까지 업로드할 수 있습니다.");
      e.target.value = "";
      return;
    }

    setPost({ ...post, imageFiles: newFiles });
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setImgPreviews(newPreviews);
    setClick([]);
  };

  const handleImageClick = (index) => {
    setClick((prevIndex) => {
      if (prevIndex.includes(index)) {
        return prevIndex.filter((i) => i !== index);
      } else {
        return [...prevIndex, index];
      }
    });
  };

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
    if (post.imageFiles.length === sortedFiles.length) {
      setPost((prevPost) => ({ ...prevPost, imageFiles: sortedFiles }));
    }
  }, [sortedFiles]);

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
          <input
            type="text"
            placeholder="투표 내용 1을 입력하세요"
            value={post.voteTextFirst}
            onChange={(e) =>
              setPost({ ...post, voteTextFirst: e.target.value })
            }
            style={{ marginTop: "10px", width: "100%", padding: "10px" }}
          />
          <input
            type="text"
            placeholder="투표 내용 2를 입력하세요"
            value={post.voteTextSecond}
            onChange={(e) =>
              setPost({ ...post, voteTextSecond: e.target.value })
            }
            style={{ marginTop: "10px", width: "100%", padding: "10px" }}
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
                    onClick={() => handleImageClick(index)}
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
                      handleDelete(index);
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

export default VoteUpload;
