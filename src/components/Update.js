const Update = () => {
  return (
    <>
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-md mt-10">
        <div className="mb-4">
          <input
            type="text"
            placeholder="제목"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="내용을 입력해 다른이들과 소통해보세요!"
            className="w-full p-2 border border-gray-300 rounded h-32"
          />
        </div>
        <div className="mb-4">
          <button
            type="button"
            className="w-full p-2 border border-gray-300 rounded bg-gray-200 hover:bg-gray-300"
          >
            사진 업로드
          </button>
        </div>

        <div>
          <button
            type="submit"
            className="w-full p-3 bg-black text-white rounded hover:bg-gray-800"
          >
            업로드
          </button>
        </div>
      </div>
    </>
  );
};

export default Update;
